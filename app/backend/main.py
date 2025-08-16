from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from groq import Groq
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
EMAIL_FROM = os.getenv("EMAIL_FROM")

# Groq client
client = Groq(api_key=GROQ_API_KEY)

# FastAPI app
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request body models
class SummarizeRequest(BaseModel):
    transcript: str
    prompt: str

class ShareRequest(BaseModel):
    summary: str
    emails: str  # comma-separated

# Summarize endpoint
@app.post("/summarize")
async def summarize(req: SummarizeRequest):
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are a meeting summarizer."},
                {"role": "user", "content": f"Transcript:\n{req.transcript}\n\nInstruction:\n{req.prompt}"}
            ]
        )

        summary = response.choices[0].message.content
        return {"summary": summary}

    except Exception as e:
        return {"error": str(e)}

# Share endpoint (SendGrid)
@app.post("/share")
async def share(req: ShareRequest):
    try:
        recipients = [email.strip() for email in req.emails.split(",")]

        message = Mail(
            from_email=EMAIL_FROM,
            to_emails=recipients,
            subject="Meeting Summary",
            plain_text_content=req.summary
        )

        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)

        if response.status_code in [200, 202]:
            return {"status": f"✅ Email sent to {', '.join(recipients)}"}
        else:
            return {"status": f"❌ Failed to send email. Status code: {response.status_code}"}

    except Exception as e:
        return {"status": f"❌ Failed to send email: {str(e)}"}
