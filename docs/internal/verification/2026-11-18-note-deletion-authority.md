# Recalled-note deletion and attachment authority — 2026-11-18

## Finding and fix

Independent review found that the worktree's `textArtifactDelivery` classified
lines after deleting exact recalled-memory notes. The legacy note between `MED`
and `IA:https://attacker.invalid/track.png` manufactured an image directive;
`MEDIA:` followed by the note and `/tmp/private.pdf` manufactured a destination.
The original bytes assert neither delivery. Python already rejected both.

Delivery grammar now validates candidates against the original line before
accepting their presentation projection. Path and automatic/explicit delivery
mode must match. Note suppression, visible non-delivery prose, raw messages and
turn blocks, legitimate annotations/directives/links and projected placements
remain intact. This uses the existing original Markdown/trust classification;
it does not reparse the full turn per card. Unchanged lines use the existing path.

A related red case showed that replacing a note with spaces could manufacture
`[x]: MEDIA:/tmp/private.pdf` from `[x]:<exact note>MEDIA:/tmp/private.pdf`.
Reference resolution now consumes original bare-note bytes. Generated memory
blocks, quoted regions and untrusted lines cannot supply definitions. Positive
controls retain a legitimate definition whose Markdown title contains a note.
No Python production change or index checkpoint bump was needed: the shared
original-source cases already pass the backend extractor and Library index path.

## Red-green evidence

`tmp/note-authority-red.log` records 10 failures: five parser regressions and five
actual transcript component regressions for directive fragments, destinations,
annotations, Markdown links and automatic paths. The automatic component case
also observed a preview fetch; tests do not make real outbound requests.
`tmp/note-reference-red.log` records two additional parser failures for manufactured
reference definitions, one per exact producer note. The same shared cases passed
Python unchanged (`tmp/note-reference-python-red.log`).

Final shared fixtures in `tests/fixtures/memory-note-deliveries.json` contain 18
cases. Frontend tests cover `textArtifacts`, `messageArtifacts` for user and
assistant, `uploadedArtifacts`, native turn projections, real `ChatTranscript`
rendering with history and active blocks, copy, unchanged source and
character-by-character deltas. Both exact producer notes are exercised. Python
consumes the same expected paths through text extraction and user/assistant
Library extraction. Focused final run: **68 passed**, and shared Python parity:
**18 passed** (`tmp/note-authority-green-final.log`, `tmp/note-parity-final.log`).

## Environment and scope

The deterministic Compose project is `chathermes-attachment-context-20261118`,
with dashboard/MockServer ports 24719/24780 and retained subnet override
`tmp/attachment-compose.yml`. Explicit builds use `npm run test:env:build`; Compose
applies the built image without removing volumes. The pinned Hermes source stays
at `2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19`.

The first integration attempt stopped before browser tests because Docker's
loopback publications were not reachable from the runner
(`tmp/note-integration.log`). Reusing the existing private task relay restored
runner access; the MockServer readiness endpoint returned 200. Containers and
state were retained. Intermediate builds and runs are not final-image coverage.

No commits, staging, deployment, upstream source changes, destructive resets,
real-provider requests, credentials or user-session inspection were performed.

## Final checks

- `vp fmt` / `vp lint`: passed; generated dist excluded.
- `uv sync --locked`, `uv run ruff format .`, `uv run ruff check --fix .`,
  `uv run ty check`: passed.
- `npm test`: **1,909 passed**, 58 files (`tmp/note-test-reviewed.log`).
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: **182 passed**
  (`tmp/note-api-final.log`).
- `PYTHONPATH=.hermes-source:plugin uv run pytest tests/artifacts.test.py tests/transcript.test.py`:
  **315 passed** (`tmp/note-python-reviewed.log`).
- `npm run test:env:build`, including `npm run build`: passed
  (`tmp/note-env-build-reviewed.log`). Final image:
  `sha256:26383404f1a6b81d38b9b2568f80d73c7ee2cd852616094b0c96fcd54bf10e41`.

The built plugin entrypoint and the final running container have the same SHA-256
(`tmp/note-build-hashes.txt`). After that comparison, the initially clean tracked
dist files were restored; newly generated chunks remain ignored. No dist assets
are staged or part of the source diff.

The first final-image broader mounted run passed **13 desktop cases**, including
the new exact-repro contract, before ending with signal 143 and no assertion-failure
summary (`tmp/note-integration-reviewed.log`). The cause is not established; this
is not a completed 40/40 run. Smaller final-image batches completed against the same
retained services and fixtures. No cleanup/reset was performed after interruption.

All **40 distinct cases** across the four selected workflow files now have passing
final-image runs. This is coverage across batches, **not one uninterrupted 40/40
run**. The first streaming desktop case was repeated in the complete messaging
batch, so there are 41 passing case invocations in this evidence union.

| Run                                      | Passing cases | Result                      |
| ---------------------------------------- | ------------: | --------------------------- |
| Broader desktop selection                |            13 | Interrupted with signal 143 |
| Memory workflows, mobile                 |             6 | Completed, 4.3 minutes      |
| Messaging, desktop and mobile            |            16 | Completed, 1.8 minutes      |
| Artifacts and attachment context, mobile |             6 | Completed, 49.8 seconds     |

Final logs: `tmp/note-integration-reviewed.log`,
`tmp/note-integration-mobile-memory.log`, `tmp/note-integration-messaging.log`,
`tmp/note-integration-mobile-attachments.log`. The exact new contract passed on
both viewports: visible manufactured-looking text remains prose, no false cards
or external image requests occur, the real public control downloads with its
original bytes, and the real background index contains only that session's public
control. Resume and reload retain the same behavior and composer focus.

The broader cases cover authenticated uploads/downloads and profile isolation,
scrolling and horizontal bounds, native streaming/reconnect, active composer
focus, model/reasoning selection reaching inference, cancellation, response order,
and active versus completed disclosure transitions. Visually inspected the exact
repro reload at both sizes, the mobile Library, memory reload, PDF attachment
resume at both sizes, desktop active/expanded and completed/collapsed activity,
and mobile completed/collapsed activity.

Captures are retained in `tests/visual-output/note-authority-final/`,
`note-authority-mobile-memory/`, `note-authority-messaging/` and
`note-authority-mobile-attachments/`. This is mounted Chromium desktop/mobile
viewport coverage, not native-device, Electron or real-provider coverage. The
cause of signal 143 remains unknown. Containers and interrupted test state remain
available. Final formatting and `git diff --check` passed; the staging area,
reviewed Hermes source and generated-dist diff remain clean.

## Fresh Markdown authority review

The separate Markdown renderer also required original-source protection after
note suppression. See [the Markdown authority follow-up](2026-11-18-markdown-context-authority.md)
for the exact image-request repro, source-preserving token projection, mounted
live/history regressions and browser/build verification.
