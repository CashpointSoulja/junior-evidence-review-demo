# Service blueprint: one diligence week

**Status:** assumed workflow, built on [weekly-analyst-workflow.md](weekly-analyst-workflow.md). Rows marked *(v1)* run in this prototype. Every other row describes how the service would work around it and is untested.

| Stage | Customer actions (associate) | Frontstage (what they see) | Backstage (system) | Support processes | Evidence it happened |
|---|---|---|---|---|---|
| 1. Calls captured | Runs expert calls; Junior records and transcribes | Junior call view | ASR and entity recognition (Junior's existing service) | Expert network supplies experts and compliance pre-clears them | Transcript with quote IDs and timestamps *(v1 uses synthetic transcripts)* |
| 2. Draft synthesis | Writes or imports claims, each citing quotes | Claims list with status chips *(v1)* | Citations resolved to quotes; deterministic checks run *(v1)* | none | `final_call_ingested` event *(v1)* |
| 3. Check claims | Opens a claim, clicks a source, reads the transcript | Claim detail, findings, metric comparison, source drawer *(v1)* | Scope, cohort, unit, period and contradiction rules *(v1)* | none | Findings on each claim *(v1)* |
| 4. Decide | Marks the claim supported, disputed or insufficient, with a note; edits the claim | Review form; edit history *(v1)* | Versioned edits; review reset on change *(v1)* | none | `claim_reviewed`, `claim_edited` *(v1)* |
| 5. Close gaps | Builds a follow-up guide from gaps and edits the questions | Gap queue, guide editor, leading-language warnings *(v1)* | Fixed templates filled per gap *(v1)* | Network books a follow-up call (outside the product) | `guide_created`, `guide_used` *(v1)* |
| 6. Gate | Approves as handoff-ready | Handoff gate with blockers *(v1)* | Fingerprint of claims; approval voided on change *(v1)* | none | `brief_approved` *(v1)* |
| 7. Share | Picks identifiers, previews the redaction, acknowledges the risk, exports | Redaction preview and residual-risk warning *(v1)* | Exact-string replacement only *(v1)* | Compliance review, outside the product | `brief_exported` *(v1)* |
| 8. Reuse | VP reads the brief; the library keeps checked claims | Markdown brief with source links *(v1)* | Not built: write-back to the library | Knowledge management | Not measured in v1 |

**Line of visibility:** the associate sees stages 2 to 7. Checks, fingerprinting and templates run behind the line. Stages 1 and 8 belong to Junior and the firm.

**Fail points to watch (hypotheses):**
- Stage 2: claims are written outside the product, so citations are never added.
- Stage 4: reviews get rubber-stamped, which shows up as "supported" with very short notes.
- Stage 7: redaction is trusted as anonymisation.
