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

---

## 🌟 Executive Summary

Modern software organizations collect tens of thousands of unstructured customer complaints across fragmented channels: Zendesk tickets, App Store reviews, CSAT surveys, and Discord channels. Traditional dashboards merely count keyword frequencies, leaving product leaders guessing which bug directly impacts annual recurring revenue (ARR).

**InsightFlow** transforms unstructured feedback into prioritized, executive engineering decisions by deeply integrating the **Adaption Labs Production Adaptive Data Platform**. It automatically:
1. Prunes duplicates via **Adaptive Deduplication & Rephrasing**.
2. Synthesizes root cause traces through **Causal Reasoning Traces**.
3. Ingests raw data via direct **AWS S3 Pre-Signed Uploads**.
4. Aligns downstream models with **AutoScientist Direct Preference Optimization (DPO)** on **Mistral-7B**.
5. Quantifies an objective **Priority Index** ($$\text{Severity} \times \text{Frequency} \times \text{ARR At Risk}$$) with automated playbooks and SLA targets.

---

## 🎯 Key Capabilities & System Highlights

### 1. Production Adaption Labs Platform Integration
* **3-Step Direct S3 Ingestion:** Ingests large datasets via `POST /datasets/upload/initiate` $\to$ Direct binary S3 `PUT` $\to$ `POST /datasets/upload/complete`.
* **Live Cloud Dataset Sync:** 1-Click **"Load Adaption Cloud"** button in the dashboard loads **1,400+ real preference pairs** directly from Adaption Labs dataset `9d4d969a-5a30-452c-b8bd-1ec6772350a8` (`cx_feedback_preferences`).
* **AutoScientist Model Alignment:** Direct integration with live trained run `792bafcc-e22b-4fdc-b91f-7b21352d1cce`:
  * **Base Model:** `mistralai/Mistral-7B-Instruct-v0.2`
  * **Training Method:** Alignment (Direct Preference Optimization - DPO)
  * **Target Win Rate:** `90.0%` | **Best Win Rate Achieved:** **`73.02%`**
  * **LoRA Configuration:** `r=32`, `alpha=64`, `dpo_beta=0.1` across all projection layers (`q, k, v, o, gate, up, down`)
  * **Export Archive:** 441 MB Zstandard compressed checkpoint (`adapter.tar.gz`) available for instant download.

### 2. High-Performance Dashboard & Real-Time Analytics
* **Smart CSV Ingestion with Schema Validation:** Auto-detects feedback text, customer identifiers, dates, channels, and sentiments with fallback column normalization.
* **Liquid Glassmorphic UI:** Transparent dark/light aesthetic with ambient chromatic shader orbs, zero layout shift, and smooth micro-animations.
* **Multi-Dimensional Metrics:** 
  * Real-time Sentiment Donut (Positive / Neutral / Negative)
  * Time-Series Volume & NPS Velocity Area Chart
  * Topic Cluster Frequency Distribution
  * Churn Risk Breakdown by Customer Tier (Enterprise, Growth, Pro, Starter)
* **Real-Time Decision Playbooks:** Generates engineering root causes, code fixes, customer retention countermeasures, and targeted SLA timelines.

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
│   - Multi-format parser & Schema Validator             │
│   - In-memory storage & Analytics Aggregation Engine   │
└──────────────┬───────────────────────────┬─────────────┘
               │                           │
               ▼                           ▼
┌──────────────────────────────┐ ┌──────────────────────────────┐
│     Adaption Labs Cloud      │ │    Real-Time AI Inference    │
│  https://api.prod.adaption   │ │                              │
│           labs.ai            │ │  - Groq Llama-3.3-70B        │
│                              │ │  - Mistral AI Engine         │
│  1. Initiate S3 pre-signed   │ │  - Sub-second SLA Playbook   │
│  2. Direct binary S3 upload  │ │    synthesis                 │
│  3. DPO Preference Pairs     │ └──────────────────────────────┘
│  4. AutoScientist LoRA run   │
│     (73.02% Win Rate)        │
└──────────────┬───────────────┘
               │
               ▼
┌────────────────────────────────────────────────────────┐
│             Vite + React 19 Frontend Client            │
│   - Executive Cockpit & Real-time Metrics              │
│   - Adaption Studio (Diff Inspector & Model Status)    │
│   - Strategic Solutions & SLA Action Matrix            │
└────────────────────────────────────────────────────────┘
```

---

## 🚀 Quickstart & Setup Guide

### Prerequisites
- **Node.js** v18.0 or higher
- **npm** or **pnpm**
- (Optional for Colab) Free Google account

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/anshuvdebnath-cyber/BUILD-BATTLE-HACKATHON.git
cd "BUILD BATTLE HACKATHON"
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your `.env` contains:
```env
PORT=3001
ADAPTION_API_KEY=your_adaption_api_key_here
ADAPTION_API_BASE=https://api.prod.adaptionlabs.ai/api/v1
ADAPTION_MODEL_ID=adaption_mistral_7b_instruct_cx_feedback_preferences_13088bd2
GROQ_API_KEY=your_groq_api_key_here
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

## 🤖 Running the Fine-Tuned Mistral-7B Model

Your AutoScientist run trained an alignment adapter on **Mistral-7B-Instruct-v0.2**. We provide two ways to run inference:

### Method 1: Google Colab (Free 16GB T4 GPU)
A turnkey script is provided in [`scripts/test_mistral_colab.py`](./scripts/test_mistral_colab.py).

1. Open [Google Colab](https://colab.research.google.com) and enable **T4 GPU** (*Runtime $\to$ Change runtime type $\to$ T4 GPU*).
2. Install packages:
   ```bash
   !pip install -q transformers peft bitsandbytes accelerate huggingface_hub
   ```
3. Download and unpack your 441 MB adapter archive:
   ```python
   import os, urllib.request

   API_KEY = "YOUR_ADAPTION_KEY"
   RUN_ID = "792bafcc-e22b-4fdc-b91f-7b21352d1cce"
   url = f"https://api.prod.adaptionlabs.ai/api/v1/autoscientist/{RUN_ID}/download"

   req = urllib.request.Request(url, headers={"Authorization": f"Bearer {API_KEY}"})
   with urllib.request.urlopen(req) as res, open("adapter.tar.gz", "wb") as f:
       f.write(res.read())

   os.makedirs("./mistral_adapter", exist_ok=True)
   os.system("zstd -d -f adapter.tar.gz -o adapter.tar")
   os.system("tar -xvf adapter.tar -C ./mistral_adapter")
   ```
4. Load base model + LoRA adapter in 4-bit precision:
   ```python
   import torch
   from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
   from peft import PeftModel

   base_id = "mistralai/Mistral-7B-Instruct-v0.2"
   bnb = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_compute_dtype=torch.float16)

   tokenizer = AutoTokenizer.from_pretrained(base_id)
   base_model = AutoModelForCausalLM.from_pretrained(base_id, quantization_config=bnb, device_map="auto")
   model = PeftModel.from_pretrained(base_model, "./mistral_adapter")
   ```
5. Run inference:
   ```python
   prompt = "<s>[INST] Customer issue: 'Double charged on checkout and order confirmation failed.' Categorize and provide technical SLA. [/INST]"
   inputs = tokenizer(prompt, return_tensors="pt").to("cuda")
   outputs = model.generate(**inputs, max_new_tokens=200, temperature=0.2)
   print(tokenizer.decode(outputs[0], skip_special_tokens=True))
   ```

### Method 2: Standalone Python SDK Pipeline
To run the end-to-end dataset adaptation and AutoScientist training from a command line or CI/CD runner:
```bash
pip install adaption python-dotenv
python scripts/adaption_pipeline.py
```

---

## 📡 API Endpoints Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/health` | `GET` | Service status, total records, and Adaption API key connectivity. |
| `/api/feedback` | `GET` | Retrieves all ingested customer feedback entries. |
| `/api/feedback/upload` | `POST` | Uploads CSV, validates schema, and streams to Adaption Labs. |
| `/api/adaption/model/info` | `GET` | Returns live AutoScientist Mistral 7B run status, win rate, and LoRA params. |
| `/api/adaption/datasets` | `GET` | Lists all datasets stored in Adaption Labs cloud account. |
| `/api/adaption/datasets/:id/download` | `GET` | Streams raw CSV dataset from Adaption Labs. |
| `/api/adaption/datasets/load-cloud` | `POST` | Ingests live cloud dataset entries into active dashboard storage. |
| `/api/adaption/solutions/generate` | `POST` | Synthesizes architectural root causes & engineering playbooks. |
| `/api/analytics` | `GET` | Real-time sentiment split, volume by day, and category breakdown. |

---

## 🏆 Hackathon Evaluation Criteria Compliance

| Requirement | Implementation in InsightFlow | Verification |
| :--- | :--- | :---: |
| **1. Feedback Management** | Smart CSV drag-and-drop, multi-attribute filter engine, 1-click cloud sync, manual escalation entry. | ✅ Complete |
| **2. AI-Powered Analysis** | Adaption 8-step pipeline, real DPO preference pairs, automated root cause synthesis. | ✅ Complete |
| **3. Analytics Dashboard** | Real-time KPI tiles, sentiment donut, time-series volume velocity, ARR impact exposure. | ✅ Complete |
| **4. Prioritized Decisions** | Mathematical priority formula ($$\text{Severity} \times \text{Frequency} \times \text{ARR}$$), SLA targets. | ✅ Complete |
| **5. Production Adaption API** | Native S3 pre-signed ingestion, real cloud dataset query, live AutoScientist run (`73.02%` win rate). | ✅ Complete |
| **6. Technical Polish** | Zero console/build errors, dark glassmorphism, responsive UI, full TypeScript type safety. | ✅ Complete |

---

## 📄 License & Credits

* Developed for **Frontend Arena — Build Battle 2026 Hackathon**.
* Adaptive Data Pipeline & AutoScientist powered by **[Adaption Labs](https://adaptionlabs.ai/)**.
* Base foundation models courtesy of **[Mistral AI](https://mistral.ai/)**.
