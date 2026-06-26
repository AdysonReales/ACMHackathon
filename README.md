# ⚖️ PROSESO AI

An AI-powered, gamified study companion that transforms passive document reading into an interactive academic courtroom battle. Built for mobile-first, zero-server-cost learning.

---

## 👥 Team LarpTrip

| Name | Role |
|------|------|
| Adyson Reales | Team Lead & Lead UI/UX Architect|
| Rolando JR. Zagala | Backend & Infrastructure Engineer |
| Elijah Raven De Luna | Prompt Engineer & Context Architect |
| Lleyton Flores | Full Stack Developer|

### 🤖 AI Tools Used

| Tool | Purpose |
|------|---------|
| Google Gemini API | Document analysis, case generation, defense grading, hint generation, and professor personality engine |
| Web Speech API | Browser-native voice-to-text for oral defense input |
| Antigravity (Gemini Agent) | Pair-programming assistant for frontend engineering and state management |

---

## 📋 Problem Statement: Case 2 — AI Study Companion

Traditional study methods and Learning Management Systems (LMS) suffer from engagement and retention drop-offs due to passive, text-dense formats that lack immediate feedback and cognitive immersion.

Proseso solves this by transforming dry document reading into an active, high-stakes academic battle simulation — gamifying retention through adversarial AI-driven cross-examination.

---

## 🎮 Core Product Loop

1. Document Ingestion — Students upload their course materials (PDF syllabi, lecture notes, or textbook screenshots).
2. Case Generation — A single-pass AI script analyzes the uploaded text, compiling it into an interactive battle layout that maps core concepts to counter-evidence cards.
3. The Courtroom Battle — A Professor sprite (with a unique personality and difficulty level) launches flawed, jargon-heavy academic "attacks." The student must construct a defense using their knowledge of the material.
4. The Oral Defense — Players can type their defense or hold down the microphone button to speak it aloud in English or Taglish. The browser's speech recognition converts voice to text in real-time.
5. AI Grading & Feedback — Each defense is graded by the AI using RAG (Retrieval-Augmented Generation) against the original document. Strong answers deal damage to the Professor's HP; weak answers result in damage to the student.

---

## 🧠 Key Features

- 4 Professor Personalities — Choose your examiner, each with a unique teaching style and difficulty rating (Prof. Reyes, Prof. Santos, Prof. Byte, Prof. Luna)
- Pokémon-Style Battle UI — Retro pixel-art battle arena with HP bars, screen shake, and turn-based combat
- RAG-Powered Grading — Answers are evaluated against chunked & embedded document context for accurate, context-aware scoring
- Voice Input — Built-in speech-to-text via Web Speech API for hands-free oral defense (supports English & Taglish)
- Hint System — Persona-styled hints from the professor when you're stuck
- Victory Evaluation — Post-battle debrief with Logic, Clarity, and Poise scores plus personalized bench notes
- Mobile-First Design — Fully responsive from desktop down to mobile viewports

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend Framework | React (Vite) + TypeScript |
| Styling | Tailwind CSS |
| AI / LLM | Google Gemini API |
| Speech-to-Text | Web Speech API (Browser-native) |
| Database | Supabase (PostgreSQL + Storage Buckets) |
| Deployment | Vite Build → Static Hosting |

---

## 📦 Local Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm

### 1. Clone the Repository
git clone https://github.com/AdysonReales/ACMHackathon.git
cd ACMHackathon

### 2. Install Dependencies
npm install

### 3. Configure Environment Variables
Create a .env.local file in the root directory:
env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

### 4. Run the Development Server
npm run dev

The app will be available at http://localhost:5173.

---

## 🏗️ Project Architecture

src/
├── components/        # Reusable UI components (BottomNav)
├── controllers/       # Business logic hooks (MVC pattern)
│   ├── useCombatController.ts      # Battle state machine
│   ├── useDocumentController.ts    # PDF processing + RAG
│   ├── useGradingController.ts     # AI defense evaluation
│   ├── useHintController.ts        # Professor hint generation
│   ├── useProfileController.ts     # User stats tracking
│   └── useScheduleController.ts    # Level progression
├── models/            # TypeScript type definitions
├── pages/             # Screen-level views
│   ├── CombatScreen.tsx            # Main battle arena
│   ├── EvidenceScreen.tsx          # Evidence deck viewer
│   ├── ProfileScreen.tsx           # Player stats
│   └── ScheduleScreen.tsx          # Level map
├── lib/               # AI provider abstraction
├── assets/            # Pixel art sprites & backgrounds
└── App.tsx            # App shell & routing

---

## 📄 License

This project was built for the ACM Hackathon 2026. All rights reserved by Team LarpTrip.
