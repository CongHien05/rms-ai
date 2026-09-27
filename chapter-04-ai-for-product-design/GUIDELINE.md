# Chapter 4 Guideline

## Chapter Objective

Create reviewable product-design artifacts for the RMS-AI MVP through:

- User Flow.
- Wireframes and low-fidelity UI.
- Scoped prototypes.
- AI-assisted design review with human approval.

Chapter 4 describes how confirmed requirements may be presented and reviewed.
It does not define production architecture or silently complete missing
business rules.

## Sources of Truth

Use the current artifacts in this order for requirement traceability:

1. PRD.
2. User Stories.
3. Acceptance Criteria.

Existing user flows, wireframes, and prototypes provide design continuity, but
they do not override the requirement baseline.

## Status Convention

### CONFIRMED

The statement has direct support in the current PRD, User Stories, or
Acceptance Criteria.

### PROPOSED UI

The statement is a presentation or interaction choice proposed to realize a
requirement. It remains a design choice and does not become a business rule.

### TBD

The requirement or business rule does not contain enough information for an
accurate decision. Keep the gap visible for team review.

## Design Principles

- A UI choice does not become a business rule.
- Do not invent thresholds, scores, formulas, allocation rules, or approval
  rules.
- Do not design a database, API, or ML model as part of a UI artifact.
- Describe prototypes as prototypes, not production behavior.
- AI supports design analysis and drafting; people review and decide.
- Trace every important screen or step to a requirement, or mark it as
  PROPOSED UI.
- Preserve unresolved business rules as TBD instead of filling them with mock
  behavior.
- Keep the MVP focused on PM decision support rather than a full HR or project
  management platform.

## AI-Assisted Design Workflow

1. Read the PRD, User Stories, and Acceptance Criteria.
2. Read upstream UI artifacts and identify the handoff context.
3. Separate CONFIRMED requirements, PROPOSED UI choices, and TBD gaps.
4. Draft the flow, wireframe, states, and traceability mapping.
5. Review for unsupported business rules, missing states, and scope creep.
6. Record human review decisions before treating a proposal as approved.

Prompt artifacts support reproducibility of this workflow. They are not
historical transcripts unless the repository contains evidence that they are.

## Definition of Done

Chapter 4 is complete when:

- The relevant main flow is documented.
- Wireframes or low-fidelity UI are sufficient for team review.
- Important loading, empty, insufficient-data, error, and decision states are
  considered where relevant.
- User Stories and Acceptance Criteria are traced to important UI steps.
- CONFIRMED, PROPOSED UI, and TBD content is clearly distinguished.
- Unresolved business rules remain TBD.
- AI-generated proposals have been reviewed by a person.
- Artifacts do not introduce unapproved API, database, or ML implementation
  decisions.
