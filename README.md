# AI Resume Analyzer (MERN + Gemini API)

Resume (PDF) upload karo + job description paste karo → AI match score, missing keywords,
strengths, aur improvement suggestions deta hai. Har analysis history mein save hota hai.

## Features
- 🌙 Dark mode toggle
- ⬇️ PDF report download
- ✍️ AI-powered bullet point rewrites
- 📈 Score trend chart over time
- 🆚 Compare multiple resumes against one job description

## Tech Stack
- Frontend: React (Vite) + Tailwind CSS + React Router
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Auth: JWT + bcrypt
- AI: Anthropic Claude API
- File handling: Multer + pdf-parse

---

## 1. Prerequisites
- Node.js v18+ installed (`node -v` se check karo)
- MongoDB — ya to local install karo, ya [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) pe free cluster banao (easier)
- Anthropic API key — [console.anthropic.com](https://console.anthropic.com) se banao

---

## 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Ab `.env` file kholo aur ye values fill karo:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=koi_bhi_lamba_random_string
ANTHROPIC_API_KEY=your_anthropic_api_key
CLIENT_URL=http://localhost:5173
```

Server start karo:

```bash
npm run dev
```

Agar sab sahi hai to terminal mein dikhega: `Server running on port 5000` aur `MongoDB connected`.

---

## 3. Frontend Setup

Naye terminal tab mein:

```bash
cd client
npm install
npm run dev
```

Browser mein kholo: **http://localhost:5173**

---

## 4. Use karo

1. Sign up karo (name, email, password)
2. Dashboard pe apna resume PDF upload karo
3. Job description paste karo (kam se kam kuch sentences)
4. "Analyze Resume" click karo — kuch second mein AI score, missing keywords aur
   suggestions dikha dega
5. Left side pe "Past Analyses" mein purani reports dikhengi — click karke wapas dekh sakte ho

---

## 5. Common Issues

- **"ANTHROPIC_API_KEY is not set"** → `.env` file mein key check karo, server restart karo
- **MongoDB connect nahi ho raha** → connection string check karo, ya Atlas mein IP whitelist
  karo (0.0.0.0/0 for testing)
- **CORS error** → `CLIENT_URL` backend `.env` mein frontend ke URL se match hona chahiye
- **PDF text extract nahi ho raha** → scanned/image-based PDF pe kaam nahi karega, text-based
  PDF use karo

---

## 6. Deploy karna ho to (optional next step)
- Backend: Render / Railway pe deploy karo
- Frontend: Vercel / Netlify pe deploy karo
- MongoDB Atlas already cloud mein hai, wahi use karo
- Deploy ke baad `client/src/api/axios.js` mein `baseURL` ko apne live backend URL se update
  karna mat bhoolna

---

Built as a MERN + AI portfolio project. Happy shipping! 🚀
