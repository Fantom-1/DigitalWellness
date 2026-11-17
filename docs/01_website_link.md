# Digital Wellness Hub — Website Link & Deployment Record

**Project Title:** Digital Wellness Hub | Practical Student Guide & AI Advisor  
**Author / Maintainer:** Yash Khedekar  
**Publication Date:** November 16, 2026  
**Status:** Live & Production Ready  

---

## 1. Primary Access Links

| Asset | Target Link / Identifier | Description |
| :--- | :--- | :--- |
| **Production Web Application** | [https://digitalwellness.yashkhedekar.me](https://digitalwellness.yashkhedekar.me) | Primary student-facing domain with SSL/TLS edge delivery via Cloudflare Workers. |
| **Public API Backend** | [https://digital-wellness-api-71g7.onrender.com](https://digital-wellness-api-71g7.onrender.com) | FastAPI asynchronous REST service hosted on Render (includes automated OpenAPI documentation). |
| **Interactive API Documentation** | [https://digital-wellness-api-71g7.onrender.com/docs](https://digital-wellness-api-71g7.onrender.com/docs) | Swagger UI for exploring and querying interactive schema endpoints. |
| **Source Code Repository** | [https://github.com/Fantom-1/DigitalWellness](https://github.com/Fantom-1/DigitalWellness) | Monorepo containing React/Vite client, FastAPI backend engine, and CI/CD automation pipelines. |

---

## 2. Infrastructure & Hosting Architecture

* **Edge Delivery & CDN:** Cloudflare Workers (Single-Page Application asset routing, HTTP/2 & HTTP/3, zero-cold-start edge caching).
* **Application Server:** Render Web Service (FastAPI running on Python 3.11 with Uvicorn async worker threads).
  * *Note on Inactivity:* Render free tier instances enter idle state after 15 minutes of zero traffic. The initial cold start takes approximately 30–35 seconds, after which responses execute in sub-100ms latencies.
* **Database Management:** PostgreSQL hosted on Supabase with `pgvector` extension configured for vector similarity embeddings.
* **Continuous Integration / Continuous Deployment (CI/CD):**
  * Automated push triggers configured via GitHub Actions (`.github/workflows/deploy.yml`).
  * Automated deployment on all commits to `master` and `main` branches using `cloudflare/wrangler-action@v4` and Node.js 22 LTS.

---

## 3. Core API Endpoints

All endpoints support cross-origin requests (CORS enabled for development and production domains):

| Method | Endpoint | Description | Sample Output / Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | System status and connectivity check | `{"status": "ok", "app": "Digital Wellness Resource Hub"}` |
| `GET` | `/stats` | Aggregate directory counts & student ratings | Total tools count, category distribution, avg student rating |
| `GET` | `/resources` | Filterable list of all 15 wellness resources | Array of resource objects (category, pricing, privacy rating) |
| `GET` | `/resources/{slug}`| Detailed resource profile with tutorial links | Full specifications, limitations, and YouTube guide URLs |
| `GET` | `/guides` | Complete list of student setup guides | Step-by-step setup walkthroughs and JSONB action items |
| `GET` | `/guides/{slug}` | Granular setup protocol | Detailed markdown, platform flags, and video tutorial link |
| `POST` | `/submissions` | Student tool suggestion intake | Payload with tool title, URL, rationale, and student email |
| `POST` | `/chat` | Context-aware AI Advisor consultation | Powered by Google Gemini model with system prompt grounding |

---

## 4. Student User Access Instructions

1. **Browser Compatibility:** Access via any modern desktop or mobile browser (Chrome, Safari, Firefox, Edge, Brave).
2. **Authentication:** No registration, login, or personal identifying information is required to access the directory, compare tools, review guides, or converse with the AI Wellness Advisor.
3. **Mobile Usage:** Optimized for touchscreens (320px to 1440px viewport width) with dedicated swipe gestures, sticky comparative tables, and 44px minimum tap targets.
