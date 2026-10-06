# Pilot, adoption and rollout

A plan, not a record of anything that has happened.

## Pilot (weeks 1–4 after build)

- **Who:** 2–3 existing customer teams who run ≥3 expert calls per project and agree to try it (recruited by Junior's customer team).
- **What:** behind a feature flag on projects with ≥2 calls. Evidence Review sits after the call summary step.
- **Instrument:** the four metrics plus guardrails in [metrics.md](metrics.md).
- **Qualitative:** a 20-minute check-in per team in weeks 2 and 4.

## Adoption path

1. **Entry point:** a "Review before sharing" action on the project synthesis, with a count of open checks.
2. **First value in one sitting:** opening one flagged claim, clicking its source and resolving it.
3. **Habit:** the export and share action shows status (draft vs handoff-ready).
4. **Spread:** VPs see "handoff-ready" on received briefs and ask for it.

## Decision gates

| Gate | Evidence needed | If not met |
|---|---|---|
| Week 2 | Every pilot team has approved at least one brief | Interview the blockers; simplify the gate |
| Week 4 | Returning / activated analysts and guides used / created are both reviewed with the team; accept-over-flag isn't dominant | Cut checks with high override rates |
| Expand | Teams ask to keep it; no increase in support load | Keep in pilot or stop |

## Rollout

Feature flag → pilot teams → opt-in for all projects → default on for projects with ≥3 calls. Kill switch at each stage. Release notes describe the checks as review aids, not guarantees.
