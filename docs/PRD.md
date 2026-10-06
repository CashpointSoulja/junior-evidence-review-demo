# PRD: Evidence Review (one-week increment)

Independent concept by Ayo Ahmed, not affiliated with Junior AI. All data in the prototype is synthetic. Statements about Junior come from its public pages (see [source-ledger.md](source-ledger.md)); everything else is a hypothesis.

## Problem

A deal team runs several expert calls, then someone writes the synthesis that goes to the partner, the investment committee or the client. Junior's own engineering writing says transcription and entity errors "can introduce false claims, poison downstream research", and that a rare hallucinated sentence could reach a client's research. Junior already shows supporting sources. The open problem is the step between "a claim has a citation" and "the cited words actually support the claim, for that scope and period, and nobody contradicted it".

Today (assumed, not observed) that check is done by hand, by re-reading transcripts, if it is done at all. The cheap failures are:

- a figure copied wrongly (15% where the expert said 12%);
- a segment figure generalised to the whole base ("retention is strong across all segments" from mid-market quotes);
- two experts disagreeing on the same figure, with only one of them cited;
- a hedged guess presented as fact;
- "experts agree" resting on one call;
- a claim with no source at all.

## Users

- **Primary:** associate or analyst at a PE fund or consultancy who owns the synthesis for a workstream (assumed weekly workflow in [weekly-analyst-workflow.md](weekly-analyst-workflow.md)).
- **Secondary:** the VP or partner who receives the brief and needs to trust it without re-reading every call.

## Goal of this increment

Before a synthesis is marked handoff-ready, every included claim has a valid source, every risky claim has a human decision, and the remaining gaps turn into a neutral follow-up guide for the next call.

## Scope (shipped)

1. **Evidence model:** 3 synthetic calls (former employee, customer, competitor) with exact quotes carrying ID, timestamp, date, cohort, scope, and where relevant a figure with unit and period.
2. **Claim checks (deterministic):** missing or broken citation; figure not in source; figure differs; unit or period mismatch; scope mismatch; real contradiction (same scope and period); different cohort or period (shown as context, not a contradiction); hedged source; "experts agree" from one call.
3. **Source click opens the transcript** at the quote (drawer on desktop, full sheet on mobile, deep link `#/source/<quote-id>`).
4. **Manual review:** supported, disputed or insufficient. A note is required to dispute, to mark insufficient, or to accept over open checks.
5. **Edit with lineage:** every text, scope, figure, type, citation or inclusion change creates a version. Edits clear the previous review.
6. **Gap queue** per diligence question: conflict, no evidence, reviewer-flagged, scope, missing cohort, single source.
7. **Template-based follow-up guide:** fixed neutral templates filled from gap fields; editable, reorderable, with a leading-language check. No model writes questions.
8. **Handoff gate:** blocked while any included claim lacks a valid citation, has a required review outstanding, or is disputed/insufficient. Approval is voided by any later claim change.
9. **Export:** Markdown brief and guide with source links, checks, gaps, edit history, status and synthetic labels. Optional redaction of selected identifiers, with a human preview, an acknowledgement step and a residual-risk warning.
10. **Browser-local:** localStorage persistence, refresh-safe, reset to seed, no login, no network calls.

## Out of scope

See [scope-and-alternatives.md](scope-and-alternatives.md). In short: no transcription, no model-based claim extraction or rewriting, no multi-user review, no integration with Junior's data, no compliance or MNPI determination.

## Requirements and acceptance

| ID | Requirement | Acceptance (tested in `test/`) |
|---|---|---|
| R1 | Uncited or broken citation blocks handoff | `MISSING_CITATION`, `BROKEN_CITATION` are blocking; approval refused |
| R2 | Same-scope, same-period conflicting figure is a contradiction | CL-3 vs QC-03 |
| R3 | Different cohort/period is context, not contradiction | CL-3 vs QB-02, CL-1 vs QA-03/QC-04 |
| R4 | Claim broader than its evidence is flagged | CL-2, CL-6; cleared when narrowed |
| R5 | Required review must be resolved; disputed/insufficient block | readiness tests |
| R6 | Edits create versions and reset review | lineage tests |
| R7 | Guide questions come only from templates and are tied to gaps | guide tests |
| R8 | Export carries status, source links, gaps and synthetic labels | export tests |
| R9 | Redaction replaces only selected terms; preview and acknowledgement required | export + UI tests |
| R10 | Text is rendered and exported as data | XSS tests; lint bans `dangerouslySetInnerHTML` |
| R11 | Refresh restores state; corrupt state is discarded; reset works | persistence tests |
| R12 | Usable by keyboard and at 390px | UI test + screenshots in [test-results.md](test-results.md) |

## Metrics

See [metrics.md](metrics.md). Primary: sourced accepted claims / reviewed claims. Speed: final call to handoff-ready. Adoption: weekly returning / activated analysts. Guide value: guides used / guides created.

## Risks

See [risk-privacy-mnpi.md](risk-privacy-mnpi.md). The biggest product risk is review fatigue: if too many checks fire, analysts will click "supported" to clear the gate.
