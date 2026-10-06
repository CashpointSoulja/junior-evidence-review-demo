# Risk, privacy and MNPI

This prototype gives **no investment, legal, compliance or MNPI assurance.** It uses synthetic data only and stores everything in the user's own browser.

## Risks and mitigations

| Risk | Where | Mitigation in prototype | Residual risk |
|---|---|---|---|
| "Handoff-ready" read as "verified true" | Gate, export | Copy says a reviewer checked claims against cited quotes; not advice or sign-off | Users may still over-trust the label |
| Rubber-stamping | Review | Notes required to accept over open checks; guardrail metric proposed | Determined users can still type a token note |
| Redaction read as anonymisation | Export | Selected strings only; preview + acknowledgement; residual-risk warning in UI and export | Indirect identifiers (title + employer + dates) remain |
| Expert identity exposure | Export | Optional redaction; identifiers listed explicitly | Not automatic |
| MNPI in a quote | Any | Out of scope; Junior advertises separate MNPI detection; nothing here claims to detect it | Prototype would export MNPI if present |
| Stored data on shared machine | localStorage | Synthetic data only; Reset clears state | A real version needs workspace storage and retention |
| Script injection via text | Claims, notes, guide | React renders text only; lint bans `dangerouslySetInnerHTML`; export escapes `<` and `>`; CSP self-only | — |
| Leading follow-up questions | Guide | Neutral templates; leading-language lint | Lint is pattern-based |

## Privacy

- No network requests, analytics, cookies or login. Fonts and logo are self-hosted.
- All names, firms, emails (`example.com`) and the phone number (UK drama range `+44 7700 900xxx`) are fictional.

## MNPI note

Expert calls in diligence can touch confidential information about a target or its competitors. In a real deployment the gate would sit *after* Junior's existing compliance controls, not replace them, and compliance would review the copy before launch.
