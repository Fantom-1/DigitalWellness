# Digital Wellness Resource Hub for Students 🧘‍♂️💻

A curated digital wellness guide and interactive AI advisor designed with **Apple UI/UX design philosophy** (dark glassmorphism, animated comet glow, refined typography, and responsive micro-interactions) to help students make informed choices about practical screen time controls, focus tools, bedtime device routines, and digital privacy.

> **Project 3 Alignment**: Fully addresses the Digital Wellness Resource Hub requirements — strictly evaluating 12 curated resources across 6 consistent comparison criteria, recording official verification dates (November 2026), providing 3 student-written setup guides with zero personal info, and including an interactive conversational chatbot that recommends tools and troubleshoots them.

---

## ✨ Features

- **Apple-Grade Glassmorphic Interface**: Deep-space `#050505` backdrop, rotating animated comet glow borders, frosted glass panels (`backdrop-blur-[24px]`), and responsive pill controls.
- **Conversational Wellness AI Chatbot ("Talk to the Hub")**: Powered by Google Gemini (`gemini-2.5-flash`), grounded in our verified database. Students can describe their personal hurdles (*e.g. "I keep scrolling YouTube Shorts during exam week on Windows and Android"*) to receive empathetic advice, matching tool badges, and direct links to setup guides.
- **Support & Troubleshooting for All 12 Tools**: The chatbot possesses deep knowledge of all 12 tools to guide students through installation, preventing bypasses, configuring strict schedules, and managing OS permissions.
- **Consistent Comparison Criteria**: Every resource is evaluated against:
  1. **Purpose & Focus Category**
  2. **Supported Platforms** (iOS, Android, macOS, Windows, Chrome, Firefox)
  3. **Verified Cost & Pricing Tier** (Strictly distinguishing truly free from freemium and paid — zero deceptive "free" tags)
  4. **Privacy & Telemetry Audit** (A+ to C ratings, local-only vs cloud storage)
  5. **Accessibility Features**
  6. **Known Limitations & Bypass Resistance**
  7. **Official Checked Date** (November 2026)
- **Interactive Resource Comparison Matrix**: Comprehensive side-by-side table with instant category filtering.
- **3 Student-Written Practical Setup Guides**:
  1. *The Unbreakable iOS & macOS Downtime Protocol* (Preventing the 15-minute ignore loophole)
  2. *Distraction-Free Deep Work Desktop Station* (Unhook + uBlock Origin + Cold Turkey)
  3. *Circadian Bedtime Wind-Down & Phone Detox* (Blue-light filtering, automated grayscale, and captive QR-code alarms)
- **Student Submission & Feedback Channel**: Glass modal enabling students to submit feedback, report broken links, suggest new tools, or link setup walkthrough videos and app screenshots.

---

## 🛠️ 100% Free-Tier Cloud Deployment Guide

This project is architected for a zero-cost stack using **Cloudflare Pages** (Frontend), **Supabase** (PostgreSQL Database), and **GitHub** (Version Control & CI/CD).

```mermaid
flowchart LR
    GitHub["GitHub Repository"] -->|Push to main| CFPages["Cloudflare Pages (Free Tier)"]
    CFPages --> Frontend["Vite React SPA (dist/)"]
    Frontend -->|API Requests| Backend["FastAPI Backend"]
    Backend -->|PostgreSQL + Vector| Supabase["Supabase (Free Tier)"]
    Backend -->|Chat & Embeddings| Gemini["Google Gemini API (Free Tier)"]
```

---

### Step 1: Database Setup on Supabase (Free Tier)

1. Create a free account at [Supabase.com](https://supabase.com) and click **"New Project"**.
2. Note your database password and project region.
3. Open the **SQL Editor** in your Supabase dashboard:
   - Paste and run the contents of [`backend/supabase_schema.sql`](backend/supabase_schema.sql) to create the tables, indexes, and vector extensions.
   - Paste and run the contents of [`backend/supabase_seed.sql`](backend/supabase_seed.sql) to instantly populate the 12 curated resources and 3 setup guides.
4. Go to **Project Settings > Database > Connection String**:
   - Copy the URI under **Transaction Pooler** (Port 6543) or **Direct Connection** (Port 5432).
   - Format: `postgresql+asyncpg://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`

---

### Step 2: Deploy Frontend on Cloudflare Pages (Free Tier)

1. Push this repository to your GitHub account (see Step 4).
2. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your repository and configure the build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `frontend`
4. Under **Environment variables (advanced)**, add:
   - `VITE_API_BASE_URL`: URL of your deployed backend (e.g. `https://your-api.onrender.com`). *(If running locally for testing, you can omit this.)*
5. Click **Save and Deploy**. Cloudflare will build and distribute your site globally across its edge network with automatic SSL.
   - SPA routing is already preconfigured via [`frontend/public/_redirects`](frontend/public/_redirects).

---

### Step 3: Deploy Backend API (FastAPI)

You can run the backend locally or deploy it to a free container host like **Render**, **Fly.io**, or **Railway**:

#### Option A: Deploy on Render Free Tier
1. Go to [Render.com](https://render.com) and click **"New Web Service"**.
2. Connect your GitHub repository.
3. Configure:
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3` (or `Docker` using [`backend/Dockerfile`](backend/Dockerfile))
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add Environment Variables:
   - `DATABASE_URL`: Your Supabase connection string from Step 1.
   - `GEMINI_API_KEY`: Your free Gemini API key from [Google AI Studio](https://aistudio.google.com/).

#### Option B: Run Locally
```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
pip install -r requirements.txt

# 3. Create your .env file from .env.example
cp .env.example .env
# Fill in GEMINI_API_KEY and DATABASE_URL

# 4. Start the FastAPI server
uvicorn main:app --reload --port 8000
```

---

### Step 4: GitHub Repository Setup

1. Initialize Git in the project root:
   ```bash
   git init
   git add .
   git commit -m "feat: Digital Wellness Resource Hub with Apple UI/UX and Gemini Chatbot"
   ```
2. Add your GitHub remote and push:
   ```bash
   git remote add origin https://github.com/your-username/digital-wellness-hub.git
   git branch -M main
   git push -u origin main
   ```
   *(All sensitive keys in `.env`, virtualenvs, logs, and `node_modules` are excluded via `.gitignore`.)*

---

## 💻 Local Development Workflow

To run both backend and frontend locally:

1. **Terminal 1 (Backend)**:
   ```bash
   cd backend
   uvicorn main:app --reload --port 8000
   ```
   *Swagger API Docs will be available at: http://127.0.0.1:8000/docs*

2. **Terminal 2 (Frontend)**:
   ```bash
   cd frontend
   npm run dev
   ```
   *Frontend UI will open at: http://localhost:5173/*

---

## 📋 The 12 Curated Resources

| # | Resource Name | Category | Supported Platforms | Verified Pricing Model | Privacy Rating |
|---|---|---|---|---|---|
| 1 | **Cold Turkey Blocker** | Focus Blocker | macOS, Windows | Freemium (\$39 one-time Pro) | A+ (100% Local) |
| 2 | **Freedom** | Distraction Blocker | iOS, Android, Mac, Win, Web | Paid (7-session trial) | B+ (Cloud Sync) |
| 3 | **One Sec** | Screen Time Friction | iOS, Android, macOS | Freemium (1 app free) | A (On-Device) |
| 4 | **Forest** | Gamified Pomodoro | iOS, Android, Chrome | Freemium / \$3.99 iOS | B (Cloud Rooms) |
| 5 | **Opal** | Screen Time Coach | iOS, macOS | Freemium (Deep Focus) | B+ (Apple API) |
| 6 | **Unhook** | Browser Extension | Chrome, Firefox, Edge | 100% Free & Open Source | A+ (Zero Telemetry) |
| 7 | **uBlock Origin** | Privacy & Ad Shield | Firefox, Chrome, Edge | 100% Free & Open Source | A+ (Zero Tracking) |
| 8 | **StayFree** | Screen Time Tracker | Android, iOS, Win, Mac | Freemium (PIN security) | A (Local Storage) |
| 9 | **LeechBlock NG** | Browser Time-Banking | Firefox, Chrome, Edge | 100% Free & Open Source | A+ (100% Offline) |
| 10 | **Olauncher** | Minimalist Launcher | Android | 100% Free & Open Source | A+ (Zero Internet Perm) |
| 11 | **Sleep as Android & Apple Sleep** | Bedtime Routine | Android, iOS | Freemium / Native Free | A (Encrypted Health) |
| 12 | **Signal Messenger** | Privacy & Safety | iOS, Android, Desktop | 100% Free & Open Source | A+ (End-to-End Encrypted) |

---

## 📜 License & Acknowledgments

Curated for students. Built with React 19, Tailwind CSS, Framer Motion, FastAPI, SQLAlchemy, and Google Gemini AI.

