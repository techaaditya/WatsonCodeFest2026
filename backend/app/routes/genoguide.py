from fastapi import APIRouter, Body
from app.services.ai_counselor import generate_counselor_response

router = APIRouter()

@router.post("/chat")
async def chat(message: str = Body(..., embed=True), mode: str = "general"):
    response = generate_counselor_response(message, mode)
    return {"response": response}

@router.get("/suggestions")
async def get_suggestions():
    return [
        "What is Beta Thalassemia?",
        "Tell me about Sickle Cell prevalence in Nepal.",
        "How is G6PD deficiency inherited?",
        "What are the symptoms of AZF microdeletions?"
    ]
