# Project Engineering Changelog & Revisions Record

**Project:** Digital Wellness Hub  
**Author / Lead Engineer:** Yash Khedekar  
**Repository:** [https://github.com/Fantom-1/DigitalWellness](https://github.com/Fantom-1/DigitalWellness)  
**Reporting Horizon:** October 2026 – November 2026  
**Current Production Release:** `v0.12.0`  

---

## 1. Release Timeline Overview

```
[October 2026]
   │── v0.1.0 (Initial Repository Scaffold & Architecture)
   │── v0.2.0 (PostgreSQL Database Schema & Async Models)
   │── v0.3.0 (Curated Wellness Dataset & Seeding Engine)
   │── v0.4.0 (React 18 Component Suite & Interface Design)
   │── v0.5.0 (AI Wellness Advisor & Natural Language Engine)
   └── v0.6.0 (Cloudflare Edge & Render Production Deployment)
[November 2026]
   │── v0.7.0 (Vite 6 Architecture Upgrade for Cloudflare)
   │── v0.8.0 (Mobile Ergonomics Sprint & Touch Gestures - 4d73171)
   │── v0.9.0 (Favicon Purge & Mobile Web App Meta Flags - 4d73171)
   │── v0.10.0 (GitHub Actions CI/CD Pipeline Deployment - e1f8fbf)
   │── v0.11.0 (Node 22 LTS & Wrangler Action v4 Migration - 3c842ce)
   └── v0.12.0 (Production Environment Variable Injection - d3bcf1c)
```

---

## 2. Granular Revision History

### Version `0.1.0` (October 12, 2026)
* **Change Classification:** Architectural Initialization
* **Summary:** Monorepo architecture established with isolated `frontend/` and `backend/` subtrees. Node.js workspace structure declared with npm workspaces.
* **Technical Details:**
  * Scaffolded Vite + React 18 frontend runtime paired with TailwindCSS v4.
  * Scaffolded FastAPI ASGI server framework with Python 3.11 specifications.
  * Git repository initialized with strict `.gitignore` rules shielding `.env` secrets, node modules, and Python bytecode caches.
* **Key Files Modified:** `package.json`, `frontend/vite.config.js`, `backend/main.py`, `backend/requirements.txt`, `.gitignore`.

---

### Version `0.2.0` (October 18, 2026)
* **Change Classification:** Data Layer Engineering
* **Summary:** Asynchronous SQLAlchemy ORM models configured against Supabase PostgreSQL.
* **Technical Details:**
  * Configured asynchronous database connection pool using `asyncpg` driver engine.
  * Implemented database schema entities:
    * `WellnessResource`: 15 comprehensive attributes (name, slug, category, pricing, privacy rating, official URLs, video guides).
    * `SetupGuide`: Title, difficulty, target platforms, and JSONB array of ordered action steps.
    * `StudentSubmission`: Student community recommendation intake pipeline.
  * Enabled `pgvector` extension across the database instance to support semantic search vector embeddings.
* **Key Files Modified:** `backend/models.py`, `backend/database.py`, `backend/schemas.py`.

---

### Version `0.3.0` (October 25, 2026)
* **Change Classification:** Content Curation & Dataset Seeding
* **Summary:** Authoring and data validation of 15 verified digital wellness tools across 5 balanced categories, alongside 3 detailed step-by-step setup guides.
* **Technical Details:**
  * Curated 3 items per category: Focus Blockers, Screen Time, Browser Extensions, Bedtime Routines, Privacy & Safety.
  * Extracted high-quality YouTube walkthrough embeds (`youtube-nocookie.com`) for audio-visual visual learners.
  * Seeded database idempotent initialization script ensuring zero duplicate records upon server reboot.
* **Key Files Modified:** `backend/seed_data.py`, `backend/seed_wellness_data.py`.

---

### Version `0.4.0` (November 02, 2026)
* **Change Classification:** Frontend UI Component Engineering
* **Summary:** Built the core modular React component hierarchy adhering to Apple Inc. minimalist design rules.
* **Technical Details:**
  * Engineered `SearchArea.jsx`: Hero title, search input, quick filter pills, interactive card carousel, and directory grid.
  * Engineered `ComparisonTable.jsx`: Side-by-side multi-parameter specification comparison view.
  * Engineered `ToolDetailModal.jsx`: Full-screen accessible dossier with live video embeds and documentation shortcuts.
  * Engineered `SetupGuides.jsx`: Tabbed protocol walkthrough with interactive checklist elements.
  * Engineered `SubmissionModal.jsx`: Student intake dialogue with client-side form validation.
* **Key Files Modified:** `frontend/src/App.jsx`, `frontend/src/components/*.jsx`, `frontend/src/index.css`.

---

### Version `0.5.0` (November 08, 2026)
* **Change Classification:** AI Integration & Natural Language Consultation
* **Summary:** Embedded Google Gemini API integration delivering conversational digital wellness recommendations.
* **Technical Details:**
  * Developed `wellness_advisor.py` with custom system prompts grounding AI suggestions in the verified 15-tool dataset.
  * Built intent parser categorizing user queries into specific behavioral roadblocks (e.g., late-night phone addiction vs. essay writing blocks).
  * Built real-time asynchronous streaming endpoint `/chat` in FastAPI.
* **Key Files Modified:** `backend/wellness_advisor.py`, `backend/intent_parser.py`, `backend/engine.py`.

---

### Version `0.6.0` (November 12, 2026)
* **Change Classification:** Infrastructure & Cloud Deployment
* **Summary:** Initial production deployment to Cloudflare edge network and Render web services.
* **Technical Details:**
  * Deployed FastAPI backend container to Render connected to live Supabase PostgreSQL.
  * Deployed frontend static assets via Cloudflare Workers assets configuration.
  * Mapped custom academic subdomain `digitalwellness.yashkhedekar.me` via Cloudflare DNS CNAME records.
* **Key Files Modified:** `wrangler.jsonc`, Cloudflare DNS Zone Records.

---

### Version `0.7.0` (November 16, 2026)
* **Change Classification:** Dependency Version Refactor
* **Summary:** Upgraded Vite from version `5.4.21` to `6.4.6`.
* **Technical Details:**
  * Resolved critical Cloudflare Workers deployment blocker: Wrangler v4 automations explicitly mandate Vite version `6.0.0+` for automatic single-page application asset binding.
  * Audited and synchronized root and frontend `package.json` lockfiles.
* **Key Files Modified:** `frontend/package.json`, `package-lock.json`.

---

### Version `0.8.0` (November 16, 2026) — Git Commit: `4d73171`
* **Change Classification:** Mobile Responsiveness & Touch Ergonomics Sprint
* **Summary:** Comprehensive overhaul of all layout components to achieve seamless 320px–1440px viewport adaptability.
* **Technical Details:**
  * Header: Refactored into a two-row responsive flex container (branding & action button on top row, horizontally scrolling segmented navigation below).
  * Touch Targets: Padded all category filter pills, carousel buttons, and navigation links to a strict **44×44px minimum touch target size**.
  * Comparison Table: Engineered sticky first column (`sticky left-0 bg-white z-10 shadow-[2px_0_6px_rgba(0,0,0,0.04)]`) allowing smooth horizontal examination without losing resource identity context.
  * Form Input Ergonomics: Configured form inputs to `text-[16px] sm:text-xs`, permanently eliminating iOS Safari's default automatic zoom behavior on input focus.
  * Viewport Height Sizing: Upgraded modals from `max-h-[90vh]` to `max-h-[90dvh]` to account for dynamic browser toolbars.
  * Gestures: Integrated native touch swipe listeners (`touchstart`, `touchmove`, `touchend`) onto the card carousel.
* **Key Files Modified:** `frontend/src/App.jsx`, `frontend/src/components/SearchArea.jsx`, `frontend/src/components/ComparisonTable.jsx`, `frontend/src/components/ToolDetailModal.jsx`, `frontend/src/components/SetupGuides.jsx`, `frontend/src/components/SubmissionModal.jsx`, `frontend/src/index.css`.

---

### Version `0.9.0` (November 16, 2026) — Git Commit: `4d73171`
* **Change Classification:** Brand Identity & Head Tag Cleanup
* **Summary:** Permanently expunged default favicon and configured Apple web app metadata.
* **Technical Details:**
  * Deleted `frontend/public/favicon.svg` via `git rm`.
  * Removed `<link rel="icon" ...>` tags from `frontend/index.html`.
  * Injected Apple mobile web app metadata tags:
    * `<meta name="theme-color" content="#f5f5f7" />`
    * `<meta name="apple-mobile-web-app-capable" content="yes" />`
    * `<meta name="apple-mobile-web-app-status-bar-style" content="default" />`
* **Key Files Modified:** `frontend/index.html`, `frontend/public/favicon.svg` (deleted).

---

### Version `0.10.0` (November 16, 2026) — Git Commit: `e1f8fbf`
* **Change Classification:** CI/CD Automation Pipeline
* **Summary:** Created automated GitHub Actions workflow to deploy frontend assets to Cloudflare Workers upon push.
* **Technical Details:**
  * Created `.github/workflows/deploy.yml` triggered on pushes to `master` and `main` impacting frontend paths.
  * Configured `actions/checkout@v4`, `actions/setup-node@v4`, clean npm dependency installation, Vite production compilation, and automated dist copying to root directory.
  * Configured `cloudflare/wrangler-action` binding `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
* **Key Files Modified:** `.github/workflows/deploy.yml`.

---

### Version `0.11.0` (November 17, 2026) — Git Commit: `3c842ce`
* **Change Classification:** CI/CD Runtime Modernization
* **Summary:** Upgraded GitHub Actions runtime to Node.js 22 LTS and updated Wrangler Action to v4.
* **Technical Details:**
  * Fixed GitHub Actions runner deprecation warning forcing Node 20 runtimes to Node 24.
  * Bumped `cloudflare/wrangler-action` from `@v3` to `@v4`.
  * Added programmatic secret validation step asserting token and account ID presence prior to build invocation.
* **Key Files Modified:** `.github/workflows/deploy.yml`.

---

### Version `0.12.0` (November 17, 2026) — Git Commit: `d3bcf1c`
* **Change Classification:** Production Environment Configuration
* **Summary:** Created production environment file establishing canonical API endpoint injection.
* **Technical Details:**
  * Added `frontend/.env.production` containing:
    `VITE_API_BASE_URL=https://digital-wellness-api-71g7.onrender.com`
  * Guarantees that production builds compiled in GitHub Actions runners bind all API fetches to the live Render backend, rather than defaulting to the local `/api` Vite development proxy.
* **Key Files Modified:** `frontend/.env.production`.
