# Test plan

Automated tests in `test/` (Vitest + Testing Library, jsdom). Manual checks with headless Chrome screenshots. Results: [test-results.md](test-results.md).

| Area | Cases | Type |
|---|---|---|
| Provenance | every quote has ID, ts, date, cohort, scope; missing and broken (incl. interviewer) citations; figure mismatch; hedged; single-source consensus; clean control | unit |
| Contradiction vs cohort | same scope + period = contradiction; other scope or period = context; percent tolerance | unit |
| Scope mismatch | generalised claims flagged; cleared on narrowing | unit |
| Readiness | seeded brief blocked; approve refused; disputed/insufficient block; note rules; approve → break → fix → re-review → re-approve | unit |
| Edit lineage | version fields, prior review, review reset, citation and figure edits, no-op ignored | unit |
| Gaps and guide | priority order; links; updates after fix; template-only, tied to gaps, no placeholders, neutral; edits kept on regenerate | unit |
| Export labels | synthetic, no-assurance and affiliation labels; draft vs approved status; source links; gaps; guide; residual risk; excluded claims; history | unit |
| Redaction | selected only; longest first; word boundaries; regex characters; links intact | unit |
| XSS as data | payload in claim text, edit reason and review note escaped in export; not rendered as markup in UI | unit + UI |
| Persistence | round trip; corrupt and wrong-schema discarded; reset; remount restores | unit + UI |
| UI | logo src and alt; footer; source click opens drawer with focus and highlight; Escape closes; deep link `#/source/…`; keyboard-only review; preview + acknowledgement gate | UI |
| Responsive | 1366×900 and 390×844 on all views; no horizontal overflow; no console errors | manual (headless Chrome) |
| Build hygiene | `npm run build`, `lint`, `typecheck`, `test`; `npm audit` | CI-style local run |
