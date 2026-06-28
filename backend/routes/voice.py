from fastapi import APIRouter
from fastapi.responses import FileResponse
from pydantic import BaseModel

from services.speech_service import speech_to_text
from services.gemini_service import ask_gemini

from gtts import gTTS

router = APIRouter(
    prefix="/voice",
    tags=["Voice"]
)

class VoiceRequest(BaseModel):
    text: str


@router.post("/speak")
async def speak(data: VoiceRequest):

    audio_file = "voice.mp3"

    # Telugu TTS
    tts = gTTS(
        text=data.text,
        lang="te"
    )

    tts.save(audio_file)

    return FileResponse(
        audio_file,
        media_type="audio/mpeg",
        filename="voice.mp3"
    )


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

    return {
        "you_said": text,
        "ai_response": ai_response
    }