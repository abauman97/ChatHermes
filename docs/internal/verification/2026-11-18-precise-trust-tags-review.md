# Precise trust tags and hidden-reference rendering review

> Screenshot paths below identify ignored local verification artifacts, not repository links.
> Captures are excluded from version control and may be absent from another checkout.

No commits, staging, deployment, cleanup or destructive reset was requested or performed.
The existing working tree was retained.

## Changes and scoped review

P1: frontend and Python trust classification now protect individual original-source
code spans instead of marking a whole inline paragraph literal. Real openers and
closers beside quoted tags still change trust depth. Fences, code blocks, tables,
quotes and lists retain their structural exclusions. Image-label code offsets
are rebased before projection; CRLF offsets and native boundaries retain their
original-source coordinates. No masked or concatenated Markdown becomes a new
source of reference authority.

Frontend extraction uses the existing block provenance tracker. Python captures
paragraph, setext/ATX-heading and table input while the block parser still owns
container-adjusted offsets; memory masking now consumes those offsets too,
removing its substring-search fallback. Runtime parser revision
`source-projection-v11` forces reconciliation of old Library records. Tests cover
v10 records as well as earlier checkpoints.

P2: rendering with hidden ranges parses each reference definition into a null
prototype scratch map, restores the accumulated map in `finally`, and merges
only an eligible first definition. This removes the accumulated-map copy per
definition. Hidden-first, visible-first, duplicate, mixed-case, Unicode and
prototype-like labels retain their expected reference semantics.

The sibling review covered frontend delivery/reference parsing, nested image
labels, native projections, memory protection, Python equivalents and persisted
index revision handling. The delivery extractors already used bounded scratch
maps; frontend extraction now also initializes those maps without a prototype.
This is a scoped review of authority/provenance and reference-map scaling, not
a claim that arbitrary Markdown has a universal complexity bound.

## Reproductions and checks

- Red frontend: 18 precise-tag cases selected the private definition; the 8k
  hidden-source definition render took 10,047.9 ms. Log:
  `tmp/precise-review-red-frontend.log` (19 failed / 577 passed).
- Red Python: all 18 original precise-tag cases failed. Log:
  `tmp/precise-review-red-python.log`.
- Shared `tests/fixtures/precise-trust-tags.json` now has 26 cases, including both
  marker directions, quoted multiline/image labels, LF/CRLF and explicit or
  assistant-only automatic delivery. User upload expectations remain explicit-only.
- Full frontend, sequential: 2,047 passed in 60 files;
  `tmp/precise-review-frontend-sequential.log`.
- Isolated 8k renderer regression: complete test duration 57.06 ms, with the
  original 2,000 ms budget unchanged;
  `tmp/precise-review-render-benchmark.json`.
- Full Python and final-image validation results are recorded below.
- API: 182 passed; `tmp/precise-review-api-final.log`.

An early expanded-fixture run had four incorrect user expectations for automatic
paths; these were corrected to preserve the existing explicit-only upload rule.
Concurrent build/test runs also exceeded existing wall-clock budgets; those
failures remain in `tmp/precise-review-focused-final.log`,
`tmp/precise-review-python-focused-final.log` and
`tmp/precise-review-frontend-final.log`. The sequential full frontend run above
passed without raising budgets.

The first mounted attempt stopped during fixture readiness because the private
remote-Docker loopback relay was absent. No browser tests ran in that attempt.
Containers and state were retained, the existing project relay was restored, and
MockServer readiness returned HTTP 200. Log: `tmp/precise-review-integration.log`.

## Final local image and quality checks

- `uv sync --locked`: passed; dependency/lock files unchanged.
- `PYTHONPATH=.hermes-source:plugin uv run pytest`: **827 passed** after the
  final parser-initialization cleanup; `tmp/precise-review-python-verified.log`.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: **182 passed** after the
  final build; `tmp/precise-review-api-verified.log`.
- `npm run build`, through explicit `npm run test:env:build`: passed;
  `tmp/precise-review-env-build-verified.log`.
- `vp fmt`, `vp fmt --check`, `vp lint`, `uv run ruff format .`,
  `uv run ruff check --fix .`, and `uv run ty check`: passed. Logs use
  `tmp/precise-review-{fmt-check-verified,lint-verified,ruff-format-final,ruff-final,ty-final}.log`.
- Pinned container `markdown-it-py 4.0.0`: **49 shared cases passed**, also checking
  user/assistant extraction; `tmp/precise-review-pinned-verified.log`. The initial
  standalone probe used an incorrect container file path; it was corrected before
  these checks ran. The locked development parser was unchanged.

Final image:
`sha256:85c817911bf21535de3ae1ea2caf7999cf757cf726fa37c351e1f49c4c98a4f6`.
The integration runner verifies Hermes revision
`2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19` and this image identity. Extractor,
indexer, generated loader and compiled frontend asset hashes match the checkout
build in `tmp/precise-review-build-hashes.json`.

The retained test project is `chathermes-final-review-20261118`, ports
25019/25080, subnet `10.251.122.0/24`, using `tmp/final-review/env.sh` and its
private loopback relay. Builds and Compose apply were explicit; fixture loading
uses stock MockServer REST expectations. No reset or cleanup-on-failure occurred.

## Mounted runs

The first final-image browser run recorded **16 passed / 2 failed** in 5.9
minutes (`tmp/precise-review-integration-verified.log`). Both failures were in the
new precise-tag test's Library locator: a PDF has a preview link and a download
link, so counting every path-containing anchor returned two. Rendering, public
file downloads, profile rejection, reload, focus and the API Library path list
had already passed in both cases. The locator now selects the Download role/name
and path together. Failure screenshots and state remain under
`tests/visual-output/precise-review-verified/`.

The PDF workflows now also capture the activity row directly, because a
full-page capture after composer focus can scroll the row outside the picture.
These captures show the slim running summary and the completed terminal output
when expanded, then its collapsed state. They supplement full-page captures;
no UI layout or disclosure-default behavior was changed.

The fresh final run passed **all 18 desktop/mobile cases in 4.7 minutes**:
`tmp/precise-review-integration-final.log`, with captures under
`tests/visual-output/precise-review-final/`. It used the final image above and the
corrected role-specific Library locator. The suite checks actual mounted-plugin
presentation, authenticated downloads, profile/session isolation, resume/reload,
raw history retention, memory/attachment suppression, image-request exclusion,
Library inclusion/exclusion, composer focus during requests, scrolling, native
profile/reasoning controls with 16px input fonts, and disclosure inspection.

I visually inspected desktop/mobile precise-tag answer and Library captures,
attachment grammar, and running/expanded/completed-collapsed activity captures.
The two public cards remain readable and the private target is absent. Mobile
terminal output wraps within its disclosure. Examples:

- Desktop precise-tag answer: `tests/visual-output/precise-review-final/precise-trust-tags-precise-e37df-nitions-across-native-parts-desktop/precise-reload.png`
- Mobile precise-tag answer: `tests/visual-output/precise-review-final/precise-trust-tags-precise-e37df-nitions-across-native-parts-mobile/precise-reload.png`
- Desktop Library: `tests/visual-output/precise-review-final/precise-trust-tags-precise-e37df-nitions-across-native-parts-desktop/precise-library.png`
- Mobile Library: `tests/visual-output/precise-review-final/precise-trust-tags-precise-e37df-nitions-across-native-parts-mobile/precise-library.png`
- Desktop completed output expanded: `tests/visual-output/precise-review-final/attachment-context-PDF-att-1b04e-ve-and-resumed-user-bubbles-desktop/attachment-activity-expanded-live.png`
- Mobile running activity: `tests/visual-output/precise-review-final/attachment-context-PDF-att-1b04e-ve-and-resumed-user-bubbles-mobile/attachment-activity-active.png`
- Mobile completed output expanded: `tests/visual-output/precise-review-final/attachment-context-PDF-att-1b04e-ve-and-resumed-user-bubbles-mobile/attachment-activity-expanded-live.png`
- Mobile completed output collapsed: `tests/visual-output/precise-review-final/attachment-context-PDF-att-1b04e-ve-and-resumed-user-bubbles-mobile/attachment-activity-collapsed-live.png`

## Limits and final workspace

This is Chromium desktop and iPhone-sized viewport coverage, not physical
Android/iOS keyboards/cameras, Electron or real-provider testing. The full unrelated
workflow suite was not run. Some full-page focus captures retain the existing
host/scroll geometry limitation; the direct disclosure captures resolve activity
inspection without changing product layout. Running captures establish visible
status/command summaries; completed output expansion/collapse is checked directly.
No new automatic-disclosure-expansion behavior is claimed.

Suppression does not delete raw authenticated history or model context. Exact
authored copies of producer notes remain ambiguous without runtime provenance.
Timing evidence is host-specific and not a general Markdown complexity guarantee.

Tracked generated dist files were initially clean and restored to their original
HEAD bytes after validation. The hash comparison above was made before that
restoration; ignored newly generated assets remain local. Generated output,
dependency/lock files, reviewed Hermes source and staging have no new diff.
`git diff --check` passes. All original working-tree changes, fixture/failure
state and project containers were preserved. No commits or deployment occurred.

## PR preparation verification

The preparation pass compared HEAD with freshly fetched `origin/main`; both were
`40d4fea1f5440921f34147a738034fe5152cfc23`. It selected 55 implementation, test,
fixture and documentation files, leaving the broader Desktop comparison report
and all ignored secrets, generated output, screenshots and temporary state out.
Screenshot links in these historical records were converted to explicitly local
artifact paths; five historical memory captures are absent locally. No apparent
credentials were found in the selected text files.

Fresh `npm test` passed 2,047 tests; the build and all 182 API tests passed.
Frontend lint/format, Ruff and ty checks passed. A fresh mounted run selected the
PDF workflows with/without warnings and precise-tag workflow on both viewports:
all six cases passed in 2.0 minutes, exit 0. Captures under the ignored
`tests/visual-output/pr-preparation/` were visually inspected for desktop/mobile
attachments, prose, Library and running/expanded/completed disclosures. Focus,
scrolling, selects and authenticated download/profile checks passed. Extractor,
indexer and compiled application hashes match the retained final image above.

The first fresh full Python run passed 826 tests and failed only the reference
scaling timing budget: 8k definitions took 2.893 seconds against 1.5 seconds while
browser work was running. Log: `tmp/pr-preparation/python.log`. No assertion or
budget was changed. The sequential full rerun passed all **827 tests** in 82.12
seconds, exit 0 (`tmp/pr-preparation/python-sequential.log`). The physical
device, provider, active-disclosure-default and capture limitations above still
apply. Validation logs and generated assets remain ignored and local; tracked
dist files were restored to their exact pre-build bytes.
