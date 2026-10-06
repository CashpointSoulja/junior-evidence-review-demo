# Founder one-pager: Evidence Review

Independent concept by Ayo Ahmed, not affiliated with Junior AI. Synthetic data only.

**Problem.** Junior's own writing says transcript errors "can introduce false claims, poison downstream research, and lose client trust" ([S3](source-ledger.md)). Accurate transcripts don't stop the synthesis step from copying a figure wrongly, generalising one segment to the whole base, or citing one expert while another disagrees.

**MVP call.** A pre-handoff gate on the synthesis. Deterministic checks compare each claim with its cited quotes and with every other quote on the same figure, and tell real contradictions apart from cohort differences. Risky claims need a human decision. Open gaps become a neutral, template-based guide for the next call. Export carries source links, status and synthetic labels, with optional selected-identifier redaction.

**Tradeoff.** Rules over models: explainable, free and testable, but only as good as the structured scope and period fields. I chose to block only on missing sources and to require a decision (not a block) on everything else, to limit review fatigue.

**What failed while building.**
- A 10% relative tolerance missed 91% vs 82% GRR as context (9.9%). Fixed: percentages now compare in points.
- Break-then-restore left the brief "approved" without re-review. Fixed: any claim change voids approval.
- At 390px the product name wrapped under the logo. Fixed.

**Measured (prototype only).** 44 automated tests pass. Build, lint and typecheck are clean. No horizontal overflow and no console errors on 8 views at 1366px and 390px. Results are in [test-results.md](test-results.md). **No user, adoption or time-saving data exists.**

**Unproven.** That analysts skip self-review today; that these checks catch errors they care about; that a gate is welcome rather than resented; that templates beat free-form questions; that the scope taxonomy matches how teams think.

**Next decision.** Run 6–8 discovery calls ([discovery-plan.md](discovery-plan.md)). If wrong figures or overgeneralisations reach VPs at least monthly, build the production slice (citation coverage plus source drawer on the real synthesis view) behind a flag for 2–3 pilot teams. If not, reposition as a speed tool for answering "where did this come from?".
