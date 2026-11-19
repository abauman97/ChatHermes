# Extraction scaling and image-alt quotation follow-up — 2026-11-18

> Screenshot paths below identify ignored local verification artifacts, not repository links.
> Captures are excluded from version control and may be absent from another checkout.

Continued the existing dirty worktree and preserved unrelated changes. No commits,
staging, deployment, push, reset, dependency changes or resource cleanup. A separate
synthetic Docker project preserves all previously retained environments and state.
This record covers the two independent-review findings; review of the correction
was performed in this agent, without a separate reviewer agent.

## Red regressions and correction

The initial frontend regression run failed **9 cases**: eight shared quotation
cases and extraction timing. Python failed the same **eight quotation cases**,
with two positive controls passing. A separate pre-fix extraction run measured
**824.0 / 2,183.2 / 7,412.8 ms** for 8k/16k/32k standalone exact notes beside
visible text and a legitimate MEDIA delivery. Logs:
`tmp/follow-up-red-frontend.log`, `tmp/follow-up-red-python.log` and
`tmp/follow-up-red-scaling.log`.

Frontend line projection now advances a cursor over ordered hidden intervals and
visits only overlaps with each line. It no longer scans every hidden interval
for every line. This retains partial lines, original offsets, source quotation
and legitimate delivery classification. The permanent extraction regression
checks all three sizes and output, with a 4-second budget per size. The original
32k case exceeds that budget. The first corrected run alongside Python checks
exceeded the initial 2.5-second budget at 16k; the final budget allows observed
runner/GC variation without accepting the reported quadratic 32k case.

Both delivery extractors walk nested inline tokens for code quotation. Image
labels have separate parser input; their code-line coordinates are rebased into
the parent input at each image nesting level before quotation checks. A multiline
MEDIA directive, attachment annotation or automatic path in image-alt code cannot
register a file. Eligible adjacent public deliveries remain available. The shared
`tests/fixtures/delivery-quotation.json` has **11 cases**, covering direct/nested
labels, nonzero line offsets, LF/CRLF, multiple code spans, preceding/following
deliveries and legitimate image delivery controls. Frontend tests cover delivery
and uploaded-file reconstruction; Python tests cover direct extraction and user/
assistant Library extraction. The same corpus passes in the built container with
pinned **markdown-it-py 4.0.0** (`tmp/follow-up-pinned-parity.log`).

The index revision is now `source-projection-v9` so normal reconciliation removes
previously registered paths. Migration tests cover v7/v8 and the prior automatic
revision with both memory-contained and image-alt-code private paths, retaining
the legitimate public file and profile isolation.

## Local gates

| Check                                                                  | Result                                            |
| ---------------------------------------------------------------------- | ------------------------------------------------- |
| `uv sync --locked`                                                     | Passed, Python 3.14.4                             |
| `npm test`                                                             | 60 files / **2,002 passed**                       |
| `PYTHONPATH=.hermes-source:plugin uv run pytest`                       | **774 passed**, 116.55 s                          |
| `PYTHONPATH=.hermes-source:plugin npm run test:api`                    | **182 passed**, 8.82 s                            |
| `vp lint`, `vp fmt`, `vp fmt --check`                                  | Passed                                            |
| `uv run ruff format .`, `uv run ruff check --fix .`, `uv run ty check` | Passed                                            |
| `npm run build` via explicit `npm run test:env:build`                  | Passed, including TypeScript/Vue and Docker build |

Logs use `tmp/follow-up-` prefixes. Full frontend validation includes the timing
regression. A separate corrected run while the browser workflows were running
measured **721.2 / 2,697.7 / 2,813.4 ms** (`tmp/follow-up-scaling-final.log`).
An additional warmed comparison against equal-length note-free controls measured
**463.9 / 859.6 / 1,785.4 ms** for notes and **165.3 / 331.9 / 765.1 ms** for
controls at 8k/16k/32k. Both track input size rather than the previous quadratic
note curve. The isolated benchmark configuration and contract are retained under
`tmp/follow-up-benchmark*`; log: `tmp/follow-up-benchmark-controls.log`.

These are local wall-clock measurements with JIT/GC/load variability; this fixes
the identified hidden-range scan, not a general guarantee of parser complexity,
backend throughput or end-to-end latency.

## Mounted validation

Project `chathermes-follow-up-review-20261118`, ports 24919/24980, subnet
`10.251.120.0/24`, environment `tmp/follow-up-env.sh`, with a project-specific
loopback relay for the remote Docker daemon. No retained project was replaced.
The explicit image build is
`sha256:9efac9b67497151e45fa6a36a5520955812045d30374468bf3cae7150ae26f4f`.
The runner verifies the pinned Hermes revision
`2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19` and this image identity. Host/container
SHA-256 hashes match for extractor, indexer, generated entry and application
bundle: `tmp/follow-up-{local,container}-hashes.txt`.

```sh
. tmp/follow-up-env.sh
npm run test:integration -- \
  tests/workflows/source-projection.spec.ts \
  tests/workflows/attachment-context.spec.ts \
  tests/workflows/memory-context.spec.ts \
  tests/workflows/markdown-context.spec.ts \
  --output=tests/visual-output/follow-up-review
```

Playwright reported **28/28 passed** (14 desktop, 14 mobile) in **7.8 minutes**,
with no failed tests. The retained `.last-run.json` says `passed` with an empty
failure list. The enclosing shell returned **143** after the successful summary;
its cause was not established, so this is not claimed as a clean zero-exit full
runner invocation. Log: `tmp/follow-up-integration.log`. The focused rerun of `tests/workflows/source-projection.spec.ts` passed
**2/2** in **43.3 seconds**, with shell exit **0**, against the same image and
preserved environment. Log: `tmp/follow-up-integration-focused.log`; captures:
`tests/visual-output/follow-up-review-focused/`. This confirms the final correction
on both viewports with an unambiguous successful command exit.

Desktop/mobile source/code, answer, active-attachment, quotation and Library
captures were inspected. Public cards, literal examples, table and composer remain
readable; the quoted private path has no file card or Library entry. Selected
captures:

- Desktop answer: `tests/visual-output/follow-up-review/source-projection-original-71b40-d-authorize-the-real-upload-desktop/source-answer-reload.png`
- Mobile answer: `tests/visual-output/follow-up-review/source-projection-original-71b40-d-authorize-the-real-upload-mobile/source-answer-reload.png`
- Mobile Library: `tests/visual-output/follow-up-review/source-projection-original-71b40-d-authorize-the-real-upload-mobile/source-library.png`
- Mobile active attachment: `tests/visual-output/follow-up-review/attachment-context-PDF-att-1b04e-ve-and-resumed-user-bubbles-mobile/attachment-context-active.png`
  The source workflow now names
  an existing synthetic private file in nested multiline image-alt code, retaining
  two legitimate public cards and requiring exactly those two public Library paths
  across resume/reload. Other scenarios cover uploads, profile isolation, downloads,
  focus, selects, scrolling, in-flight disclosure inspection and stream boundaries.

## Limits

Synthetic fixtures and Chromium desktop/mobile viewports do not establish physical
Android/iOS keyboard/camera behavior, Electron or real-provider behavior. No full
unrelated browser suite is claimed. Raw saved history remains unchanged; this is
presentation and artifact-authority classification, not source deletion. Exact
authored producer copies remain ambiguous without runtime provenance. This change
does not establish a general backend or Markdown complexity bound. The deliberately
invalid external image in the quotation reproducer displays its authored alt text,
including the synthetic path, when loading fails. Preventing file authority does
not remove ordinary authored example text or external-image behavior. Some
programmatically scrolled captures retain the existing host/capture geometry
limitation; no layout correction is claimed.

Tracked generated assets were restored to their exact pre-build bytes after local
validation; new build output remains ignored. `git diff --exit-code --
plugin/chathermes/dashboard/dist` passed, and the staging area remains empty. Containers, fixture state, failure
logs and screenshots remain available for debugging. No generated assets are
staged or committed. Final `git diff --check` and `vp fmt --check` passed.
