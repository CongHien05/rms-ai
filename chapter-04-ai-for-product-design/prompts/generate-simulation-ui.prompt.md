# Reusable Prompt — What-if Simulation and PM Decision UI Design

## Purpose

Use this prompt to reproduce an AI-assisted design review for the RMS-AI
What-if Simulation, Impact Review, and PM Accept/Reject flow.

This is a reusable prompt artifact. It supports reproducibility of the design
process and is not claimed to be a verbatim historical transcript.

## Prompt

```text
You are a Senior Product Designer and Business Analyst working on the RMS-AI
MVP. Produce a low-fidelity UI design for the flow that continues from Resource
Recommendation into What-if Simulation, Impact Review, and PM Accept/Reject.

Before designing, inspect the repository and read the current versions of:

1. PRD.
2. User Stories.
3. Acceptance Criteria.
4. Project Risk UI artifact.
5. Resource Recommendation UI artifact.
6. Chapter 4 guideline and any existing Chapter 4 user-flow/UI artifacts.

Do not infer file paths that do not exist. Report missing sources and determine
whether they block accurate design.

Treat requirement sources as authoritative. Use existing UI artifacts and the
prototype only for continuity. Do not turn prototype behavior into a business
requirement.

Use these status labels consistently:

- CONFIRMED: directly supported by PRD, User Stories, or Acceptance Criteria.
- PROPOSED UI: a presentation or interaction choice proposed to realize a
  requirement; it is not a business rule.
- TBD: the requirement or business rule is not sufficiently defined.

Analyze this conceptual flow:

Resource Recommendation
-> choose a proposal to evaluate
-> Scenario Setup
-> Run Simulation
-> Impact Review
-> PM Accept / Reject

Scenario Setup, Run Simulation, Impact Review, and PM Decision are conceptual
steps. Do not assume they must be separate pages, routes, or modals. If you
recommend a decomposition, label it PROPOSED UI.

For the entry point, preserve enough context for the PM to know which project
and recommendation/proposal are under review. Do not invent candidate fields,
scenario fields, payloads, or APIs.

For Scenario Setup, analyze:

- the PM's goal;
- the proposal being evaluated;
- confirmed inputs;
- proposed presentation fields;
- unresolved business fields;
- validation and insufficient-data states.

Do not invent allocation limits, numeric scenario values, workload rules,
duration rules, or constraints.

For Run Simulation, analyze:

- the PM action;
- ready and loading states;
- success and failure states;
- insufficient-data behavior;
- transition to Impact Review.

Preserve the confirmed invariant that simulation, including failed simulation,
does not change real allocation.

For Impact Review, analyze:

- baseline context;
- scenario context;
- expected impact;
- comparison presentation;
- positive, no-improvement, and negative outcomes;
- insufficient-data and error states.

If the requirement does not define an impact metric, keep it TBD. Do not invent
risk reduction percentages, workload percentages, delivery probabilities,
scores, thresholds, or benefit formulas. Mark placeholders as Illustrative or
Not yet determined rather than presenting them as real data.

For PM Decision, analyze:

- the exact proposal being decided;
- context needed before the decision;
- Accept and Reject;
- state after each decision;
- apply failure;
- transition after the decision.

Preserve these requirement invariants:

- AI supports the PM and does not make the final decision.
- Recommendation does not automatically allocate a candidate.
- A recommendation includes a basic explanation of suitability.
- No suitable candidate does not cause the system to force an unsuitable
  result.
- Simulation and simulation failure do not change real allocation.
- Reject does not apply the proposal.
- Without explicit PM acceptance, the proposal is not applied.
- If an allowed apply succeeds, the real change corresponds to the proposal
  accepted by the PM.
- If apply fails, the UI does not report successful apply.

Do not assume Accept means immediate apply. Keep apply timing and sufficient
conditions TBD unless the requirement baseline confirms them.

Treat Back navigation and project-context preservation as UI concerns. They may
be proposed and must be labeled PROPOSED UI unless already confirmed. Do not
define Cancel as an independent business action without requirement support.

Consider, without inventing expected business behavior:

- loading;
- insufficient data;
- empty results;
- recommendation and simulation errors;
- no suitable candidate in the upstream flow;
- simulation failure;
- no-improvement and negative impact;
- data changes after simulation;
- stale scenarios;
- duplicate decisions;
- PM leaving without a decision;
- apply failure or partial failure.

Keep stale-data policy, duplicate-submit policy, retry policy, recovery
behavior, and unresolved transition rules as TBD.

Map the design to the actual content of US-02, US-03, US-04 and their relevant
Acceptance Criteria. Verify IDs from the repository instead of assuming them.
Add a traceability table with:

| UI Step / State | User Story | Acceptance Criteria | Requirement Source | Status |

For each important screen or conceptual step, provide:

- PM goal;
- entry condition;
- information displayed;
- input data;
- user actions;
- expected output;
- loading state;
- empty or insufficient-data state;
- error state;
- edge cases;
- next transition;
- User Stories;
- Acceptance Criteria;
- requirement status;
- remaining TBDs.

Clearly list CONFIRMED items, PROPOSED UI choices, open TBDs, edge cases, and
scope-creep risks. Check that every important statement is traceable to a
requirement or explicitly labeled PROPOSED UI/TBD.

Do not design or propose:

- a database schema;
- API endpoints or payloads;
- an ML model;
- matching or simulation formulas;
- authentication or authorization;
- production persistence;
- a full HR or project-management system;
- automatic AI approval or allocation.

End with a design-readiness verdict. TBD items do not automatically block a
low-fidelity design when they can remain visible without inventing rules.
```

## Expected Human Review

The reviewer should verify that:

- requirement IDs and meanings match the current repository;
- UI proposals have not been presented as confirmed product behavior;
- unresolved business rules remain TBD;
- edge cases are identified without invented recovery policies;
- the design stays within the PM decision-support MVP;
- no API, database, or ML implementation has been introduced.
