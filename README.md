# RMS-AI

**RMS-AI — AI-powered Project Risk Prediction and Resource Optimization System**

RMS-AI is an AI-assisted decision-support system for software project resource management. The repository now contains the base services, the Chapter 3 requirement baseline, and Chapter 4 low-fidelity product-design work.

## Current Scope

The current product-design scope covers the PM decision flow from Project Risk through Resource Recommendation, What-if Simulation, and Accept/Reject. Existing UI is a scoped prototype used to review that flow; it is not a production implementation and does not provide real AI prediction, matching, simulation, persistence, or allocation changes.

Do not extend the repository into a full HR or project-management platform, or add AI/ML models, production database design, authentication, infrastructure, or business rules that the requirement baseline has not confirmed.

## Project Structure

```text
/
├── frontend/      # React + TypeScript + Vite
├── backend/       # NestJS + TypeScript API
├── ai-service/    # FastAPI service
├── chapter-01-ai-in-software-engineering/
├── chapter-03-ai-for-requirements-product-analysis/
├── chapter-04-ai-for-product-design/
├── AGENTS.md
├── README.md
└── .gitignore
```

## Course Artifacts

```text
chapter-01-ai-in-software-engineering/
→ Project clarification and project brief

chapter-03-ai-for-requirements-product-analysis/
→ PRD and requirement-analysis artifacts

chapter-04-ai-for-product-design/
→ User flows, low-fidelity UI design, design prompts, and review artifacts
```

No environment variables are required for the base applications.

## Frontend

The React frontend includes a low-fidelity prototype for Project Risk,
Resource Recommendation, What-if Simulation, and local PM decision states.
These screens use illustrative presentation data and do not call production
AI or allocation services.

```powershell
cd frontend
npm install
npm run dev
```

Build validation:

```powershell
npm run build
```

## Backend

```powershell
cd backend
npm install
npm run start:dev
```

Health check:

```text
GET http://localhost:3000/health
{ "status": "ok" }
```

Validation:

```powershell
npm run build
npm test
```

## AI Service

```powershell
cd ai-service
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\python -m uvicorn main:app --reload --port 8000
```

Health check:

```text
GET http://localhost:8000/health
{ "status": "ok" }
```

Validation:

```powershell
.\.venv\Scripts\python -m py_compile main.py
```
