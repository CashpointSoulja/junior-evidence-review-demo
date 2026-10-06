# Metrics

Every metric has a numerator, a denominator and a window. **There is no baseline and no adoption data.** The prototype computes these live from events stored in the browser (`src/engine/metrics.ts`); pilot targets below are hypotheses to agree with the team, not predictions.

| Metric | Numerator | Denominator | Window | In prototype | Pilot hypothesis (to validate) |
|---|---|---|---|---|---|
| **Sourced accepted claims / reviewed claims** (primary quality) | claims marked supported, included, with ≥1 valid expert-quote citation | claims with any review decision | per brief; pilot: rolling 4 weeks per team | live | Track trend; a fall after a rule change means the checks are catching more |
| **Final call to handoff-ready** (speed) | time from last call available to first approval | (median over briefs approved) | per brief; pilot: weekly median | demo timer from first load to first approval, labelled as such | Measure before and after on the same teams; no target until baseline exists |
| **Weekly returning analysts / activated analysts** (adoption) | activated analysts active in ≥2 ISO weeks | analysts who approved ≥1 brief | trailing 4 ISO weeks | live, but max 1 analyst per browser | Decide at week 4 whether to expand (see [pilot-adoption-rollout.md](pilot-adoption-rollout.md)) |
| **Guides used / guides created** (gap-to-action) | guides exported or copied at least once | guides generated | all time per project | live | Low ratio means templates are too generic (discovery D6) |

## Guardrail metrics (pilot)

- **Accept-over-flag rate:** supported decisions on claims with open review findings / supported decisions. A high rate suggests rubber-stamping.
- **Findings per claim:** review-severity findings / claims. Too high suggests review fatigue.
- **Re-approval rate:** briefs re-approved after change / briefs approved.

## Events (local)

`session_started`, `final_call_ingested` (simulated at first load), `claim_reviewed`, `claim_edited`, `guide_created`, `guide_used`, `brief_approved`, `brief_exported`, `reset`. Each has a timestamp and the local analyst ID `local-analyst`. Nothing is sent anywhere.
