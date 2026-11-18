# Original-source span review — 2026-11-18

> Screenshot paths below identify ignored local verification artifacts, not repository links.
> Captures are excluded from version control and may be absent from another checkout.

Continued the exact existing worktree and preserved its uncommitted implementation,
fixtures, documentation and user changes. No other worktree, upstream source,
dependency/lockfile, secret, staging, commit, push, PR or deployment changes.
Only the retained deterministic Compose project
`chathermes-attachment-context-20261118` was used, with ports 24719/24780,
`tmp/attachment-compose.yml` and the existing private loopback relay.
Containers, volumes, failed captures and synthetic fixture state are retained.

## Red evidence

Before redesign, `src/utils/source-projection.test.ts` recorded **5 failed / 1
passed**: attachment/memory table cells retained `PRIVATE` and an active attacker
image element; backtick/tilde fences and indented code lost `KEEP_THIS_CODE` across
truncation. Frontend retention of the upload after a memory-contained attachment
marker already passed. Python extraction of that same upload failed (**1 failed**).
These are renderer and extractor reproductions; no baseline browser network
capture is claimed. Logs: `tmp/source-projection-red-frontend.log` and
`tmp/source-projection-red-python.log`.

## Implementation and critical review

`markdown-source.ts` captures block provenance while Markdown still has its
container-adjusted positions, including individual table cells, escaped pipes,
repeated text, indentation/tab transformations, headings and code. Frontend block metadata stays in weak maps; native runtime blocks are untouched. Newline edges translate normalized parser offsets back
to original source coordinates. Finished token suppression retains partial code
as literal code and removes entirely hidden structures as balanced subtrees,
including terminal whitespace that carries no visible source authority.

Delivery removal and placements also use original spans, including deliveries
without memory. Visible fragments are never reparsed to establish active syntax.
Reference definitions are consumed from identical original bytes with an
eligibility callback, preserving parser context and duplicate-definition order.
Tables join code/list/quote examples in the non-delivery trust classification.
The Python table mapper supports the pinned parser's missing cell maps without
changing the parser's grammar. Its offset construction appends in one pass.

Python selects user attachment/warning cutoffs over memory-masked presentation,
matching the frontend, while retaining original offsets and classification.
Standalone exact notes and first-close handling of nested generated blocks are
aligned. `source-projection-v7` reconciles earlier Library metadata; native file
validation, deletion records, profiles, sessions, multipart images, runtime and
reconnect handling remain native.

Critical review was performed in this agent; no independent reviewer agent was
spawned. Review expanded observable contracts and found/fixed these regressions:

- Heading closing hashes require mapping the parser's actual heading content.
- Rule replacement clears Markdown paragraph-interruption alternatives unless
  explicitly preserved. Both languages now preserve them. A full frontend run
  exposed a list-rendering regression before the correction; the transcript
  contract and independent-parser corpus cover it.
- Unrelated retained empty code blocks must survive suppression beside memory.
  `tmp/source-projection-empty-code-red.log` records the failing regression.
- Definition maps include a terminal newline at Desktop's exact truncation
  boundary. Ignoring that newline must retain the original valid destination;
  marker/body bytes remain excluded. Shared fixtures recorded red first in
  `tmp/source-projection-reference-cutoff-red.log`.
- A hidden table's map can extend past its closing memory tag by whitespace.
  Mounted desktop/mobile scenarios and
  `tmp/source-projection-hidden-structure-red.log` caught its empty shell.

A further parity check reproduced two Python failures for memory openers after
Unicode whitespace (`tmp/source-projection-whitespace-red.log`). Python now
matches the frontend whitespace predicate exactly and starts the hidden range at
the opener. This prevents hidden-marker truncation and body authority from
diverging. The mounted case includes this prefix, and its two positive uploads
use distinct files so one delivery cannot conceal omission of the other.

Shared `tests/fixtures/source-projection.json` has 20 cases. Additional renderer
contracts cover each supported block family, both newline forms, original code,
empty blocks, quoted notes, native text prefixes at every arriving character and
replacement snapshot reconstruction. Existing profile/runtime, deduplication,
reference ownership and bounded parsing contracts remain in the full suites.

## Local validation

- `uv sync --locked`: passed; dependency and lock files unchanged.
- `npm test`: **1,973 passed**, 59 files; `tmp/source-projection-frontend-parity.log`.
- `PYTHONPATH=.hermes-source:plugin uv run pytest`: **753 passed**;
  `tmp/source-projection-python-parity.log`.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: **182 passed**;
  `tmp/source-projection-api-parity.log`.
- `npm run build`, through explicit `npm run test:env:build`: passed;
  `tmp/source-projection-env-build-parity.log`.
- `vp fmt`, `vp fmt --check`, `vp lint`: passed. Final logs use
  `tmp/source-projection-fmt-check-parity-final.log` and `tmp/source-projection-lint-parity-final.log`.
- `uv run ruff format .`, `uv run ruff check --fix .`, `uv run ty check`: passed;
  `tmp/source-projection-ruff-format-final.log`, `tmp/source-projection-ruff-final.log`,
  `tmp/source-projection-ty-final.log`.
- Pinned container `markdown-it-py 4.0.0`: **20 shared cases and original
  table-code provenance passed**, `tmp/source-projection-pinned-parser-parity.log`.
  Development uses its existing locked parser version; neither was changed.

An early API run concurrent with a build recorded **181 passed / 1 failed** for
an absent generated manifest. The stable-build rerun above passed. Asset-serving
API checks must run after generation, as now documented in the testing guide.

## Mounted validation

The final explicit build is
`sha256:9b518b27cc0ed8a101327f2439b23dce293a05d0c84ea11bf0bac8e20924f8ce`.
The integration runner verified Hermes revision
`2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19` and this image identity. Running
extractor/indexer and generated entry hashes matched the checkout build before
generated output restoration.

Intermediate image `53c395724aab` ran **26 passed / 2 failed** in 8.6 minutes;
its source-span scenario exposed the empty table shell. That run predates the
final review corrections and is not final-image validation. It remains in
`tmp/source-projection-integration.log` and
`tests/visual-output/source-projection-verified/`.

The first focused `ce51e642ffca` run recorded **1 passed / 1 failed**: mobile passed;
desktop passed presentation, authenticated downloads, profile rejection and raw
history, then the Library entry was absent at the 30-second polling deadline.
Failure state remains in `tmp/source-projection-integration-focused-final.log`
and `tests/visual-output/source-projection-focused-final/`. The new scenario now
uses the existing memory workflows' 75-second observable polling bound, without
fixed sleeps or resets. It additionally captures the visible assistant table.

The corrected rendering image `ce51e642ffca` subsequently passed **28/28** in
7.6 minutes (`tmp/source-projection-integration-complete.log`), before the final
Unicode-whitespace parity correction. The final combined run for image
`9b518b27cc0e` passed **28/28** (14 desktop, 14 mobile) in **7.9 minutes**,
with no failures in that uninterrupted run.
The retained invocation is:

```sh
. tmp/projection-env.sh
npm run test:integration -- \
  tests/workflows/source-projection.spec.ts \
  tests/workflows/attachment-context.spec.ts \
  tests/workflows/memory-context.spec.ts \
  tests/workflows/markdown-context.spec.ts \
  --output=tests/visual-output/source-projection-parity-final
```

Log: `tmp/source-projection-integration-parity-final.log`. The scenario checks the
actual React-mounted dashboard with authenticated history and native resume/reload,
original upload bytes, wrong-profile 404s, Library indexing, network attempts,
focus and scrolling. Existing workflows exercise real uploads, native model-picker controls,
tool disclosures, progressive streaming and
reconnect. No dashboard/session/file/inference API is browser-mocked; only
attacker-origin traffic is intercepted and counted before aborting it.

Inspected final desktop and mobile source reload/answer captures and Library
captures, plus desktop/mobile real PDF resumes and the desktop terminal memory
response. Retained `KEEP_THIS_CODE`, empty code, the visible original table,
public/reference uploads and composer remain readable. Each synthetic source
session indexes exactly its two distinct positive files, with no private entry
or attempted attacker-image request. Model-picker font/focus and completed tool
disclosure inspection remain covered by the real PDF workflows.

The mobile answer capture omits the host header after programmatic scrolling;
the user/code capture shows its title. This is the existing capture/ancestor
scroll-position limitation, not proof of stable host geometry at every instant.
No layout fix is claimed. Main content, composer and Library are painted and
readable in the inspected final captures.

Selected final captures:

- Desktop original source/code: `tests/visual-output/source-projection-parity-final/source-projection-original-71b40-d-authorize-the-real-upload-desktop/source-reload.png`
- Desktop retained answer/table: `tests/visual-output/source-projection-parity-final/source-projection-original-71b40-d-authorize-the-real-upload-desktop/source-answer-reload.png`
- Mobile original source/code: `tests/visual-output/source-projection-parity-final/source-projection-original-71b40-d-authorize-the-real-upload-mobile/source-reload.png`
- Mobile retained answer/table: `tests/visual-output/source-projection-parity-final/source-projection-original-71b40-d-authorize-the-real-upload-mobile/source-answer-reload.png`
- Mobile Library: `tests/visual-output/source-projection-parity-final/source-projection-original-71b40-d-authorize-the-real-upload-mobile/source-library.png`

The initially clean tracked generated assets were restored from their original
HEAD bytes after the builds; ignored output remains local. Final generated dist,
dependency/lockfile, reviewed upstream checkout and staging diffs are empty.
`git diff --check` passes. No cleanup/reset was performed; fixture state, prior
failure captures, logs and containers remain available for debugging.

## Limits

This is presentation filtering, not removal from raw authenticated history or
model context. Byte-identical authored copies of exact producer notes/blocks are
irreducibly ambiguous and remain suppressed. Desktop intentionally truncates
exact authored attachment/warning markers, including inside code. Other provider
rewrites do not widen the exact producer grammar.

Browser coverage uses Chromium desktop/mobile viewports, not Electron, real
Android/iOS hardware, native keyboards or real cameras. No real-provider tests
were run and no credentials were read. Upstream strips raw memory XML from live
deltas before the browser receives it in this pin; raw table/XML client-prefix
and snapshot cases are supplied directly by frontend contracts, while mounted
workflows verify the actual transport's notes, completion and reconnect behavior.
The complete unrelated browser workflow suite is not claimed.
