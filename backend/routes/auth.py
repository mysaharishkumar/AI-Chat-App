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

    print("STEP 1 : Request Received")

    otp = str(randint(100000, 999999))
    print("STEP 2 : OTP Generated")

    print("STEP 3 : Delete Previous OTP")
    await otp_codes.delete_many({"email": data.email})
    print("STEP 4 : Previous OTP Deleted")

    print("STEP 5 : Save OTP")
    await otp_codes.insert_one({
        "email": data.email,
        "otp": otp
    })
    print("STEP 6 : MongoDB Success")

    print("STEP 7 : Send Email")
    send_otp_email(data.email, otp)
    print("STEP 8 : Email Sent")

    return {
        "message": "OTP Sent"
    }