# Role-fit memo: Senior Product Manager, London

Ayo Ahmed. Independent concept, not affiliated with Junior AI. Role facts from [S1](source-ledger.md).

## What the role asks for, and what this repo shows

| The role asks for (S1) | Evidence in this repo |
|---|---|
| Own the core research workflow end to end | One complete workflow: claims → sources → decision → gaps → guide → gate → export |
| Problem discovery | The problem comes from Junior's own public writing (S3). A [discovery plan](discovery-plan.md) is given instead of invented findings |
| MVP scoping, "MVP done, not perfect" | [Scope and rejected alternatives](scope-and-alternatives.md); deterministic rules instead of models |
| Ship one major feature per week | Sized as a one-week increment; [launch checklist](launch-checklist.md) |
| QA, bug triage, release readiness | [Test plan](test-plan.md), [actual results](test-results.md), [triage](triage.md) |
| Usage metrics, adoption curves | [Metrics](metrics.md) with numerators, denominators and windows, computed live, no invented baseline |
| Sample projects: interview guides, call anonymisation | Gap-driven guide; selected-identifier redaction with honest limits |
| Keep stakeholders aligned through conversation, not documents | The docs are an audition artefact. In the job I'd keep the [30-second explanation](thirty-second-explanation.md) and decision log, and do the rest live |

## Why this problem

Junior has invested in transcript accuracy (S3) and in showing sources (S2). The next place an error gets into a client's research is the synthesis. Evidence Review is a narrow way to close that last step without rebuilding any of Junior's pipeline.

## What I would do differently with access

- Use real structured call data and Junior's entity recognition instead of seeded fields.
- Replace the assumed workflow with what customers actually do.
- The JD frames guide generation as "AI-assisted". I'd test model suggestions behind the same human gate, and measure their precision before launch.

## Gaps in this application

- No Junior customer conversations (by design: no outreach).
- Not tested with real analysts. Usability claims are limited to keyboard and responsive checks.
