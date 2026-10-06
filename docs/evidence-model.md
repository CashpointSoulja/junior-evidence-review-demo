# Evidence model

Code: `src/engine/types.ts`, rules in `src/engine/checks.ts`. All records in the prototype are synthetic (`src/data/project.ts`).

## Records

**Call**: `id`, expert name, role, `cohort` (former_employee | customer | competitor), `date`, duration, quotes.

**Quote**: `id` (e.g. `QA-04`), `callId`, `ts` (hh:mm:ss), speaker (Expert | Interviewer), exact `text`, `scope` (all_customers | mid_market | small_firms | single_firm), optional `metric` { key, value, unit (% | weeks | days), period, scope, estimate? }, optional `hedged`.

**Claim**: `id`, diligence `topic`, `text`, `scope`, `generality` (single | consensus), `citations` (quote IDs), optional `claimedMetric` { key, value, unit, period }, `keyThesis`, `included`, `review` { status, note, at }, `history` (versions).

**Version**: `v`, `at`, `change`, `detail`, text and citations after the change, review status before the change.

## Check rules

| Code | Severity | Fires when |
|---|---|---|
| MISSING_CITATION | blocking | claim cites nothing |
| BROKEN_CITATION | blocking | a cited ID is not an expert quote (missing, or an interviewer line) |
| HEDGED_SOURCE | review | a cited quote is marked hedged by the expert |
| SCOPE_MISMATCH | review | every cited quote's scope is narrower than (or a sibling of) the claim's scope |
| SINGLE_SOURCE_CONSENSUS | review | claim says experts agree, cites fewer than 2 calls |
| METRIC_UNSOURCED | review | claim states a figure; no cited quote has that metric |
| UNIT_OR_PERIOD_MISMATCH | review | cited figure uses another unit or period |
| METRIC_MISMATCH | review | cited figure differs beyond tolerance |
| CONTRADICTION | review | an *uncited* quote on the same metric, same scope, same period differs beyond tolerance |
| COHORT_DIFFERENCE | info | an uncited quote on the same metric differs, but for another scope or period. Shown as context, explicitly "not a contradiction" |

Tolerance: percentages compare in absolute points (>1pt); other units relatively (>10%).

Scope breadth: all_customers (3) > mid_market = small_firms (2) > single_firm (1). A claim about a single firm is never scope-mismatched.

## Review and readiness

- **Review required** if the claim is a key thesis or has any review-severity finding.
- Note required for disputed, insufficient, or supported-over-open-checks.
- **Blockers** (per included claim): blocking findings; required review not done; disputed or insufficient.
- **Approval**: allowed only with zero blockers. Stores a fingerprint and is voided by any later claim action.
- **Status**: blocked → ready to approve → handoff-ready; "changed since approval" after any change.

## Gaps (per diligence question)

CONFLICT, NO_EVIDENCE, UNRESOLVED_REVIEW, SCOPE, COHORT_LIMITED (required cohort absent from cited quotes, with a target cohort), SINGLE_SOURCE. Ordered in that priority.

## Seeded cases

| Claim | Designed to show |
|---|---|
| CL-1 | Key thesis, clean source; two cohort differences shown as context |
| CL-2 | "All segments" from mid-market quotes: scope mismatch |
| CL-3 | 7% vs competitor's 12% same scope and period: real contradiction; customer's 12% for one firm: cohort difference |
| CL-4 | 15% claimed vs 12% quoted; one firm generalised |
| CL-5 | Mid-market 6 weeks vs one firm's 16 weeks in 2021: different period |
| CL-6 | Small-firm win rate generalised to all deals |
| CL-7 | No citation: blocks until QB-04 is cited |
| CL-8 | Hedged source presented as fact |
| CL-9 | Clean control: no findings |
