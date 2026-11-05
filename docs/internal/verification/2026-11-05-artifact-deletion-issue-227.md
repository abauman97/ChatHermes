# Issue 227 continuation: native artifact deletion

This continues the [automatic artifact verification](2026-11-05-automatic-artifacts-issue-227.md)
and resolves its desktop/mobile library deletion blocker. Existing worktree edits
were preserved. No commit, push, deployment, or other worktree modification occurred.

## Reproduction and authenticated call chain

The existing `chathermes-issue-227` fixture was reused with its existing volumes,
MockServer expectations and session state. Runner requests reached the dashboard
at `http://172.25.0.2:9227` and MockServer at `http://172.25.0.2:1227`.
`/api/auth/providers` exposed the expected password-capable basic provider;
`PUT /mockserver/status` reported MockServer 9.1.0. An unauthenticated plugin
DELETE returned 401. Browser workflows logged in through the real dashboard UI.

Before changes, the installed `plugin_api.py` SHA-256 matched the worktree:
`b177af568e788b5bba2be3378dc4e57ebb01eca9662b64db59a4427799c58516`.
Both unchanged library workflows failed at the existing exact count assertion:
55 cards remained instead of 54. Runtime inspection of the two new disposable
workspaces found 54 physical files, with `artifact-54.txt` absent in each.
A second reproduction with stronger browser assertions confirmed that each
authenticated DELETE returned 503, with the sanitized body
`{"detail":"Hermes file operation is unavailable"}`.

The complete path is:

1. `ArtifactBrowser.vue`: the card's Delete button opens the native confirmation
   dialog; Delete file invokes `remove()` with the selected artifact.
2. `remove()` sends a same-origin, cookie-authenticated DELETE to
   `/api/plugins/chathermes/files`, including `path`, `session_id` and `profile`.
   Hermes applies dashboard authentication and its plugin/profile request scope.
3. `artifact_delete()` resolves legacy uploaded-image references, then calls
   `_native_file(request, "delete", path, session_id)` with the authenticated request.
4. `_native_file()` validates references and resolves the selected profile.
   It rejects SSH workspace deletion through native `_fs_backend(profile)`.
   Native async `fs_download(path, request, profile, session_id)` validates session
   ownership, path resolution, hosted read restrictions, and a regular readable file.
5. Native `delete_managed_file(ManagedFileDelete(path=path, recursive=False), request)`
   enforces managed-path policy and removes the file. Both reviewed and running
   contracts return a dictionary on success and raise HTTP exceptions on policy
   failures. The reviewed Hermes pin's handler is async; the running image's
   handler is synchronous. `fs_download` remains async in both.
6. On success, `artifact_delete()` calls `artifact_store.remove_file()` to remove
   matching profile-local cards and persist suppression for referencing sessions,
   then triggers reconciliation. The UI removes the card only after an OK response;
   Refresh and pagination reload the remaining indexed entries.

Previously, step 5 deleted the file synchronously and then attempted to await the
returned dictionary. That raises `TypeError`, mapped to 503, before step 6 can run.
This confirms the earlier runtime-compatibility attribution and locates the bug
in the plugin's invocation of the native handler.

A read-only SQLite inspection of the retained fixtures confirmed the metadata
effect: both baseline sessions have 55 indexed entries and zero suppression rows,
despite the missing target files. Both fixed-run sessions have 54 indexed entries
and one suppression row, with the target files absent.

## Fix and regression coverage

The adapter now dispatches as FastAPI does: async deletion handlers are awaited;
synchronous deletion handlers run through Starlette's thread pool, which preserves
the request's context variables. Filesystem deletion does not block the event loop.
Existing validation, native policies, error redaction and metadata ordering remain.

The focused API regression runs against both handler shapes. It verifies thread
dispatch, context propagation, nonrecursive payloads, profile forwarding,
cross-session suppression after history replay, isolation from another profile,
and retained metadata after native policy denial, I/O failure, read denial or
remote-workspace refusal. The synchronous case failed before the fix.

The browser workflow retains every original assertion and additionally checks
HTTP 200 with `{ok: true}`, confirmation dismissal, physical file removal, exactly
54 indexed entries and absence of the deleted path. Its original exact 54-card
checks before and after Refresh/Load More still apply.

## Served revision and validation

The explicit `npm run test:env:build` completed using the unchanged official base
digest `sha256:e6d81ae52ebf6a43efa529701405509f20054ba818f179ddd748bed4f8af584c`.
Only this project's Hermes test service was recreated, retaining its volume and
network override. The resulting test image is `6e06cc187d1d`.

The installed fixed API SHA-256 matches the worktree:
`8e47dc67c0229f637f013c52d187e2b2d304d0d11f02bc2eac18e1731854e8b0`.
Authenticated requests to the actual host SDK asset URLs under
`/dashboard-plugins/@default/chathermes/dist/` returned 200 and matched the local
build bytes for all three loaded resources:

- `index.js`: `3c1f0cde153a043c0b02b74a0d49ece5529513c068b85975da3c34c75c05e059`
- `assets/app-BYDuBIwL.js`: `d21909a44a6e0d8220a11a8c189751bea991e67fccf9c9d4c6c295d05ec3e097`
- `style.css`: `73b714fd1e99567f6dc86703775df6601d394113e04366e892df19f6e3f80802`

| Validation                                                                  | Result                                |
| --------------------------------------------------------------------------- | ------------------------------------- |
| `uv sync --locked`                                                          | Passed                                |
| `vp fmt`, `vp lint`                                                         | Passed                                |
| `uv run ruff format .`, `uv run ruff check --fix .`, `uv run ty check`      | Passed                                |
| Focused API: `-k 'artifact_deletion or native_artifact_file_routes'`        | 4 passed, 137 deselected (1.97s)      |
| `PYTHONPATH=.hermes-source:plugin npm run test:api`                         | 141 passed (13.52s)                   |
| `PYTHONPATH=.hermes-source:plugin uv run pytest tests/artifacts.test.py -q` | 219 passed (2.15s)                    |
| `PYTHONPATH=.hermes-source:plugin uv run pytest`                            | 550 passed (143.18s), no skips        |
| `npm test`                                                                  | 43 files, 1,371 tests passed (72.11s) |
| `npm run test:env:build` (includes `npm run build`)                         | Passed                                |

The browser command uses the same environment settings recorded in the preceding
verification, with `CHATHERMES_DASHBOARD_URL_HOST=172.25.0.2` explicitly set:

```sh
npm run test:integration -- tests/workflows/artifacts.spec.ts tests/workflows/automatic-artifacts.spec.ts tests/workflows/messaging.spec.ts
```

The combined invocation printed **20 passed (2.7m)**, including both library
workflows and all 16 messaging contracts, but its enclosing tool shell reported
exit 143. A second combined invocation was also terminated (after 13 passing
tests, with no assertion failure). These are recorded as runner interruptions,
not successful command exits; their signal source was not established.

Final validation uses smaller sequential invocations with recorded exit statuses:

- `npm run test:integration -- tests/workflows/artifacts.spec.ts tests/workflows/automatic-artifacts.spec.ts`:
  **4 passed (39.7s), exit 0**. Desktop library/automatic: 8.5s/9.7s;
  mobile library/automatic: 10.3s/10.2s.
- `npm run test:integration -- tests/workflows/messaging.spec.ts --project=desktop`:
  **8 passed (59.1s), exit 0**.
- `npm run test:integration -- tests/workflows/messaging.spec.ts --project=mobile`:
  **8 passed (1.0m), exit 0**.

All 20 browser contracts therefore completed with exit 0 in three sequential
batches. No desktop/mobile deletion blocker remains. The signal source in the
long combined invocations remains an environment/runner limitation; smaller
invocations provide complete validation without weakening assertions.

Visually inspected actual dashboard desktop and mobile screenshots after deletion
and Refresh, plus automatic file preview screenshots. The desktop library retains
multiple columns; mobile uses one column, with accessible card actions and bounded
scrolling. The confirmation closes after successful deletion and the deleted card
stays absent after refresh. Final screenshots are under the ignored
`tests/visual-output/artifacts-indexed-artifact-5ae56-tions-and-responsive-layout-{desktop,mobile}/`
directories, including `artifact-deleted.png` and `artifact-refreshed.png`.
Sanitized pre-fix failure screenshots/context are retained separately under
`tests/visual-output/issue-227-deletion-http-baseline/` after the final run.
Messaging screenshots were also inspected for tool expansion, completed collapsed
activity, the usable composer and native model/reasoning selection.

Native Android/iOS keyboards, camera, a live SSH server and real providers were
not exercised. The reviewed async handler contract has focused API coverage;
the actual browser run uses the current synchronous Hermes release. Failed-run
fixture state remains available; no destructive reset or cleanup was performed.
Tracked generated dist files were restored after build and served-byte validation;
the generated dist diff and staging area are empty.
