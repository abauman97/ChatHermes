# Attachment context: explicit Desktop parity follow-up — 2026-11-18

> Screenshot paths below identify ignored local verification artifacts, not repository links.
> Captures are excluded from version control and may be absent from another checkout.

This follow-up supersedes the conservative-parser and warning-preservation
recommendations in [the original verification](2026-11-18-attachment-context.md)
and [the read-only hydration comparison](desktop-hydration-comparison.md).
Those documents remain historical evidence. The user explicitly accepted
Desktop's authored-marker truncation tradeoff and requested this narrow change.

## Implementation and review

Read the actual pinned `apps/desktop/src/lib/chat-messages/hydration.ts`,
`components/assistant-ui/reference-kinds.ts` and `lib/embedded-images.ts` in
`.hermes-source` at `2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19`.
The attachment helper now uses Desktop's exact marker, warning and context-ref
patterns, first-marker slicing, trimming, encounter-order deduplication and
exact-token substring test before hoisting missing refs. Warning-only messages
use the same broad removal. There is no requirement for uploads, complete native
blocks or top-level Markdown. Fenced authored markers can truncate too. The old
conservative search and work budgets have been removed.

The helper exposes the retained prefix separately from recovered references.
Artifact parsing classifies Markdown against the complete original message,
before truncation or display trimming, and collects/cleans deliveries only in
the retained prefix. Expanded bodies, warnings and recovered refs never establish cards.
Original upload annotations/MEDIA retain original names and paths; recovered
file refs already represented by an original card are omitted from displayed
text. Other recovered refs remain text. This deliberately retains the plugin's
authenticated artifact model rather than adopting Desktop's general reference
chip/thumbnail file access. Uploads occurring only after a truncation boundary
cannot establish provenance from the discarded body. Inline image content parts
retain their existing handling. No server/file-route changes were made.

User rendering and saved-response matching both use `uploadedArtifacts`.
Assistant/tool processing, native runtime, profiles, cancellation, session
selection and durable model-facing content retain existing behavior. Skill,
Discord, image-routing and other unrelated Desktop hydration rules were not
imported as part of this change.

Regression coverage executes the actual pinned Desktop display helper (with
adapters for unrelated string/skill imports) over hundreds of combinations of
markers, warnings, LF/CRLF, malformed markers, quote styles, all six recovered
reference kinds, excluded line/session kinds, duplicates and inline refs.
Additional cases cover start markers, fenced examples and repeated sections.
Mounted Vue tests cover user cards/profile/session props, upload identity,
reference recovery without artifact authority, inline images, large repeated
markers/fences and unchanged live/saved assistant marker/warning rendering.
Saved-target tests cover warning-only matching, recovered reference equality,
differing references and differing original upload paths.

Self-review found and fixed a trim-order issue during validation: parsing a
trimmed prefix could reinterpret an indented MEDIA example as an explicit
delivery. Parsing the original prefix first retains the existing provenance
boundaries. The existing quotation regressions now expect Desktop's display
trim while continuing to require zero artifacts. An additional focused regression
covers this with recovered refs. No arbitrary path access was added.

## Validation before independent review

All requested gates passed on the final source:

- `npm test`: **55 files / 1,817 tests** passed. Log:
  `tmp/attachment-parity-tests-final2.log`.
- Focused artifacts, Desktop comparison, rendering and saved-target tests:
  **4 files / 551 tests** passed (`tmp/attachment-parity-focused-final.log`).
  The actual Desktop comparison ran, rather than being skipped.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: **182 passed**.
- `PYTHONPATH=.hermes-source:plugin uv run pytest tests/transcript.test.py`:
  **24 passed**, including pinned producer warnings, persistence and profile checks.
- `uv sync --locked`, `uv run ruff format .`, `uv run ruff check --fix .`,
  `uv run ty check`, `vp fmt`, `vp fmt --check`, `vp lint` and
  `git diff --check`: passed. Ruff left all 147 files unchanged.
- `npm run test:env:build`, including `npm run build`: passed. Final build log:
  `tmp/attachment-parity-verified-env-build.log`.

Intermediate local runs caught the trim-order issue above and then stale
expectations of preserved outer whitespace. These were corrected; final tests
retain the zero-artifact security assertions. An intermediate run overlapped a
reference-filter edit and failed the new recovered-reference assertion; the
subsequent focused and full runs on final source passed. No failing state was
cleaned up or silently counted as successful.

## Authenticated mounted verification before independent review

Reused only the retained task-owned project
`chathermes-attachment-context-20261118`, ports 24719/24780 and reserved Android
ports 24760/24723, with the existing ignored `tmp/attachment-compose.yml` subnet
override. Restarted this task's private loopback relay from
`tmp/attachment-forward.mjs`, because the remote Docker publications were not
runner-local. Explicit Compose `up -d --wait --no-build` applied the final build,
preserving fixture volumes/session state. No other project's services were
recreated, stopped or reset. An initial build used the worktree-default image
tag without applying it; the correctly scoped final rebuild is the image below.

Final tested image:
`sha256:0c65a2527260f9ba4ea20f4970776d1232d97966be69b251454136daa59fd982`.
The integration runner verified that image and the reviewed Hermes source pin.

Ran `npm run test:integration -- tests/workflows/attachment-context.spec.ts`
with the project/ports above, the existing override, runner-loopback dashboard
and MockServer URLs, checkout-local Chromium and relative `TMPDIR=tmp`.
Result: **8/8 passed in 1.3 minutes**. Log:
`tmp/attachment-parity-integration.log`.

Desktop and mobile both exercised real authenticated upload, staging, inference,
native events, persistence and reload. Each uploaded PDF remained one original
card; download bytes matched the upload and profile beta received 404. Raw history
retained native context/warnings. Bubbles hid both after reload. Authored inline
marker phrases stayed visible; separate line-start authored attachment and
warning markers truncated live and after reload, without requiring an upload.
Original authored notes remained in history. Assistant replies retained their
expected text. No browser route mocks or upstream source edits were used.

The PDF workflows also checked Home/in-flight/resumed composer focus, model
picker and native reasoning select (at least 16px), no horizontal document
overflow, scrolling into view and completed disclosure open/inspect/close.
Visually inspected all **16** active/live/resumed PDF and authored-marker
screenshots. Desktop was 1280×720 at DPR 1; mobile was Chromium's iPhone 13
viewport, 390×664 at DPR 3. The screenshots show clean prompt bubbles, original
cards, hidden expansions/warnings and immediate user → work → answer ordering.

Screenshot evidence (ignored local files):

| Scenario                   | Desktop                                                                                                                                                                                                                                                                                                                                                                                            | Mobile                                                                                                                                                                                                                                                                                                                                                                                          |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PDF                        | active: `tests/visual-output/attachment-context-PDF-att-1b04e-ve-and-resumed-user-bubbles-desktop/attachment-context-active.png`, live: `tests/visual-output/attachment-context-PDF-att-1b04e-ve-and-resumed-user-bubbles-desktop/attachment-context-live.png`, resumed: `tests/visual-output/attachment-context-PDF-att-1b04e-ve-and-resumed-user-bubbles-desktop/attachment-context-resumed.png` | active: `tests/visual-output/attachment-context-PDF-att-1b04e-ve-and-resumed-user-bubbles-mobile/attachment-context-active.png`, live: `tests/visual-output/attachment-context-PDF-att-1b04e-ve-and-resumed-user-bubbles-mobile/attachment-context-live.png`, resumed: `tests/visual-output/attachment-context-PDF-att-1b04e-ve-and-resumed-user-bubbles-mobile/attachment-context-resumed.png` |
| PDF with native warning    | active: `tests/visual-output/attachment-context-PDF-att-43036--user-bubbles-with-warnings-desktop/attachment-context-active.png`, live: `tests/visual-output/attachment-context-PDF-att-43036--user-bubbles-with-warnings-desktop/attachment-context-live.png`, resumed: `tests/visual-output/attachment-context-PDF-att-43036--user-bubbles-with-warnings-desktop/attachment-context-resumed.png` | active: `tests/visual-output/attachment-context-PDF-att-43036--user-bubbles-with-warnings-mobile/attachment-context-active.png`, live: `tests/visual-output/attachment-context-PDF-att-43036--user-bubbles-with-warnings-mobile/attachment-context-live.png`, resumed: `tests/visual-output/attachment-context-PDF-att-43036--user-bubbles-with-warnings-mobile/attachment-context-resumed.png` |
| Authored attachment marker | resumed: `tests/visual-output/attachment-context-Desktop-3a80e-ive-and-saved-user-messages-desktop/authored-marker-resumed.png`                                                                                                                                                                                                                                                                    | resumed: `tests/visual-output/attachment-context-Desktop-3a80e-ive-and-saved-user-messages-mobile/authored-marker-resumed.png`                                                                                                                                                                                                                                                                  |
| Authored warning marker    | resumed: `tests/visual-output/attachment-context-Desktop-d449e-ive-and-saved-user-messages-desktop/authored-marker-resumed.png`                                                                                                                                                                                                                                                                    | resumed: `tests/visual-output/attachment-context-Desktop-d449e-ive-and-saved-user-messages-mobile/authored-marker-resumed.png`                                                                                                                                                                                                                                                                  |

## Limits and review before independent review

Mobile coverage is Chromium viewport emulation, not Android/iPhone hardware or a
native keyboard/camera test. The PDF is a synthetic binary for classification and
byte delivery, not a valid renderer-preview fixture. No rendered Electron Desktop
or real-provider run was performed. Multiline exception warnings are covered by
the pinned-producer Python and frontend tests, rather than injected into the live
server. Full Python suite and unrelated integration suites were not rerun.
Short conversations verify scrolling into view, not long-history anchoring.

The pre-existing active disclosure rows remain visible but their details default
to closed; this does not verify automatic active-detail expansion. That known
limitation from the original report was left alone per the requested scope.
Completed disclosure transitions pass. Desktop's general reference chips and
thumbnail/path access are outside this narrowly requested presentation parity.

Final self-review checked exact marker/ref patterns against the pin, raw-content
immutability, parsing before trim, absence of recovered-ref file authority,
original-card deduplication, shared saved-target projection and assistant
isolation. No additional implementation or security issue remains identified.
Upstream revision and checkout are unchanged. Dependency manifests are unchanged.
Only this worktree was used; unrelated intentional work was preserved.
Tracked generated dist assets were restored after the final image build; ignored
output remains local. Nothing was staged, committed, pushed, deployed or submitted
as a PR. No destructive cleanup was performed. The isolated containers, sessions,
screenshots, logs and private relay remain available for debugging.

## Independent review: closing multiline code delimiter regression

Independent review found that preserving indentation alone was insufficient:
truncation could discard a closing inline-code delimiter and reclassify quoted
delivery examples as authenticated artifact cards. The exact reproduction is
`` `\nMEDIA:/tmp/private.pdf\n--- Attached Context ---\nend` ``
(the `\n` sequences denote actual newlines). Context Warnings and legacy
attachment annotations had the same problem. The earlier final self-review
above missed this case.

`textArtifactDelivery` now parses the complete original Markdown for block and
multiline inline-code classification. Its retained-length boundary limits
delivery collection, reference removal and cleaned text to the retained prefix.
`uploadedArtifacts` supplies that boundary from the unchanged Desktop projection.
This avoids inferring quotation from an incomplete prefix or granting authority
to otherwise legitimate deliveries in the discarded suffix. Assistant/tool
callers still use the complete text as before. Markdown reference destinations
resolve using only retained definitions; discarded reference definitions cannot
supply file authority to retained links. Focused tests cover both discarded and
legitimate retained definitions.

Regressions cover the exact input, both marker types, MEDIA directives, file/image
annotations and MEDIA links. They assert unchanged projected text, no artifacts
for quoted examples, legitimate retained cards alongside those examples, excluded
suffix deliveries, shared saved-response identity and profile/session props.
The pinned Desktop helper also executes the exact marker/annotation cases.
The mounted workflow seeds original messages through real SessionDB prerequisites
and checks resume/reload, quotation text, card counts, original download bytes,
profile beta rejection, focus, scrolling and final desktop/mobile screenshots.
The existing live PDF workflows still cover sending, attachments, native selects
and disclosure transitions.

### Post-review validation

- Focused artifact/rendering, saved-target and actual pinned Desktop comparison:
  **4 files / 559 tests passed**, `tmp/quotation-focused.log`.
- Full `npm test`: **55 files / 1,825 tests passed**, `tmp/quotation-tests.log`.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: **182 passed**,
  `tmp/quotation-api.log`; the locked uv environment was synchronized first.
- `npm run test:env:build` (including `npm run build`): passed,
  `tmp/quotation-env-build.log`.
- `vp fmt`, `vp fmt --check`, `vp lint` and `git diff --check`: passed.
  Formatting/lint logs are `tmp/quotation-fmt.log`,
  `tmp/quotation-fmt-check.log` and `tmp/quotation-lint.log`.

An intermediate reference-definition test omitted Markdown's separating blank
line, so its legitimate-definition expectation failed. Corrected the fixture
and reran focused/full checks; the intermediate full log is retained at
`tmp/quotation-tests-reference-fixture.log`. The first mounted run passed 10/10;
the final run rebuilds and reapplies the reference-resolution adjustment too.

Reused the same task-owned Compose project, ports, override and private relay
described above, without resets or volume cleanup. Final tested image:
`sha256:a47ce51890b1f4f74a72535cf4090ce763d8ccb5428b2af5a088aeb749b229f7`.
The upstream pin and checkout remain unchanged. Restored tracked generated
dist files after building the image; generated output is not part of the diff.
Other existing changes remain present. Nothing was staged, committed, pushed,
deployed or edited upstream.

Final `npm run test:integration -- tests/workflows/attachment-context.spec.ts`:
**10/10 passed in 1.5 minutes**, `tmp/quotation-integration.log`. The runner
verified the final image and pinned Hermes revision. Visually inspected all
**20** explicit screenshots from that final run (10 desktop, 10 mobile), covering
quotation resume/reload, active/live/resumed PDFs and authored markers. Quoted
private paths remain prose with Desktop's truncated opening backtick; only the
legitimate retained upload has a card. Original bytes download successfully and
profile beta receives 404. Focus, bounded layout, scrolling, native reasoning
select and completed disclosure transitions passed. Active detail expansion
retains the pre-existing limitation documented above.

The existing screenshot table now points at the regenerated final PDF and
authored-marker screenshots. Additional final quotation evidence:

| Phase  | Desktop                                                                                                                     | Mobile                                                                                                                     |
| ------ | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Resume | screenshot: `tests/visual-output/attachment-context-truncat-e5b3e-etained-authenticated-cards-desktop/quotation-resume.png` | screenshot: `tests/visual-output/attachment-context-truncat-e5b3e-etained-authenticated-cards-mobile/quotation-resume.png` |
| Reload | screenshot: `tests/visual-output/attachment-context-truncat-e5b3e-etained-authenticated-cards-desktop/quotation-reload.png` | screenshot: `tests/visual-output/attachment-context-truncat-e5b3e-etained-authenticated-cards-mobile/quotation-reload.png` |

Mobile remains Chromium iPhone viewport emulation, without a hardware keyboard
or camera run. No Electron Desktop renderer or real provider was exercised.
Python production code was unchanged; the API suite was rerun, while the full
Python and unrelated integration suites were not. Containers, sessions, logs
and ignored screenshots remain available for debugging.
