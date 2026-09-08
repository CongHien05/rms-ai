# RMS-AI — Member Work Plan

> This file is a **working plan for Codex**, not a permanent job title.
> The team has 2 members: **Hiền** and **Khánh**.
> Responsibilities rotate by milestone so both members contribute to requirements, design, coding, AI, testing, and documentation.

## 0. How Codex must use this file

Before doing any task:

1. Read `AGENTS.md`.
2. Read `README.md`.
3. Read `docs/PRD.md` if it exists.
4. Read this member plan.
5. Inspect the current repository, branch, `git status`, and existing implementation.
6. Do not assume a planned feature already exists.
7. Do not implement work from a future milestone unless explicitly requested.
8. Do not commit, push, reset, rebase, force-push, or perform destructive Git operations unless explicitly requested.
9. Keep changes limited to the assigned task.
10. After implementation, run relevant build/tests and report changed files, commands, validation results, and remaining issues.

## 1. Product Direction

**RMS-AI — AI-powered Project Risk Prediction and Resource Optimization System**

Core product flow:

```text
Project Risk Prediction
        ↓
Resource Recommendation
        ↓
What-if Simulation
        ↓
PM Accept / Reject
```

Planned stack:

- Frontend: React + TypeScript + Vite
- Backend: NestJS + TypeScript
- AI service: Python + FastAPI
- Database: MySQL (later phase)

Core product areas:

- Employee & Skill Management
- Project / Sprint / Task Management
- Resource Allocation & Bench Management
- Project Risk Prediction
- Resource Matching / Recommendation
- What-if Simulation
- Explainable AI
- AI Recommendation History

## 2. Team Working Agreement

The project uses **milestone ownership, not permanent roles**.

For each task:

- One member = **Primary Owner**
- Other member = **Reviewer**
- Reviewer must inspect the diff and raise issues before merge.
- Ownership should rotate regularly.
- Avoid both members editing the same file at the same time unless planned.
- Prefer small, meaningful commits.
- Each meaningful change should have a branch and PR when practical.
- Both members should contribute across docs, source code, tests, and AI work during the full project.

Recommended branch naming:

```text
docs/...
chore/...
feat/...
fix/...
test/...
refactor/...
```

Recommended commit style:

```text
docs: ...
chore: ...
feat: ...
fix: ...
test: ...
refactor: ...
```

Do not manufacture fake commits. Each commit must represent real work.

## 3. Current Known Checkpoint

Current known state from the latest team checkpoint:

- `AGENTS.md` exists.
- `README.md` exists.
- React + TypeScript + Vite frontend scaffold exists.
- NestJS backend scaffold exists.
- FastAPI AI service scaffold exists.
- Backend `GET /health` implemented.
- AI service `GET /health` implemented.
- Frontend build passed.
- Backend build passed.
- Backend unit/e2e tests passed.
- FastAPI compile/import and live health check passed.
- No database, authentication, business modules, or ML models have been implemented yet.
- PRD has not yet been created at the latest confirmed checkpoint.

IMPORTANT:
Before starting new work, verify Git history and branch state. Do not assume the base-code branch has already been merged unless Git confirms it.

## 4. Project Milestones

The team follows the course progression instead of implementing the whole system immediately.

### Milestone 1 — Project Initialization + PRD v0.1

Deliverables:

- Base codebase
- README
- PRD v0.1
- AI-assisted development evidence
- Initial user stories
- Initial acceptance criteria

Do NOT add:

- database implementation
- auth
- CRUD features
- ML models
- production infrastructure

### Milestone 2 — Product Design

Deliverables:

- Main user flows
- Use-case flows
- Wireframes / low-fidelity prototype
- Feature boundaries
- Design review notes

Primary product flow to visualize:

```text
High-risk project
→ AI explains risk
→ PM requests resource recommendation
→ system ranks candidates
→ PM runs what-if simulation
→ PM accepts/rejects
```

### Milestone 3 — Architecture + Data + API Design

Deliverables:

- System architecture
- Module boundaries
- ERD / database design
- Key entities
- API contracts
- AI service integration contract
- Security/RBAC design
- Architecture decision notes

No speculative complexity:
- no microservices beyond actual need
- no Redis unless justified
- no Kubernetes
- no unnecessary event bus

### Milestone 4 — Core Management MVP

Implement the minimum business data required by AI:

- Employee
- Skill / EmployeeSkill
- Project
- Project Requirement
- Sprint / Task as required by risk features
- Allocation
- Bench / utilization calculation

Acceptance focus:
Data must be usable by later AI features.

### Milestone 5 — AI/Data MVP

Implement:

- dataset preparation / synthetic data if real data is unavailable
- feature engineering
- baseline risk model
- resource matching score
- model evaluation
- prediction/recommendation persistence where required

Risk model should return at minimum:

```text
riskProbability
riskScore
riskLevel
topFactors
modelVersion
```

Matching should return at minimum:

```text
candidate
matchingScore
availability
skill fit
bench status
explanation
```

### Milestone 6 — Recommendation + What-if Integration

Implement end-to-end flow:

```text
Risk Prediction
→ Resource Recommendation
→ What-if Simulation
→ PM Decision
```

Critical rule:

- simulation must not mutate real allocation data
- only PM Accept may apply allocation changes

### Milestone 7 — Review + Refactor

Focus:

- code review
- duplication
- error handling
- validation
- architecture consistency
- security checks
- technical debt
- AI-generated code verification

### Milestone 8 — Testing

Required coverage:

- unit tests
- integration tests
- important e2e flow
- API negative cases
- invalid allocation cases
- no-candidate case
- AI service unavailable case
- demo regression test

### Milestone 9 — Technical Documentation + Demo

Deliverables:

- final README
- setup guide
- API documentation
- architecture diagrams
- AI model evaluation evidence
- before/after simulation evidence
- limitations
- responsible AI / risks
- final demo script
- presentation support material

## 5. Shared Definition of Done

A task is not DONE only because code exists.

A task is DONE when relevant criteria pass:

- implementation matches current PRD
- scope is respected
- build passes
- relevant tests pass
- API contract is consistent
- no unrelated files changed
- reviewer has enough information to review
- AI-generated output has been verified
- documentation is updated when behavior changes

## 6. Codex Task Template

Use this structure for each new Codex task:

```text
Read AGENTS.md, README.md, docs/PRD.md if present, and my member plan.

Current milestone:
<milestone>

My assigned task:
<one concrete task>

Before editing:
1. inspect current implementation
2. inspect git status and branch
3. identify exact files affected
4. propose a minimal plan
5. identify risks/assumptions

Constraints:
- do not work outside this task
- do not implement future milestone features
- do not commit or push
- preserve existing working behavior

After implementation:
- run relevant build/tests
- report changed files
- report commands
- report validation results
- report unresolved issues
- report final git status
```


# Member: HIỀN

## 7. Hiền — Project Contribution Plan

Hiền is the member who coordinates most frequently with ChatGPT, but this does **not** make Hiền a permanent PM/frontend/backend/AI role.

The purpose of this plan is to give Hiền concrete ownership while keeping contribution balanced across the full project.

### Milestone 1 — Primary ownership

Hiền owns:

- README product overview review
- `docs/PRD.md` sections:
  - Product Overview
  - Problem Statement
  - Product Goals
  - Target Users
  - Product Scope
  - MVP Scope
  - Out of Scope
- review current base-code structure
- ensure the PRD does not promise features outside the agreed MVP

Khánh reviews these sections.

Suggested commit:

```text
docs: define RMS-AI product overview and MVP scope
```

### Milestone 2 — Primary ownership

Hiền owns:

- main PM/product user flow
- risk prediction → recommendation → simulation → decision flow
- first wireframe/prototype draft for:
  - AI Risk Center
  - Resource Recommendation
  - What-if Simulation
- design rationale notes

Khánh reviews usability and missing business cases.

### Milestone 3 — Primary ownership

Hiền owns:

- high-level system architecture document
- frontend ↔ backend API boundary
- backend ↔ AI service integration boundary
- initial API contract for:
  - project risk
  - resource matching
  - simulation
- review Khánh's ERD/database proposal for consistency with PRD

Suggested commits:

```text
docs: add RMS-AI system architecture
docs: define AI integration API contracts
```

### Milestone 4 — Primary implementation ownership

Hiền owns one complete vertical slice:

**Project / Sprint / Task foundation**

Expected work may include:

- project domain
- minimum sprint/task data needed for risk prediction
- validation
- backend endpoints
- minimal frontend integration
- tests

Do not implement every project-management feature. Only implement data required by RMS-AI MVP.

Khánh reviews API/data consistency.

### Milestone 5 — Primary AI ownership

Hiền owns:

**Project Risk Prediction**

Expected work:

- define risk label/target
- define risk features
- prepare training/evaluation pipeline
- implement baseline model
- compare models when justified
- expose prediction through FastAPI
- return explainable factors
- document model metrics and limitations

Recommended baseline progression:

```text
Logistic Regression
→ compare with Random Forest / XGBoost
→ select using measured results
```

Do not select a model only because it sounds more advanced.

### Milestone 6 — Primary integration ownership

Hiền owns:

- Project Risk API integration
- Risk Center UI
- explanation display
- risk before/after integration with simulation result
- ensure persisted prediction includes model metadata when required

Khánh owns the recommendation/simulation engine and Hiền integrates with it.

### Milestone 7 — Review responsibility

Hiền reviews:

- Khánh's resource allocation logic
- matching/optimization assumptions
- simulation mutation safety
- API consistency

Hiền also refactors only issues confirmed by review.

### Milestone 8 — Testing ownership

Hiền owns:

- end-to-end demo test
- risk prediction API tests
- UI/API integration regression
- primary demo scenario

Required demo path:

```text
High Risk
→ explanation
→ candidate recommendation
→ simulation
→ risk before/after
→ PM decision
```

### Milestone 9 — Finalization ownership

Hiền owns:

- final README integration
- architecture explanation
- demo flow documentation
- model evaluation summary
- final demo rehearsal checklist

Khánh reviews final technical accuracy.

## 8. Hiền — Immediate Next Task

Before doing anything else:

1. Verify whether `chore/initialize-codebase` has been committed/pushed/merged.
2. Sync with `main`.
3. Do not start implementation features.
4. Start PRD only after base-project history is clean.

Immediate PRD task:

```text
Product Overview
Problem Statement
Product Goals
Target Users
Product Scope
MVP Scope
Out of Scope
```

Do not write detailed DB schemas, API implementation, ML algorithms, or architecture decisions in PRD v0.1 unless the team has explicitly decided them.

## 9. Hiền — Review Checklist Before Every Commit

```text
[ ] Does this belong to the current milestone?
[ ] Did I change only my assigned files?
[ ] Did I inspect current code instead of assuming?
[ ] Did build/tests pass?
[ ] Did Codex invent unnecessary architecture?
[ ] Did I verify AI-generated content?
[ ] Is the commit one meaningful unit of work?
[ ] Is Khánh able to review the diff clearly?
```
