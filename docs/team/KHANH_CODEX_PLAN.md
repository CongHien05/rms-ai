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


# Member: KHÁNH

## 7. Khánh — Project Contribution Plan

Khánh does **not** have a permanent backend/data/AI role.

This plan gives Khánh concrete ownership while ensuring balanced contributions across documentation, application code, AI work, testing, and review.

### Milestone 1 — Primary ownership

Khánh owns `docs/PRD.md` sections:

- User Needs
- Initial User Stories
- Acceptance Criteria
- Business Rules
- Non-functional Requirements
- Assumptions & Risks
- Success Metrics

Khánh also reviews:

- base-project local setup instructions
- whether all three services can be reproduced on another machine

Hiền reviews the PRD sections.

Suggested commits:

```text
docs: add RMS-AI user stories and acceptance criteria
docs: define RMS-AI quality requirements and risks
```

### Milestone 2 — Primary ownership

Khánh owns:

- employee/resource-related user flows
- allocation and bench flow
- alternative/edge-case flows:
  - no suitable candidate
  - candidate lacks required skill
  - insufficient availability
  - PM rejects recommendation
- review Hiền's wireframes for missing operational cases

### Milestone 3 — Primary ownership

Khánh owns:

- ERD/database design
- entities and relationships
- allocation constraints
- skill requirement model
- prediction/recommendation history storage proposal
- security/RBAC data considerations

Khánh reviews Hiền's API contracts against the data model.

Suggested commits:

```text
docs: add RMS-AI database design
docs: define resource allocation constraints
```

### Milestone 4 — Primary implementation ownership

Khánh owns one complete vertical slice:

**Employee / Skill / Allocation foundation**

Expected work may include:

- Employee
- Skill / EmployeeSkill
- Project allocation
- availability/utilization
- bench detection
- validation
- backend endpoints
- minimal frontend integration
- tests

Do not implement broad HR functionality unrelated to RMS-AI.

Hiền reviews business/API consistency.

### Milestone 5 — Primary AI ownership

Khánh owns:

**Resource Matching + Optimization groundwork**

Expected work:

- matching feature definition
- candidate filtering
- weighted-scoring baseline
- availability constraints
- skill-level constraints
- bench preference when business-valid
- recommendation explanation
- optimization formulation when the project reaches that scope
- evaluation cases for recommendation quality

Initial matching should be explainable and measurable before introducing more complex ML.

Example baseline dimensions:

```text
skill fit
availability
experience
performance
domain experience
```

Weights must be documented and revisable.

### Milestone 6 — Primary integration ownership

Khánh owns:

- resource recommendation endpoint
- recommendation history where required
- what-if simulation engine
- allocation constraints
- PM Accept / Reject behavior
- ensure simulation never mutates real allocation
- only accepted decisions may apply allocation changes

Hiền integrates risk prediction and UI around this flow.

### Milestone 7 — Review responsibility

Khánh reviews:

- Hiền's risk feature engineering
- model evaluation
- risk explanation logic
- prediction API contract
- model assumptions and edge cases

Khánh also handles confirmed refactoring tasks within assigned scope.

### Milestone 8 — Testing ownership

Khánh owns:

- allocation constraint tests
- matching tests
- simulation tests
- negative/edge cases
- no-candidate scenario
- invalid allocation scenario
- AI service unavailable/fallback behavior where implemented
- data seed reproducibility checks

### Milestone 9 — Finalization ownership

Khánh owns:

- database/API technical documentation review
- resource matching explanation
- simulation before/after evidence
- test evidence
- known limitations and technical risks
- final environment/setup reproducibility test

Hiền reviews final presentation consistency.

## 8. Khánh — Immediate Next Task

Before starting:

1. Verify current Git branch/history.
2. Confirm base-project branch has been merged before starting PRD work.
3. Pull latest `main`.
4. Create/use the agreed PRD branch.
5. Do not implement source features yet.

Immediate PRD task:

```text
User Needs
User Stories
Acceptance Criteria
Business Rules
Non-functional Requirements
Assumptions & Risks
Success Metrics
```

Use the agreed MVP:

```text
Project Risk Prediction
→ Resource Recommendation
→ What-if Simulation
→ PM Accept / Reject
```

Do not expand the PRD into unrelated HR/project-management features.

## 9. Khánh — Review Checklist Before Every Commit

```text
[ ] Is this work inside the current milestone?
[ ] Is this actually my assigned ownership?
[ ] Did I pull/inspect latest main before branching?
[ ] Did I avoid editing Hiền's active files without coordination?
[ ] Did build/tests pass?
[ ] Did I verify Codex output rather than trust it automatically?
[ ] Are business constraints explicitly tested?
[ ] Is this a meaningful, reviewable commit?
```
