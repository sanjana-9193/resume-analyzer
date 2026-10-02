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
