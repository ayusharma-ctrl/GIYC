# 🌍 Guess If You Can - GIYC Challenge

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://vercel.com)
[![Neon](https://img.shields.io/badge/Database-Neon%20PostgreSQL-blue?style=flat)](https://neon.tech)

**The Ultimate AI-Powered Travel Guessing Game**  
Guess destinations based on cryptic clues and AI-generated images. Earn streaks, unlock achievements, and challenge friends!


## 🚀 Features

- **AI-Powered Gameplay**
  - Gemini-generated clues & trivia
  - Automatic image generation for destinations
  - Dynamic dataset expansion using AI

- **Core Game Mechanics**
  - 30-second answer timer with shake effect
  - Daily streaks & achievement system
  - Multiple choice questions with 3 wrong options
  - Interactive feedback with confetti animations

- **Social Features**
  - Challenge friends system
  - Invite tracking with notifications
  - Public profile stats tracking

- **User Management**
  - Secure authentication (username/password)
  - Protected routes middleware
  - Session management with cookies

- **Progression System**
  - Daily play streaks tracking
  - 10+ unlockable achievements
  - Global leaderboard stats

## 🛠 Tech Stack

**Frontend**
- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS + Shadcn UI
- Framer Motion (Animations)
- Canvas Confetti

**Backend**
- Next.js Server Actions
- Prisma ORM
- PostgreSQL (Neon Serverless)

**AI Integration**
- Google Gemini Pro
- LangChain (Dataset generation)

**Infrastructure**
- Vercel (Hosting)
- Neon (Database)
- Docker (Local development)

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)
- Google Gemini API key

### 1. Clone Repository
```bash
git clone https://github.com/ayusharma-ctrl/GIYC.git
cd GIYC
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Follow sample.env file and create a new '.env' file in the root directory.

### 4. Start Server
```bash
npx prisma migrate dev
npm run dev
```
