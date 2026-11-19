# Recalled-memory display verification — 2026-11-18

> Screenshot paths below identify ignored local verification artifacts, not repository links.
> Captures are excluded from version control and may be absent from another checkout. Some historical captures are no longer present locally.

The original run below is historical and was superseded by independent review.
Its claims about original-source artifact trust, whole-turn suppression, authored
XML, inline-code scope and browser raw-block coverage were incomplete or wrong.
See [the review follow-up](2026-11-18-memory-context-review.md) for the corrected
implementation, regression evidence, final validation and remaining limitations.
The original run's “frontend only” scope does not describe the follow-up.

## Scope and contracts

Preserved the uncommitted attachment-context implementation, tests and records.
This change adds only a frontend presentation projection and regression coverage;
no Python production code, upstream checkout, manifest or dependency changed.
No message-role stripping was added. Stored/native/model-facing content is not
rewritten by the projection.

Reviewed Hermes v0.23.0, commit
`2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19`:

- `agent/memory_context.py`: exact block producer, current note, legacy note
  sanitizer and stream scrubber. The producer emits a line-start XML fence and
  newline. The upstream streaming scrubber handles split block tags but does not
  withhold split recalled-note prefixes.
- `hermes_state_messages.py::_loaded_view_content` sanitizes user/assistant
  **strings**, leaving multipart arrays unchanged. The new contract test executes
  the actual producer and this load lens using the uv environment.
- Desktop `lib/chat-messages/hydration.ts` applies attached-context truncation
  but has no general memory scrub. `attachment-turn.ts` strips memory for
  attachment matching; that is not a renderer-wide secrecy guarantee.
- REST `web_routers/sessions.py::_project_for_display` and plugin `transcript.py`
  retain multipart text. Native `tui_gateway/session_history.py::_history_to_messages`
  flattens text and carries display metadata. ChatHermes maps snapshot rows into
  messages, rebuilds in-flight text through `snapshotIntervals`/`reduceTurn`, and
  accumulates live `message.delta` data in native text phases. The presentation
  projection runs after these steps; it does not modify their reconciliation.

The helper removes exact generated line-start fences, including an unfinished
confirmed block, and the two exact recalled-memory notes. It runs before user
attachment projection and assistant artifact discovery/render/copy, and aligns
saved response matching with the visible prose. The legacy draft fallback uses
the same rule. Ordinary authored notes and code examples remain visible.

## Reproductions and regression coverage

Before implementation, `vp test run src/components/memory-context.test.ts`
failed both new cases: multipart/structured text leaked synthetic memory and
character-by-character native deltas painted `<memory-`. Evidence:
`tmp/memory-red.log`.

Before rebuilding, ran the new authenticated history workflow against the retained
pre-fix image `sha256:a47ce51890b1f4f74a72535cf4090ce763d8ccb5428b2af5a088aeb749b229f7`.
It failed on visible `RECALL_PRIVATE`; screenshot inspection confirmed the
recalled note, memory body and two extra `recall-private.pdf` cards. Evidence:
`tmp/memory-browser-red.log` and `tmp/memory-red-artifacts/`. The failed fixture
session/container state was retained.

New regressions cover exact and interrupted blocks; ordinary note lookalikes;
inline XML and fenced/indented/inline-code examples; every marker prefix; native
character-split deltas; raw-content immutability; no memory-body artifact fetch;
repeated reconnect snapshots; replacement/profile changes and late old-profile
snapshots; and saved response identity across raw multipart versus sanitized
history. The native-session regression exercises the runtime plus real Vue
transcript, with mocked transport hooks.

The browser workflows use the actual authenticated React-mounted plugin and
real Hermes, SessionDB and MockServer. They seed only synthetic test-session
prerequisites in this worktree's isolated fixture environment. No route mocks or
Hermes handler replacements are used.

Intermediate checks caught two test-fixture mistakes: a nonexistent runtime
`blocks` property, and a widened `kind` literal. Corrected both and reran the
focused tests and build. Review also tightened the opening-tag newline check;
the new inline-XML regression protects that boundary. Initial full tests passed
1,831; subsequent/final full tests passed 1,833. Intermediate build logs were
superseded by the clean final build log below.

## Local commands and outcomes

| Command                                                                   | Outcome / evidence                                                                                |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `uv sync --locked`                                                        | Passed; `tmp/memory-sync.log`                                                                     |
| `npm test`                                                                | 57 files, 1,833 tests passed; `tmp/memory-tests-verified.log`                                     |
| `PYTHONPATH=.hermes-source:plugin npm run test:api`                       | 182 passed; `tmp/memory-api.log`                                                                  |
| `PYTHONPATH=.hermes-source:plugin uv run pytest tests/transcript.test.py` | 24 passed; `tmp/memory-transcript.log`                                                            |
| `uv run ruff format .`                                                    | 148 files unchanged; `tmp/memory-ruff-format.log`                                                 |
| `uv run ruff check --fix .`                                               | Passed; `tmp/memory-ruff.log`                                                                     |
| `uv run ty check`                                                         | Passed; `tmp/memory-ty.log`                                                                       |
| `vp fmt`, `vp fmt --check`, `vp lint`                                     | Passed; `tmp/memory-fmt-final.log`, `tmp/memory-fmt-check-final.log`, `tmp/memory-lint-final.log` |
| `npm run build`                                                           | Passed; standalone `tmp/memory-build-verified.log`, also included in final environment build      |
| `npm run test:env:build`                                                  | Passed; `tmp/memory-env-build-final.log`                                                          |
| `git diff --check`                                                        | Passed                                                                                            |

## Mounted environment

Reused only the existing task-owned project
`chathermes-attachment-context-20261118`, dashboard/MockServer ports 24719/24780,
and ignored `tmp/attachment-compose.yml` subnet override. Restarted its private
loopback relay with `node tmp/attachment-forward.mjs`. No other project's
resources were touched, no volumes reset, no user profiles edited, and no
failure cleanup performed.

The final environment build used:

```sh
COMPOSE_PROJECT_NAME=chathermes-attachment-context-20261118 \
CHATHERMES_DASHBOARD_PORT=24719 CHATHERMES_MOCKSERVER_PORT=24780 \
CHATHERMES_COMPOSE_OVERRIDE=tmp/attachment-compose.yml npm run test:env:build
```

Applied explicitly with the same project/ports and:
`docker compose --project-directory . -f tests/docker/compose.yml
-f tmp/attachment-compose.yml up -d --wait --no-build`.
The existing fixture volume/session state was retained.

Final tested image:
`sha256:4d5e3e2134e6b230a631e1590f1d90286db1b11bfe9ca646147cde1a226d5b04`.
The runner verified this image and the reviewed upstream revision.

Browser invocation, with the project/ports/override above:

```sh
CHATHERMES_TEST_URL=http://127.0.0.1:24719 \
CHATHERMES_MOCKSERVER_URL=http://127.0.0.1:24780 \
CHATHERMES_CHROMIUM=$PWD/tmp/playwright-browsers/chromium-1243/chrome-linux64/chrome \
TMPDIR=tmp npm run test:integration -- \
  tests/workflows/memory-context.spec.ts tests/workflows/attachment-context.spec.ts
```

## Mounted results and final review

First mounted run: **10 passed / 4 failed**, `tmp/memory-integration.log`.
The history test incorrectly decoded Hermes's sentinel-prefixed multipart
storage with bare `json.loads`; it now uses `SessionDB._decode_content`.
MockServer encoded a literal Unicode em dash in the new SSE fixture as `?`,
so the arriving note was outside the exact producer grammar. The fixture now
uses ASCII JSON Unicode escapes inside SSE; this preserves the actual generated
note without widening production matching. Failed captures are retained under
`tmp/memory-first-mounted-artifacts/`; fixture containers/session state were
retained too. These corrections changed test fixtures only, after the final
plugin image build.

Final combined browser run: **14/14 passed in 1.9 minutes**, seven desktop and
seven mobile, `tmp/memory-integration-final.log`. Both viewports passed native
resume/reload, stored multipart equality, raw recall retained in the actual
recorded inference continuation, ordinary-note preservation, original upload
bytes and wrong-profile 404s. Split block/note output remained absent from DOM
mutation samples across live events and an in-flight reload. Existing attachment
workflows also passed Home/in-flight/resumed focus, model/reasoning select,
scrolling into view, horizontal bounds and completed disclosure inspection.

Inspected all eight explicit memory screenshots and four representative PDF
active/resumed screenshots from the final combined run. Usable captures show
ordinary notes, one original upload, clean answers and the existing slim work
rows. Two memory captures were unusable: the desktop active capture was shifted
out of frame and the mobile reload capture was black despite passing DOM
assertions. These captures do not establish stable painted layout at those
instants. No claim is made that their cause has been resolved.

An additional read-only, authenticated mobile reload capture of the same
synthetic fixture, after two animation frames, rendered correctly and was
visually inspected: `tmp/memory-settled-mobile.png`. The ignored script
`tmp/memory-capture.mjs` uses the existing preparation helper and scoped fixture
session, without submitting or modifying any data. Ran it with the same
project/ports/override/Chromium environment as the integration invocation.
`tmp/memory-settled-capture.log` records window scrollY 0, header at (0, 0)
and plugin dimensions 390×664 at (0, 0). This extra capture does not establish
a general fix for transient capture/layout behavior.

Selected screenshot evidence:

- Desktop memory resume: `tests/visual-output/memory-context-memory-cont-1caa2--and-authored-notes-survive-desktop/memory-resume.png`
- Desktop completed stream: `tests/visual-output/memory-context-split-recal-81300-events-and-in-flight-reload-desktop/memory-stream-complete.png`
- Mobile memory resume: `tests/visual-output/memory-context-memory-cont-1caa2--and-authored-notes-survive-mobile/memory-resume.png`
- Mobile active stream: `tests/visual-output/memory-context-split-recal-81300-events-and-in-flight-reload-mobile/memory-stream-active.png`
- Mobile completed stream: `tests/visual-output/memory-context-split-recal-81300-events-and-in-flight-reload-mobile/memory-stream-complete.png`
- Settled mobile reload: `tmp/memory-settled-mobile.png`

Final self-review checked source preservation, exact producer grammar, pending
prefix behavior, lack of runtime mutation/shared scope state, artifact discovery
before retrieval, visible-response matching and documented limits. Tracked
generated dist files were restored to their initially clean state after builds;
ignored generated files remain local. Upstream source status is clean. Nothing
was staged, committed, pushed, deployed or submitted as a PR. Only this worktree
and its existing isolated fixture project were used. All prior intentional
edits remain present; no destructive cleanup was performed.

## Limits

This is an exact-producer presentation rule, not a secrecy boundary. REST and
native runtime data can still contain memory. Identical unquoted authored copies
of the fences or specific note cannot be distinguished without provenance. Other case or
whitespace variants, malformed/provider-rewritten fences, separate text phases,
and reasoning/tool bodies are outside the filter's guarantee. Fenced and
indented code remain visible; an inline-code memory example conservatively
protects its entire paragraph. An unconfirmed partial prefix becomes visible
when generation ends; a confirmed unfinished block remains hidden.

Split streaming coverage is within one accumulated native text phase. Browser
DOM mutation samples and an in-flight reload complement component tests; they
do not prove every possible transport ordering or every provider's behavior.
Desktop/mobile use Chromium viewports, not Electron, Android/iPhone hardware,
native keyboards or camera. PDF uploads exercise classification/download bytes,
not real PDF rendering. The pre-existing active disclosure detail-default
behavior remains outside this change. Full Python and unrelated browser suites
were not run; API, transcript and all frontend tests were run.
