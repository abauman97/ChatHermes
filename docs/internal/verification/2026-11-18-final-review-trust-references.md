# Final review: quoted trust tags and reference scaling — 2026-11-18

> Screenshot paths below identify ignored local verification artifacts, not repository links.
> Captures are excluded from version control and may be absent from another checkout.

Continued the existing dirty worktree, preserving prior work. No commit, staging,
push, deployment, reset or resource cleanup. Verification uses a new isolated
deterministic Compose project; earlier projects and their state remain available.

## Red regressions and fixes

The frontend and Python red runs each failed **eight tests**: seven shared
quoted-closing-tag cases and the reference scaling regression. Closing tags in
direct/nested image-alt code incorrectly ended trust blocks for untrusted tool
results, thinking and code wrappers, with LF and CRLF. Trusted duplicate-reference
controls passed. Logs: `tmp/final-review/red-{frontend,python}.log`.

| Definitions | Frontend before | Python before | Frontend corrected | Python corrected |
| ----------- | --------------- | ------------- | ------------------ | ---------------- |
| 2,000       | 659.4 ms        | 485 ms        | 78.7 ms            | 137 ms           |
| 4,000       | 2,734.3 ms      | 3,509 ms      | 114.9 ms           | 282 ms           |
| 8,000       | 11,644.2 ms     | 6,140 ms      | 227.6 ms           | 555 ms           |

These are local wall-clock measurements, with JIT/GC and machine-load variation.
Corrected logs: `tmp/final-review/frontend-final.log` and
`tmp/final-review/python-final-focused.log`. Permanent tests assert output, first
eligible duplicate authority, absolute timing budgets and bounded doubling growth
at 2k/4k/8k. No timing budget was relaxed.

Both trust classifiers now walk all inline descendants, including image labels.
Original bytes and offsets remain unchanged. Both reference rules parse each
definition into a temporary one-definition map and merge only eligible entries,
retaining the first eligible normalized label. Python retains duplicate metadata.
Sorted original-source exclusion starts and prefix maximum ends replace repeated
whole-source scans with logarithmic overlap queries. Index construction is
O(N log N); map insertion does not copy accumulated definitions.

The shared `tests/fixtures/delivery-quotation.json` now has **23 cases**, including
the exact reported reproducer, nested labels, quoted openers, LF/CRLF, explicit
public controls and excluded/trusted duplicate-reference ordering. Frontend
delivery/upload reconstruction and Python direct/user/assistant extraction consume
the same corpus. New placement assertions check original-source offsets.
All 23 cases also pass inside the built Hermes container with pinned
markdown-it-py **4.0.0** (`tmp/final-review/pinned-parity.log`).

Index revision `source-projection-v10` triggers normal reconciliation of previous
registrations. Worker tests include v9 and earlier revisions, the exact quoted
trust-close reproducer, retained legitimate delivery and profile isolation.

## Validation

| Check                                                                  | Final result                                                                                        |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `uv sync --locked`                                                     | Passed, Python 3.14.4                                                                               |
| `npm test -- --disableConsoleIntercept`                                | 60 files / **2,015 passed**, exit 0                                                                 |
| `PYTHONPATH=.hermes-source:plugin uv run pytest`                       | **793 passed**, exit 0                                                                              |
| `PYTHONPATH=.hermes-source:plugin npm run test:api`                    | **182 passed**, exit 0                                                                              |
| Complete focused artifact suites                                       | **559 frontend cases** (all functional cases passed; see timing rerun below), **354 Python passed** |
| `vp lint`, `vp fmt`, `vp fmt --check`                                  | Passed                                                                                              |
| `uv run ruff format .`, `uv run ruff check --fix .`, `uv run ty check` | Passed                                                                                              |
| `npm run build` through explicit `npm run test:env:build`              | Passed, including TypeScript/Vue and Docker build                                                   |
| `git diff --check`; tracked generated asset comparison                 | Passed                                                                                              |

Logs use the `tmp/final-review/` directory. The complete frontend rerun contains
all final cases and supersedes the focused run's timing failure. No tests were
removed or thresholds changed. Logs and retained containers remain available
for debugging.

One focused frontend run during competing validation work failed the existing
32k hidden-note budget: 4,809 ms against 4,000 ms. Its new definition-scaling
regression passed at 118.8 / 216.5 / 371.0 ms. The subsequent complete frontend
run measured hidden notes at 581.2 / 1,000.2 / 2,043.1 ms without changing the
threshold. The failed run is retained in
`tmp/final-review/frontend-final-focused.log`.

## Mounted dashboard verification

The broader command selected all four relevant workflow files on desktop and
mobile:

```sh
. tmp/final-review/env.sh
npm run test:integration -- tests/workflows/source-projection.spec.ts \
  tests/workflows/attachment-context.spec.ts tests/workflows/memory-context.spec.ts \
  tests/workflows/markdown-context.spec.ts --output=tests/visual-output/final-review
```

It recorded **26 passing cases, one failure and one unfinished case**, then the
runner exited **143** before a final summary. Its termination cause was not
established. Do not interpret this as a clean full-suite pass.
`tmp/final-review/integration.log` and captures are retained. The desktop
memory-stream reload scenario observed a transient malformed producer-note
prefix containing `Treahoritati`; its exact-note assertion failed. This review
did not establish that failure's root cause or change streaming reconciliation.
Mobile passed the same scenario during the broad run.

The final focused command reruns that scenario and the changed source-projection
workflow on both viewports, without changing assertions or resetting state:

```sh
. tmp/final-review/env.sh
npm run test:integration -- tests/workflows/source-projection.spec.ts \
  tests/workflows/memory-context.spec.ts --grep 'native deltas|original-source spans' \
  --output=tests/visual-output/final-review-focused
```

It passed **4/4** in **1.9 minutes**, with shell exit **0**. Both desktop and mobile
passed the memory-stream scenario and the trust/reference regression. Log:
`tmp/final-review/integration-focused.log`; its `.last-run.json` reports `passed`
with no failed tests. This successful rerun does not establish the root cause of
the earlier intermittent streaming failure.

The source workflow seeds the actual quoted trust closure beside an existing
synthetic private file, an untrusted definition followed by 256 trusted reference
definitions and a later duplicate private destination. It requires exactly the
two public cards and Library paths after resume/reload, checks authenticated
downloads/profile rejection and focuses the composer. The other selected
workflows check scrolling, uploads, selects and active/completed disclosures.

Desktop/mobile answer and active-attachment captures were inspected. Broken
external-image alt text and the private path remain ordinary example text; no
private file card is present. Desktop/mobile Library screenshots show the two
public files. Selected inspected captures:

- Desktop answer: `tests/visual-output/final-review/source-projection-original-71b40-d-authorize-the-real-upload-desktop/source-answer-reload.png`
- Mobile answer: `tests/visual-output/final-review/source-projection-original-71b40-d-authorize-the-real-upload-mobile/source-answer-resume.png`
- Mobile Library: `tests/visual-output/final-review-focused/source-projection-original-71b40-d-authorize-the-real-upload-mobile/source-library.png`
- Mobile active attachment: `tests/visual-output/final-review/attachment-context-PDF-att-1b04e-ve-and-resumed-user-bubbles-mobile/attachment-context-active.png`

The scrolled answer captures retain the existing host/capture geometry
limitation near the composer; no layout change is claimed.

## Environment and limits

Project `chathermes-final-review-20261118`, ports 25019/25080, subnet
`10.251.122.0/24`; environment: `tmp/final-review/env.sh`. A project-specific
loopback relay reaches the remote Docker daemon. The explicit
`npm run test:env:build` build produced image
`sha256:2e75db5ff17b8ebe338ca91ef635e7bf987ec67f51e4982a6797ce374f249414`.
The integration runner verifies this image and the reviewed Hermes source pin
`2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19`. Local/container extractor, indexer and
generated entry hashes match (`tmp/final-review/{local,container}-hashes.txt`).
Tracked generated assets were restored to their pre-build bytes from a local
archive; new generated output remains ignored. No generated assets are staged.

This verifies the identified extraction regressions, not a general Markdown
complexity bound. Synthetic Chromium desktop/mobile viewports do not establish
physical Android/iOS keyboard or camera behavior, Electron or real-provider
behavior. No full unrelated browser suite is claimed. Raw history is preserved;
quoted private path text may remain visible as ordinary example text without
acquiring file-card, download or Library authority.
