from fastapi import APIRouter, HTTPException
from random import randint
import os

from database.otp import otp_codes
from database.users import users
from models.otp import SendOTPRequest, VerifyOTPRequest
from services.email_service import send_otp_email

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


@router.post("/send-otp")
async def send_otp(data: SendOTPRequest):

    print("POST RECEIVED")
    print(data.email)

    return {
        "message": "Backend Working"
    }