# AI-Powered Resume Analyzer & Job Match Scoring System

Upload a PDF resume, paste a job description, and receive an AI-generated fit score, skill gap breakdown, and actionable improvement recommendations — powered by GPT-4o.

## Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18 + Vite + Tailwind CSS    |
| Backend   | Node.js + Express.js              |
| Database  | MongoDB Atlas (1-hour TTL sessions)|
| AI        | OpenAI GPT-4o (structured output) |
| PDF       | pdf-parse                         |

## Project Structure

```
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
└── server/          # Express API
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    └── services/
```

## Setup

### 1. Server

```bash
cd server
cp .env.example .env   # fill in your values
npm install
npm run dev            # starts on :5000
```

**Required `.env` values:**
- `OPENAI_API_KEY` — from [platform.openai.com](https://platform.openai.com)
- `MONGODB_URI` — MongoDB Atlas connection string

### 2. Client

```bash
cd client
npm install
npm run dev            # starts on :5173
```

Open [http://localhost:5173](http://localhost:5173).

## How It Works

1. User uploads a PDF resume and pastes a job description.
2. `pdf-parse` extracts raw text from the PDF (server-side).
3. GPT-4o extracts a structured skill profile (skills, experience, education).
4. GPT-4o semantically matches the skill profile against the job description.
5. The API returns a fit score (0–100), matched skills, missing skills, and recommendations.
6. Results are stored in MongoDB with a 1-hour TTL — no PII is persisted.

## Privacy

No resume text or personal information is stored in the database. Only the structured analysis result (scores, skill lists, recommendations) is saved per session, and it auto-expires after one hour.
