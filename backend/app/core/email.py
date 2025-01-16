from email.message import EmailMessage
import smtplib
from app.core.config import settings

def send_email(subject: str, recipient: str, body: str):
    msg = EmailMessage()
    msg.set_content(body)
    msg['Subject'] = subject
    msg['From'] = settings.from_email
    msg['To'] = recipient

    try:
        with smtplib.SMTP(settings.smtp_server, settings.smtp_port) as server:
            server.send_message(msg)
        print(f"Email sent to {recipient}")
    except Exception as e:
        print(f"Failed to send email: {e}")