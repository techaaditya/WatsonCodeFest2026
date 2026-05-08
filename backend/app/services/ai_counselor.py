import json
import os
from io import BytesIO
from typing import AsyncGenerator, Optional

import httpx
from PyPDF2 import PdfReader


OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
OLLAMA_MODEL = "medgemma1.5:4b"


def extract_pdf_text(pdf_bytes: bytes) -> str:
    reader = PdfReader(BytesIO(pdf_bytes))
    pages = []
    for page in reader.pages:
        pages.append(page.extract_text() or "")
    return "\n".join(pages).strip()


def build_prompt(message: str, pdf_text: Optional[str] = None) -> str:
    base = (
        "System: You are GenoGuide, an expert clinical genetic counselor. "
        "Answer the user's query clearly and concisely.\n"
    )
    if pdf_text:
        base += f'Context from attached Lab Report:\n"{pdf_text}"\n'
    base += f'User Query: "{message}"'
    return base


async def generate_counselor_response(message: str, mode: str = "general", pdf_text: Optional[str] = None) -> str:
    prompt = build_prompt(message=message, pdf_text=pdf_text)
    payload = {"model": OLLAMA_MODEL, "prompt": prompt, "stream": False}
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(f"{OLLAMA_BASE_URL}/api/generate", json=payload)
        response.raise_for_status()
        data = response.json()
    return data.get("response", "").strip()


async def stream_counselor_response(message: str, mode: str = "general", pdf_text: Optional[str] = None) -> AsyncGenerator[str, None]:
    prompt = build_prompt(message=message, pdf_text=pdf_text)
    payload = {"model": OLLAMA_MODEL, "prompt": prompt, "stream": True}

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
                    yield json.dumps({"delta": delta, "done": False}) + "\n"
                if done:
                    yield json.dumps({"delta": "", "done": True}) + "\n"
