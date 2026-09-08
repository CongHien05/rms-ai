# RMS-AI Repository Instructions

## Project

RMS-AI — AI-powered Project Risk Prediction and Resource Optimization System.

The system is an AI decision-support product for software project resource management.

Core long-term product flow:

Project Risk Prediction
-> Resource Recommendation
-> What-if Simulation
-> PM Accept / Reject

## Current Course Phase

We are currently in project initialization and product requirements.

IMPORTANT:
Do NOT implement product features yet.
Do NOT implement AI/ML models yet.
Do NOT design the full database yet.
Do NOT implement authentication, CRUD modules, dashboards, resource matching,
risk prediction, optimization, or simulation yet.

## Current Technical Direction

Frontend:
- React
- TypeScript

Backend:
- NestJS
- TypeScript

AI service:
- Python
- FastAPI

Database planned for later:
- MySQL

## Repository Target Structure

/
├── frontend/
├── backend/
├── ai-service/
├── docs/
│   ├── PRD.md
│   └── ai-usage/
├── README.md
├── .gitignore
└── .env.example

## Working Rules

1. Work only inside this repository.
2. Inspect the existing repository before making changes.
3. Never assume files or architecture that do not exist.
4. Do not add unnecessary frameworks, infrastructure, databases,
   Docker, CI/CD, or dependencies.
5. Keep changes minimal and appropriate for the current course phase.
6. Do not implement future requirements early.
7. Before modifying files, explain the planned changes.
8. After modifying files, run relevant validation/build commands.
9. Never run git commit, git push, git reset, git rebase,
   or destructive git commands unless explicitly requested.
10. Do not modify unrelated files.

## Current Definition of Done

The base project is complete only when:

- frontend can start successfully
- backend can start successfully
- ai-service can start successfully
- backend has a simple GET /health endpoint
- ai-service has a simple GET /health endpoint
- README explains how to run each service
- no RMS-AI business feature has been implemented