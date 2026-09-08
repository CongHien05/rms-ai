# RMS-AI

**RMS-AI — AI-powered Project Risk Prediction and Resource Optimization System**

RMS-AI is an AI-assisted decision-support system for software project resource management. The current scope is Week 1 base-project initialization only.

## Current Scope

This repository contains startup-ready base services only. Do not add product features, AI/ML models, database configuration, authentication, CRUD modules, Docker, CI/CD, dashboards, resource matching, risk prediction, optimization, or simulation in this phase.

## Project Structure

```text
/
├── frontend/      # React + TypeScript + Vite
├── backend/       # NestJS + TypeScript API
├── ai-service/    # FastAPI service
├── AGENTS.md
├── README.md
└── .gitignore
```

No environment variables are required for the base applications.

## Frontend

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
