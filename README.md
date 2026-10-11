# 🌊 InsightFlow — Intelligent Customer Feedback & Decision Platform
> **Frontend Arena — Build Battle 2026 | AI × Web Development Hackathon (48-Hour Individual Track)**  
> **Core AI Integration: Adaption Labs' Adaptive Data Pipeline**

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Adaption](https://img.shields.io/badge/Engine-Adaption_Labs-cyan)](https://docs.adaptionlabs.ai/)

---

## 🌟 Executive Summary

Businesses receive thousands of noisy customer feedback items across fragmented channels: support tickets, app store reviews, user surveys, and sales call notes. 

Standard dashboards merely count keyword frequencies. **InsightFlow** transforms messy, repetitive feedback into verifiable executive action by integrating **Adaption Labs' Adaptive Data Pipeline**. It prunes duplicates via **Prompt Deduplication**, traces root causes through **Reasoning Traces**, enforces brand governance via **Blueprint Constraints**, and quantifies an objective **Priority Index** ($$\text{Severity} \times \text{Frequency} \times \text{ARR At Risk}$$).

---

## 🚀 Key Standout Features

### 1. Ingestion & Feedback Management
* **Smart CSV Drag-and-Drop Ingestion:** Auto-discovers columns (`feedback_text`, `customer`, `rating`, `category`, `tier`) with zero schema friction.
* **Pre-Loaded Enterprise Datasets:** Instant one-click demonstration across 3 industry verticals:
  * **CloudScale SaaS:** SAML SSO token deprecation, burst webhook drops, mid-cycle seat proration bugs.
  * **FinPay Global:** 3D-Secure weekend OTP timeouts, 4K passport KYC upload rejection, FX settlement latency.
  * **ShopPulse E-Commerce:** Black Friday promo discount wipe on Apple Pay toggle, parcel tracking lag.
* **Multi-Attribute Filter Engine:** Filter in real-time by Sentiment (Positive, Negative, Neutral, Mixed), Category, and Customer Tier.
* **Manual Feedback Submission:** Quick-entry modal for ad-hoc customer escalations.

### 2. Adaption Studio & Quality Lift Engine *(The Core AI Workflow)*
* **Official 8-Step Adaptive Data Pipeline:**
  * **Step 2 (Role Mapping):** Maps source columns into standard roles: `[Prompt]` (customer friction), `[Context]` (account tier, SLA, IdP), and `[Completion]` (remediation plan).
  * **Step 3 (Baseline Quality Grading):** Computes pre-adaptation metrics (Letter Grade: `C`, Score: `5.2/10`, `41st` percentile).
  * **Step 4 (Recipe Execution):**
    * **Prompt Deduplication:** Combines 50 duplicate reports into single high-signal clusters.
    * **Reasoning Traces:** Synthesizes architectural root cause diagnostics.
    * **Hallucination Mitigation:** Ensures proposed actions are strictly grounded in log data.
    * **Brand Voice Steering:** Harmonizes output into professional enterprise tone.
  * **Step 5 (Blueprint Configuration):** Configures length bounds (Detailed vs. Concise), safety classifications, and grounding thresholds (98%).
  * **Step 7 (Before vs. After Diff View):** Side-by-side inspection showing raw noisy text versus structured SFT instruction pairs with **+80.8% verified Quality Lift**.
  * **Step 8 (Global Expansion):** Simulates multi-region feedback expansion into 242+ supported languages (Spanish, German, Japanese, etc.).

### 3. Analytics & Trend Observatory
* **Time-Series Velocity Charts:** Tracks feedback volume and Net Sentiment Score (NSS) over time to pinpoint exact deployment regressions.
* **Category Frequency Clustering:** Visualizes dominant failure domains (Authentication, API, Latency, Billing).
* **Tier Revenue Exposure Breakdown:** Measures churn vulnerability separated by Enterprise, Pro, and Starter tiers.

### 4. Intelligent Prioritization & Root Cause Matrix
* **Deterministic Priority Score Formula:**
  $$\text{Priority Score} = (\text{Severity Weight} \times 0.4) + (\text{Account Churn ARR} \times 0.3) + (\text{Recurrence Frequency} \times 0.3)$$
* **Explainability Directives:** Clear diagnostic rationale explaining *why* leadership must resolve the issue immediately.
* **Direct Customer Citations:** Verifiable quotes from affected accounts linked directly to the recommendation.

### 5. Issue Tracking (Action Kanban) & Executive Reporting
* **Interactive Kanban Board:** One-click conversion of prioritized insights into tracked tickets (`Backlog` $\rightarrow$ `In Progress` $\rightarrow$ `Resolved`).
* **Financial Recovery Tracking:** Real-time counter of **Saved ARR** vs. **Pending ARR at Risk**.
* **Executive Briefing Generator:** Exportable one-page decision brief for C-suite presentations (Print / PDF / Markdown / JSON).

---

## 🛠️ Architecture & Technology Stack

```
[Raw Multi-Source Data]
        │
        ▼
[PapaParse Ingestion & Smart Auto-Discovery]
        │
        ▼
[Adaption Adaptive Data Engine]
   ├─ Step 2: Role Mapping (Prompt / Context / Completion)
   ├─ Step 3: Quality Scoring (Grade C ➔ Grade A)
   ├─ Step 4: Recipes (Deduplication, Reasoning Traces, Grounding)
   └─ Step 5: Blueprint Constraints & Policies
        │
        ▼
[React 19 + TypeScript + Vite Core Application]
   ├─ Overview Cockpit
   ├─ Feedback Hub
   ├─ Adaption Studio
   ├─ Analytics Observatory (Recharts)
   ├─ Decision Matrix
   ├─ Issue Kanban Board
   └─ Executive Briefing Exporter
```

---

## 💻 Local Setup & Running

```bash
# 1. Clone repository
git clone <repository-url>
cd "BUILD BATTLE HACKATHON"

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build production bundle
npm run build
```

---

## 🏆 Compliance with Hackathon Criteria

| Requirement | Implementation in InsightFlow | Status |
| :--- | :--- | :--- |
| **1. Feedback Management** | CSV drag-and-drop, manual modal, search & multi-filter, 3 enterprise presets | ✅ 100% Complete |
| **2. AI-Powered Analysis** | Sentiment, topic clustering, Adaption 8-step pipeline, quality score lift | ✅ 100% Complete |
| **3. Analytics Dashboard** | Real-time KPI tiles, sentiment donut, time-series area charts, frequency bars | ✅ 100% Complete |
| **4. Intelligent Recommendations** | Prioritization formula ($$\text{Severity} \times \text{Frequency} \times \text{ARR}$$), root-cause explainability | ✅ 100% Complete |
| **5. Reports & Issue Tracking** | 3-column Kanban board, saved ARR counters, Print/PDF/Markdown export | ✅ 100% Complete |
| **Technical Polish** | Dark glassmorphism, responsive layout, zero build errors, verified HTTP 200 | ✅ 100% Complete |

---
*Developed for Frontend Arena — Build Battle 2026*
