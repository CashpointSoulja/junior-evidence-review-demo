# Scope and rejected alternatives

## In scope this week

One workflow, end to end: claims → checks → source → human decision → gaps → guide → gate → export. Synthetic data, browser-local, no network calls.

## Rejected alternatives

| Alternative | Why not this week |
|---|---|
| **Model-based claim verification** (ask an LLM whether a quote supports a claim) | Adds the error class we're trying to catch; costs money; results not reproducible in a demo. Deterministic checks on structured fields are explainable and testable. Revisit as a *suggestion* layer behind the same human gate. |
| **Live interview-guide generation** | Same issue, plus leading-question risk. Fixed neutral templates tied to explicit gaps are auditable. |
| **Full transcript ingestion and claim extraction** | That's Junior's core pipeline; rebuilding it would be a replacement, not an increment. The increment assumes structured quotes exist. |
| **Automatic MNPI/compliance detection** | Junior already advertises MNPI flagging. A prototype must not imply compliance assurance. Redaction is limited to selected strings, with a residual-risk warning. |
| **Multi-user review with roles and comments** | Needs auth and a backend. A single-reviewer gate tests the core question (will analysts resolve flags?) first. |
| **Dashboard of team metrics** | No real usage exists; a dashboard would show invented numbers. Metrics are computed from local events with explicit denominators instead. |
| **Scoring claims 0–100 for confidence** | False precision. Three human states (supported, disputed, insufficient) plus explicit checks are easier to defend in an IC. |
| **Blocking on every finding** | Review fatigue. Only missing/broken citations block outright; other findings require a decision, and cohort differences are context only. |

## Explicit non-goals

- No investment recommendation or view on the synthetic deal.
- No claim that redaction anonymises anyone.
- No claim of customer validation or adoption.
