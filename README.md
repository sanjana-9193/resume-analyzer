# AI Resume Analyzer

A full-stack MERN application that uses AI to analyze resumes against job descriptions, providing instant match scores, missing keyword detection, and actionable improvement suggestions.

## Features

- 🎯 **AI-Powered Resume Analysis** — Upload a resume (PDF) and a job description to get an instant ATS match score (0-100)
- 🔑 **Missing Keywords Detection** — Identifies important skills/keywords from the job description that are missing in the resume
- ✅ **Strengths & Suggestions** — AI-generated insights on what's working and what to improve
- ✍️ **AI Bullet Point Rewrites** — Get stronger, quantified rewrites of weak resume bullet points
- ✨ **AI Resume Builder** — Generate a complete, polished resume from raw details (education, skills, experience, projects)
- 🆚 **Compare Multiple Resumes** — Upload 2-5 resumes against one job description and see which scores highest
- 📈 **Score Trend Chart** — Visualize how your resume scores improve over time across analyses
- ⬇️ **PDF Export** — Download analysis reports and AI-generated resumes as PDF
- 🌙 **Dark Mode** — Full dark/light theme support
- 🔐 **User Authentication** — Secure signup/login with JWT, with per-user analysis history

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS, React Router, Recharts, jsPDF
**Backend:** Node.js, Express.js
**Database:** MongoDB (Mongoose)
**Authentication:** JWT + bcrypt
**AI:** Google Gemini API
**File Handling:** Multer, pdf-parse

## Project Structure
resume-analyzer/
├── client/ # React frontend (Vite)
│ └── src/
│ ├── components/ # Reusable UI components
│ ├── pages/ # Route-level pages
│ ├── context/ # Auth & theme context providers
│ └── api/ # Axios API client
└── server/ # Express backend
├── models/ # Mongoose schemas
├── controllers/ # Route handlers
├── routes/ # API route definitions
├── middleware/ # Auth middleware
└── utils/ # PDF parsing & AI integration


## Getting Started

### Prerequisites
- Node.js v18+
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- A [Google Gemini API key](https://aistudio.google.com/apikey) (free tier available)

### Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Fill in `.env`:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_string
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173

```bash
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

## How It Works

1. Sign up / log in
2. Upload a resume (PDF) and paste a job description
3. AI analyzes the match and returns a score, missing keywords, strengths, and suggestions
4. Optionally generate AI-rewritten bullet points, compare multiple resumes, or build a new resume from scratch
5. All analyses are saved to your history, viewable anytime

## License

This project is open source and available for learning purposes.

---

Built as a full-stack portfolio project combining the MERN stack with AI integration.
