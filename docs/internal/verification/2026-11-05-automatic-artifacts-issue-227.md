# Issue 227: automatic artifact paths

Issue: https://github.com/abauman97/ChatHermes/issues/227

The reference was the reviewed Hermes source at
`bf0203a794a07aac3ff764972ab9087baa4e4f4e`, particularly
`gateway/platforms/base.py` (`MEDIA_DELIVERY_EXTS`, `extract_local_files`),
`website/docs/user-guide/features/deliverable-mode.md`, and the native
`hermes_cli/web_routers/files.py` download, canonicalization and read guards.
ChatHermes intentionally applies the issue's narrower standalone-path/explicit-link
intent boundary instead of scanning ordinary prose.

## Implementation evidence

- Python and TypeScript consume the same 52 automatic-delivery fixtures alongside
  the retained explicit-delivery fixtures. Parsing is independent of the filesystem.
- Automatic candidates use HEAD on the existing authenticated download endpoint.
  Native runtime validation supplies canonical identity and MIME without returning
  file contents. The index calls the same boundary directly.
- Native local file tests cover runtime home expansion, canonical aliases, missing
  files, directories, protected filenames, escaping/protected symlinks, source-file
  exclusions, unreadability, profile/session ownership and repeated SQLite indexing.
  A remote adapter contract verifies a bounded runtime read without local access or
  streaming contents.
- Frontend contracts cover partial/completed streaming, duplicate updates and blocks,
  canonical aliases, restored history, stale scope cancellation, reasoning/tool
  exclusion and preservation of later explicit deliveries.
- Versioned reconciliation fingerprints rescan checkpoints created by the previous
  parser without a schema change or database reset.

## Local validation

All commands ran in this worktree, with the uv-managed Python 3.14 environment and
reviewed source checkout. No commits, pushes or deployments were performed.

| Command                                             | Result                                                                                                                                       |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `uv sync --locked`                                  | Passed before development; `uv add --dev python-multipart` intentionally synchronized the dev dependency and lock for native router imports. |
| `vp fmt --check`                                    | Passed.                                                                                                                                      |
| `vp lint`                                           | Passed, no remaining diagnostics.                                                                                                            |
| `uv run ruff format --check .`                      | Passed; all checked files already formatted.                                                                                                 |
| `uv run ruff check .`                               | Passed.                                                                                                                                      |
| `uv run ty check`                                   | Passed.                                                                                                                                      |
| `npm test`                                          | 43 files, 1,371 tests passed.                                                                                                                |
| `PYTHONPATH=.hermes-source:plugin uv run pytest`    | 549 passed, no skips.                                                                                                                        |
| `PYTHONPATH=.hermes-source:plugin npm run test:api` | 140 passed.                                                                                                                                  |
| `npm run build`                                     | Passed, including the final explicit `npm run test:env:build`.                                                                               |
| `git diff --check`                                  | Passed.                                                                                                                                      |

## Dashboard environment

The deterministic Docker project is `chathermes-issue-227`, with dashboard port
9227 and MockServer port 1227. The explicit build used the official base digest
`sha256:e6d81ae52ebf6a43efa529701405509f20054ba818f179ddd748bed4f8af584c`.
Docker's default address pools were exhausted before container creation. A temporary
Compose override at `/tmp/chathermes-227-compose.yml` selected the unused subnet
`10.227.227.0/24`; no other Docker resources were changed or removed.
The browser uses the existing cached Chromium binary selected through
`CHATHERMES_CHROMIUM`; the environment's default browser path did not exist.

The first fixture-load attempt could not reach the remote daemon's loopback-only
publications, although container health checks passed. Only this project's
publications were moved to the daemon's private interface (`172.25.0.2`), retaining
its volumes and subnet. The test runner then loaded all 47 inference expectations.
The final run uses these environment settings:

```sh
COMPOSE_PROJECT_NAME=chathermes-issue-227 \
CHATHERMES_BIND_ADDRESS=172.25.0.2 \
CHATHERMES_DASHBOARD_PORT=9227 \
CHATHERMES_MOCKSERVER_PORT=1227 \
CHATHERMES_COMPOSE_OVERRIDE=/tmp/chathermes-227-compose.yml \
CHATHERMES_CHROMIUM="$HOME/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome" \
npm run test:integration -- tests/workflows/automatic-artifacts.spec.ts tests/workflows/artifacts.spec.ts tests/workflows/messaging.spec.ts
```

## Runtime compatibility discovered by browser validation

The first browser run passed all 16 messaging contracts, but the two artifact
contracts failed on both viewport sizes at preview (HTTP 503). The current
image's `fs_read_data_url` returns `JSONResponse` for local files, whereas the
reviewed source pin returns a dictionary. The existing wrapper attempted to JSON
serialize the response object. The focused compatibility change accepts either
shape, retains private/no-store and nosniff headers, and sanitizes native error
responses. The API regression tests exercise both shapes and error redaction.

Messaging screenshots inspected during that run showed the user → activity →
assistant order, expandable tool content, a focusable compact mobile composer and
native model/reasoning selection. Copies are retained with the final ignored
visual output under `issue-227-messaging-review/`.

## Final browser results and limitations

- `npm run test:integration -- tests/workflows/automatic-artifacts.spec.ts`:
  **2 passed (24.0s)**, desktop and mobile. Live partial-path handling, validated
  cards, missing/code/prose exclusions, reload/native resume, text previews,
  downloads, persisted history, exact indexed paths and visible library links
  passed. The initial library selector counted a hidden preview-dialog download
  link as well as the card link; the final selector checks the named card action.
- The broader run passed all **16 existing messaging contracts** across desktop
  and mobile, covering streaming, focus, Stop, real tools, model/reasoning
  selection, clarification, recovery and disclosures.
- The existing `tests/workflows/artifacts.spec.ts` still fails on **both viewport
  sizes at deletion**: 55 cards remain where 54 are expected. Preview/download,
  pagination and grid checks now reach this later step. The current image's
  `delete_managed_file` is synchronous, while the reviewed pin and the unchanged
  plugin deletion caller use an awaited handler. This is a separate existing
  compatibility issue; deletion code was left unchanged to keep issue 227 scoped.
  The runtime probe confirmed a synchronous handler and two removed fixture files
  among the four library-test directories: deletion occurred before the caller's
  await failed, preventing the metadata/tombstone update. Failure evidence is retained in
  `tests/visual-output/issue-227-existing-deletion-failure/`.
- Inspected final desktop/mobile screenshots for live/resumed cards, mobile text
  preview and the indexed desktop library. Cards match after reload; the mobile
  composer remains focusable, text wraps and no horizontal document overflow was
  observed. Final automatic-delivery screenshots are under
  `tests/visual-output/automatic-artifacts-automa-46e3a-resume-history-and-indexing-{desktop,mobile}/`.
- No live SSH server, real provider, native Android/iOS keyboard or camera was
  exercised. SSH probing is covered by the native adapter contract; mobile
  screenshots use Chromium device viewports.

The final rebuilt test image is `69f422a6ceda` (same official base digest above).
Containers, fixture files, scoped MockServer expectations and state remain for
inspection. Generated dist output is excluded from the change; tracked generated
files are restored after validation. No commit, push or deployment was performed.

The final frontend regression also verifies that a failed automatic text probe
cannot hide an existing explicit tool delivery. Final quality checks pass; Git's
staging area and generated dist diff remain empty.

## Subsequent deletion follow-up

The deletion blocker above was reproduced, traced and fixed in the same worktree.
See the [native deletion verification](2026-11-05-artifact-deletion-issue-227.md)
for the authenticated call chain, runtime contracts, served revision checks,
regression coverage and subsequent desktop/mobile results.
