# 🌊 InsightFlow — Intelligent Customer Feedback & Decision Platform

> **Frontend Arena — Build Battle 2026 | AI × Web Development Hackathon**  
> **Core AI Integration: Adaption Labs Production API & AutoScientist Model Alignment**

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Backend-Express_5.x-black?logo=express&logoColor=white)](https://expressjs.com/)
[![Adaption Labs](https://img.shields.io/badge/Engine-Adaption_Labs_Production-00E5FF?logo=databricks&logoColor=black)](https://docs.adaptionlabs.ai/)
[![AutoScientist](https://img.shields.io/badge/Fine--Tuned-Mistral--7B--Instruct-FF7000?logo=huggingface&logoColor=white)](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2)
[![Google Colab](https://img.shields.io/badge/Google_Colab-T4_GPU_Server-F9AB00?logo=googlecolab&logoColor=white)](./notebooks/InsightFlow_Mistral7B_LoRA_Inference.ipynb)

---

## 🌟 Executive Summary

Modern software teams collect tens of thousands of unstructured customer complaints across fragmented channels: support tickets, App Store reviews, CSAT surveys, and Discord channels. Traditional dashboards merely count keyword frequencies, leaving product and engineering leaders guessing which bugs actually cause customer churn and impact Annual Recurring Revenue (ARR).

**InsightFlow** transforms unstructured feedback into prioritized, executive engineering decisions by deeply integrating the **Adaption Labs Production Adaptive Data Platform**. It provides:
1. **100% Live Dynamic Computation**: Zero pre-fed or hardcoded fallback datasets. Every single metric, cluster, sentiment split, and solution is computed live from the uploaded data.
2. **AutoScientist Direct Preference Optimization (DPO)**: Fine-tuned **Mistral-7B-Instruct-v0.2** model trained on Adaption Labs with attached LoRA adapter weights.
3. **Live GPU Tunnel Integration**: Connects directly to Google Colab GPU instances via Cloudflare Quick Tunnels for sub-second, fine-tuned neural inference.
4. **Transparent Proof of Inference**: Interactive in-app token inspector revealing the raw text tokens emitted by your model on the GPU.
5. **Attack-Proof Architecture**: Built-in sliding-window rate limiting, XSS sanitization, SSRF outbound validation, and defense-in-depth security headers.

---

## 🎯 Key Capabilities & System Highlights

### 1. Production Adaption Labs Platform Integration
* **3-Step Direct S3 Ingestion:** Ingests large datasets via `POST /datasets/upload/initiate` $\to$ Direct binary S3 `PUT` $\to$ `POST /datasets/upload/complete`.
* **Live Cloud Dataset Sync:** Ingests real preference pairs directly from Adaption Labs dataset `9d4d969a-5a30-452c-b8bd-1ec6772350a8` (`cx_feedback_preferences`).
* **AutoScientist Model Alignment:** Direct integration with live trained run `792bafcc-e22b-4fdc-b91f-7b21352d1cce`:
  * **Base Model:** `mistralai/Mistral-7B-Instruct-v0.2`
  * **Training Method:** Alignment (Direct Preference Optimization - DPO)
  * **Target Win Rate:** `90.0%` | **Best Win Rate Achieved:** **`73.02%`**
  * **LoRA Configuration:** `r=32`, `alpha=64`, `dpo_beta=0.1` across all projection layers (`q, k, v, o, gate, up, down`)
  * **Export Checkpoint:** Decompressed LoRA adapter attached on top of 4-bit NF4 quantized base model.

### 2. High-Performance Dashboard & Real-Time Analytics
* **Smart CSV Ingestion with Schema Validation:** Auto-detects feedback text, customer identifiers, dates, channels, and sentiments with fallback column normalization.
* **Liquid Glassmorphic UI:** Transparent dark/light aesthetic with ambient chromatic shader orbs, zero layout shift, and smooth micro-animations.
* **Multi-Dimensional Metrics (100% Live Computed):** 
  * Real-time Sentiment Donut (Positive / Neutral / Negative)
  * Time-Series Volume & NPS Velocity Area Chart
  * Topic Cluster Frequency Distribution
  * ARR Exposure by Issue Category
* **Real-Time Decision Playbooks:** Generates engineering root causes, code fixes, customer retention countermeasures, and targeted SLA timelines.

---

## 🛡️ Security & Attack-Proof Hardening

InsightFlow includes enterprise-grade defense-in-depth security:
* **HTTP Security Headers (`server/middleware/security.js`):**
  * `X-Frame-Options: DENY` (prevents clickjacking)
  * `X-Content-Type-Options: nosniff` (mitigates MIME-type spoofing)
  * `X-XSS-Protection: 1; mode=block`
  * `Referrer-Policy: strict-origin-when-cross-origin`
  * `Permissions-Policy` (disables camera, mic, geolocation access)
  * `X-Powered-By` header stripped to eliminate server fingerprinting.
* **Sliding-Window Rate Limiting:**
  * 120 requests/minute for general endpoints.
  * 30 requests/minute for compute-heavy routes (`/solutions/generate`, `/upload`) to block denial-of-service (DoS) and API abuse.
* **XSS & Injection Sanitization:**
  * Incoming CSV rows, text inputs, and category tags are sanitized to remove `<script>` tags, inline event handlers (`onload`, `onerror`), and `javascript:` URIs.
* **SSRF Protection:**
  * Outbound AI endpoint validator checks URLs against internal loopback ranges, cloud metadata addresses (`169.254.169.254`), and enforces secure HTTPS protocol.
* **Memory-Backed Streaming Uploads:**
  * Limits file uploads strictly to `.csv` format under 25MB without writing unverified files to host disk.

---

## 🏗️ Architecture & Data Flow

```
┌────────────────────────────────────────────────────────┐
│                   Customer Channels                    │
│   (Zendesk, Discord, App Reviews, CSV File Uploads)    │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│            InsightFlow Modular Backend (Port 3001)     │
│   - Security Headers & Sliding-Window Rate Limiter     │
│   - CSV Ingestion & XSS Sanitization Pipeline          │
│   - SSRF-Protected Outbound AI Dispatcher              │
└──────────────┬───────────────────────────┬─────────────┘
               │                           │
               ▼                           ▼
┌──────────────────────────────┐ ┌──────────────────────────────┐
│     Adaption Labs Cloud      │ │    Live GPU Inference Hub    │
│  https://api.prod.adaption   │ │                              │
│           labs.ai            │ │  - Google Colab T4 GPU       │
│                              │ │  - Mistral-7B + LoRA Adapter │
│  1. Initiate S3 pre-signed   │ │  - Cloudflare Quick Tunnel   │
│  2. Direct binary S3 upload  │ │  - Groq AI Fallback Engine   │
│  3. DPO Preference Pairs     │ │                              │
│  4. AutoScientist LoRA run   │ └──────────────────────────────┘
│     (73.02% Win Rate)        │
└──────────────┬───────────────┘
               │
               ▼
┌────────────────────────────────────────────────────────┐
│             Vite + React 19 Frontend Client            │
│   - Real-Time Live Analytics (Zero Hardcoded Data)     │
│   - Interactive Raw Model Output Inspector (Proof)     │
│   - Actionable Engineering Solutions & SLA Matrix      │
└────────────────────────────────────────────────────────┘
```

---

## 🚀 Quickstart & Setup Guide

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/anshuvdebnath-cyber/BUILD-BATTLE-HACKATHON.git
cd "BUILD BATTLE HACKATHON"
npm install
```

### 2. Configure Environment Variables
Create or verify your `.env` file in the root directory:
```env
PORT=3001
ADAPTION_API_KEY=your_adaption_api_key_here
ADAPTION_API_BASE=https://api.prod.adaptionlabs.ai/api/v1
ADAPTION_MODEL_ID=adaption_mistral_7b_instruct_cx_feedback_preferences_13088bd2
GROQ_API_KEY=your_groq_api_key_here
MISTRAL_API_URL=https://your-tunnel-name.trycloudflare.com/predict
```

### 3. Launch Development Servers

**Terminal 1 — Start the Backend Server (Port 3001):**
```bash
npm run server
```

**Terminal 2 — Start the Frontend Client (Port 5173/5174):**
```bash
npm run dev
```

Open your browser at `http://localhost:5173` or `http://localhost:5174`.

---

## 📓 Running the Fine-Tuned Mistral-7B Model on Google Colab

A production-ready Jupyter Notebook is provided in [`notebooks/InsightFlow_Mistral7B_LoRA_Inference.ipynb`](./notebooks/InsightFlow_Mistral7B_LoRA_Inference.ipynb).

### 1-Click Setup:
1. Open [Google Colab](https://colab.research.google.com).
2. Click **File** $\to$ **Upload notebook** $\to$ Select `notebooks/InsightFlow_Mistral7B_LoRA_Inference.ipynb` from this repo.
3. Select **Runtime** $\to$ **Change runtime type** $\to$ **T4 GPU** (Free tier).
4. Click **Run All** (`Ctrl + F9`).
5. The notebook will:
   - Quantize `mistralai/Mistral-7B-Instruct-v0.2` in 4-bit NF4 precision.
   - Attach the fine-tuned Adaption Labs LoRA weights.
   - Start the FastAPI inference service in a background daemon thread.
   - Launch an encrypted Cloudflare Tunnel and print your public URL:
     ```
     ====================================================================
     🎉 YOUR LIVE MISTRAL API URL:
     https://random-words-sample.trycloudflare.com/predict
     ====================================================================
     ```
6. Paste that URL into your `.env` file as `MISTRAL_API_URL`.
7. Your web dashboard will immediately query your live Google Colab GPU for all resolution synthesis!

---

## 📡 API Endpoints Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/health` | `GET` | Service status, total records, and Adaption API key connectivity. |
| `/api/feedback` | `GET` | Retrieves all ingested customer feedback entries. |
| `/api/feedback/upload` | `POST` | Uploads CSV, validates schema, sanitizes inputs, and wipes previous buffer. |
| `/api/adaption/model/info` | `GET` | Returns live AutoScientist Mistral 7B run status, win rate, and LoRA params. |
| `/api/adaption/datasets` | `GET` | Lists all datasets stored in Adaption Labs cloud account. |
| `/api/adaption/datasets/:id/download` | `GET` | Streams raw CSV dataset from Adaption Labs. |
| `/api/adaption/datasets/load-cloud` | `POST` | Ingests live cloud dataset entries into active dashboard storage. |
| `/api/adaption/solutions/generate` | `POST` | Queries fine-tuned Mistral 7B GPU / Groq for engineering playbooks. |
| `/api/analytics` | `GET` | 100% dynamically calculated sentiment split, volume, and top issue trends. |

---

## 🏆 Hackathon Evaluation Criteria Compliance

| Requirement | Implementation in InsightFlow | Verification |
| :--- | :--- | :---: |
| **1. Feedback Management** | Smart CSV drag-and-drop, multi-attribute filter engine, 1-click cloud sync, manual escalation entry. | ✅ Complete |
| **2. AI-Powered Analysis** | Adaption 8-step pipeline, real DPO preference pairs, live Mistral-7B GPU inference. | ✅ Complete |
| **3. Analytics Dashboard** | Real-time KPI tiles, sentiment donut, time-series volume velocity, ARR impact exposure. | ✅ Complete |
| **4. Prioritized Decisions** | Mathematical priority formula ($$\text{Severity} \times \text{Frequency} \times \text{ARR}$$), SLA targets. | ✅ Complete |
| **5. Production Adaption API** | Native S3 pre-signed ingestion, real cloud dataset query, live AutoScientist run (`73.02%` win rate). | ✅ Complete |
| **6. Zero Hardcoded Datasets** | 100% computed live on upload; wipes stale buffers on new upload; zero mock fallbacks. | ✅ Complete |
| **7. Security Hardened** | Rate limiting, XSS input sanitization, SSRF protection, strict security headers. | ✅ Complete |

---

## 📄 License & Credits

* Developed for **Frontend Arena — Build Battle 2026 Hackathon**.
* Adaptive Data Pipeline & AutoScientist powered by **[Adaption Labs](https://adaptionlabs.ai/)**.
* Foundation models courtesy of **[Mistral AI](https://mistral.ai/)**.
