# Snapshot correction recovery: saved phases and images

Independent-review follow-up in `native-session.ts`. Existing transcript,
Python, workflow and documentation edits were retained. No Hermes source was
modified. No commit, push or deployment was performed.

## Reproduction and fix

Before the fix, the new focused regression returned **2 failed, 67 passed**.
The snapshot matched one saved `Ask, Again, Again` sequence and valid Unicode
code-point offsets. Saved content included thinking, `A😀`, a tool, `B`, then
an image-only phase, another tool, `C`, and the final correction's `D`. Restore
moved `A😀B` after the first tool and discarded its image. Native-only recovery
also lost images from subsequent corrections because a nonempty `row.text`
summary replaced multipart `row.content`. The red log is retained in ignored
`tmp/snapshot-recovery/red.log`.

Restore now merges each correction's snapshot segment into the adopted saved
blocks through the existing prefix-aware snapshot reducer. Equal saved text
leaves the phases untouched; unseen suffixes extend the trailing text phase or
follow a trailing tool. No saved text/image blocks are discarded. Native row
normalization preserves multipart content even when a text summary is present.

The final focused suite covers REST-backed omitted snapshots and native-only
snapshots, exact matches and extended text in every correction segment, repeated
restore/hydration, later live deltas, non-BMP Unicode, image-only phases, thinking,
multiple tools, equal consecutive offsets, and ordinary recovery with or without
a trailing tool. It asserts exact block order, contents, images and durable user
IDs. Existing ambiguous/older/conflicting sequence guards remain covered.
The correction snapshot tests use mocked transport hooks and history APIs;
they do not establish real native correction persistence or a durable event
replay guarantee.

## Final validation

Command logs are retained under ignored `tmp/snapshot-recovery/`. An initial
build caught missing union narrowing in the new test projection helper; it was
corrected before final validation.

The existing deterministic fixture was reused: project
`chathermes-transcript-order-final`, dashboard `172.25.0.2:9229`, MockServer
`172.25.0.2:1190`. Final built plugin assets were copied into the fixture's
installed `/opt/data/plugins/chathermes/dashboard/dist/`; the stale plugin reader
was also updated as described below. No Hermes files,
container lifecycle, live provider or real-user state was changed. Infrastructure
and synthetic sessions are retained. The matching built and installed entry hash
was `aa27b33f9282d9b283bfc32d001584c9a2b30b0ef1bb79f5324adcb1474411be`.
Tracked generated assets were restored after the copy and ignored build output
remains uncommitted. Earlier screenshots were preserved under
`tmp/snapshot-recovery/previous-browser-output/`.

The final browser run uses the real authenticated Hermes dashboard plugin with
MockServer inference, through:

```sh
COMPOSE_PROJECT_NAME=chathermes-transcript-order-final \
CHATHERMES_BIND_ADDRESS=172.25.0.2 CHATHERMES_DASHBOARD_URL_HOST=172.25.0.2 \
CHATHERMES_DASHBOARD_PORT=9229 CHATHERMES_MOCKSERVER_PORT=1190 \
CHATHERMES_CHROMIUM=/opt/data/profiles/developer/home/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome \
npm run test:integration -- tests/workflows/transcript.spec.ts \
  tests/workflows/messaging.spec.ts tests/workflows/execution.spec.ts \
  tests/workflows/reasoning.spec.ts
```

Browser artifacts remain under ignored `tests/visual-output/`. Desktop/mobile
viewport verification is distinct from real Android/native-device or upstream
Desktop verification; those are outside this run. Real-provider and real-user
session tests were not run.

| Check                                                                    | Final result                                         |
| ------------------------------------------------------------------------ | ---------------------------------------------------- |
| `npm test`                                                               | 42 files, 1,297 passed                               |
| Focused native-session suite                                             | 75 passed                                            |
| `PYTHONPATH=.hermes-source:plugin uv run pytest`                         | 547 passed, no skips                                 |
| `PYTHONPATH=.hermes-source:plugin npm run test:api`                      | 137 passed                                           |
| `npm run test:docker`                                                    | 16 passed                                            |
| `vp fmt` / `vp lint`                                                     | Passed using repository-local `node_modules/.bin/vp` |
| `uv run ruff format .` / `uv run ruff check --fix .` / `uv run ty check` | Passed; formatter left 130 files unchanged           |
| `npm run build`                                                          | Passed; generated tracked assets restored afterward  |

An overlapping redundant frontend rerun ended with signal 143 and no test
summary; its log is retained. The final separate full rerun passed all 1,297
tests after the last test edits. No cause for that signal was established.

The first browser invocation used the final frontend with a stale installed
Python reader (`7e4eb324...`). It returned 17 passed, 2 failed, 1 interrupted,
26 not run when the runner was interrupted to correct the fixture. The failures
were legacy rotation and rotated-tool history; the interrupted case was rotated
paging. Full evidence is retained under
`tmp/snapshot-recovery/browser-stale-reader/` and `browser.log`. Only the
worktree's plugin `transcript.py` was then copied into the fixture's installed
plugin directory; it is loaded per request and required no restart or Hermes
edit. Its final local/installed hash matches:
`6324217d31712278cda831a79bffc4de14fd7d12c0686780d15c20dfe95e202a`.
The full browser command above was rerun after that update.

The corrected final browser invocation returned **46 passed in 5.3 minutes**:
23 desktop and 23 mobile scenarios. All four selected workflow files passed,
including mid-flight snapshot/history/later-delta recovery, authenticated archived
user/assistant images, real tool execution, disclosure transitions, model/reasoning
selection, cancellation, repeated-message ordering, paging and rewind contracts.

Final screenshots were visually inspected at both sizes: approval/completion,
expanded completed thinking, native model/reasoning controls, newline/focused home
composer, retained tool output, mid-flight recovery with preserved draft/scroll
position, and archived images. The image fixture is a white PNG; both authenticated
image elements decode successfully, with user and assistant cards present. The
snapshot warning remains visible during incomplete native recovery. Screenshots
show expected transcript interleaving and readable controls without horizontal
overflow. The precise correction-offset/image regression remains the mocked
protocol coverage described above, rather than a claim of real native correction
replay. No Android/device, live provider or actual user-session evidence is implied.

The final diff has no generated distribution changes; the reviewed Hermes source
checkout remains clean. No files were staged, committed, pushed or deployed.
