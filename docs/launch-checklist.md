# Launch checklist

Status for this prototype in brackets. Production items are what I'd require for a real launch.

## Prototype (this repo)

- [x] Build, lint, typecheck and tests pass (see [test-results.md](test-results.md))
- [x] Desktop (1366px) and 390px screenshots reviewed
- [x] Keyboard path: skip link, tab order, source drawer focus and Escape
- [x] Synthetic labels on every view and in every export
- [x] Non-affiliation footer on every view
- [x] No network calls, no login, no API keys; CSP restricts to self
- [x] Reset restores the seed; corrupt storage is discarded
- [x] Secrets and private-context audit of files and history before push
- [ ] Public visibility (owner action)
- [ ] Hosted URL verified signed-out

## Production (if Junior built it)

- [ ] Feature flag and kill switch
- [ ] Events wired to analytics with the definitions in [metrics.md](metrics.md)
- [ ] Permission model: who can approve, who can see redaction terms
- [ ] Data retention follows workspace settings; redaction terms not logged
- [ ] Compliance review of copy: no assurance language
- [ ] Support macro and known-issues doc
- [ ] Triage owner for week 1 ([triage.md](triage.md))
- [ ] Release note reviewed by design and eng
