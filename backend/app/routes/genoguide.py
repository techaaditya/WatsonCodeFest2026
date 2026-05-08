from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from app.services.ai_counselor import extract_pdf_text, generate_counselor_response, stream_counselor_response

router = APIRouter()

@router.post("/chat")
async def chat(
    message: str = Form(...),
    mode: str = Form("general"),
    attachment: UploadFile | None = File(None),
):
    pdf_text = None
    if attachment:
        if attachment.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF attachments are supported")
        content = await attachment.read()
        pdf_text = extract_pdf_text(content)
    response = await generate_counselor_response(message=message, mode=mode, pdf_text=pdf_text)
    return {"response": response}


@router.post("/chat/stream")
async def chat_stream(
    message: str = Form(...),
    mode: str = Form("general"),
    attachment: UploadFile | None = File(None),
):
    pdf_text = None
    if attachment:
        if attachment.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF attachments are supported")
        content = await attachment.read()
        pdf_text = extract_pdf_text(content)

    stream = stream_counselor_response(message=message, mode=mode, pdf_text=pdf_text)
    return StreamingResponse(stream, media_type="application/x-ndjson")

@router.get("/suggestions")
async def get_suggestions():
    return [
        "What is Beta Thalassemia?",
        "Tell me about Sickle Cell prevalence in Nepal.",
        "How is G6PD deficiency inherited?",
        "What are the symptoms of AZF microdeletions?"
    ]
