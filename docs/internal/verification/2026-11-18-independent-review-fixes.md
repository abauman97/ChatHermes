# Independent review fixes — 2026-11-18

> Screenshot paths below identify ignored local verification artifacts, not repository links.
> Captures are excluded from version control and may be absent from another checkout.

The four reported findings were reproduced before implementation changes. Work
continued in the existing dirty worktree, without commits, pushes, deployment,
resets, resource cleanup or replacement of retained containers. The adversarial
contracts were written separately from the implementation; no reviewer agent was
used.

## Reproduction and fixes

- The new frontend contract initially failed **10/14** cases. Hidden autolinks
  leaked their remaining characters; astral/multi-code-point atoms survived in
  part; image-label code failed to protect exact producer notes. Rendering 4,000
  disjoint hidden notes took **3,597 ms**, exceeding the 1,500 ms contract.
  Evidence: `tmp/independent-review-red-frontend.log`.
- Python initially failed **4/5** new cases: explicit outer links also indexed
  their nested image, automatic outer links used a different order, and both
  producer notes lost code protection in image labels. Evidence:
  `tmp/independent-review-red-python.log`.
- Suppression now treats equal source ends as one indivisible atom. All UTF-16
  units of entities, normalized automatic links and surrogate pairs are removed
  together when their original source overlaps hidden content. Original Markdown
  is still parsed once; concatenated visible fragments receive no new authority.
- Hidden intervals are sorted/merged once, searched by binary lookup and scanned
  only where relevant to a block. Newline coordinate normalization uses one
  source pass instead of rescanning every hidden-range prefix.
- Python records original delivery spans, visits explicit removal/automatic
  insertion positions in the frontend's order, and checks consumed ranges before
  registering nested files. Automatic outer labels retain eligible inner images.
- Both memory classifiers walk nested image children and rebase code spans from
  each label's local parser input into the original block source. Exact producer
  grammar, native text boundaries and trust classification remain intact.
- `source-projection-v8` makes the existing indexer reconcile previous metadata;
  checkpoint tests include `source-projection-v7`. No new store or runtime path
  was added.

The final independent frontend suite has **17 passing** cases, including
unsorted/overlapping ranges, individual surrogate units, nested labels, table
labels, legitimate delivery controls and 1,000/2,000/4,000 hidden-note sizes.
Python has separate literal adversarial cases. The mounted source workflow adds
hidden autolinks/entities, code-bearing image labels and a consumed private image
inside a public delivery, checking both transcript cards and Library metadata.

## Local validation

| Check                                                                  | Actual result                          |
| ---------------------------------------------------------------------- | -------------------------------------- |
| `uv sync --locked`                                                     | Passed; Python 3.14.4 environment      |
| `npm test`                                                             | **60 files / 1,990 tests passed**      |
| `PYTHONPATH=.hermes-source:plugin uv run pytest`                       | **759 passed**, 170.00 s               |
| `PYTHONPATH=.hermes-source:plugin npm run test:api`                    | **182 passed**, 9.29 s                 |
| `vp lint` and `vp fmt --check`                                         | Passed                                 |
| `uv run ruff format .`, `uv run ruff check --fix .`, `uv run ty check` | Passed                                 |
| `npm run build` / `npm run test:env:build`                             | Passed, including Vue/TypeScript build |

Logs use the `tmp/independent-review-` prefix. Final frontend, API, lint, format,
type and image-build logs have `final` in their names. Full Python evidence is
`tmp/independent-review-python.log`.

The first build caught two TypeScript nullability errors; they were fixed before
the successful final builds. The first API invocation omitted the documented
runtime `PYTHONPATH` and recorded **46 failed / 128 passed / 8 skipped**, chiefly
missing `hermes_cli` imports. The corrected invocation above passed all 182;
these early failures are retained in `tmp/independent-review-api.log`.

Final focused render measurements were **170.3 / 200.8 / 204.2 ms** for
1,000/2,000/4,000 disjoint notes (`tmp/independent-review-benchmark-isolated.log`).
A separate run during concurrent validation measured **230.9 / 275.4 / 484.2 ms**
(`tmp/independent-review-benchmark-final.log`). These are local wall-clock render
measurements with ordinary JIT/load variability, not end-to-end extraction times
or a general performance guarantee. Both runs passed the output and budget
assertions.

## Mounted validation

A separate deterministic project, `chathermes-independent-review-20261118`, uses
ports 24819/24880 and subnet `10.251.119.0/24`. The original project and its state
were left running. The remote Docker services are reached through a local
project-specific relay. Environment: `tmp/independent-review-env.sh`; explicit
build: `tmp/independent-review-env-build-final.log`.

The runner verifies Hermes revision
`2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19` and Compose image
`sha256:4a07e552838dfa70a08c46b4f879144b1896fdbdf6eac2dfa58117f19b4351f4`. Host and
container SHA-256 hashes match for the extractor, indexer, generated entry and
application bundle (`tmp/independent-review-{local,container}-hashes.txt`).

```sh
. tmp/independent-review-env.sh
npm run test:integration -- \
  tests/workflows/source-projection.spec.ts \
  tests/workflows/attachment-context.spec.ts \
  tests/workflows/memory-context.spec.ts \
  tests/workflows/markdown-context.spec.ts \
  --output=tests/visual-output/independent-review-final
```

The uninterrupted final run passed **28/28** in **7.9 minutes**: 14 desktop and
14 mobile, with no failures. Evidence: `tmp/independent-review-integration.log`.
The expanded source scenario passed on both viewports. Each source session
indexed exactly its two positive public files and no consumed private reference.
It checked original history preservation, resume/reload, hidden atomic text,
retained code/table grammar, two assistant cards, authenticated bytes,
wrong-profile rejection, composer focus, horizontal scrolling and Library parity.
The accompanying PDF/memory workflows checked live transport, attachments,
in-flight composer focus, at-least-16px selects, disclosure inspection and
stream/reconnect boundaries.

Visually inspected the desktop/mobile source user/code and answer captures,
desktop active PDF, mobile active/resumed PDF and mobile Library. Retained code,
public cards, assistant prose/table, activity order and composer remain readable;
hidden atoms and the consumed private reference are absent. Some captures after
programmatic scrolling omit host navigation controls, while others show them.
This retains the existing capture/ancestor-scroll limitation; no host geometry
or layout correction is claimed.

Selected inspected captures:

- Desktop source/code: `tests/visual-output/independent-review-final/source-projection-original-71b40-d-authorize-the-real-upload-desktop/source-reload.png`
- Desktop answer/cards: `tests/visual-output/independent-review-final/source-projection-original-71b40-d-authorize-the-real-upload-desktop/source-answer-reload.png`
- Mobile source/code: `tests/visual-output/independent-review-final/source-projection-original-71b40-d-authorize-the-real-upload-mobile/source-reload.png`
- Mobile answer/cards: `tests/visual-output/independent-review-final/source-projection-original-71b40-d-authorize-the-real-upload-mobile/source-answer-reload.png`
- Mobile active attachment: `tests/visual-output/independent-review-final/attachment-context-PDF-att-1b04e-ve-and-resumed-user-bubbles-mobile/attachment-context-active.png`
- Mobile Library: `tests/visual-output/independent-review-final/source-projection-original-71b40-d-authorize-the-real-upload-mobile/source-library.png`

## Boundaries

All fixtures are synthetic. This is presentation filtering, not deletion from
raw history or model context. Byte-identical authored producer blocks still lack
runtime provenance. Chromium desktop/mobile viewports do not establish behavior
on physical Android/iOS hardware, native keyboards/cameras or Electron. No real
provider test or unrelated full browser workflow suite is claimed.

Tracked generated assets were restored byte-for-byte from a pre-build snapshot;
ignored build output remains local. Generated dist assets are not staged or
committed. Containers, fixtures, logs and captures remain available for debugging.
