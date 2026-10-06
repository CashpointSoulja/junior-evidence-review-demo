# User stories with acceptance criteria

Each story maps to code and tests that ship in this increment. "Test" names the file where the acceptance criteria are asserted. Results are in [test-results.md](test-results.md).

## US-1 Provenance on every quote
As an associate, I want each quote to carry its call, timestamp, date, cohort and scope, so I can judge how much weight it carries.
- **AC1:** Every quote in the 3 synthetic calls has an ID, `ts`, call date, cohort and scope. A figure, if present, has a value, unit and period.
- **AC2:** Citation chips show quote ID, call ID, timestamp and cohort.
- Test: `test/engine.test.ts` (provenance).

## US-2 Source opens the transcript
As an associate, I want clicking a source to open the transcript at that quote, so I can read it in context.
- **AC1:** Clicking a citation opens the transcript drawer with that quote highlighted.
- **AC2:** `#/source/<quote-id>` deep-links to the same view.
- **AC3:** The drawer's heading takes focus on open, and Escape closes the drawer.
- Test: `test/ui.test.tsx`. End-to-end check in test-results.

## US-3 Contradiction vs cohort difference
As an associate, I want real conflicts kept separate from figures about different cohorts, so I don't chase false alarms or miss real ones.
- **AC1:** The same metric, scope and period with a material difference raises `CONTRADICTION`, which needs review.
- **AC2:** A different scope or period raises `COHORT_DIFFERENCE`, which is informational only.
- **AC3:** A claim scoped wider than its cited quote raises `SCOPE_MISMATCH`.
- Test: `test/engine.test.ts`.

## US-4 Manual review
As an associate, I want to mark claims supported, disputed or insufficient, so a human decision is recorded.
- **AC1:** The three statuses can be set from the keyboard alone.
- **AC2:** Disputed and insufficient require a note. So does supported when the claim has open findings.
- Test: `test/engine.test.ts`, `test/ui.test.tsx` (keyboard-only review).

## US-5 Edit lineage
As a VP, I want to see how a claim changed, so I can trust the final wording.
- **AC1:** Every edit appends a version with time, change type, reason, text, citations and the previous review status.
- **AC2:** An edit clears the review decision.
- Test: `test/engine.test.ts`.

## US-6 Handoff gate
As a VP, I want "handoff-ready" to mean the evidence was checked, so the status is worth trusting.
- **AC1:** Approval is refused if any included claim has a missing or broken citation, an unresolved required review, or a disputed or insufficient status, or if the brief is empty.
- **AC2:** Any change to a claim after approval moves the status to "changed since approval". The approval stays invalid even if the change is reverted, until someone approves again.
- **AC3:** The break / fix / approve demo works in the UI.
- Test: `test/engine.test.ts`. End-to-end check in test-results.

## US-7 Gap-driven follow-up guide
As an associate, I want follow-up questions generated from open gaps, so the next call closes them.
- **AC1:** Gaps are ordered conflict first, then no evidence, unresolved review, scope, cohort-limited and single-source.
- **AC2:** The guide is filled from fixed templates and labelled as template-based. No model calls are made.
- **AC3:** Questions can be edited, reordered, removed and added. Rebuilding keeps edits. Leading wording is flagged.
- Test: `test/engine.test.ts`.

## US-8 Export with labels and redaction
As an associate, I want to export the brief and guide with sources and clear labels, and to redact the identifiers I choose.
- **AC1:** The export includes the synthetic label, the no-assurance notice, the non-affiliation line, readiness status, source links, findings, gaps, the guide and edit history.
- **AC2:** Download and copy stay disabled until a current preview has been shown and the residual-risk warning acknowledged.
- **AC3:** Custom terms are matched as literal strings, not regex.
- Test: `test/engine.test.ts`, `test/ui.test.tsx`.

## US-9 Safe rendering, local state, reset
- **AC1:** Script-like text in sources is shown as text. The Markdown export escapes `<` and `>`.
- **AC2:** State persists across refresh. Corrupt storage falls back to the seed data. Reset restores the seed.
- **AC3:** No network requests leave the app, and it works at 390 px wide without horizontal scrolling.
- Test: `test/engine.test.ts`, `test/ui.test.tsx`. End-to-end check in test-results.
