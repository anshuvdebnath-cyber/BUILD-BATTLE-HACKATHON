# InsightFlow x Adaption Labs — Master AI Context & Integration Specification

> **How to use this file:**  
> Copy and paste this entire document directly into the **Adaption Lab Chat** (or Adaption Studio prompt assistant). It gives Adaption full context on our architecture, data schema, goals, and tells it exactly how to guide us in training and integrating models for the **Build Battle Hackathon 2026**.

---

## 1. Project Overview & Objective

### 1.1 What We Are Building
**InsightFlow** is an intelligent **Customer Decision Platform** built for the **Frontend Arena Build Battle 2026**.  
Instead of simple sentiment charts, InsightFlow solves the real enterprise pain point: **turning noisy, chaotic customer feedback into high-confidence, ROI-ranked engineering and product decisions.**

### 1.2 The Problem We Solve
- **Data Pollution**: Real customer feedback contains massive noise, 40%+ duplicates, typos, inconsistent schema, and vague rants.
- **Decision Paralysis**: Product teams receive thousands of tickets but cannot calculate the business ARR risk or prioritize what engineering sprint should fix next.
- **The Adaption Advantage**: We use **Adaption AI (adaptionlabs.ai)** as our core data adaptation and intelligence engine to:
  1. **Sanitize & Deduplicate**: Clean feedback text using Adaption's Adaptive Data recipes.
  2. **Domain Adapt / Train Models**: Fine-tune models to accurately classify sentiment, identify root cause categories, flag urgent anomalies (e.g., checkout phishing / seller fraud), and estimate ARR impact.
  3. **Executive Action Generation**: Produce structured decision playbooks for Product Managers, Engineers, and Executives.

---

## 2. System Architecture & Tech Stack

- **Repository**: [https://github.com/anshuvdebnath-cyber/BUILD-BATTLE-HACKATHON](https://github.com/anshuvdebnath-cyber/BUILD-BATTLE-HACKATHON)
- **Frontend**: React 19, TypeScript, Vite, TailwindCSS 4.
  - **Design System**: Liquid glassmorphism modeled directly after `https://adaptionlabs.ai/` (subtle blur, floating glass capsules, editorial typography, custom connected-node geometric logo).
- **Backend**: Modular Node.js / Express 5 API running on port `3001`:
  - `server/index.js`: Main server entry point.
  - `server/routes/adaption.routes.js`: Adaption pipeline & training routes.
  - `server/controllers/adaption.controller.js`: Orchestrates data cleaning, training jobs, and metrics.
  - `server/services/adaption.service.js`: Integration service communicating with Adaption Labs API.
- **Frontend Views**:
  - `OverviewView.tsx`: Executive command center with anomaly alerts & ROI impact.
  - `FeedbackView.tsx`: CSV feedback ingestion table & schema validator.
  - `AdaptionStudioView.tsx`: Interactive control room to trigger Adaption recipes & model training.
  - `AnalyticsView.tsx`: Velocity, sentiment trends, and category distribution charts.
  - `RecommendationsView.tsx`: ROI-ranked executive decision playbooks.
  - `TrackerView.tsx`: Engineering sprint kanban board for resolving issues.
  - `ExecutiveReportView.tsx`: One-click C-suite printable brief.

---

## 3. Dataset & Data Schema

We are feeding Adaption a production dataset of **1,250 customer feedback records** from multi-vendor marketplaces and B2B SaaS.

### 3.1 CSV Column Schema
| Column Name | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `feedback_id` | String | Unique record identifier | `FB-1042` |
| `customer_id` | String | Identifier of the customer/merchant | `CUST-8912` |
| `text` | String | Raw, unnormalized feedback or complaint | `"checkout keeps failing with 504 gateway timeout on stripe payment"` |
| `source` | Enum | Channel source | `email`, `zendesk`, `app_store`, `twitter`, `discord` |
| `sentiment` | Enum | Target sentiment | `negative`, `neutral`, `positive` |
| `category` | Enum | Product category | `Checkout & Billing`, `Authentication`, `Seller Fraud`, `Mobile App`, `API & Webhooks` |
| `urgency` | Enum | Urgency rating | `critical`, `high`, `medium`, `low` |
| `arr_impact` | Number | Estimated annual revenue at risk (USD) | `45000` |
| `timestamp` | ISO String | Event date & time | `2026-03-24T14:22:00Z` |

### 3.2 Critical Real-World Anomaly in Dataset
- **The Phishing & Fake Merchant Surge**: A cluster of 84 complaints over the last 48 hours indicates fraudulent sellers infiltrating checkout.
- **Complaint Velocity**: +48.5% growth.
- **Estimated ARR at Risk**: **$265,000**.
- **Model Task**: Adaption must automatically detect this cluster, deduplicate repeated complaints, and trigger an automated security playbook.

---

## 4. Adaption AI Pipeline Workflow

We need Adaption Labs to execute a 4-stage pipeline:

```
[ Raw CSV: 1,250 Rows ]
         │
         ▼
[ Stage 1: Adaptive Data Preparation ]
  ├── Deduplication Recipe (cluster near-identical rants)
  ├── Text Normalization (strip noise, fix casing & typos)
  └── Outlier & Quarantine Filter (flag malformed entries)
         │
         ▼
[ Stage 2: Domain Adaptation / Model Training ]
  ├── Base Model Selection (Adaption Fast vs. Reasoning)
  ├── Fine-tuning on Market Feedback Classification
  └── Anomaly & Root-Cause Detection Calibration
         │
         ▼
[ Stage 3: Quality Scoring & Benchmarking ]
  ├── Baseline Score (Raw data): 46.0 / 100 (Grade F)
  └── Adapted Score (Sanitized data): 95.0 / 100 (Grade A+)
  └── Quality Lift: +106.5% improvement in categorization precision
         │
         ▼
[ Stage 4: Executive Decision Generation ]
  ├── ROI & ARR Risk Calculation
  ├── Engineering Actionable Recommendations (Fix Stripe 504, Implement Captcha)
  └── Sprint Ticket Export
```

---

## 5. Existing Backend API Endpoints in Our App

Our Express backend already implements the following endpoints in `server/routes/adaption.routes.js`:

1. `GET /api/adaption/recipes`
   - Returns available Adaptive Data recipes (`deduplication`, `semantic_clustering`, `sentiment_alignment`, `noise_filter`, `pii_redaction`).
2. `POST /api/adaption/run-pipeline`
   - Accepts dataset ID and selected recipes, executes cleaning pipeline, and returns sanitized rows + quality lift metrics.
3. `GET /api/adaption/models`
   - Lists available base and fine-tuned models in Adaption Studio.
4. `POST /api/adaption/train`
   - Triggers fine-tuning or adaptation job on the sanitized dataset.
5. `GET /api/adaption/status/:jobId`
   - Polls status of active training job (`queued` $\to$ `processing` $\to$ `completed`).
6. `POST /api/adaption/inference`
   - Passes new unstructured feedback text to the trained model to predict category, sentiment, urgency, and ARR risk.

---

## 6. What We Need from You (Adaption Lab Chat)

Please act as the Lead AI Systems Engineer at Adaption Labs and guide us on the following:

1. **Recommended Adaption Recipe Configuration**:
   - Provide the exact JSON recipe config for Adaption's data engine to clean our 1,250 rows (thresholds for deduplication, embedding similarity, text normalization rules).
2. **Model Training & Fine-Tuning Setup**:
   - Which base model on Adaption should we use for customer feedback reasoning?
   - What hyperparameters (epochs, learning rate, batch size) give the highest classification accuracy?
3. **API Integration Code**:
   - Provide the exact cURL / Python / Node.js requests to call the official Adaption Labs API to:
     - Upload our dataset.
     - Launch the recipe run.
     - Train the adapted model.
     - Query live inference predictions.
4. **Prompt Template for Executive Decision Synthesis**:
   - Give us the optimal system prompt for the fine-tuned model to synthesize raw clusters into concrete engineering tickets (Title, Root Cause, ARR Impact, Confidence Score, Mitigation Steps).
