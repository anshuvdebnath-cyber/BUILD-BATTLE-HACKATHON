# 🌊 InsightFlow — Intelligent Customer Decision Platform

> **Frontend Arena — Build Battle 2026 | AI × Web Development Hackathon**  
> **Core AI Integration: Adaption Labs Production API & Fine-Tuned Mistral-7B AutoScientist**

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Backend-Express_5.x-black?logo=express&logoColor=white)](https://expressjs.com/)
[![Adaption Labs](https://img.shields.io/badge/Engine-Adaption_Labs_Production-00E5FF?logo=databricks&logoColor=black)](https://docs.adaptionlabs.ai/)
[![AutoScientist](https://img.shields.io/badge/Fine--Tuned-Mistral--7B--LoRA-FF7000?logo=huggingface&logoColor=white)](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2)
[![Google Colab](https://img.shields.io/badge/Google_Colab-T4_GPU_Server-F9AB00?logo=googlecolab&logoColor=white)](./notebooks/InsightFlow_Mistral7B_LoRA_Inference.ipynb)

---

## 💡 What is InsightFlow?

Engineering and product leaders receive thousands of customer complaints across support tickets, App Store reviews, CSAT surveys, and Discord channels. Traditional dashboards merely count keyword frequencies, leaving teams guessing which bugs actually cause customer churn or threaten business revenue.

**InsightFlow** changes that:
1. **Uploads Raw Feedback**: Ingests raw CSV customer feedback files with instant schema normalization.
2. **100% Live Dynamic Computation**: Zero pre-fed, mock, or hardcoded datasets. When you upload data, previous metrics are purged and everything is recalculated live on the fly.
3. **Fine-Tuned Mistral-7B Intelligence**: Connects to a fine-tuned **Mistral-7B-Instruct-v0.2** model trained on Adaption Labs AutoScientist with attached LoRA adapter weights.
4. **Live GPU Tunnel**: Serves real-time inference directly from a free Google Colab T4 GPU via encrypted Cloudflare Quick Tunnels.
5. **Actionable Resolution Playbooks**: Synthesizes root causes, immediate code patches, customer retention strategies, and SLA timelines.
6. **Attack-Proof Architecture**: Enterprise-grade security featuring sliding-window rate limiting, XSS input sanitization, SSRF outbound guard, and security headers.

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Customer Channels                    │
│   (Support Tickets, App Reviews, CSAT, CSV Uploads)    │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│         InsightFlow Express Backend (Port 3001)        │
│   • Defense-in-Depth Security Headers                  │
│   • Sliding-Window Rate Limiting (120 req/min)         │
│   • XSS Input Sanitization Pipeline                    │
│   • SSRF-Protected Outbound AI Dispatcher              │
└──────────────┬───────────────────────────┬─────────────┘
               │                           │
               ▼                           ▼
┌──────────────────────────────┐ ┌──────────────────────────────┐
│     Adaption Labs Cloud      │ │    Live GPU Inference Hub    │
│  https://api.prod.adaption   │ │                              │
│           labs.ai            │ │  • Google Colab T4 GPU       │
│                              │ │  • Mistral-7B + LoRA Adapter │
│  1. Initiate S3 pre-signed   │ │  • Cloudflare Quick Tunnel   │
│  2. Direct binary S3 upload  │ │  • Transparent Raw Output    │
│  3. DPO Preference Pairs     │ │  • Groq AI High-Speed Backup │
│  4. AutoScientist LoRA run   │ │                              │
│     (73.02% Win Rate)        │ │                              │
└──────────────┬───────────────┘ └──────────────────────────────┘
               │
               ▼
┌────────────────────────────────────────────────────────┐
│             Vite + React 19 Frontend Client            │
│   • Liquid Glassmorphic UI with Ambient Glows          │
│   • 100% Live Dynamic Computation on Every Upload      │
│   • Transparent Proof-of-Inference Token Inspector     │
│   • Real-Time ROI & SLA Priority Ranking               │
└────────────────────────────────────────────────────────┘
```

---

## ⚡ Quickstart Guide

### 1. Prerequisites
- **Node.js** v18+ (tested on v20+)
- **Git**
- Optional: Google Colab account with free T4 GPU access

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/anshuvdebnath-cyber/BUILD-BATTLE-HACKATHON.git
cd "BUILD BATTLE HACKATHON"

# Install dependencies
npm install
```

### 3. Environment Configuration
Create or edit your `.env` file in the project root:
```env
PORT=3001
CORS_ORIGIN=http://localhost:5173

# Adaption Labs Production Credentials
ADAPTION_API_KEY=pt_live_f571fe1acf24b42406e1b8c7ba206d7e87405040
ADAPTION_API_BASE=https://api.prod.adaptionlabs.ai/api/v1
ADAPTION_MODEL_ID=adaption_mistral_7b_instruct_cx_feedback_preferences_13088bd2

# High-Speed AI Synthesis (Groq)
GROQ_API_KEY=your_groq_api_key_here

# Live Google Colab GPU Endpoint (Generated by Colab Notebook)
MISTRAL_API_URL=https://your-tunnel-id.trycloudflare.com/predict
```

### 4. Running Locally

**Terminal 1 — Start the Backend Server:**
```bash
npm run server
```
Server runs on `http://localhost:3001` with security headers, rate limiting, and API routing.

**Terminal 2 — Start the Frontend Client:**
```bash
npm run dev
```
Open `http://localhost:5173` (or `http://localhost:5174`) in your browser.

---

## 📓 Running the Fine-Tuned Model on Google Colab GPU

We provide a verified 1-click Jupyter Notebook in [`notebooks/InsightFlow_Mistral7B_LoRA_Inference.ipynb`](./notebooks/InsightFlow_Mistral7B_LoRA_Inference.ipynb).

### Step-by-Step Colab Instructions:
1. Open [Google Colab](https://colab.research.google.com).
2. Click **File** $\to$ **Upload notebook** $\to$ select `notebooks/InsightFlow_Mistral7B_LoRA_Inference.ipynb`.
3. Set the runtime: **Runtime** $\to$ **Change runtime type** $\to$ **T4 GPU** (Free).
4. Run all cells (`Ctrl + F9`). The notebook will:
   - Install `torch`, `transformers`, `peft`, and `zstandard`.
   - Download the trained AutoScientist LoRA adapter checkpoint (`Run ID: 792bafcc-e22b-4fdc-b91f-7b21352d1cce`).
   - Quantize `mistralai/Mistral-7B-Instruct-v0.2` in 4-bit NF4 precision.
   - Launch an asynchronous FastAPI service on port 8000.
   - Provision an encrypted Cloudflare Quick Tunnel and display your public link:
     ```
     ====================================================================
     🎉 YOUR LIVE MISTRAL API URL:
     https://random-words-sample.trycloudflare.com/predict
     ====================================================================
     ```
5. Copy that URL and paste it into your `.env` as `MISTRAL_API_URL`.
6. InsightFlow will now query your live Colab GPU instance for all feedback analysis and resolution synthesis!

---

## 🛡️ Attack-Proof Security Hardening

InsightFlow includes comprehensive defense-in-depth protections in [`server/middleware/security.js`](./server/middleware/security.js):

| Security Measure | Implementation | Purpose |
| :--- | :--- | :--- |
| **HTTP Security Headers** | Helmet-equivalent custom middleware | Prevents Clickjacking (`X-Frame-Options: DENY`), MIME sniffing (`nosniff`), and strips `X-Powered-By`. |
| **Sliding-Window Rate Limiter** | Sliding timestamp log per IP | 120 req/min general, 30 req/min for compute-heavy routes (`/solutions/generate`, `/upload`). |
| **XSS Input Sanitization** | Recursive HTML tag & script stripper | Strips `<script>`, inline event handlers (`onload`, `onerror`), and `javascript:` pseudo-protocols. |
| **SSRF Outbound Guard** | IP & hostname validator | Blocks outbound calls to loopback (`127.0.0.1`), private RFC1918 subnets, and AWS/GCP metadata endpoints (`169.254.169.254`). |
| **Memory-Backed Streaming Upload** | Multer memory buffer | Limits uploads strictly to `.csv` files under 25MB without persisting unvalidated files to disk. |

---

## 📡 API Endpoints Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/health` | `GET` | Health check endpoint returning status, connected entries, and timestamp. |
| `/api/feedback` | `GET` | Returns all current ingested customer feedback records. |
| `/api/feedback/upload` | `POST` | Uploads a CSV, validates schema, wipes stale data, and triggers live compute. |
| `/api/adaption/model/info` | `GET` | Returns live AutoScientist training metrics, win rate (73.02%), and LoRA architecture. |
| `/api/adaption/datasets` | `GET` | Lists all cloud datasets stored in the Adaption Labs account. |
| `/api/adaption/datasets/:id/download` | `GET` | Streams dataset CSV from Adaption Labs cloud storage. |
| `/api/adaption/datasets/load-cloud` | `POST` | Ingests live cloud dataset records into active dashboard memory. |
| `/api/adaption/solutions/generate` | `POST` | Queries fine-tuned Mistral-7B GPU / Groq for engineering playbooks. |
| `/api/analytics` | `GET` | Computes live sentiment breakdown, volume velocity, and ARR impact. |

---

## 🏆 Hackathon Evaluation Criteria

| Requirement | How InsightFlow Delivers | Status |
| :--- | :--- | :---: |
| **1. Customer Feedback Management** | Drag-and-drop CSV upload, multi-filter query bar, instant cloud sync, manual ticket creation. | ✅ Complete |
| **2. AI-Powered Analysis** | Adaption Labs Adaptive Data pipeline, DPO preference pair optimization, live Mistral-7B inference. | ✅ Complete |
| **3. Analytics Dashboard** | Real-time sentiment donut, volume velocity area charts, cluster topic distribution, ARR exposure. | ✅ Complete |
| **4. Prioritized Decisions** | Dynamic ROI formula ($$\text{Severity} \times \text{Frequency} \times \text{ARR}$$), engineering playbooks, SLA targets. | ✅ Complete |
| **5. Production Adaption API** | Native 3-step S3 upload, real cloud datasets, AutoScientist training run (`73.02%` win rate). | ✅ Complete |
| **6. Zero Hardcoded Datasets** | 100% computed live on upload; old buffers purged on new file upload; zero mock fallbacks. | ✅ Complete |
| **7. Security Hardened** | Sliding-window rate limiter, XSS sanitization, SSRF protection, defense-in-depth headers. | ✅ Complete |

---

## 📁 Repository Structure

```
BUILD-BATTLE-HACKATHON/
├── notebooks/
│   └── InsightFlow_Mistral7B_LoRA_Inference.ipynb  # 1-Click Google Colab GPU notebook
├── public/
│   ├── hackathon_feedback.csv                     # Sample feedback dataset
│   └── favicon.svg                                # Brand assets
├── scripts/
│   ├── adaption_pipeline.py                       # Python SDK Adaption ingestion script
│   └── test_mistral_colab.py                      # Standalone GPU inference script
├── server/
│   ├── config/config.js                           # Server configuration & environment
│   ├── controllers/                               # Feedback & Adaption controllers
│   ├── middleware/                                # Security headers, rate limiter, SSRF guard
│   ├── routes/                                    # Express API routes
│   ├── services/                                  # Adaption Labs client & storage
│   └── index.js                                   # Server entry point
├── src/                                           # React 19 Frontend application
│   ├── components/                                # Liquid glassmorphic UI components
│   ├── context/                                   # Application state management
│   ├── services/                                  # Frontend API client
│   └── App.tsx                                    # Main application layout
├── .env.example                                   # Sample environment configuration
├── .gitignore                                     # Python cache, node_modules, and env rules
├── package.json                                   # NPM dependencies & scripts
├── tsconfig.json                                  # TypeScript configuration
└── vite.config.ts                                 # Vite bundler configuration
```

---

## 📄 License & Credits

* Developed for **Frontend Arena — Build Battle 2026 Hackathon**.
* Adaptive Data Pipeline & AutoScientist powered by **[Adaption Labs](https://adaptionlabs.ai/)**.
* Base foundation models courtesy of **[Mistral AI](https://mistral.ai/)**.
