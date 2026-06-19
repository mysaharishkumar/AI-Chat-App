import os
import smtplib

from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()


def send_otp_email(email: str, otp: str):

    sender = os.getenv("EMAIL_ADDRESS")
    password = os.getenv("EMAIL_PASSWORD")

    body = f"""
Hello,

Welcome to AI Chat App.

Your One-Time Password (OTP) is:

{otp}

This OTP will expire in 5 minutes.

If you did not request this OTP, please ignore this email.

Regards,
AI Chat App Team
"""

    msg = MIMEText(body)

    msg["Subject"] = "AI Chat App - Login Verification"
    msg["From"] = f"AI Chat App <{sender}>"
    msg["To"] = email

    server = smtplib.SMTP(
        "smtp.gmail.com",
        587
    )

    server.starttls()

    server.login(
        sender,
        password
    )

    server.send_message(msg)

    server.quit()