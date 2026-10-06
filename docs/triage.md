# Triage guide

## Severity

| Sev | Definition | Example | Response |
|---|---|---|---|
| S1 | Wrong "handoff-ready" status, or an identifier the user selected appears in an export | Gate passes with an uncited claim; selected name not redacted | Disable export via flag; fix same day |
| S2 | A check misfires in a way that could mislead | Cohort difference labelled as contradiction, or the reverse | Fix within the weekly cycle; add a regression test |
| S3 | Workflow friction | Drawer scroll position wrong on mobile | Backlog, batch weekly |
| S4 | Cosmetic | Tag wraps awkwardly | Backlog |

## Intake

1. Reproduce on the synthetic project if possible (Reset, then steps).
2. Capture: route (`#/…`), claim ID, quote IDs, browser, viewport.
3. Check whether it's a rule bug (`src/engine/checks.ts`), a gate bug (`readiness.ts`), or UI.
4. Write the failing test first in `test/engine.test.ts` or `test/ui.test.tsx`.

## Known limitations (not bugs)

- Redaction is exact-string only.
- Metrics are local to one browser.
- Checks rely on structured scope and period fields; they don't read meaning.
