# Meeting Notes Summarizer

A web application that allows users to upload or paste meeting transcripts, generate AI-powered summaries, and share them via email. Built with **Next.js**, **FastAPI**, **Groq API**, and **SendGrid**.

---

## Features

- Upload `.txt` transcript or paste text manually
- Generate AI summaries using Groq API
- Customize summary instructions/prompts
- Editable summary output
- Share summaries via email with multiple recipients
- Production-ready deployment with environment variables

---

## Tech Stack

- **Frontend:** Next.js, React  
- **Backend:** FastAPI, Python  
- **AI:** Groq API for summarization  
- **Email Service:** SendGrid for sending emails  
- **Deployment:** Vercel (frontend), Railway/Render (backend)  

---

## Folder Structure

meeting-notes/
├── app/

│ ├── api/

│ ├── globals.css

│ └── page.tsx # Frontend UI

├── backend/

│ └── main.py # FastAPI backend

├── public/

├── .gitignore

├── next.config.mjs

├── package.json

├── requirements.txt # Python dependencies

├── tsconfig.json

└── README.md

---

## Setup & Local Development

### 1. Clone the repository

```bash
git clone https://github.com/sreethiii/Meeting-notes-summariser.git
cd meeting-notes
```

### 2. Frontend Setup (Next.js)
```bash
cd app
npm install
npm run dev
```
Open http://localhost:3000 in your browser

### 3. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
Open http://127.0.0.1:8000/docs to test API endpoints

### 4. Environment Variables

Create a .env file in the backend folder:
```bash
GROQ_API_KEY=your_groq_api_key
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=verified_email@example.com
```

## Usage

1. Upload or paste a meeting transcript
2. Enter custom instructions if needed
3. Click Generate Summary
4. Edit the summary if desired
5. Enter comma-separated emails → click Send

## Screenshots
<img width="923" height="802" alt="Screenshot 2025-08-16 183656" src="https://github.com/user-attachments/assets/77e7fb77-6e6d-4a06-bd2c-bfb824a183bd" />


