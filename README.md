<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ContextLingo

AI-powered language learning from real-life context. Users upload a photo or describe a scene; Gemini 3 Pro extracts the context, proposes themes, and builds a tailored lesson with vocabulary, quizzes, and roleplay.

- Built for Kaggle hackathon: **Google DeepMind - Vibe Code with Gemini 3 Pro in AI Studio Kaggle Hackathon**
- Team: 2 members — HyIsNoob and Jaxy

## Key Features
- **Context-first lessons:** Upload image → Gemini 3 Pro analyzes → suggests 3 themes tied to the original context.
- **Bilingual Bridge:** Target language separated from instruction language; examples are bilingual.
- **Adaptive quizzes:** Hard mode progress (+10% per question), completion gates to prevent skipping.
- **Speech practice:** Text-to-Speech playback and Speech-to-Text answer checking.
- **Roleplay dojo:** AI proposes roles, allows customer/staff switching, and grammar toggle (Grammar Detective).
- **Persistence:** LocalStorage for settings, study history, saved words, and journal tabs.
- **Gamification:** XP, streaks, and Magic Recap Card export (html2canvas) for sharing.

## User Flow
1) **Input & Setup:** choose target language + level; persisted for next sessions.  
2) **Smart Theme Analysis:** upload/describe; Gemini proposes 3 context-anchored themes.  
3) **Learn Mode:** vocabulary up top, quiz pagination below; gated “Continue Learning”.  
4) **Roleplay Modal:** AI role suggestions, role switching, grammar check toggle.

## Tech Stack
- **Frontend:** React + Vite, Tailwind via CDN, React 19.
- **AI:** Gemini 3 Pro through `@google/genai`.
- **Utilities:** Web Speech API (TTS/STT), `canvas-confetti`, `html2canvas` (CDN), LocalStorage.
- **Language:** TypeScript.

## Getting Started
Prerequisite: Node.js

```bash
npm install
# set GEMINI_API_KEY in .env.local
npm run dev
```

## Scripts
- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview build

## Project Structure (key)
- `components/` — UI flow: Landing, ThemeSelector, LearnView, RoleSelector, etc.
- `services/` — Gemini calls, storage, word-chain logic.
- `utils/` — audio helpers.
- `LingoBot.svg` — mascot used across the app.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
