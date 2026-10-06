# Decision log

| # | Date | Decision | Options considered | Why | Revisit when |
|---|---|---|---|---|---|
| 1 | 2026-10-06 | Build pre-handoff evidence review, not a new capture or summary feature | Interview-guide generator; anonymisation tool; evidence review | Junior's public writing names false claims reaching research as a risk; it touches two JD sample projects (guides, anonymisation) without replacing either | Discovery D3 shows errors are rare |
| 2 | 2026-10-06 | Deterministic checks on structured quote fields | LLM judge; keyword matching | Explainable, testable, free, no hallucination | Structured fields aren't available in production |
| 3 | 2026-10-06 | Distinguish contradiction (same scope and period) from cohort or period difference | Flag every differing figure | Flagging every difference is noise; cohort differences are often the insight | Card sort (D5) disagrees |
| 4 | 2026-10-06 | Percent figures compare in absolute points (>1pt); other units relative (>10%) | Single 10% relative rule | First version with 10% relative missed 91% vs 82% GRR (9.9% relative); points match how analysts read rates | Users want configurable tolerance |
| 5 | 2026-10-06 | Only missing/broken citations block outright; key-thesis and flagged claims need a decision | Block on all findings | Review fatigue | Pilot shows rubber-stamping |
| 6 | 2026-10-06 | Notes required to dispute, mark insufficient, or accept over open checks | Notes optional | Makes accept-over-flag a deliberate, visible act | Users find it heavy |
| 7 | 2026-10-06 | Any claim change voids approval, even if reverted | Compare fingerprints only | A break-then-restore originally left the brief "approved" without re-review; voiding is the safer default | Never, for handoff semantics |
| 8 | 2026-10-06 | Template-based guide with leading-language lint | Free text only; generated guide | Neutrality and auditability | D6 shows templates too generic |
| 9 | 2026-10-06 | Redaction = selected exact strings, preview + acknowledgement + warning | Auto-detect names | Honest about limits; avoids implying anonymisation | Integrate with Junior's existing redaction/NER |
| 10 | 2026-10-06 | Browser-local storage, no login | Backend | No spend, no real data, instant demo | Pilot |
