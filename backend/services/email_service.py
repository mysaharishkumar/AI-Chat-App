import os
import smtplib

from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()


def send_otp_email(email: str, otp: str):

    sender = os.getenv("EMAIL_ADDRESS")
    password = os.getenv("EMAIL_PASSWORD")

    print("========== EMAIL DEBUG ==========")
    print("Sender:", sender)
    print("Password Exists:", password is not None)
    print("Sending to:", email)

    body = f"""
Hello,

Your OTP is:

{otp}
"""

    msg = MIMEText(body)

    msg["Subject"] = "OTP"
    msg["From"] = sender
    msg["To"] = email

    try:

        print("Connecting SMTP...")

        server = smtplib.SMTP(
            "smtp.gmail.com",
            587,
            timeout=10
        )

        print("Connected")

        server.starttls()

        print("TLS Started")

        server.login(
            sender,
            password
        )

        print("Login Success")

        server.send_message(msg)

        print("Email Sent")

        server.quit()

    except Exception as e:

        print("EMAIL ERROR:", e)

        raise