# Source ledger

Every statement about Junior AI or the role in this repo traces to a public page below, read on 2026-10-06. Anything not listed here is my assumption or synthetic data.

| # | Source | What it supports | Used in |
|---|---|---|---|
| S1 | Senior Product Manager, London: <https://jobs.ashbyhq.com/junior/b0035c57-0cc0-4dff-a0c3-dc37579f29a7> | £110K–£125K plus equity; owns "the core research workflow end to end"; "shipping 1 major feature per week and driving measurable adoption"; customer calls with PE firms and consultancies; QA, bug triage, launch checklists; usage metrics and adoption curves; sample projects: interview guide generation, live transcription, call anonymization; "MVP done, not perfect"; alignment "through direct conversation, not documents" | role-fit memo, PRD, founder one-pager |
| S2 | Junior homepage: <https://junior.ai/> | Voice intelligence for M&A; call types; pipelines from expert networks; Alexandria as "custom conversational library"; JuniorGPT "shows exactly where each insight" comes from (testimonial); retention controls; "Programmatic MNPI detection" | PRD, risk doc, roadmap |
| S3 | "Solving the ASR Accuracy Gap in Due Diligence": <https://junior.ai/resources/solving-the-asr-accuracy-gap-in-due-diligence> | "Errors can introduce false claims, poison downstream research, and lose client trust"; "a plausible sentence that was never spoken could make its way into a client's research"; entity accuracy raised from 75% to 97%, "The remaining 3% are the hard cases" | PRD problem, Five Whys, founder one-pager |
| S4 | "Supervisor Takeover for Athena, an Autonomous AI Interviewer": <https://junior.ai/resources/supervisor-takeover-for-athena> | Athena exists as an autonomous AI interviewer with human supervisor takeover | roadmap |
| S5 | Junior resources index: <https://junior.ai/resources> | Index of the articles above | — |
| S6 | Junior logo: <https://junior.ai/images/logo.svg> | Literal logo used top-left (SHA-256 recorded in [brand/VISUAL_GUIDE.md](brand/VISUAL_GUIDE.md)) | app header |
| S7 | Junior production stylesheet (via homepage) | Colour, radius and type tokens (raw list in `brand/scrape/css-custom-properties.txt`) | `src/styles/tokens.css` |
| S8 | Geist font, npm package `geist` (SIL OFL 1.1) | Self-hosted font matching the site | `public/vendor/` |

## Not sourced (explicitly)

- The weekly analyst workflow: assumption.
- Pain-point frequency and severity: unknown; to be measured in discovery.
- All calls, people, firms, figures, emails and phone numbers: synthetic.
- No Junior customer, employee or user was contacted for this work.
