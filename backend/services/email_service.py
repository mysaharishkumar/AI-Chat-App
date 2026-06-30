import os
import smtplib
import ssl

from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()


def send_otp_email(email: str, otp: str):

    sender = os.getenv("EMAIL_ADDRESS")
    password = os.getenv("EMAIL_PASSWORD")

    print("\n========== EMAIL DEBUG ==========")
    print("Sender:", sender)
    print("Password Exists:", password is not None)
    print("Receiver:", email)

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

    try:

        print("STEP 1 : Connecting Gmail SMTP...")

        server = smtplib.SMTP(
            "smtp.gmail.com",
            587,
            timeout=20
        )

        print("STEP 2 : Connected")

        context = ssl.create_default_context()

        server.starttls(context=context)

        print("STEP 3 : TLS Started")

        server.login(
            sender,
            password
        )

        print("STEP 4 : Login Success")

        server.send_message(msg)

        print("STEP 5 : Email Sent Successfully")

        server.quit()

        print("STEP 6 : SMTP Closed")

    except smtplib.SMTPAuthenticationError as e:

        print("SMTP AUTH ERROR")
        print(e)
        raise

    except smtplib.SMTPException as e:

        print("SMTP ERROR")
        print(e)
        raise

    except Exception as e:

        print("GENERAL EMAIL ERROR")
        print(type(e).__name__)
        print(str(e))
        raise