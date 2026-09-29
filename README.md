# 🌾 GramUdyog AI (ग्राम उद्योग AI)
### Hyper-Local AI Business Advisory & Smart Scheme Feasibility Engine for Rural & Semi-Urban India

> **Empowering grassroots entrepreneurs by turning 10% Margin Capital into institutional-grade, data-driven, bank-funded micro-enterprises with 90% loan auto-routing.**

---

## 📌 Problem & Context
First-time rural and semi-urban entrepreneurs face severe business failure and stagnation due to:
1. **Anecdotal Decision Making:** Selecting business activities based on hearsay rather than localized data (catchment demographics, competitor density, raw material proximity, purchasing power).
2. **Financial Illiteracy & Scheme Mismatch:** Confusion regarding margin money (equity), loan eligibility ceilings, interest rates, tenure, and moratorium grace periods.
3. **Lack of Institutional Consulting:** Inability to afford high-grade feasibility studies or produce Bank-Ready Detailed Project Reports (DPRs) required by branch managers.

---

## 💡 Solution Architecture

**GramUdyog AI** democratizes institutional-grade business consulting through two intelligent, interconnected modules:

### 🌟 Module 1: Hyper-Local Business Feasibility Report
1. **Market Reach Catchment (5–10 km Radius):** Dynamic consumer population estimation, household density, target demographic split (farmers, haat traders, local institutions), and distribution channel optimization.
2. **Opportunity Analysis & Unserved Niches:** High-margin processing gaps, unadulterated value addition, B2B linkages (Anganwadis, midday meals, local dhabas, dairy cooperatives).
3. **General Business Analysis (SWOT Matrix):** Four-quadrant matrix evaluating internal strengths, weaknesses, external opportunities, and threats customized to the micro-enterprise budget.
4. **Localized Threat & Mitigation Playbook:** Deep mitigation strategies for seasonality, single-buyer lock-ins, grid power disruptions, and informal credit (*khata/udhaar*) cash-flow traps.
5. **Competitor Mapping & Saturation Meter:** Block-level competitor density per 10,000 population, market maturity classification, and competitive moats.
6. **Product Market Value & Pricing Strategy:** Cost-of-production breakdowns, mandi wholesale benchmarks, suggested retail pricing, and gross margin calculations matched to regional purchasing power.

---

### 💰 Module 2: Smart Financial Calculator & Scheme Router

#### 1. Financial Structuring & 10:90 Leverage
- **Beneficiary Equity (Margin Capital):** Fixed at **10%** of Project Cost.
- **Total Feasible Project Cost:** $\text{Available Margin} \div 0.10$ ($\text{Margin} \times 10$).
- **Maximum Eligible Loan:** **90%** of Project Cost (subject to scheme caps).
- *Example:* ₹1,00,000 margin capital establishes a ₹10,00,000 project cost and unlocks a ₹9,00,000 loan.

#### 2. Scheme Auto-Selection Engine
```
                                [ User Available Margin ]
                                            │
                                            ▼
                          [ Project Cost = Margin / 0.10 ]
                                            │
                     ┌──────────────────────┴──────────────────────┐
                     ▼                                             ▼
          Project Cost ≤ ₹1.40 Lakh                    Project Cost > ₹1.40 Lakh
                     │                                 and ≤ ₹50.00 Lakh
                     ▼                                             │
      ┌─────────────────────────────┐                              ▼
      │    Micro Finance Scheme     │               ┌─────────────────────────────┐
      ├─────────────────────────────┤               │      Term Loan Scheme       │
      │ • Max Cost: ₹1.40 Lakh      │               ├─────────────────────────────┤
      │ • Max Loan: ₹1.25 Lakh (90%)│               │ • Range: ₹1.40L - ₹50.00L   │
      │ • Rate: 6.5% p.a.           │               │ • Max Loan: ₹45.00 Lakh(90%)│
      │ • Tenure: 3 Years (12 Qtrs) │               │ • Rate: 8.0% p.a.           │
      │ • Moratorium: 3 Months (1 Q)│               │ • Tenure: 7 Years (28 Qtrs) │
      └─────────────────────────────┘               │ • Moratorium: 6 Months (2 Q)│
                                                    └─────────────────────────────┘
```

#### 3. EMI & Moratorium Amortization Generator
- **Quarterly & Monthly Amortization:** Calculates debt service with full moratorium principal deferment.
- **CapEx vs Working Capital Split:** Automatically items core machinery, shed preparation, raw material inventory buffer, and reserve funds.
- **Cash Flow Projections & DSCR:** Forecasts monthly turnover, operating expenses, take-home net profit, break-even months, and Debt Service Coverage Ratio (DSCR > 1.5x standard).

---

## 🇮🇳 Multilingual & Grassroots Features
- **8 Indian Languages:** English, हिन्दी (Hindi), मराठी (Marathi), বাংলা (Bengali), தமிழ் (Tamil), తెలుగు (Telugu), ಕನ್ನಡ (Kannada), ગુજરાતી (Gujarati).
- **Interactive AI Coach Sathi:** Real-time chat & Voice AI assistant for licensing guidance (Udyam, FSSAI, GST), government subsidies (PMEGP, PMFME, Mudra), and machinery sourcing.
- **Voice Synthesis (Text-to-Speech & Speech-to-Text):** Read aloud feasibility summaries and accept voice inputs in native Indian languages.
- **1-Click Bank-Ready DPR (Detailed Project Report):** Export / Print bank appraisal dossiers with means of finance, repayment tables, and applicant declarations.

---

## 🛠️ Technology Stack
- **Frontend Framework:** React 19 + TypeScript + Vite 8
- **Styling & UI:** Tailwind CSS v4 + Lucide Icons
- **AI Intelligence:** Dual-Engine (Gemini 2.5 GenAI API + Offline Econometric Expert Rule Heuristics)
- **Financial Computation:** Deterministic Amortization & DSCR Models

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Local Run
```bash
# 1. Navigate to project directory
cd gram-udyog-ai

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

---

## 📦 Pushing to a New GitHub Repository

To publish this project to your GitHub account:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Add all project files
git add .

# 3. Commit
git commit -m "feat: Initial commit for GramUdyog AI platform"

# 4. Set main branch
git branch -M main

# 5. Create a new repo on GitHub (e.g., https://github.com/<your-username>/gram-udyog-ai)
# 6. Link remote repository
git remote add origin https://github.com/<your-username>/gram-udyog-ai.git

# 7. Push code to GitHub
git push -u origin main
```

---

## 📜 License
Distributed under the MIT License.
