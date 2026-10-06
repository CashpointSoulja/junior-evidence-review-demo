# Viability memo

**Question:** Is a pre-handoff evidence check worth Junior building next? This memo covers desirability, feasibility, viability and risk. It is written as a hypothesis, with no customer data behind it.

## What is known (public sources, see [source ledger](source-ledger.md))
- Junior's London Senior PM role owns the core research workflow, ships frequently and is measured on adoption.
- Junior already shows sources in JuniorGPT. Its own ASR article says transcription errors can "introduce false claims, poison downstream research". It also says a hallucinated sentence could reach a client's research, and that the last 3% of entity errors remain hard.
- Junior offers redaction, retention controls and MNPI flagging. That suggests buyers care about controls, not just speed.

## What is assumed (not validated)
- Associates hand off syntheses with claims that are wrongly scoped or rest on a single source often enough to hurt.
- VPs will accept a one-step gate if it takes less time than they would spend re-checking.
- Gap-driven guides make follow-up calls more efficient.

## Desirability
**Plausible, but unproven.** The pain lines up with Junior's own published concerns. Its size is unknown: I have no baseline error rate and no interviews. The first pilot measure is the share of claims changed or disputed during review, out of all reviewed claims ([metrics](metrics.md)).

## Feasibility
**High for v1.** The checks are deterministic, run on structured quote fields and need no model spend. The hard part is v2: pulling scope, cohort, unit and period from real transcripts with enough precision. Without that structure the checks degrade to "has a citation". Building it would likely reuse Junior's entity-recognition work and needs an evaluation set first ([roadmap](roadmap.md)).

## Viability
- **Value lever (hypothesis):** Trust in the synthesis supports retention and expansion. A checked brief is a reason for the VP, not just the associate, to want Junior.
- **Cost:** Low marginal compute for v1. The main costs are engineering time and the extra review minutes per brief, which the metric "final call to handoff-ready" has to watch.
- **Pricing:** No separate SKU. It is a workflow feature that deepens use of transcripts and the library. Pricing is not tested.
- **Kill criteria (pilot):** Stop or rethink if, after 4 weeks, fewer than half of activated analysts return weekly, or if the gate is mostly bypassed. Also stop if review notes show rubber-stamping, or if call-to-ready time rises without any change in disputed claims. Thresholds are placeholders to agree with the team before the pilot.

## Main risks
1. False confidence: "handoff-ready" read as "true". Mitigation: wording, the no-assurance notice and the gate rules ([risk](risk-privacy-mnpi.md)).
2. Friction: a gate that slows the deal team will be bypassed. Mitigation: a light gate (key-thesis and flagged claims only).
3. Structured-data dependency for v2 (see Feasibility).

## Recommendation
Run the 4-week pilot in [pilot-adoption-rollout.md](pilot-adoption-rollout.md) with 2–3 existing customer teams before investing in v2 extraction. The next decision: continue to v2 if review changes a meaningful share of claims and analysts return weekly.
