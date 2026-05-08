import json
import os
import re
from io import BytesIO
from typing import AsyncGenerator, Optional

import httpx
from PyPDF2 import PdfReader


OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
OLLAMA_MODEL = "medgemma1.5:4b"

TAG_THOUGHT_OPEN = "[THOUGHT]"
TAG_THOUGHT_CLOSE = "[/THOUGHT]"
TAG_RESPONSE_OPEN = "[RESPONSE]"
TAG_RESPONSE_CLOSE = "[/RESPONSE]"
# Reserve tail when streaming so split tags across chunks are not emitted early
_TAG_SAFE_TAIL = 24
def extract_pdf_text(pdf_bytes: bytes) -> str:
    reader = PdfReader(BytesIO(pdf_bytes))
    pages = []
    for page in reader.pages:
        pages.append(page.extract_text() or "")
    return "\n".join(pages).strip()


def build_prompt(message: str, pdf_text: Optional[str] = None) -> str:
    base = (
        "You are GenoGuide. You must separate your internal analysis from your response.\n"
        "Use the following format strictly:\n"
        "[THOUGHT]\n"
        "<Internal reasoning here>\n"
        "[/THOUGHT]\n"
        "[RESPONSE]\n"
        "<Final clinical response here>\n"
        "[/RESPONSE]\n"
        "Do not deviate from this format. I will be parsing your output based on these specific tags.\n"
    )
    if pdf_text:
        base += f'Context from attached Lab Report:\n"{pdf_text}"\n'
    base += f'User Query: "{message}"'
    return base


async def generate_counselor_response(message: str, mode: str = "general", pdf_text: Optional[str] = None) -> str:
    prompt = build_prompt(message=message, pdf_text=pdf_text)
    payload = {
        "model": OLLAMA_MODEL, 
        "prompt": prompt, 
        "stream": False,
        "options": {
            "temperature": 0.1,
            "top_p": 0.9,
            "num_predict": 350,
        }
    }
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(f"{OLLAMA_BASE_URL}/api/generate", json=payload)
        response.raise_for_status()
        data = response.json()
    raw = data.get("response", "").strip()
    thought, response = split_thought_and_response(raw)
    return json.dumps({"thought": thought, "response": response})


def split_thought_and_response(raw: str) -> tuple[str, str]:
    """Parse complete LLM output into thought + response using [THOUGHT] / [RESPONSE] blocks."""
    if not raw or not raw.strip():
        return "", ""
    thought_m = re.search(
        re.escape(TAG_THOUGHT_OPEN) + r"(.*?)" + re.escape(TAG_THOUGHT_CLOSE),
        raw,
        re.DOTALL | re.IGNORECASE,
    )
    response_m = re.search(
        re.escape(TAG_RESPONSE_OPEN) + r"(.*?)" + re.escape(TAG_RESPONSE_CLOSE),
        raw,
        re.DOTALL | re.IGNORECASE,
    )
    thought = thought_m.group(1).strip() if thought_m else ""
    response = response_m.group(1).strip() if response_m else ""
    if not thought_m and not response_m:
        # No tags: treat entire output as clinical response
        response = raw.strip()
    elif response_m and not thought_m:
        # Only response tag present
        pass
    elif thought_m and not response_m:
        response = ""
    return thought, response


def _stream_feed_tags(delta: str, state: dict) -> tuple[str, str]:
    """
    Incrementally split streaming chunks into thought vs response text.
    Phases: seek_thought_open | in_thought | seek_response_open | in_response | done
    """
    phase = state.setdefault("phase", "seek_thought_open")
    buf = state.setdefault("buf", "") + delta
    state["buf"] = buf

    thought_chunks: list[str] = []
    response_chunks: list[str] = []

    while True:
        buf = state["buf"]
        if not buf:
            break

        if phase == "seek_thought_open":
            i = buf.lower().find(TAG_THOUGHT_OPEN.lower())
            if i < 0:
                if len(buf) > _TAG_SAFE_TAIL:
                    state["buf"] = buf[-_TAG_SAFE_TAIL:]
                break
            state["buf"] = buf[i + len(TAG_THOUGHT_OPEN) :]
            phase = state["phase"] = "in_thought"
            continue

        if phase == "in_thought":
            # Case-insensitive close tag
            lower = buf.lower()
            close_idx = lower.find(TAG_THOUGHT_CLOSE.lower())
            if close_idx < 0:
                if len(buf) > _TAG_SAFE_TAIL:
                    emit_len = len(buf) - _TAG_SAFE_TAIL
                    thought_chunks.append(buf[:emit_len])
                    state["buf"] = buf[emit_len:]
                break
            thought_chunks.append(buf[:close_idx])
            rest = buf[close_idx + len(TAG_THOUGHT_CLOSE) :]
            state["buf"] = rest
            phase = state["phase"] = "seek_response_open"
            continue

        if phase == "seek_response_open":
            i = buf.lower().find(TAG_RESPONSE_OPEN.lower())
            if i < 0:
                if len(buf) > _TAG_SAFE_TAIL:
                    state["buf"] = buf[-_TAG_SAFE_TAIL:]
                break
            state["buf"] = buf[i + len(TAG_RESPONSE_OPEN) :]
            phase = state["phase"] = "in_response"
            continue

        if phase == "in_response":
            lower = buf.lower()
            close_idx = lower.find(TAG_RESPONSE_CLOSE.lower())
            if close_idx < 0:
                if len(buf) > _TAG_SAFE_TAIL:
                    emit_len = len(buf) - _TAG_SAFE_TAIL
                    response_chunks.append(buf[:emit_len])
                    state["buf"] = buf[emit_len:]
                break
            response_chunks.append(buf[:close_idx])
            state["buf"] = buf[close_idx + len(TAG_RESPONSE_CLOSE) :]
            phase = state["phase"] = "done"
            continue

        if phase == "done":
            state["buf"] = ""
            break

    return "".join(thought_chunks), "".join(response_chunks)


def _stream_finalize(state: dict) -> tuple[str, str]:
    """Flush any remainder after stream ends."""
    phase = state.get("phase", "seek_thought_open")
    buf = state.get("buf", "")
    t_extra, r_extra = "", ""
    if phase == "in_thought" and buf:
        t_extra = buf
    elif phase in ("seek_response_open",) and buf:
        pass
    elif phase == "in_response" and buf:
        r_extra = buf
    elif phase == "seek_thought_open" and buf:
        # Never opened thought — treat as response
        r_extra = buf
    state["buf"] = ""
    return t_extra, r_extra


async def stream_counselor_response(message: str, mode: str = "general", pdf_text: Optional[str] = None) -> AsyncGenerator[str, None]:
    prompt = build_prompt(message=message, pdf_text=pdf_text)
    payload = {
        "model": OLLAMA_MODEL, 
        "prompt": prompt, 
        "stream": True,
        "options": {
            "temperature": 0.1,
            "top_p": 0.9,
            "num_predict": 350,
        }
    }
    state: dict = {}

    async with httpx.AsyncClient(timeout=180.0) as client:
        async with client.stream("POST", f"{OLLAMA_BASE_URL}/api/generate", json=payload) as response:
            response.raise_for_status()
            async for line in response.aiter_lines():
                if not line:
                    continue
                try:
                    parsed = json.loads(line)
                except json.JSONDecodeError:
                    continue
                delta = parsed.get("response", "")
                done = parsed.get("done", False)
                if delta:
                    thought_delta, response_delta = _stream_feed_tags(delta, state)
                    if thought_delta or response_delta:
                        yield json.dumps(
                            {
                                "thought_delta": thought_delta,
                                "response_delta": response_delta,
                                "done": False,
                            }
                        ) + "\n"
                if done:
                    t_flush, r_flush = _stream_finalize(state)
                    if t_flush or r_flush:
                        yield json.dumps(
                            {
                                "thought_delta": t_flush,
                                "response_delta": r_flush,
                                "done": False,
                            }
                        ) + "\n"
                    yield json.dumps({"thought_delta": "", "response_delta": "", "done": True}) + "\n"
