# Junior Evidence Review

**Independent concept by Ayo Ahmed, not affiliated with Junior AI.** A one-week product increment for the London Senior Product Manager role. All companies, people, calls and figures are synthetic.

Before a deal-team synthesis goes to a VP, IC or client, Evidence Review checks every claim against the exact expert quotes it cites. It also tells real contradictions apart from cohort differences. The brief can't be marked handoff-ready until every included claim has a source and every risky one has a human decision.

## What it does

- **3 synthetic expert calls** for a fictional PE software deal (former employee, customer, competitor). Each quote has an ID, timestamp, date, cohort, scope and, where relevant, a figure with unit and period.
- **Deterministic checks:** missing or broken citation, figure mismatch, unit or period mismatch, scope mismatch, real contradiction, cohort difference (shown as context), hedged source, and "experts agree" from one call.
- **Source click opens the transcript** at the quote.
- **Manual review:** supported, disputed or insufficient, with required notes. Edits are versioned and reset review.
- **Gap queue → template-based follow-up guide.** Questions are neutral, editable and tied to gaps. No live generation.
- **Handoff gate** with a break / fix / approve demo. Approval is voided by any later change.
- **Export** of brief and guide as Markdown, with source links, gaps, status and synthetic labels. Optional redaction of selected identifiers needs a human preview and shows a residual-risk warning.
- **Browser-local:** no login, no APIs, no network calls. State persists across refresh, and Reset restores the seed.

## Run

```bash
npm ci
npm run dev        # http://localhost:5173
npm run build && npm run lint && npm run typecheck && npm test
```

Node 22. Set `BASE_PATH=/junior-evidence-review-demo/` when building for a sub-path host. The GitHub Pages workflow in `.github/workflows/pages.yml` does this and only runs when started manually.

## Walkthrough video

[2-minute vertical walkthrough (MP4, 1080×1920, 1:48)](docs/video/junior-evidence-review-walkthrough.mp4). It is recorded from the live UI with voice and burned-in captions. A [transcript](docs/video/transcript.txt) and [captions (SRT)](docs/video/captions.srt) are alongside.

## Docs

| | |
|---|---|
| Product | [PRD](docs/PRD.md) · [ELI5](docs/ELI5.md) · [30-second pitch](docs/thirty-second-explanation.md) · [Five Whys](docs/five-whys.md) · [JTBD](docs/JTBD.md) |
| Users | [Hypothesis personas](docs/personas.md) · [User stories and acceptance criteria](docs/user-stories.md) · [Service blueprint](docs/service-blueprint.md) · [Assumed weekly workflow](docs/weekly-analyst-workflow.md) |
| Discovery | [Discovery plan](docs/discovery-plan.md) (no findings yet; nothing invented) |
| Decisions | [Scope and rejected alternatives](docs/scope-and-alternatives.md) · [Decision log](docs/decision-log.md) · [Viability memo](docs/viability-memo.md) |
| Data | [Evidence model](docs/evidence-model.md) · [Data dictionary](docs/data-dictionary.md) |
| Measurement | [Metrics](docs/metrics.md) · [Pilot, adoption and rollout](docs/pilot-adoption-rollout.md) |
| Delivery | [Roadmap and v2](docs/roadmap.md) · [First 30 days](docs/first-30-days.md) · [Launch checklist](docs/launch-checklist.md) · [Triage](docs/triage.md) |
| Quality | [Test plan](docs/test-plan.md) · [Test results (actual output)](docs/test-results.md) · [Screenshots](docs/screenshots/) |
| Risk | [Risk, privacy and MNPI](docs/risk-privacy-mnpi.md) |
| Context | [Founder one-pager](docs/founder-one-pager.md) · [Role-fit memo](docs/role-fit-memo.md) · [Source ledger](docs/source-ledger.md) · [Visual guide](docs/brand/VISUAL_GUIDE.md) · [Brand scrape](docs/brand/scrape/) |

## Notices

- Junior's name and logo belong to Junior AI. They appear only to show where the concept would sit, taken from <https://junior.ai/images/logo.svg>.
- Geist font © Vercel, SIL Open Font License 1.1 (`public/vendor/geist.LICENSE.txt`).
- Not investment advice. Not a compliance, legal or MNPI review. Redaction is not anonymisation.
- Code: MIT ([LICENSE](LICENSE)).
