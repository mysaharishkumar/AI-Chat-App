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
async def send_otp(data: SendOTPRequest):

    print("\n========== SEND OTP ==========")
    print("STEP 1 : Request Received")
    print("Email :", data.email)

    otp = str(randint(100000, 999999))

    print("STEP 2 : OTP Generated")
    print("OTP :", otp)

    print("STEP 3 : Delete Previous OTP")

    await otp_codes.delete_many({
        "email": data.email
    })

    print("STEP 4 : Previous OTP Deleted")

    print("STEP 5 : Save OTP")

    await otp_codes.insert_one({
        "email": data.email,
        "otp": otp
    })

    print("STEP 6 : MongoDB Success")

    saved = await otp_codes.find_one({
        "email": data.email
    })

    print("Saved Document :", saved)

    print("STEP 7 : Send Email")

    send_otp_email(
        data.email,
        otp
    )

    print("STEP 8 : Email Sent")

    return {
        "message": "OTP Sent"
    }


@router.post("/verify-otp")
async def verify_otp(data: VerifyOTPRequest):

    print("\n========== VERIFY OTP ==========")

    print("Email From React :", data.email)
    print("OTP From React   :", data.otp)

    mongo_record = await otp_codes.find_one({
        "email": data.email
    })

    print("Mongo Record :", mongo_record)

    if mongo_record is None:
        raise HTTPException(
            status_code=404,
            detail="Email not found"
        )

    print("Mongo OTP :", mongo_record["otp"])

    print(
        "OTP Match :",
        mongo_record["otp"] == data.otp
    )

    if mongo_record["otp"] != data.otp:

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

        user_id = str(result.inserted_id)

    else:

        user_id = str(user["_id"])

    await otp_codes.delete_many({
        "email": data.email
    })

    print("OTP Verified Successfully")

    return {
        "message": "Login Successful",
        "user_id": user_id,
        "email": data.email
    }