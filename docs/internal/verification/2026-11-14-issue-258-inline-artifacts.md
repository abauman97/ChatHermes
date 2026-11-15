# Issue 258: artifacts follow their response references

The review follow-ups at the end supersede the initial validation counts and
image identity below. The final P2 delimiter follow-up records the latest build.

Worktree: `/opt/data/projects/ChatHermes-issue-258`, starting at `dff7eeffc0`.
No commit, push, deployment, dependency changes, other-worktree edits, or real
provider/personal session use. Test state and screenshots are local and ignored.

## Implementation and upstream review

The old `AssistantTextBlock.vue` rendered all cleaned Markdown followed by every
artifact card. It therefore discarded the accepted references' positions.
The shared delivery parser now records positions while applying the existing
acceptance rules; rendering interleaves the existing authenticated cards there.
The existing `textArtifacts` text/files contract remains unchanged for uploads,
message extraction, validation, deduplication and tool consumers.

Reviewed Hermes Desktop at the repository's v0.23.0 pin,
`2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19`, in the local `.hermes-source` checkout:

- `apps/desktop/src/lib/chat-messages/parts.ts`: `renderMediaTags`,
  `assistantTextPart`, and `appendAssistantTextPart` preserve media in the response
  flow and rerender from accumulated raw text during streaming.
- `apps/desktop/src/components/assistant-ui/markdown-text.tsx`: `MarkdownLink`
  resolves media where it occurs and `MarkdownParagraph` accommodates delivered
  content in the paragraph flow.

ChatHermes keeps its stricter delivery/security grammar. Whole-line and labeled
MEDIA, explicit Markdown links/images, attachments, and validated automatic files
use the same source positions in live and saved turns. Repeated references and
canonical aliases remain deduplicated; tool cards keep their tool location and
unreferenced multipart images remain at the end of their text block.

Markdown is parsed as a whole response before its safe HTML is divided into
balanced sections. This preserves emphasis across an inline card and reference
links whose definitions occur elsewhere. Private boundary tokens avoid changing
adjacent auto-linked URLs. Ordinary text/entities cannot forge boundaries; HTML
remains escaped and executable URL schemes remain rejected.

Reviewed `artifact_extraction.py`, `artifact_indexer.py`, `ArtifactCard.vue`,
`AssistantTurn.vue`, and `_native_file`/file routes in `plugin_api.py`.
No backend extraction, provenance, authentication or filesystem policy changed.
Automatic candidates still require same-origin authenticated HEAD validation;
preview/download still recheck the native profile/session-aware file boundary.
Quoted/code/list/reasoning/untrusted content and arbitrary tool bodies still do
not confer delivery provenance. There are no new direct filesystem or gateway
requests and no credentials in browser state or test evidence.

## Regression proof and checks

The new streaming/history component regression was also run with only
`AssistantTextBlock.vue` temporarily restored to its HEAD implementation. That
command exited 1 with exactly:

```text
Expected: Desktop description: desktop.png Mobile description: mobile.png
Received: Desktop description: Mobile description: desktop.png mobile.png
```

The working implementation was restored byte-for-byte in a `finally` block.
The same regression passes with the fix. Local logs are
`tmp/regression-baseline.log` and `tmp/regression-fixed.log`.

Final validation commands (exit 0 unless noted):

- `npm test`: 53 files, 1,712 tests passed (`tmp/npm-test-complete.log`).
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: 182 passed
  (`tmp/test-api.log`).
- `PYTHONPATH=.hermes-source:plugin uv run pytest tests/artifacts.test.py`:
  219 passed (`tmp/artifacts-python.log`).
- `npm run build`, through the explicit `npm run test:env:build` command:
  Vue type checking and production build passed
  (`tmp/env-build-final-source.log`).
- `vp lint`: passed (`tmp/lint-complete.log`).
- `vp fmt` on changed TypeScript/Vue files and `vp fmt --check`: passed
  (`tmp/fmt-complete.log`).
- `git diff --check`: passed.

Python tooling was prepared with `uv sync --locked`; no Python source changed.
The full Python suite was not run. `npm ci` reported the existing dependency
inventory's 13 audit findings (10 moderate, 3 high); no dependency was altered.

## Real dashboard and visual verification

Isolated deterministic Compose project: `chathermes-issue258`, dashboard port
25819 and MockServer port 25880. A private daemon address is used for runner
access. The ignored override `tmp/compose.issue258.yml` assigns the unused
`10.253.158.0/24` subnet. Local environment settings are in `tmp/test-env.sh`.
Builds were explicitly applied with Compose `up -d --wait --no-build`.
The final selected and running fixture image is:

```text
sha256:8c29baaca23edba30a400f762986d74bfca5d270b800db0fc451d0deb7458115
```

Both the immutable Hermes source pin and Compose image identity are checked by
the integration runner. The source was built before this image was applied.
An initial artifact-only workflow run passed all 10 desktop/mobile cases; the
final run repeats those checks against the final image and adds streaming,
tool, model/reasoning-select, and file/camera attachment controls.

Final workflow command:

```sh
npm run test:integration -- \
  tests/workflows/inline-artifacts.spec.ts \
  tests/workflows/media-links.spec.ts \
  tests/workflows/media-labeled.spec.ts \
  tests/workflows/automatic-artifacts.spec.ts \
  tests/workflows/messaging.spec.ts \
  tests/workflows/navigation.spec.ts \
  --grep 'artifact references|file deliveries|MEDIA|streaming renders progressively|file and camera|resumed model and reasoning|real tool activity'
```

Final result: **18 passed in 2.3 minutes, exit 0**
(`tmp/integration-final.log`). No final validation failures remain.
Final-image screenshots were opened and visually inspected at desktop and mobile
sizes: description/card order, image loading, readable Markdown, scrolling,
composer placement, attachment staging, native reasoning selection and inspected
tool output. The controls also assert focus during streaming, completed-disclosure
collapse/reopening and persistence, and actual model selection in inference.

Ignored screenshot evidence under `tests/visual-output/`:

- `inline-artifacts-artifact--ea4da-rough-streaming-and-history-{desktop,mobile}/inline-{streamed,reloaded}-{desktop,mobile}-description.png`
- `messaging-real-tool-activi-26d58-s-before-one-final-response-{desktop,mobile}/tool-completed.png`
- `messaging-resumed-model-an-4b40a--the-real-inference-request-{desktop,mobile}/resumed-model-reasoning.png`
- `navigation-file-and-camera-c6b53-and-preserve-composer-focus-{desktop,mobile}/attachment.png`

The first artifact-only run is retained separately under `tmp/evidence-initial/`.
These paths are local evidence, not committed screenshots.
The workflow uses full authenticated Hermes dashboard plugin mounts, stock
MockServer inference and real SessionDB/native resume. It checks progressive
card insertion, source order in mixed prose, reload/history, duplicate suppression,
loaded image thumbnails, text previews, authenticated downloads, anonymous denial,
wrong-session rejection, named-profile isolation, 16px/focusable composers and
horizontal overflow. Security tests preserve existing unsuccessful-tool and
untrusted/quoted-delivery fixtures.

## Failures encountered and limitations

- Initial Compose startup exited 1: `all predefined address pools have been fully
  subnetted`. Only this project's ignored override was added; no networks or
  containers belonging to other projects were changed or deleted.
- Initial endpoint probes against `http://docker:25819` and `:25880` failed
  because daemon-loopback publications were unreachable from the runner. This
  project's ports were explicitly rebound to the private daemon address; the
  resulting authenticated browser workflows succeeded.
- An early new component test failed because its `textContent` assertion assumed
  spaces between block elements. The assertion now compares ordered DOM children.
- The adjacent-URL regression intentionally exposed an intermediate implementation
  bug: the internal boundary was included in the preceding URL's `href`. A first
  square-bracket boundary attempt still failed with the encoded marker in `href`.
  An isolated inline token delimited by angle brackets fixes both cases; the
  regression and full frontend suite pass. Logs:
  `tmp/adjacent-link-before.log`, `tmp/markdown-final.log`,
  `tmp/markdown-final2.log` and `tmp/npm-test-complete.log`.
- The baseline regression failure above is expected proof of issue reproduction.

No real provider, physical camera, native Android app, OS keyboard or Electron
Desktop UI was exercised. Mobile evidence uses Chromium's iPhone 13 viewport,
touch and user-agent emulation. The camera check uses the real authenticated
upload input with synthetic PNG bytes. Screenshots use synthetic white images;
they establish card placement and loading rather than visual content fidelity.
Containers and synthetic state are retained for debugging. Generated tracked dist
changes are restored after validation; newly generated bundles remain ignored.

## Read-only review follow-up: consumed ranges and Markdown block structure

Both review findings were reproduced before their fixes. The new regressions
initially reported **5 failed, 556 passed** across the artifact parser and section
renderer (`tmp/review-reproduction.log`). The cases include the exact nested
`Before [x ![a](MEDIA:/tmp/a.png) y](MEDIA:/tmp/b.txt) after` response,
an automatic outer link containing an explicit image, indented paragraph
continuation, a following reference definition, and a setext heading.

The delivery parser now checks consumed ranges before registering an artifact.
An explicit outer delivery consumes its entire label, so its nested image cannot
create a stale position. Retained automatic links use their ending positions;
visiting insertion points in source order places an explicit image inside their
label before the outer card and accounts for removed source bytes. Regressions
assert exact cleaned text, eligible paths, monotonic positions and prose appearing
once around a later sibling delivery.

The Markdown renderer now parses the original block structure and reference
definitions before inserting private boundaries into inline content or between
existing block tokens. It inserts no blank lines into response source. Original
inline content supplies coordinates for repeated boundaries, continuation
indentation remains subject to Markdown's whitespace rules, and offsets account
for normalized CRLF endings. Tests cover paragraph/code and reference-definition
interpretation, headings, same-position cards, emphasis, adjacent URL handling,
escaped HTML, unsafe links, forged markers and all accepted-delivery fixtures.

An intermediate focused run caught two boundary-mapping mistakes (same-position
markers and indentation), which were fixed before final validation. Initial lint
also caught an attribute union type and an unsupported array method; both were
resolved without changing dependencies or compiler settings.

Final checks, all **exit 0**:

| Command                                                                                                                                       | Outcome                                                                     | Local log                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `npm test -- src/features/artifacts/artifacts.test.ts src/utils/markdown-sections.test.ts src/features/chat/components/AssistantTurn.test.ts` | 3 files, 679 passed                                                         | `tmp/review-focused-final.log`                               |
| `npm test`                                                                                                                                    | 53 files, 1,719 passed                                                      | `tmp/review-npm-test.log`                                    |
| `PYTHONPATH=.hermes-source:plugin npm run test:api`                                                                                           | 182 passed                                                                  | `tmp/review-api.log`                                         |
| `PYTHONPATH=.hermes-source:plugin uv run pytest tests/artifacts.test.py`                                                                      | 219 passed                                                                  | `tmp/review-artifacts-python.log`                            |
| `vp lint`                                                                                                                                     | Passed                                                                      | `tmp/review-lint-final.log`                                  |
| `vp fmt` on changed frontend/workflow files; `vp fmt --check`                                                                                 | Passed                                                                      | `tmp/review-fmt-final.log`, `tmp/review-fmt-check-final.log` |
| `npm run test:env:build` (includes `npm run build`)                                                                                           | Vue type checking, production build and explicit fixture image build passed | `tmp/review-env-build.log`                                   |
| `git diff --check`                                                                                                                            | Passed                                                                      | `tmp/review-diff-check.log`                                  |

No Python source changed. The full Python suite was not run; the API and artifact
security/parity suites above were rerun. Package manifests and lockfiles are
unchanged. No dependencies were added.

The final image was applied explicitly to the same isolated Compose project,
retaining its volumes and MockServer. Its selected and running identity is:

```text
sha256:abc7eccf063d28e7636aae723639101e3bf8af4e31f850b1099aeb9174cbd176
```

Application sources did not change after this build. Only workflow assertions
and documentation were refined afterward. The final integration command repeats
the six spec files listed above, with the grep selection extended by
`|reasoning and tools share` to verify active and completed disclosures.
Result: **20 passed (10 desktop, 10 mobile) in 2.9 minutes, exit 0**, in
`tmp/review-integration-final.log`. The runner verified both the pinned Hermes
source revision and this Compose image identity.

The first follow-up workflow attempt finished **18 passed, 2 failed, exit 1**
(`tmp/review-integration-first.log`). Both failures came from a new assertion
counting hidden preview-dialog `pre` elements as response code. The assertion was
scoped to rendered Markdown. A reference assertion was also corrected during
review: a literal URL can auto-link, while the `[docs]` reference must remain
unresolved. No application change was needed for either assertion correction.
The first attempt's screenshots and failure contexts remain in
`tmp/review-workflow-first-output/`; containers and synthetic sessions remain
available. The final run has no failures.

Final source review checked range consumption before registration, ordering of
retained versus replaced references, source-to-inline coordinate mapping,
reference-definition scope, private-marker collision handling, HTML escaping,
link schemes, authenticated file routes and turn-level deduplication. No further
blocking findings were identified. No authentication, provenance or filesystem
policy was weakened.

Final-image screenshots were opened and inspected at 1280×720 desktop and
390×664 mobile CSS viewports (mobile PNGs use device scale 3). They show correct
description/card ordering, one outer nested-delivery card, continuation as prose,
literal reference-definition text and unresolved `[docs]`, loaded image cards,
bounded scrolling, the focused composer, staged attachments, native selects,
expanded active tool data and collapsed/reopened completed activity.

Local ignored evidence under `tests/visual-output/`:

- `inline-artifacts-artifact--ea4da-rough-streaming-and-history-{desktop,mobile}/inline-{streamed,reloaded}-nested-delivery.png`
- `inline-artifacts-artifact--ea4da-rough-streaming-and-history-{desktop,mobile}/inline-{streamed,reloaded}-markdown-structure.png`
- `inline-artifacts-artifact--ea4da-rough-streaming-and-history-{desktop,mobile}/inline-{streamed,reloaded}-{desktop,mobile}-description.png`
- `messaging-reasoning-and-to-1a0e6-ith-the-active-stream-below-{desktop,mobile}/{activity-streaming,tool-streaming-expanded,activity-collapsed,activity-expanded}.png`
- `messaging-resumed-model-an-4b40a--the-real-inference-request-{desktop,mobile}/resumed-model-reasoning.png`
- `navigation-file-and-camera-c6b53-and-preserve-composer-focus-{desktop,mobile}/attachment.png`

These are authenticated real-Hermes plugin workflows with deterministic stock
MockServer inference. Mobile is Chromium emulation, not native iOS/Android or a
physical camera test; the earlier limitations still apply. No commit, push,
deployment or other worktree was used. Generated dist changes were restored
after the image build and remain absent from the source diff and index.

## Final review follow-up: entity boundaries

Reproduced the entity-splitting finding before changing the renderer. The focused
command `npm test -- src/utils/markdown-sections.test.ts` exited **1**, with
**5 failed, 33 passed** (`tmp/entity-reproduction.log`). Removing the delivery in
`Before &am[file](MEDIA:/tmp/a.txt)p; after` produces the valid entity `&amp;`, but
the private marker interrupted its spelling before inline parsing. Sections
therefore displayed `&am` before the card and `p;` afterward instead of `&`.

Inline boundary positions now advance to the end of any enclosing decodable
entity in the original inline source. The decoded entity precedes the card;
reverse insertion preserves sibling order and multiple cards at the same decoded
position. The entity grammar follows markdown-it's inline numeric limits and
named decoding, including replacement characters and entities producing multiple
code points. Escaped ampersands, unknown names and overlong numeric spellings
remain literal and retain their original positions. Block parsing, reference
definitions and the existing security boundaries are unchanged.

Nine new regression cases cover those contracts and compare concatenated section
text with ordinary cleaned Markdown rendering. The focused suite passes
**42 tests, exit 0** (`tmp/entity-focused.log`). The real-Hermes workflow now sends
the split `&amp;` spelling around its report delivery and asserts the exact
description/card/prose order during the completed streamed turn and after reload,
alongside the existing progressive streaming, focus, image, nested delivery,
Markdown structure, preview, download, authentication and isolation checks.

Final source gates, all **exit 0**:

- `npm test`: **53 files, 1,728 passed** (`tmp/entity-npm-test.log`).
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: **182 passed**
  (`tmp/entity-api.log`).
- `vp lint`: passed (`tmp/entity-lint.log`).
- `vp fmt src/utils/markdown.ts src/utils/markdown-sections.test.ts tests/workflows/inline-artifacts.spec.ts`:
  passed (`tmp/entity-fmt.log`); `vp fmt --check`: passed
  (`tmp/entity-fmt-check.log`).
- `npm run test:env:build`: production build, Vue type checking and explicit
  fixture image build passed (`tmp/entity-env-build.log`). The image was applied
  with this project's existing override and `up -d --wait --no-build`, exit 0
  (`tmp/entity-apply.log`).
- `git diff --check`: passed (`tmp/entity-diff-check.log`).

The final selected and running fixture image, verified by the integration runner:

```text
sha256:03732ae9bbdac5b6a9e1b475a85c3f76e124b7b08bc33fb20aa9a4650a0be3f0
```

An initial successful build and full frontend run preceded the final refinement
for escaped and invalid numeric entities. Both were rerun against the final
source; their superseded logs are `tmp/entity-env-build-initial.log` and
`tmp/entity-npm-test-initial.log`. No application source changed after the final
build. No Python source, dependency manifest or lockfile changed. The full Python
suite and artifact Python suite were not repeated for this frontend-only follow-up.
Tracked generated dist files were restored after building the image, with new
bundles left ignored. No commit, push, deployment, dependency changes or other
worktree edits were performed.

The first broader integration attempt selected the same six specs and grep as
the previous review follow-up. It ended with **exit 143**, after **13 completed
passing cases**, including both desktop and mobile inline-artifact workflows;
there was no assertion failure report or final Playwright summary. This is an
incomplete run, not a 20-test pass. Its log is `tmp/entity-integration.log`, and
its output was retained at `tmp/entity-workflow-interrupted-output/`. No reset,
container cleanup or application change followed. The same checks were split
into smaller batches for complete exit statuses.

The core rerun completed **12 passed (6 desktop, 6 mobile) in 1.3 minutes,
exit 0**, logged at `tmp/entity-integration-core.log`:

```sh
npm run test:integration -- \
  tests/workflows/inline-artifacts.spec.ts \
  tests/workflows/messaging.spec.ts \
  tests/workflows/navigation.spec.ts \
  --grep 'artifact references|streaming renders progressively|file and camera|resumed model and reasoning|real tool activity|reasoning and tools share'
```

Final-image screenshots were opened and inspected at desktop 1280×720 and mobile
390×664 CSS viewports. Both show `Before &`, report card, then `after.` with later
cards in source order. The streamed mobile screenshot shows the complete entity
line; the reloaded mobile screenshot scrolls that line partly under the header,
while the reload DOM order assertion verifies its complete text. No broken entity
fragments remain. Focus while streaming, bounded scrolling, loaded image cards,
authenticated preview/download, attachment staging, native reasoning selection,
actual runtime model selection and active/completed disclosure transitions passed.
The attachment, select and expanded/collapsed tool screenshots were also opened
and inspected on both viewport sizes.

Core screenshots are retained under `tmp/entity-workflow-core-output/` using the
same relative paths as the previous review record, plus:

- `inline-artifacts-artifact--ea4da-rough-streaming-and-history-{desktop,mobile}/inline-{streamed,reloaded}-entity-boundary.png`

These checks use the authenticated real-Hermes dashboard plugin with deterministic
MockServer inference. Mobile is Chromium emulation; no native device, physical
camera or real provider was exercised. Existing limitations still apply.

The remaining media checks completed in two independent invocations, both
**exit 0**:

```sh
npm run test:integration -- \
  tests/workflows/automatic-artifacts.spec.ts \
  tests/workflows/media-labeled.spec.ts \
  tests/workflows/media-links.spec.ts --project=desktop
# Repeat the identical command with --project=mobile.
```

- Desktop: **4 passed in 1.3 minutes**
  (`tmp/entity-integration-media-desktop.log`), screenshots retained at
  `tmp/entity-workflow-media-desktop-output/`.
- Mobile: **4 passed in 51.5 seconds**
  (`tmp/entity-integration-media-mobile.log`), screenshots at
  `tests/visual-output/`.

Across the three completed batches, **20 passed (10 desktop, 10 mobile)** against
the final image, with no failed assertions. Every invocation verified the same
Hermes source pin and Compose image ID. The earlier exit-143 run remains recorded
as incomplete. Containers, volumes, synthetic sessions and all evidence are
retained. Final formatting and diff checks pass; the index is empty and generated
dist files and dependency manifests/lockfiles have no diff.

## Final review follow-up: escape boundaries (P2)

Reproduced the exact `Description` + single backslash + newline + `MEDIA:/tmp/a.txt` + newline +
`After` case before fixing the renderer. Removing the delivery leaves a valid
backslash hard break, but inserting `<CHATHERMESARTIFACTBOUNDARY…>` between the
backslash and LF made the opening angle bracket the escape target. The card
splitter removed the marker text and left visible `<>`, changing the hard break.
The initial expanded regression command exited **1**, with **13 failed,
44 passed** (`tmp/escape-reproduction.log`).

Boundaries now advance past an entire original backslash escape, including its
Unicode code point, or a backslash hard break and following indentation. Newline
whitespace is kept together so that insertion preserves Markdown's space trimming.
End-of-inline boundaries are appended as tokens after inline parsing, preserving
final literal backslashes and repeated cards at the same end position. Entity
handling, original block parsing and authenticated file delivery remain intact.

The additional whitespace sweep reproduced two failures before the final newline
handling: backslash + one/two spaces + LF retained spaces that ordinary Markdown
discards (**2 failed, 62 passed**, `tmp/escape-space-reproduction.log`). These cases
now pass. The final focused suite has **66 passing tests**, including 24 new
cases covering odd/even backslash runs, escaped punctuation and ampersands,
non-escapable characters, literal trailing backslashes, LF/CRLF and indentation,
spaces before LF, Unicode surrogate pairs and Unicode line separators. Boundary
sweeps compare paragraph text and break/emphasis/link structure with ordinary
cleaned Markdown rendering. An exact regression also asserts the hard break stays
before the card and `After` stays after it. Focused log:
`tmp/escape-focused-final.log` (exit 0).

The real-Hermes inline-artifact workflow now delivers a hard-break fixture and a
final literal-backslash fixture, checking eight cards in exact source order,
the actual `br`, absence of stray `<>`, and preserved trailing backslash after
streaming and reload. Screenshots cover both fixtures at each phase.

An initial lint/build attempt caught missing TypeScript narrowing for token
metadata (`tmp/escape-lint.log`, `tmp/escape-env-build.log`, both exit 1). Explicit
typing fixed those diagnostics. The first successful full frontend run and image
build preceded the whitespace/Unicode sweep; they are superseded by the final
checks below (`tmp/escape-npm-test.log`, `tmp/escape-env-build-final.log`).

Final source gates, all **exit 0**:

- `npm test`: **53 files, 1,752 passed** (`tmp/escape-npm-test-final.log`).
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: **182 passed**
  (`tmp/escape-api.log`).
- `vp lint`: passed (`tmp/escape-lint-final.log`).
- `vp fmt` on the changed renderer, regression and workflow files: passed
  (`tmp/escape-fmt-final.log`, `tmp/escape-workflow-fmt.log`);
  `vp fmt --check`: passed (`tmp/escape-fmt-check-final.log`).
- `npm run test:env:build`: Vue type checking, production `npm run build` and
  explicit fixture image build passed (`tmp/escape-env-build-final2.log`).
- Explicit Compose `up -d --wait --no-build` with the existing project override:
  passed (`tmp/escape-apply.log`). Volumes and MockServer were retained.
- `git diff --check`: passed (`tmp/escape-diff-check.log`).

The final selected and running image identity is:

```text
sha256:9a3d3c33ec9be9d3c905a4a25d62cbbb7be9db2bdad9283c57c73b763c5877c7
```

No application source changed after this build. Workflow assertions and evidence
were refined afterward. No Python source, dependency manifest or lockfile changed;
the full Python suite and additional media-only workflows were not repeated for
this renderer follow-up. The real-Hermes browser checks use deterministic stock
MockServer inference and Chromium mobile emulation; they do not cover native
iOS/Android, physical camera hardware or a real provider.

The first browser invocation completed **10 passed, 2 failed (exit 1)**
(`tmp/escape-integration-first.log`). Both failures were the workflow's final
history comparison: its previous `JSON.stringify` substring assertion escaped LF
but not literal backslashes. Streaming/reload DOM order, hard-break, preview,
authentication and focus assertions all passed before that assertion. The
workflow now compares the parsed API's assistant `content` directly to the exact
sent fixture. Hard-break screenshots also center the card so both adjacent prose
lines are visible. Neither correction changed application code. The initial
screenshots/failure contexts are retained at `tmp/escape-workflow-first-output/`;
no reset or cleanup followed the failures.

The final rerun completed **12 passed (6 desktop, 6 mobile) in 1.4 minutes,
exit 0** (`tmp/escape-integration-final.log`):

```sh
npm run test:integration -- \
  tests/workflows/inline-artifacts.spec.ts \
  tests/workflows/messaging.spec.ts \
  tests/workflows/navigation.spec.ts \
  --grep 'artifact references|streaming renders progressively|file and camera|resumed model and reasoning|real tool activity|reasoning and tools share'
```

The runner verified the reviewed Hermes source pin and the image identity above.
The final workflow checks progressive rendering, exact card/prose order and hard
breaks, reload/history, image loading, authenticated previews/downloads, anonymous
denial and wrong-session rejection, focus while streaming and on Home, bounded
horizontal scrolling, file/camera attachment staging, native reasoning selection
and runtime model selection, and active/completed disclosure transitions.

Final-build screenshots were opened and visually inspected at desktop 1280×720
and mobile 390×664 CSS viewports (mobile PNGs use scale 3). Both streamed and
reloaded hard-break screenshots show the complete `Description` → `hardbreak.txt`
card → `After hard break.` sequence, with no stray angle brackets. Separate end
screenshots show the literal final backslash before `terminal.txt`. The attachment,
model/reasoning select, expanded active tool, collapsed completed activity and
reopened completed activity screenshots were also inspected on both sizes.

Evidence remains under `tests/visual-output/` and is copied to the ignored
`tmp/escape-workflow-final-output/` with these relative paths:

- `inline-artifacts-artifact--ea4da-rough-streaming-and-history-{desktop,mobile}/inline-{streamed,reloaded}-hard-break.png`
- `inline-artifacts-artifact--ea4da-rough-streaming-and-history-{desktop,mobile}/inline-{streamed,reloaded}-terminal-escape.png`
- `messaging-resumed-model-an-4b40a--the-real-inference-request-{desktop,mobile}/resumed-model-reasoning.png`
- `navigation-file-and-camera-c6b53-and-preserve-composer-focus-{desktop,mobile}/attachment.png`
- `messaging-reasoning-and-to-1a0e6-ith-the-active-stream-below-{desktop,mobile}/{tool-streaming-expanded,activity-collapsed,activity-expanded}.png`

The prior entity follow-up's mobile media output was preserved at
`tmp/entity-workflow-media-mobile-output/` before the new Playwright run.
Containers, volumes, synthetic sessions and failed-run evidence remain available.
Tracked generated dist files were restored after building the final image; new
bundles remain ignored. The index is empty, and generated dist files and dependency
manifests/lockfiles have no diff. No commit, push, deployment, dependency changes
or other-worktree edits were performed.

## Final P2 follow-up: delimiter classification and unchanged inline source

This follow-up supersedes the escape-boundary follow-up's renderer design and
final validation/image identity. The reported input is
`**before[file](MEDIA:/tmp/a.txt)**after`; cleaned Markdown is `**before**after`.
The previous `<private-marker>` insertion changed the punctuation beside the
closing delimiter run, so emphasis parsing produced literal asterisks. This was
not an emphasis-only exception: inserting any raw marker before parsing lets
lookahead, delimiter flanking, escaping and other inline grammar see different
source. More marker-spelling exceptions would not establish semantic parity.

`src/utils/markdown.ts` now parses the unchanged cleaned response through the
complete Markdown pipeline, including delimiter balancing and linkification.
Source-coordinate metadata follows emitted tokens, pending literal text, text
joins and normalized automatic links. Only after parsing does it insert private
boundary tokens and split finished text tokens. Decoded entities, escapes,
Unicode surrogate pairs, code spans and automatic links remain indivisible where
needed. The existing balanced DOM section splitting and collision-resistant
marker prefix remain; no raw boundary spelling is fed into Markdown parsing.
Ordinary rendering without boundary context delegates to the original rules.
The authoritative API contract records this guarantee.

The focused suite now has **98 passing cases**
(`tmp/delimiter-focused-final.log`). It includes the exact reported HTML result,
opening/closing and split delimiter delivery placements, and every source offset
across 22 cleaned Markdown examples. The latter compare each rendered character's
formatting ancestors and link target with ordinary cleaned Markdown, covering
asterisk/underscore runs, intraword and unmatched delimiters, nested emphasis,
punctuation, strikethrough, code spans, explicit/reference links, automatic URLs,
Unicode URL normalization, email links, entities and escapes. All previous entity,
escape, hard-break, block-structure, safety and delivery-order regressions remain.

The real-Hermes workflow adds a ninth authenticated file delivery with the exact
reported delimiter adjacency. Both streamed and reloaded turns assert bold
`before`, plain `after`, no literal asterisks, and exact prose/card order. New
`inline-{streamed,reloaded}-emphasis-boundary.png` screenshots show that sequence.

The first complete frontend run passed **1,781 tests in 53 files** and the first
image build passed (`tmp/delimiter-npm-test.log`, `tmp/delimiter-env-build.log`).
Lint initially reported a mismatch between the separately imported DefinitelyTyped
Token and markdown-it 15's bundled Token type; deriving the type from the actual
parser fixed it without changing dependencies. The final source also avoids
repeated string comparisons and coordinate-array copies on long text; the final
gates below include that adjustment.

The first browser run completed **10 passed, 2 failed, exit 1**
(`tmp/delimiter-integration-first.log`). Both failures were the existing
hard-break count in the inline-artifact workflow: the post-parse projection put
a paragraph-continuation soft break after its standalone card, so the later
section contained two breaks instead of one. Emphasis formatting and the nine
cards' exact text order had already passed. The projection now keeps newline
syntax and consumed spaces/indentation before the card, with three focused
regressions for LF and one/two preceding spaces. Their first run failed before
the coordinate correction; all 98 focused cases pass afterward. Failed screenshots
and contexts are retained at `tmp/delimiter-workflow-first-output/`; no state
reset or cleanup followed the failures.

Final source gates, all **exit 0**:

- `npm test`: **53 files, 1,784 passed** (`tmp/delimiter-npm-test-final2.log`).
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: **182 passed**
  (`tmp/delimiter-api.log`).
- `vp lint`: passed (`tmp/delimiter-lint-final.log`).
- `vp fmt` on changed renderer, regression and workflow files, followed by
  `vp fmt --check`: passed (`tmp/delimiter-fmt-final.log`,
  `tmp/delimiter-fmt-check-final.log`).
- Explicit `npm run test:env:build`, including `npm run build`: passed
  (`tmp/delimiter-env-build-final2.log`).
- Explicit Compose `up -d --wait --no-build` with the existing isolated project
  and override: passed (`tmp/delimiter-apply-final.log`). State/volumes were retained.
- `git diff --check`: passed (`tmp/delimiter-diff-check.log`).

The final selected/running image, verified by the integration runner, is:

```text
sha256:8737365edd7bd691c15c8613f752cc81ac0709985d747e249a575bee94cb8b66
```

No application source changed after this build. No Python source, dependency
manifest or lockfile changed. The full Python suite was not repeated for this
frontend renderer follow-up. Browser verification uses deterministic stock
MockServer inference, the actual pinned Hermes dashboard plugin and Chromium
mobile emulation; it does not cover native mobile devices, physical camera
hardware or real providers.

Final workflow result: **12 passed (6 desktop, 6 mobile), 1.6 minutes, exit 0**
(`tmp/delimiter-integration-final.log`):

```sh
npm run test:integration -- \
  tests/workflows/inline-artifacts.spec.ts \
  tests/workflows/messaging.spec.ts \
  tests/workflows/navigation.spec.ts \
  --grep 'artifact references|streaming renders progressively|file and camera|resumed model and reasoning|real tool activity|reasoning and tools share'
```

The runner verified the reviewed Hermes source pin and the final image identity
above. Contracts cover progressive streaming and history/reload, exact nine-card
order, emphasis classification, soft/hard breaks, loaded images, authenticated
preview/download and rejected anonymous/wrong-session requests. They also verify
composer focus on Home and during inference, horizontal scrolling bounds,
file/camera attachment staging, native reasoning selection, actual inference
model selection, and active/completed disclosure transitions.

Final-image screenshots were opened and visually inspected at desktop 1280×720
and mobile 390×664 CSS viewports (mobile screenshots use scale 3). Both sizes show
bold `before` → `emphasis.txt` card → plain `after`, without literal delimiters;
the hard-break screenshots preserve `Description` → card → `After hard break.`.
Attachment staging, model/reasoning selects, expanded active tool output,
collapsed completed activity and reopened completed activity were also inspected
on both sizes. Text, card controls and composer remain readable and bounded.

Final evidence is retained under `tests/visual-output/` and copied to the ignored
`tmp/delimiter-workflow-final-output/`:

- `inline-artifacts-artifact--ea4da-rough-streaming-and-history-{desktop,mobile}/inline-{streamed,reloaded}-emphasis-boundary.png`
- `inline-artifacts-artifact--ea4da-rough-streaming-and-history-{desktop,mobile}/inline-{streamed,reloaded}-hard-break.png`
- `messaging-resumed-model-an-4b40a--the-real-inference-request-{desktop,mobile}/resumed-model-reasoning.png`
- `navigation-file-and-camera-c6b53-and-preserve-composer-focus-{desktop,mobile}/attachment.png`
- `messaging-reasoning-and-to-1a0e6-ith-the-active-stream-below-{desktop,mobile}/{tool-streaming-expanded,activity-collapsed,activity-expanded}.png`

All final checks passed. Test containers, volumes, synthetic sessions and failed
run evidence remain available. Tracked generated dist files were restored after
the final image build; new generated bundles remain ignored. The index is empty,
and generated dist files and dependency manifests/lockfiles have no diff. No
commit, push, production deployment, dependency changes or other-worktree edits
were performed.

## Final P2 follow-up: preserve whitespace code and structural content

This follow-up supersedes the preceding final image and validation identity.
The empty-section cleanup considered only trimmed text and an allowlist of
`img,hr,br,input`. A whitespace-only fenced code block following an artifact
therefore disappeared. The same problem affected empty fences, whitespace inline
code, and empty headings, blockquotes, lists and tables. The initial regression
run reproduced **8 failures, 102 passes, exit 1**
(`tmp/empty-section-reproduction.log`).

Cleanup now treats only empty `p,strong,em,s,a` wrappers as disposable, using the
same content predicate for wrapper and whole-section cleanup. Every other
rendered element preserves the section, including code with significant
whitespace and structural Markdown with no text. Boundary-only wrappers still
collapse, retaining the existing card ordering and empty-section regressions.
Fourteen new cases compare the complete following section with ordinary Markdown
rendering: empty/backtick/tilde fences, spaces/tabs, indented code, whitespace
inline code inside emphasis and links, images, rules, breaks, empty headings,
blockquotes, lists and tables. The section suite now has **112 cases**.

The real-Hermes workflow ends with a whitespace-only fenced block immediately
after the final artifact; that section has no prose or other element that could
mask the reported cleanup defect. Streaming completion and reload assert the
exact code text (`three spaces + LF + tab + LF`), its source position after the
ninth card, and preservation of a whitespace inline code span and horizontal rule
earlier in the response. New screenshots show the final card and blank code
surface at both phases.

Final gates after the application change, all **exit 0**:

- Focused section/artifact/assistant-turn suites: **3 files, 758 passed**
  (`tmp/empty-section-focused-final.log`).
- `npm test`: **53 files, 1,798 passed** (`tmp/empty-section-npm-test.log`).
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: **182 passed**
  (`tmp/empty-section-api.log`).
- `vp fmt` on the changed files, `vp fmt --check`, and `vp lint`: passed
  (`tmp/empty-section-fmt.log`, `tmp/empty-section-workflow-fmt.log`,
  `tmp/empty-section-fmt-check-final.log`, `tmp/empty-section-lint-final.log`).
- Explicit `npm run test:env:build`, including `npm run build` and Vue type
  checking: passed (`tmp/empty-section-env-build.log`).
- Explicit isolated Compose `up -d --wait --no-build` with the existing override:
  passed (`tmp/empty-section-apply.log`); existing volumes/state retained.
- `git diff --check`: passed (`tmp/empty-section-diff-check.log`).

The integration runner verified the reviewed Hermes source pin and this selected
and running image:

```text
sha256:ffb0902d8eb23e4c84814985c4cc4c1fb409651a63e9711a2cb647519a7bde74
```

No application source changed after the build. Workflow fixture/assertion edits
were finalized before browser verification. The final browser run completed
**12 passed (6 desktop, 6 mobile), 1.6 minutes, exit 0**, with no failures
(`tmp/empty-section-integration.log`):

```sh
npm run test:integration -- \
  tests/workflows/inline-artifacts.spec.ts \
  tests/workflows/messaging.spec.ts \
  tests/workflows/navigation.spec.ts \
  --grep 'artifact references|streaming renders progressively|file and camera|resumed model and reasoning|real tool activity|reasoning and tools share'
```

Coverage includes streaming/reload/history, exact card/prose order, significant
code whitespace, images, authenticated preview/download and access rejection,
composer focus on Home and during inference, bounded scrolling, file/camera
attachment staging, native reasoning selection, actual runtime model selection,
and active/completed disclosure transitions.

Opened and visually inspected streamed and reloaded whitespace-code screenshots
at desktop 1280×720 and mobile 390×664 CSS viewports (mobile PNG scale 3).
The code surface remains after `terminal.txt`; the inline code surface and rule
also remain. Both viewport sizes' attachment, model/reasoning select, expanded
active tool, collapsed completed activity and reopened activity screenshots were
opened and inspected. Content and controls remain readable and bounded.

Evidence is retained at `tests/visual-output/` and copied to ignored
`tmp/empty-section-workflow-final-output/`, including:

- `inline-artifacts-artifact--ea4da-rough-streaming-and-history-{desktop,mobile}/inline-{streamed,reloaded}-whitespace-code.png`
- `navigation-file-and-camera-c6b53-and-preserve-composer-focus-{desktop,mobile}/attachment.png`
- `messaging-resumed-model-an-4b40a--the-real-inference-request-{desktop,mobile}/resumed-model-reasoning.png`
- `messaging-reasoning-and-to-1a0e6-ith-the-active-stream-below-{desktop,mobile}/{tool-streaming-expanded,activity-collapsed,activity-expanded}.png`

These use the actual authenticated Hermes dashboard plugin with stock MockServer
inference and Chromium mobile emulation. Native devices, physical cameras and
real providers were not tested. No Python source changed; the full Python suite
and media-only browser workflows were not repeated for this cleanup follow-up.
Prior visual output was retained at `tmp/empty-section-prior-workflow-output/`.
Containers, volumes and synthetic sessions remain available. Tracked generated
dist files were restored after the image build; new bundles remain ignored.
The index is empty; dist files, dependency manifests and lockfiles have no diff.
No commit, push, deployment or dependency changes were performed.
