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

The repository has completed its initial setup and Chapter 3 requirement
baseline. Current course work includes Chapter 4 product design: user flows,
low-fidelity UI artifacts, AI-assisted design review, and scoped prototypes.

Existing Project Risk, Resource Recommendation, and What-if UI work is a
design/prototype baseline. Do not describe it as production behavior or use it
to create business rules that are absent from the PRD, User Stories, or
Acceptance Criteria.

IMPORTANT:
Do NOT implement AI/ML models, a full database, authentication, full CRUD
modules, production resource matching, risk prediction, optimization, or a
simulation engine unless a later task explicitly authorizes that scope.

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

## Repository Structure

/
├── frontend/
├── backend/
├── ai-service/
├── chapter-01-ai-in-software-engineering/
├── chapter-03-ai-for-requirements-product-analysis/
├── chapter-04-ai-for-product-design/
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
11. Trace important UI steps to the current PRD, User Stories, or Acceptance
    Criteria, or label them as PROPOSED UI.
12. Keep unresolved business rules as TBD. A prototype choice does not confirm
    a product requirement.

## Current Chapter 4 Definition of Done

Chapter 4 work is complete only when the relevant flow and low-fidelity UI are
reviewable, important states are considered, requirement traceability is
present, and CONFIRMED / PROPOSED UI / TBD content is clearly distinguished.
Chapter 4 artifacts must not introduce API, database, or ML implementation
decisions without explicit authorization.
