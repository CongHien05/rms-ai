# RMS-AI PRD v0.1

## Document Information

- Product name: RMS-AI — AI-powered Project Risk Prediction and Resource Optimization System
- Document version: v0.1
- Status: Draft
- Current course phase: Milestone 1 — Project Initialization + PRD v0.1

This document defines the initial product direction for RMS-AI. It is not a final specification and does not claim that planned functionality already exists.

## Product Overview

RMS-AI is an AI-assisted decision-support system for software project resource management. It helps project managers identify delivery risks, understand resource and skill gaps, review employee recommendations, and test allocation changes before making real decisions.

The agreed MVP decision flow is:

```text
Project Risk Prediction
-> Resource Recommendation
-> What-if Simulation
-> PM Accept / Reject
```

RMS-AI supports human decision-making. The system may suggest risks, candidates, and simulated outcomes, but the project manager remains the final decision-maker.

## Problem Statement

Software projects can become delayed because risk signals, skill gaps, workload imbalance, and bench capacity are often reviewed too late or across disconnected tools. Project managers may not have a clear view of which projects are at risk, which employees could help, or whether a proposed allocation change would improve the situation.

RMS-AI addresses this by organizing key project and resource signals into a focused AI-assisted workflow. The product should help teams make earlier, better-informed allocation decisions without turning into a full HR management or general project-management platform.

## Product Goals

- Detect project delivery risks earlier using available project and resource signals.
- Identify skill and resource gaps that may affect delivery.
- Recommend suitable employees based on relevant MVP data.
- Help reduce bench time by surfacing available employee capacity.
- Help reduce overload and inefficient allocation.
- Allow project managers to simulate allocation changes before applying them.
- Keep AI recommendations explainable enough for review and acceptance or rejection.

## Target Users

- Project Manager: primary user who reviews risk, requests recommendations, runs simulations, and accepts or rejects allocation changes.
- Resource Manager: reviews capacity, bench status, and allocation fit when needed.
- Team Lead or Delivery Lead: may provide context about project status, skills, or delivery risk.

## Product Scope

The confirmed product scope is a focused MVP for project risk and resource allocation decisions. RMS-AI should use only the management data required to support the core decision flow, such as project status, task or sprint progress, employee skills, availability, workload, and allocation context.

Basic management capabilities may be included only when they are necessary to provide data for risk prediction, recommendation, or simulation. Future ideas should remain separate from MVP commitments until the team confirms them.

## MVP Scope

The MVP includes:

- Project Risk Prediction: estimate whether a project may face delivery risk and show the main contributing factors at a high level.
- Resource Recommendation: suggest suitable employees who may reduce risk or fill a skill/resource gap.
- What-if Simulation: preview the possible effect of a proposed allocation change without changing real allocation data.
- PM Accept / Reject: allow the project manager to decide whether to apply or reject the suggested change.
- Minimal supporting data management required for the above flow.

What-if Simulation must be non-destructive. Simulation results should not modify real allocation data unless a project manager explicitly accepts a change.

## Out of Scope

The following are outside PRD v0.1 and later milestone planning unless explicitly approved:

- Full HR management platform functionality.
- Full project-management platform functionality.
- Detailed database schema, ERD, or final data model.
- Exact API endpoints or NestJS module architecture.
- Detailed UI screens, wireframes, or visual design.
- Final ML algorithm selection, including treating XGBoost or Random Forest as already decided.
- Optimization formulas or final matching weights.
- Authentication, detailed RBAC matrix, Docker, CI/CD, deployment architecture, cloud provider, or production infrastructure.
- AI/ML model implementation, training pipeline, or business feature code.

## Open Questions / TBD

- Final dataset source: real, synthetic, or hybrid.
- Exact risk prediction label definition.
- Final evaluation metrics for risk prediction and recommendation quality.
- Final resource-matching weighting or model approach.
- Which management CRUD capabilities are truly required by the MVP.
- Exact demo dataset scale.
