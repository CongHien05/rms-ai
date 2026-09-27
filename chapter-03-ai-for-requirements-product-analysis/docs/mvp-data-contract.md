# RMS-AI MVP Conceptual Data Contract

## 1. Purpose and Scope

This artifact defines the conceptual data contract for the RMS-AI MVP decision
flow:

```text
Project
-> Risk Assessment
-> Risk Explanation
-> Resource Recommendation
-> What-if Scenario
-> Simulation
-> Impact
-> PM Decision
-> [Application behavior]
```

It bridges requirement and product-design artifacts toward later high-level
architecture, API, database, and AI design work. It does not define production
API DTOs, database schema, ERD, ML model choice, ranking formula, simulation
formula, or implementation behavior.

Core invariant: AI supports the PM; the PM decides.

## 2. Sources and Status Convention

Primary requirement sources:

1. `PRD.md`
2. `user-stories.md`
3. `acceptance-criteria.md`

Design and prototype context:

- `pm-risk-ui-design.md`
- `resource-recommendation-ui-design.md`
- `chapter-04-ai-for-product-design/docs/what-if-simulation-ui-design.md`
- Current frontend prototype files under `frontend/src/`

Status convention:

| Status | Meaning |
|---|---|
| Confirmed | Directly supported by PRD, User Stories, or Acceptance Criteria. |
| TBD | Product decision is needed and the current sources do not define it. |
| Optional | Possible UX or product improvement, not required by the current MVP baseline. |
| Mock-only | Exists only in prototype/demo presentation data. |
| Derived | Calculated from other information; formula must be marked TBD unless confirmed. |

Prototype implementation is evidence of presentation continuity, not a source
of new business requirements.

## 3. Product Data Flow

```text
Project Data
    ↓
Risk Capability
    ↓
Risk Assessment
    +
Risk Explanation
    ↓
Recommendation Request
    ↓
Ranked Recommendation
    ↓
Allocation Scenario
    ↓
Simulation
    ↓
Impact Result
    ↓
PM Decision
    ↓
[Application — semantics partially TBD]
```

Boundary notes:

| Boundary | Confirmed information crossing boundary | TBD information |
|---|---|---|
| Project Data -> Risk Capability | A project is assessed for risk of not meeting delivery plan/deadline. | Minimum input, source data, freshness, feature definitions, target label. |
| Risk Capability -> Risk Assessment + Explanation | A risk estimate and key explanatory factors are shown for the project. | Representation, scale, threshold, factor semantics, ordering, contribution. |
| Risk -> Recommendation Request | PM can request resource recommendation for the project under review. | Request payload, staffing need, role, skills, constraints, required risk context. |
| Recommendation -> Allocation Scenario | PM considers ranked candidates with basic suitability explanation. | Candidate identity fields, how candidate becomes an allocation scenario. |
| Scenario -> Simulation | PM evaluates a proposed allocation change hypothetically. | Scenario structure, constraints, editable inputs, one vs many resources. |
| Simulation -> Impact Result | PM sees expected impact for the exact simulated scenario. | Impact dimensions, baseline, comparison format, formula, failure states. |
| Impact -> PM Decision | PM accepts or rejects the proposal under review. | Whether valid simulation is mandatory before accept; stale-data policy. |
| PM Decision -> Application | If apply is permitted and succeeds, real change matches accepted proposal. | Apply timing, sufficient conditions, persistence, failure, retry, rollback. |

## 4. Requirement Traceability

| Concept | Information / Field | Purpose | Requirement Source | Status | Consumer |
|---|---|---|---|---|---|
| Project | Current project under PM review | Anchor risk, recommendation, scenario, and decision to the correct context | PRD MVP flow; US-01 to US-04 | Confirmed | Frontend, Backend, Risk Capability, Recommendation Capability, Simulation Capability |
| Project | Project identifier/name | Distinguish projects in UI and flow | pm-risk UI design; frontend mock | TBD; mock names are Mock-only | Frontend, Backend |
| Project | Project status, team, sprint, tasks, timeline | Possible risk/resource context | PRD Product Scope | TBD | Risk Capability, Recommendation Capability, Unknown |
| Resource data | Skills | Possible supporting context for recommendation and AI inputs | PRD Product Scope example; User Stories scope boundary | TBD as a required category and field set | Recommendation Capability, Simulation Capability |
| Resource data | Availability | Possible supporting context for recommendation and AI inputs | PRD Product Scope example; User Stories scope boundary | TBD as a required category and field set | Recommendation Capability, Simulation Capability |
| Resource data | Workload | Possible supporting context for recommendation and AI inputs | PRD Product Scope example; User Stories scope boundary | TBD as a required category and field set | Recommendation Capability, Simulation Capability |
| Resource data | Allocation context | Possible supporting context for recommendation, simulation, and AI inputs | PRD Product Scope example; User Stories scope boundary | TBD as a required category and field set | Recommendation Capability, Simulation Capability |
| Risk Assessment | Risk of not meeting delivery plan/deadline | Let PM understand project delivery risk | PRD Product Goals; US-01; AC-US-01-01 | Confirmed | Frontend, Backend, Risk Capability |
| Risk Assessment | Score, percentage, level, color, threshold | Possible representation | User Stories TBD-02; PM risk UI TBD | TBD | Frontend, Risk Capability |
| Risk Explanation | Key explanatory factors | Help PM understand risk at a high level | PRD MVP Scope; US-01; AC-US-01-01 | Confirmed | Frontend, Risk Capability |
| Risk Explanation | Factor contribution, SHAP, weight, causality | Model-internal or mathematical explanation | PM risk UI TBD | TBD | Risk Capability |
| Recommendation Request | PM requests recommendation for project | Continue MVP flow from risk to recommendation | US-02; AC-US-02-01 | Confirmed | Frontend, Backend, Recommendation Capability |
| Recommendation | Ranked candidate list | Let PM compare suggested candidates | PRD MVP Scope; US-02; AC-US-02-01 | Confirmed | Frontend, Recommendation Capability |
| Recommendation | Basic suitability explanation | Explain why a candidate may fit | PRD Product Goals; US-02; AC-US-02-01 | Confirmed | Frontend, Recommendation Capability |
| Recommendation | Matching score, confidence, ranking formula | Quantitative matching detail | User Stories TBD-03, TBD-10 | TBD | Recommendation Capability |
| Recommendation | No suitable candidate state | Avoid forcing unsuitable candidates into results | AC-US-02-03; AC-US-02-05 | Confirmed | Frontend, Backend, Recommendation Capability |
| Scenario | Proposed allocation change | Subject of what-if simulation | PRD MVP Scope; US-03; AC-US-03-01 | Confirmed | Frontend, Simulation Capability |
| Scenario | Candidate-to-scenario mapping | Turn a candidate/proposal into a simulation input | Resource recommendation UI; Chapter 4 design | TBD | Frontend, Backend, Simulation Capability |
| Simulation | Non-destructive simulation run | Evaluate without changing real allocation | PRD MVP Scope; AC-US-03-02 | Confirmed | Backend, Simulation Capability |
| Impact | Expected impact of exact simulated scenario | Support PM decision before real change | US-03; AC-US-03-01 | Confirmed | Frontend, Simulation Capability |
| Impact | Risk/workload/skill/delivery/cross-project dimensions | Possible impact categories | User Stories TBD-05 | TBD | Simulation Capability |
| PM Decision | Accept / Reject | Preserve PM final decision authority | PRD Overview; US-04 | Confirmed | Frontend, Decision/Application |
| PM Decision | No explicit accept means no apply | Prevent AI result or silence becoming approval | AC-US-04-03 | Confirmed | Backend, Decision/Application |
| Application | Successful apply matches accepted proposal | Guard real allocation change | AC-US-04-01 | Confirmed with conditions | Backend, Decision/Application |
| Application | Apply timing, failure recovery, rollback, retry | Production application behavior | AC-US-04-06; TBD-07 | TBD | Decision/Application |

## 5. Project Context

Confirmed:

- A project is the primary context for risk assessment, recommendation,
  scenario, simulation, impact, and PM decision.
- The risk assessment concerns the project's ability to meet the planned
  delivery or expected deadline.

TBD:

- Project identifier format, project visibility rule, project status taxonomy.
- Required team/member/timeline/sprint/task structure.
- Minimum valid input for risk, recommendation, and simulation.
- Whether project status, progress/work cycle, skills, availability, workload,
  or allocation context is required. The PRD names these only as examples of
  possible minimal supporting data; it does not confirm each category as a
  mandatory input or field.
- Historical delivery data and risk evidence definitions.

Mock-only:

- `project-a-mock`, `project-b-mock`, `Dự án A [Minh họa]`, and display labels
  in the frontend prototype.

This contract does not convert Project, Sprint, Task, Member, or Allocation
into database entities.

## 6. Risk Assessment

Confirmed:

- A risk assessment exists for a project when enough data and a successful
  assessment are available.
- It estimates the risk that the project will not meet the planned delivery or
  expected deadline.
- An unsupported or insufficient result must not be presented as reliable.

TBD:

- Risk representation: score, probability, label, level, color, or wording.
- Thresholds, scale, target/label definition, model confidence, model version.
- Assessment timestamp and freshness behavior.
- Data sufficiency rule and unavailable-state wording.

Derived:

- Risk result is likely derived from project/resource data, but feature formula
  and target semantics are TBD.

## 7. Risk Explanation

Confirmed:

- PM sees key explanatory factors at a high product level.
- Explanations help PM understand the risk estimate before considering
  intervention.

TBD:

- Factor identity, factor label, factor value, ordering, contribution,
  supporting evidence, and whether factors imply causality.
- Whether explanations use feature importance, SHAP, weights, confidence, or a
  simpler product-level explanation.

Mock-only:

- Prototype strings such as `Yếu tố giải thích A [Minh họa]`.

Product-level explanation is not the same as mathematical model explanation.

## 8. Recommendation Request

Confirmed:

- PM can request resource recommendation for the project under review.
- Viewing or receiving recommendations does not change real allocation.

TBD:

- Request payload, project reference structure, risk assessment dependency,
  staffing need, requested role, required skills, time period, allocation
  amount, constraints, and behavior when risk is unavailable.

The current handoff confirms conceptual project context only; it does not
define API parameters.

## 9. Resource Recommendation

Confirmed:

- Successful recommendation provides a ranked candidate list.
- Each candidate has a basic suitability explanation.
- No suitable candidate must be shown clearly.
- The system must not add unsuitable candidates merely to avoid an empty list.

TBD:

- Candidate identity fields, candidate count, eligibility rule, exclusion
  reason, ties, ranking formula, matching score, confidence, skills,
  availability, workload, and display fields.
- Difference between insufficient data, recommendation generation failure,
  system error, and true no-suitable-candidate result.

Mock-only:

- `candidate-a-mock`, `displayLabel`, and `MockRecommendationCandidatePresentation`.

Rank exists; ranking formula is not known.

## 10. Candidate vs Allocation Scenario

Candidate:

- Confirmed as the concept returned in a ranked recommendation list.
- Exact candidate identity and display fields are TBD.

Allocation Scenario:

- Confirmed as a proposed allocation change PM can simulate.
- Exact scenario structure is TBD.

Boundary:

- Candidate does not equal allocation scenario by default.
- Current frontend passes `candidateId` into the What-if view, but this is
  prototype presentation behavior and is not a domain relationship.
- The candidate-to-scenario transformation is TBD.

## 11. What-if Scenario

Confirmed:

- PM evaluates a proposed allocation change through what-if simulation.
- The scenario must remain hypothetical until an allowed and successful apply
  after explicit PM acceptance.

TBD:

- Scenario reference, project reference format, candidate/resource reference,
  allocation change, role, effort, allocation percentage, start date, end date,
  affected project, constraints, source recommendation, and whether a scenario
  can include multiple candidates/resources.

Mock-only:

- Prototype "Thử phương án minh họa" action and candidate-as-context text.

## 12. Simulation

Confirmed:

- Simulation is hypothetical and non-destructive.
- Running, viewing, or failing a simulation does not change real allocation.
- The result, when successful, must belong to the exact scenario simulated.

TBD:

- Simulation request shape, status lifecycle, loading semantics, timeout,
  cancellation, retry, failure handling, cache, async job behavior, and behavior
  when scenario data changes.

No queue, retry policy, or asynchronous architecture is defined here.

## 13. Impact Result

Confirmed:

- PM sees expected impact for the exact scenario simulated.
- Impact is decision support, not evidence that allocation has changed.

TBD:

- Impact dimensions: risk, workload, skill coverage, delivery, resource, or
  cross-project effects.
- Baseline, before/after format, delta, comparison period, scale, explanation,
  and handling of no improvement or negative impact.

Optional:

- Two-column baseline/simulated layout from UI designs.

No fake numeric impact metric is introduced by this contract.

## 14. PM Decision

Confirmed:

- PM may accept or reject a proposal.
- Rejection means the proposal is not applied.
- No explicit acceptance must not be treated as acceptance.
- If PM accepts and apply is permitted and succeeds, the real change must match
  the accepted proposal.
- If apply fails, the system must not report successful application.

TBD:

- Decision persistence, actor identity details, decision timestamp, rejection
  reason, repeated decision handling, and whether a valid simulation is
  mandatory before acceptance.

Optional:

- Capturing rejection reason as a UX improvement.

## 15. Decision vs Application Boundary

Decision:

- PM chooses Accept or Reject for a proposal/scenario under review.

Application:

- The system changes real allocation only if application is permitted and
  succeeds after explicit PM acceptance.

Confirmed invariants:

- Accept is not automatically equal to successful apply.
- Reject does not apply.
- No explicit accept does not apply.
- Successful apply must correspond to the exact accepted option.
- Apply failure must not be reported as success.

TBD:

- Application eligibility, timing, state, result, partial failure, rollback,
  retry, recovery, persistence, and stale-data validation.

## 16. Freshness / Staleness

Conceptual linkage:

- Requirements tie a risk result to the assessed project, a recommendation to
  the project request, and simulation impact to the exact simulated scenario.
  This linkage does not define data-version or freshness semantics, or when a
  result becomes stale, invalid, or unusable.

TBD:

- All freshness and staleness semantics, including whether a prior result may
  be treated as current or reliable after its context changes.
- Risk freshness, recommendation freshness, simulation freshness, changed
  project/resource/allocation data, expired recommendation, expired simulation,
  recompute rules, stale decision behavior, and any TTL.

No expiry duration is defined.

## 17. Frontend / Backend / AI Boundaries

Current project direction, not a confirmed product architecture:

```text
Frontend
   ↓
Backend / Application Layer
   ↓
AI Service / AI Capabilities
```

Candidate conceptual responsibilities - TBD:

- Frontend may present project risk, explanations, recommendations, scenario
  context, simulation impact, and PM decision controls, and capture explicit PM
  interactions. Prototype UI must preserve TBD and mock labels.
- Backend / Application Layer may coordinate business flow, data access, AI
  capability calls, decisions, application, or persistence. None of these
  responsibilities or their boundaries is confirmed by the current product
  requirements.
- Authorization, persistence, module boundaries, orchestration, data ownership,
  and apply behavior remain TBD.

AI capability responsibilities:

- Conceptually includes Risk Prediction, Resource Recommendation, and
  Simulation / Impact.
- These are capabilities, not confirmed separate services or microservices.

This boundary records the repository's current technical direction only. It
does not define service modules, deployment units, persistence architecture, or
communication mechanisms.

## 18. AI Input / Output Boundary

### A. Risk Capability

| Category | Content |
|---|---|
| Confirmed inputs | Project context sufficient to assess delivery risk. |
| TBD inputs | Target label, project fields, sprint/task data, workload, allocation, history, freshness, minimum data. |
| Confirmed outputs | Risk estimate for the project; key explanatory factors. |
| TBD outputs | Score/level/probability, thresholds, confidence, model version, timestamp, factor contribution. |

### B. Recommendation Capability

| Category | Content |
|---|---|
| Confirmed inputs | Project context and PM request for recommendation. |
| TBD inputs | Risk result dependency, staffing need, role, skills, time period, constraints, availability, workload, allocation context. |
| Confirmed outputs | Ranked candidate list; basic suitability explanation; no-suitable-candidate state. |
| TBD outputs | Candidate schema, count, ranking formula, matching score, confidence, exclusion reason, unavailable/failure states. |

### C. Simulation / Impact Capability

| Category | Content |
|---|---|
| Confirmed inputs | A proposed allocation change/scenario for a project. |
| TBD inputs | Scenario schema, candidate/resource mapping, allocation amount, dates, constraints, baseline, cross-project context. |
| Confirmed outputs | Expected impact for the exact simulated scenario; non-destructive behavior. |
| TBD outputs | Impact dimensions, baseline/delta format, explanation, failure details, stale-result behavior. |

No ML algorithm, optimization algorithm, LLM, or model family is selected.

## 19. Presentation vs Domain vs API vs DB vs AI

Presentation Model != Domain Concept != API DTO != Database Entity != AI
Input/Output.

Example:

- `MockRecommendationCandidatePresentation` confirms that the prototype needs
  display data for a candidate list.
- It does not confirm a production API response, database table, AI output
  schema, or final candidate identity fields.

Similarly, the prototype's `candidateId` routing proves only current UI state
management. It does not prove that a candidate is a complete allocation
scenario.

## 20. API Readiness

| API area | Readiness | Exact blockers |
|---|---|---|
| Project Risk API | Partially ready | Flow and outcome confirmed; risk representation, minimum input, data sufficiency, freshness, and explanation semantics TBD. |
| Resource Recommendation API | Partially ready | Ranked list and explanation confirmed; candidate schema, eligibility, ranking rule, no-data/failure states, and score/confidence semantics TBD. |
| Simulation API | Partially ready | Non-destructive simulation and exact-scenario impact confirmed; scenario schema, constraints, status lifecycle, and impact dimensions TBD. |
| Decision/Application API | Partially ready | Accept/reject invariants confirmed; apply timing, sufficient conditions, persistence, failure recovery, duplicate decisions, and stale-data handling TBD. |

No production endpoint path, method, request body, or response body is defined.

## 21. Database Readiness

Conceptual data that may be evaluated for persistence later, without implying a
current persistence requirement:

- Project context.
- Possible resource/supporting context, if later confirmed as required.
- Risk assessment result and explanation, if historical review is required.
- Recommendation result, if decision traceability is required.
- Scenario/simulation/impact result, if PM decisions depend on review history.
- PM decision and application result, if auditability is required.

Confirmed conceptual behavior, not persistence:

- Real allocation must not change before explicit PM acceptance and allowed
  successful apply.
- The MVP flow needs minimal supporting data for AI input and PM review. The
  current requirements do not establish that each category or result must be
  persisted.

TBD:

- Which concepts are persisted, retention, history, ERD, table structure,
  identifiers, relationships, and transaction semantics.

No ERD proposal was reviewed in this task. No database schema is defined.

## 22. AI Readiness

| AI area | Readiness | Reason |
|---|---|---|
| Risk target/label readiness | Blocked | PRD explicitly leaves the operational risk training label TBD. |
| Risk feature readiness | Partially ready | The PRD names possible supporting-data examples; required categories, exact fields, and minimum data are TBD. |
| Risk explanation output readiness | Partially ready | Key factors confirmed; contribution semantics and representation TBD. |
| Recommendation input readiness | Partially ready | Project request confirmed; staffing need, skills, availability, workload, allocation context, and constraints TBD. |
| Recommendation output readiness | Partially ready | Ranked candidates and explanation confirmed; candidate schema, score, confidence, ranking formula TBD. |
| Simulation input readiness | Partially ready | Proposed allocation change confirmed; scenario schema and constraints TBD. |
| Impact output readiness | Partially ready | Expected impact confirmed; dimensions, scale, baseline, formula TBD. |

## 23. TBD / Open Questions

### Risk

- Risk representation.
- Target / label.
- Threshold.
- Minimum input.
- Factor semantics.
- Freshness.

### Recommendation

- Candidate identity fields.
- Candidate count.
- Candidate eligibility.
- Ranking rule.
- Ranking ties.
- Skills.
- Availability.
- Workload.
- Matching score.
- Confidence.

### Scenario

- Candidate-to-allocation-option relationship.
- Allocation inputs.
- Allocation amount.
- Constraints.
- Number of resources.
- Cross-project effects.

### Impact

- Impact dimensions.
- Baseline.
- Comparison format.
- Scale.
- Explanation.

### Decision / Application

- Application conditions.
- Application timing.
- Persistence.
- Stale-data behavior.
- Repeated decision.
- Failure.
- Retry.
- Rollback/recovery.
- Post-reject behavior.

### Freshness

- Expiration policy for risk, recommendation, simulation, and decisions.
- Whether changed project, resource, or allocation data requires recomputation.
- Whether PM can accept a scenario after context changes.

## 24. Next-Phase Readiness

Ready for next phase:

- High-level system architecture can evaluate the current frontend,
  backend/application, and AI capability direction while keeping candidate
  responsibilities TBD.
- Initial API contracts can be drafted from the confirmed conceptual flow while
  preserving unresolved fields as TBD.
- ERD/database work can identify candidate persistent concepts without treating
  this artifact as a schema.
- AI design can start with confirmed outcomes and explicitly blocked/TBD model
  inputs, outputs, labels, and metrics.

Not ready:

- Production DTOs, database schema, AI model implementation, ranking formula,
  simulation formula, or automatic apply behavior.
