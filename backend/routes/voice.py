from fastapi import APIRouter
from pydantic import BaseModel

from services.speech_service import speech_to_text
from services.gemini_service import ask_gemini

#import pyttsx3

router = APIRouter(
    prefix="/voice",
    tags=["Voice"]
)

#engine = pyttsx3.init()


class VoiceRequest(BaseModel):
    text: str


@router.post("/speak")
async def speak(data: VoiceRequest):

    #engine.say(data.text)
    #engine.runAndWait()

    return {
        "message": "Speech completed"
    }


@router.get("/listen")
async def listen():

    text = speech_to_text()

    return {
        "text": text
    }


@router.get("/chat")
async def voice_chat():

    text = speech_to_text()

    if not text:
        return {
            "error": "No speech detected"
        }

    ai_response = await ask_gemini(text)

    #engine.say(ai_response)
    #engine.runAndWait()

    return {
        "you_said": text,
        "ai_response": ai_response
    }