# Test results

Actual output from my own runs on 2026-10-06 (Linux, Node v22.23.3, Vitest 5.0.3, headless Chrome). Independent runs by anyone else are not recorded here unless they report them.

## Build, lint, typecheck, tests

```text
$ npm run build
dist/index.html                   0.84 kB │ gzip:  0.47 kB
dist/assets/index-xtSO7ns_.css   15.06 kB │ gzip:  3.57 kB
dist/assets/index-BNdfXa27.js   284.96 kB │ gzip: 88.41 kB
✓ built in 1.18s

$ npm run lint
> eslint .
(no findings, exit 0)

$ npm run typecheck
> tsc -b --noEmit
(no errors, exit 0)

$ npm test
 RUN  v5.0.3
 Test Files  2 passed (2)
      Tests  44 passed (44)

$ npm audit --omit=dev
found 0 vulnerabilities

$ npm audit
found 0 vulnerabilities
```

**Audit note:** the first run found 3 advisories (1 moderate, 2 critical), all in the dev-only test runner (`vitest` 3.2.7 → `@vitest/mocker`, `tinypool`). Upgrading to `vitest` 5.0.3 fixed all three. I then reran build, lint, typecheck and the full 44-test suite with no test or config changes needed. `npm audit` now reports 0 for both dev and production dependencies.

## Failures found and fixed during the build

| Failure | Cause | Fix |
|---|---|---|
| `approves once resolved, breaks…` expected `changed_since_approval`, got `approved` | Approval compared fingerprints only, so restoring a removed citation re-validated the old approval without re-review | Any claim action now voids approval (`decision-log.md` #7) |
| Gap test expected a missing-customer gap on pricing | Test was wrong: pricing already cites a customer quote. The missing-customer case is implementation | Test corrected |
| CL-1 showed no cohort context for the 82% small-firm GRR | 10% relative tolerance (9.9%) | Percent figures now compare in points (decision #4) |
| `tsc` could not find `process` in `vite.config.ts` | Missing Node types | Added `@types/node` |
| 390px header wrapped "Evidence Review" onto two lines | Too many header items | Project chip hidden at ≤520px; product name `nowrap` |

## End-to-end in a real browser (production build, `vite preview`)

Script drove the UI with Playwright against Chrome. It ran once at 1366×900 and once at 390-wide, with identical output:

```text
start: Blocked
first tab focus: Skip to content
CL-2 after edit+review history: 2
before approve: Ready to approve
after approve: Handoff-ready
after break: Changed since approval | blockers: 2
after fix: Changed since approval
re-approved: Handoff-ready
after reload: Handoff-ready | toast: Restored your review from this browser. Dismiss
guide questions: 10
download: project-kestrel-brief-approved.md 8341 bytes
export has status: true | synthetic: true | names left: [] | source link: true
deep link highlight: true
metrics: 5 / 7 | 0m 31s | 0 / 1 | 1 / 1
after reset: Blocked
third-party hosts requested: [] | page errors: []
```

Read as: the seeded brief is blocked. Resolving the claims makes it approvable. Removing a source breaks the gate (2 blockers: the citation, plus CL-1's review). Restoring the source still needs re-review and re-approval. State survives reload. The export carries status, synthetic labels and source links, and no selected names survive redaction. A source link from the export opens the highlighted quote. Reset returns the brief to blocked. No request left the origin. The "0m 31s" is the demo timer for the script's run, not a benchmark.

## Responsive and console

Headless Chrome at 1366×900 and 390×844 across 8 views (claims list, claim detail, source drawer, gaps, guide, export, metrics, call transcript):

```text
d … overflowX=0  (all 8 views)    d errors: []
m … overflowX=0  (all 8 views)    m errors: []
```

Screenshots: [`screenshots/`](screenshots/).

## Keyboard

- First Tab lands on "Skip to content" (e2e above).
- Keyboard-only review: focus radio → Space → Tab Tab → Enter saves (UI test).
- Source drawer: heading receives focus on open and Escape closes it (UI test). Focus returning to the opener is implemented but not asserted by a test.

## Not tested

- Screen readers (only roles and labels checked via Testing Library queries).
- Safari and Firefox.
- Real users. There are no usability or adoption results.

## Walkthrough video (recorded 2026-10-06)

The video was recorded from the running production build at 432x768 CSS px with device scale 2.5. It shows the live UI only, with a visible cursor, focus highlights and zooms. Captions are burned in. The MP4 is committed at `docs/video/junior-evidence-review-walkthrough.mp4`. Encoder SEI and container tags were stripped, and the file decodes cleanly.

Actual `ffprobe` output for `junior-evidence-review-walkthrough.mp4`:

```text
stream|codec_name=h264|codec_type=video|width=1080|height=1920|r_frame_rate=30/1
stream|codec_name=aac|codec_type=audio|sample_rate=48000|channels=2
format|duration=107.509000|size=17269378
mean_volume: -19.2 dB   max_volume: -1.9 dB
```

- `silencedetect` at -40 dB with a 1.5 s minimum found no silent stretches.
- Container metadata: only the `isom` brand tags remain. There is no title, encoder or tool tag.
- The transcript and timed captions are in `docs/video/transcript.txt` and `docs/video/captions.srt`.
