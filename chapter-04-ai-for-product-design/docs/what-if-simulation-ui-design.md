# What-if Simulation & PM Decision UI Design — MVP

## 1. Purpose and Scope

This document defines a reviewable low-fidelity UI design for the part of the
RMS-AI PM flow that starts after Resource Recommendation:

```text
Resource Recommendation
-> choose a proposal to evaluate
-> What-if Simulation
-> Impact Review
-> PM Accept / Reject
```

It covers scenario context, simulation states, impact presentation, PM
decision states, and directly related edge cases. It does not define an API,
database, ML model, simulation formula, allocation rule, or production
workflow.

The existing frontend is a scoped prototype and a continuity reference. It is
not a source of new business requirements.

## 2. Requirement Sources and Status Convention

Sources of truth:

1. `chapter-03-ai-for-requirements-product-analysis/docs/PRD.md`
2. `chapter-03-ai-for-requirements-product-analysis/docs/user-stories.md`
3. `chapter-03-ai-for-requirements-product-analysis/docs/acceptance-criteria.md`
4. `chapter-03-ai-for-requirements-product-analysis/docs/pm-risk-ui-design.md`
5. `chapter-03-ai-for-requirements-product-analysis/docs/resource-recommendation-ui-design.md`

Status convention:

- **CONFIRMED:** directly supported by the requirement baseline.
- **PROPOSED UI:** a presentation or interaction choice; not a business rule.
- **TBD:** the requirement or business rule is not sufficiently defined.

## 3. Upstream Handoff and Ownership

Project Risk Overview and Project Risk Detail belong to the upstream flow. The
Resource Recommendation artifact continues that flow and supplies the entry
context for this design.

The minimum conceptual handoff is:

- the project currently being considered;
- the recommendation/proposal the PM wants to evaluate.

The exact candidate fields, scenario payload, data contract, and API are
**TBD**. A candidate may provide context for creating a scenario, but the
requirement does not confirm that one candidate is a complete allocation
scenario.

## 4. Conceptual Flow and Screen Decomposition

Scenario Setup, Run Simulation, Impact Review, and PM Decision are conceptual
steps. They are not confirmed as separate pages, routes, or modals.

**PROPOSED UI:** use one What-if view with progressive sections:

1. Scenario context.
2. Run Simulation action and status.
3. Impact Review after a result is available.
4. PM Decision after the result is presented.

This keeps the project and proposal visible while avoiding additional
navigation. Whether a valid simulation result must exist before Accept is
allowed remains **TBD**; the progressive disclosure is a UI proposal for the
review flow, not a confirmed approval rule.

## 5. Entry Point

### PM goal

Evaluate a proposed allocation change before making a real decision.

### Entry condition

The PM has reached Resource Recommendation for a project and has indicated a
proposal to evaluate. How a candidate becomes a complete proposal is **TBD**.

### Context to preserve

| Information | Purpose | Status |
| --- | --- | --- |
| Current project | Prevent evaluating a proposal under the wrong project context | CONFIRMED at flow level; displayed fields TBD |
| Current recommendation/proposal | Identify what the PM intends to simulate | CONFIRMED at flow level; scenario structure TBD |
| Recommendation explanation | Preserve why the proposal was considered | PROPOSED UI; exact content already depends on US-02 |
| Previous simulation state | Decide whether an old result remains usable | TBD |

No score, threshold, ranking formula, or unconfirmed candidate field is added
to the handoff.

## 6. Scenario Setup

### PM goal

Understand which hypothetical change will be simulated.

### Low-fidelity structure

```text
+--------------------------------------------------------------------------+
| < Back to Resource Recommendation [PROPOSED UI]                           |
| WHAT-IF SIMULATION                                                       |
| Project: [Current project context — exact fields TBD]                    |
+--------------------------------------------------------------------------+
| SCENARIO UNDER REVIEW                                                    |
| Recommendation/proposal: [Illustrative context]                          |
| Hypothetical allocation change: [TBD]                                    |
| Constraints and validation: [TBD]                                        |
+--------------------------------------------------------------------------+
| This is a simulation. Real allocation has not changed.                   |
| [Run Simulation]                                                         |
+--------------------------------------------------------------------------+
```

### Information and validation

| Item | Design treatment | Status |
| --- | --- | --- |
| Project context | Keep visible in the What-if view | CONFIRMED at flow level |
| Proposal being evaluated | Identify the proposal throughout simulation and impact review | CONFIRMED; content TBD |
| Candidate as scenario context | May be shown as illustrative context | PROPOSED UI |
| Allocation change fields | Do not invent fields or numeric values | TBD |
| Availability/workload constraints | Do not assume missing data means available or unallocated | TBD |
| Allocation limit, duration, workload rule | Do not define | TBD |
| Scenario validation result | A place may be reserved, but rules and blocking behavior are undecided | PROPOSED UI / TBD |

### Insufficient-data state

The UI must not present an incomplete scenario as ready based on invented
values. The minimum data, message, and next action are **TBD**. Whether the PM
may edit, go back, or retry is not a confirmed business behavior.

## 7. Run Simulation

### PM action

The PM explicitly starts a simulation for the proposal under review.

### Invariant

Running, viewing, or failing a simulation does not change real allocation.
This is **CONFIRMED** by the PRD and AC-US-03-02.

### State model

| State | UI behavior | Requirement status |
| --- | --- | --- |
| Ready | Show the proposal context and Run Simulation action | PROPOSED UI; readiness rule TBD |
| Loading | Show that simulation is in progress; do not present impact as a completed result | PROPOSED UI |
| Success | Present impact for the exact proposal that was simulated | CONFIRMED; presentation TBD |
| Insufficient data | Do not fabricate a result; explain that a reliable result is unavailable | PROPOSED UI / TBD |
| Failure | Do not show a successful impact result; real allocation remains unchanged | CONFIRMED invariant / TBD recovery |

Timeout, cancellation, retry policy, and whether the PM may continue to a
decision after failure are **TBD**.

## 8. Impact Review

### PM goal

Understand the expected impact of the exact proposal that was simulated before
making a decision.

### Low-fidelity structure

```text
+--------------------------------------------------------------------------+
| EXPECTED IMPACT                                                          |
| Applies to: [Proposal just simulated]                                    |
+------------------------------------+-------------------------------------+
| Baseline                           | Simulated scenario                  |
| [Representation TBD]               | [Representation TBD]              |
+------------------------------------+-------------------------------------+
| Impact indicator and comparison point: [TBD]                            |
| This result has not changed real allocation.                             |
+--------------------------------------------------------------------------+
```

The two-column comparison is **PROPOSED UI**. It is not a confirmed output
format.

### Impact information

| Item | Status |
| --- | --- |
| Result belongs to the exact simulated proposal | CONFIRMED — AC-US-03-01 |
| Result is an expected impact, not a real allocation change | CONFIRMED |
| Baseline representation | TBD |
| Impact metric, scale, threshold, or formula | TBD |
| Risk, workload, skill coverage, delivery, or cross-project impact | TBD |
| Explanation of why impact changed | TBD |

### Outcome patterns

The design must not assume every simulation improves the situation.

| Outcome | Design treatment | Status |
| --- | --- | --- |
| Positive impact | Present only if supported by an actual result; metric and wording TBD | PROPOSED UI / TBD |
| No improvement | Keep the comparison neutral; do not manufacture a benefit | PROPOSED UI / TBD |
| Negative impact | Show the returned direction without hiding it; representation TBD | PROPOSED UI / TBD |
| Insufficient result | Do not present placeholders as real impact | PROPOSED UI / TBD |
| Error | Keep real allocation unchanged and do not show success | CONFIRMED invariant / TBD recovery |

No percentage, probability, risk reduction, workload calculation, score, or
benefit formula is introduced by this artifact.

## 9. PM Decision — Accept / Reject

### PM goal

Make the final human decision about the proposal being considered.

### Context before decision

- Current project.
- Exact proposal under review.
- Impact result associated with that proposal, when available.
- Clear statement that real allocation has not changed before an allowed and
  successful apply operation.

Whether a valid simulation result is mandatory before Accept is **TBD-06**.

### Low-fidelity structure

```text
+--------------------------------------------------------------------------+
| PM DECISION                                                              |
| Proposal: [Proposal under review]                                        |
| [Accept Proposal]                         [Reject Proposal]               |
| Apply timing and sufficient conditions: [TBD]                            |
+--------------------------------------------------------------------------+
```

### Decision outcomes

| Event | Required outcome | Status |
| --- | --- | --- |
| PM accepts and apply is allowed and succeeds | Real change corresponds to the exact accepted proposal | CONFIRMED — AC-US-04-01 |
| PM rejects | Proposal is not applied | CONFIRMED — AC-US-04-02 |
| PM does not explicitly accept | Proposal is not applied; silence and AI output are not acceptance | CONFIRMED — AC-US-04-03 |
| Apply fails | Do not report that the proposal was applied successfully | CONFIRMED — AC-US-04-07 |
| State after apply failure | Allocation state, recovery, and retry behavior | TBD — AC-US-04-06 |
| Data changed after simulation | Validity check and next action | TBD — AC-US-04-04 |
| Duplicate decision | Detection and response | TBD — AC-US-04-05 |

Accept does not necessarily mean immediate apply. Apply timing, sufficient
conditions, partial failure handling, and persistence are **TBD**.

**PROPOSED UI:** while a local prototype records an Accept or Reject choice,
label it as a prototype decision and do not claim that a production allocation
was updated.

## 10. Back, Cancel, and Context Preservation

| Interaction | Treatment | Status |
| --- | --- | --- |
| Back to Resource Recommendation | Preserve project context; handling of old simulation state remains undecided | PROPOSED UI / TBD |
| Back after a result | Do not imply the result applies to a different proposal | CONFIRMED invariant / PROPOSED UI |
| Cancel Simulation | Do not define it as a separate business action without a requirement | TBD |
| Leave without a decision | Do not apply the proposal | CONFIRMED; save/discard/expiry TBD |

Back and navigation behavior must not mutate real allocation.

## 11. State and Edge-case Matrix

| Area | State or edge case | Confirmed behavior | Remaining TBD |
| --- | --- | --- | --- |
| Upstream | No suitable candidate | Do not force an unsuitable candidate into the list | Suitability criteria and next action |
| Entry | Missing project/proposal context | Do not invent context | Message and recovery path |
| Scenario | Missing availability/workload | Do not infer availability | Validation and continuation behavior |
| Scenario | Possible constraint violation | No unconfirmed limit or threshold | Warn, block, or simulate behavior |
| Simulation | Loading | Real allocation remains unchanged | Timeout and cancel behavior |
| Simulation | Failure | Real allocation remains unchanged | Retry and transition behavior |
| Impact | No improvement | Do not manufacture improvement | Metric and wording |
| Impact | Negative outcome | Do not hide an unfavorable result | Metric and presentation |
| Impact | Insufficient data | Do not show an unreliable result as factual | Recovery behavior |
| Freshness | Data changes after simulation | Old result remains tied to the old context | Stale policy and re-simulation rule |
| Decision | Reject | Do not apply | Subsequent navigation/persistence |
| Decision | No explicit Accept | Do not apply | Save, discard, and expiry |
| Decision | Duplicate submission | No new rule is defined | Idempotency and response policy |
| Apply | Failure or partial failure | Do not report successful apply | Allocation state, rollback, and retry |

## 12. Requirement Invariants

- AI supports the PM and does not make the final decision.
- Recommendation does not automatically allocate a candidate.
- A recommendation includes a basic explanation of suitability.
- No suitable candidate means the UI does not force an unsuitable result.
- Simulation and simulation failure do not change real allocation.
- Reject does not apply the proposal.
- Without explicit PM acceptance, real allocation does not change.
- If an allowed apply succeeds, the change corresponds to the accepted
  proposal.
- If apply fails, the UI does not report success.

## 13. Requirement Traceability

| UI step or state | User Story | Acceptance Criteria | Requirement source | Status |
| --- | --- | --- | --- | --- |
| Recommendation handoff and proposal context | US-02 — PM considers ranked candidates with explanations | AC-US-02-01, AC-US-02-02 | PRD — Resource Recommendation | CONFIRMED; scenario mapping TBD |
| No suitable candidate upstream | US-02 | AC-US-02-03, AC-US-02-05 | Confirmed supplemental requirement | CONFIRMED |
| Recommendation unavailable or missing data | US-02 | AC-US-02-04 | TBD-01, TBD-03, TBD-07 | TBD |
| Scenario under review | US-03 — PM evaluates a proposed allocation change | AC-US-03-01 | PRD — What-if Simulation | CONFIRMED; structure TBD |
| Run Simulation | US-03 | AC-US-03-02 | PRD non-destructive simulation rule | CONFIRMED |
| Constraint issue | US-03 | AC-US-03-03 | TBD-04 | TBD |
| Simulation failure | US-03 | AC-US-03-04 | TBD-07 | CONFIRMED invariant / TBD recovery |
| Scenario or data changes | US-03, US-04 | AC-US-03-05, AC-US-04-04 | TBD-08 | TBD |
| Impact Review | US-03 | AC-US-03-01 | PRD expected-impact requirement | CONFIRMED; metrics TBD |
| Accept | US-04 — PM controls the real allocation decision | AC-US-04-01, AC-US-04-03 | PRD — PM Accept / Reject | CONFIRMED with conditions; timing TBD |
| Reject | US-04 | AC-US-04-02, AC-US-04-03 | PRD — PM Accept / Reject | CONFIRMED |
| Duplicate decision | US-04 | AC-US-04-05 | TBD-08 | TBD |
| Apply failure | US-04 | AC-US-04-06, AC-US-04-07 | TBD-07 plus confirmed failure constraint | CONFIRMED constraint / TBD recovery |

## 14. Open Questions / TBD

### Scenario

- Exact content of an allocation proposal.
- Whether a candidate is a complete proposal or an input to create one.
- Editable inputs and allocation constraints.
- Minimum data and validation rules.
- Whether multiple scenarios, reruns, or resets are required.

### Simulation and Impact

- Simulation formula and success criteria.
- Impact indicators, baseline, comparison point, and representation.
- Risk, workload, skill coverage, delivery, and cross-project scope.
- Loading timeout, retry, and failure recovery.
- Stale-result and re-simulation policy.

### Decision

- Whether a valid simulation is mandatory before Accept.
- Sufficient conditions and timing for apply.
- State after Accept or Reject.
- Persistence, history, expiry, and optional rejection reason.
- Duplicate decision and partial apply behavior.
- Recovery and retry after apply failure.

## 15. Scope Guardrails

This design does not add:

- candidate scores, thresholds, ranking weights, or Top N;
- candidate fields not confirmed by the requirement baseline;
- allocation limits, workload rules, or duration rules;
- simulation, prediction, or benefit formulas;
- automatic optimization or AI approval;
- production persistence or real allocation mutation;
- a full HR, employee-management, or project-management workflow;
- API, database, ML, authentication, notification, or infrastructure design.

## 16. Design Review Check

The conceptual MVP continuation is covered:

```text
Resource Recommendation
-> proposal context
-> Run Simulation
-> Impact Review
-> PM Accept / Reject
```

The artifact preserves all confirmed invariants and exposes unresolved rules as
TBD. The proposed single-view decomposition and progressive disclosure remain
PROPOSED UI and require human review before being treated as approved design.
