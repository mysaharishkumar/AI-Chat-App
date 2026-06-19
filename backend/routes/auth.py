from fastapi import APIRouter, HTTPException
from random import randint

from database.otp import otp_codes
from database.users import users

from models.otp import (
    SendOTPRequest,
    VerifyOTPRequest
)

from services.email_service import send_otp_email

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


@router.post("/send-otp")
async def send_otp(
    data: SendOTPRequest
):

    otp = str(
        randint(100000, 999999)
    )

    await otp_codes.delete_many({
        "email": data.email
    })

    await otp_codes.insert_one({
        "email": data.email,
        "otp": otp
    })

    send_otp_email(
        data.email,
        otp
    )

    return {
        "message": "OTP Sent"
    }


@router.post("/verify-otp")
async def verify_otp(
    data: VerifyOTPRequest
):

    record = await otp_codes.find_one({
        "email": data.email,
        "otp": data.otp
    })

    if not record:
        raise HTTPException(
            status_code=401,
            detail="Invalid OTP"
        )

    user = await users.find_one({
        "email": data.email
    })

    if not user:

        result = await users.insert_one({
            "email": data.email,
            "login_type": "email_otp"
        })

        user_id = str(
            result.inserted_id
        )

    else:

        user_id = str(
            user["_id"]
        )

    await otp_codes.delete_many({
        "email": data.email
    })

    return {
        "message": "Login Successful",
        "user_id": user_id,
        "email": data.email
    }