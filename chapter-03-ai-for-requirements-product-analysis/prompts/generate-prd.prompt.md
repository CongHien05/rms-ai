# Prompt: Generate RMS-AI PRD v0.1

This prompt summarizes the PRD creation request used in the Codex workflow so the requirement-analysis process can be reproduced. It is not a separate historical transcript.

## Objective

Create an initial PRD v0.1 for RMS-AI, an AI-powered Project Risk Prediction and Resource Optimization System. Treat the PRD as an early draft and source of truth for product-side scope.

## Prompt

Write a concise, professional PRD v0.1 for RMS-AI.

The product purpose is to support software project resource management by helping teams detect delivery risks earlier, identify skill and resource gaps, recommend suitable employees, reduce bench time, reduce overload, and simulate allocation changes before a project manager applies them.

Use this MVP decision flow:

```text
Project Risk Prediction
→ Resource Recommendation
→ What-if Simulation
→ PM Accept / Reject
```

Include only these sections:

- Document Information
- Product Overview
- Problem Statement
- Product Goals
- Target Users
- Product Scope
- MVP Scope
- Out of Scope
- Open Questions / TBD

Clearly distinguish confirmed scope from future ideas. Do not claim planned functionality already exists. Keep the MVP focused on AI-assisted decision support, with the project manager as the final decision-maker. What-if Simulation must be non-destructive and must not change real allocation data unless a project manager accepts a change.

Do not specify detailed database schema, ERD, exact APIs, NestJS module architecture, detailed UI screens, wireframes, final ML models, optimization formulas, deployment architecture, Docker, CI/CD, cloud provider, or detailed RBAC.
