import os
from fastapi import APIRouter
from google import genai

router = APIRouter()


@router.post("/chat")
async def chat(prompt: dict):
    """Chat with the AI assistant using Gemini."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {"error": "GEMINI_API_KEY not configured"}

    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt.get("message", ""),
    )
    return {"response": response.text}
