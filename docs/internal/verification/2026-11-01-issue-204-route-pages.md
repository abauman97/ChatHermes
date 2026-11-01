# Issue 204 route-specific pages

Local verification record for `codex/issue-204-route-pages`, based on `ff5bf5a79718abbe5bed9fe28f2b42daafd700ad`.

## Architecture

Every registered destination has its own feature `pages/` component. Home and session pages compose the reusable conversation; the composer and native runtime remain mounted in the shell. Scheduled list/history/output pages own abortable requests. Project workspace state is shared by the Project feature because the sidebar, session creation and project pages all need the same gateway-owned membership.

The shell renders default, actions and dialogs router outlets. Feature contexts replace the broad shared page-props bag and component-instance coordination. Vue Router route snapshots reject obsolete asynchronous work, including navigation away and back to the same URL. A pending creation is retired when another navigation command starts. Canonical hash URLs and host history ownership remain unchanged; recent sessions navigate immediately and discover Project membership without rewriting their URLs. Scheduled status and Inbox scope are shareable query state.

## Environment

Only Compose project `chathermes-issue-204`, dashboard port `9129` and MockServer port `1180` were used. The sibling fixtures were not modified. The remote Docker daemon required a reachable publication (`CHATHERMES_BIND_ADDRESS=0.0.0.0` on the private Docker service) and a local TCP forward from `127.0.0.1:9129` to `docker:9129`; the browser uses loopback as a secure context for service workers. MockServer remains at `http://docker:1180`.

The installed Playwright browser revision was absent. The documented `CHATHERMES_CHROMIUM` override uses `/opt/hermes/tools/chromium-1208/chrome-linux64/chrome`. An attempted explicit Chromium installation was stopped after it remained silent; no browser installation is required with this override.

The actual installed Node is `v26.12.1` (rather than the goal file's Node 22), npm `12.0.2`, Vite+ `1.1.0`, and uv Python `3.14.4`. No dependencies were changed. `.hermes-source` matches `bf0203a794a07aac3ff764972ab9087baa4e4f4e`. `.env` was not read or changed.

Use this environment for browser gates:

```sh
export COMPOSE_PROJECT_NAME=chathermes-issue-204
export CHATHERMES_DASHBOARD_PORT=9129
export CHATHERMES_MOCKSERVER_PORT=1180
export CHATHERMES_BIND_ADDRESS=0.0.0.0
export CHATHERMES_TEST_URL=http://127.0.0.1:9129
export CHATHERMES_CHROMIUM=/opt/hermes/tools/chromium-1208/chrome-linux64/chrome
# Additionally for the default visual suite:
export CHATHERMES_TEST_CONTAINER=chathermes-issue-204-hermes-1
export CHATHERMES_LIVE_CONTAINER=chathermes-issue-204-hermes-1
export CHATHERMES_VISUAL_FIXTURES=1
```

## Iteration notes

Initial Docker readiness succeeded, but REST fixture loading could not reach loopback publications on the remote daemon. Reachable publications resolved this. Browser startup then reported a missing `chromium_headless_shell-1243` executable; the existing browser override resolved it. The remote HTTP origin did not permit notification permission grants; loopback forwarding resolves the secure-context requirement.

The diagnostic integration run found two assertions out of date with existing, tested composer behavior: desktop context controls remain visible but inactive while editing, and desktop Enter sends while Shift+Enter inserts a newline (mobile Enter inserts a newline). Browser assertions now cover both desktop and mobile contracts. User keyboard documentation was corrected accordingly. The new route test scopes navigation locators to the plugin to distinguish Hermes's own navigation. The workspace artifact check waits for the real response to settle before testing keyboard preview activation.

The complete workflow diagnostic initially passed 76/78 cases. Its two failures led to a native dialog Escape fix (do not close the drawer behind a dialog) and a durable response completion barrier before reload. Browser waiting for cold saved-history attachment uses the same 80-second budget as first-response recovery. Both affected desktop/mobile cases subsequently passed in a targeted real-Hermes run. The final full run is recorded below.

The default visual suite originally lacked deterministic inference expectations for its prompts. Added finite native-profile, tool, branching and activity SSE expectations to the stock MockServer fixture set. Unknown requests still fail. Artifact scenarios REST-load scoped inference using freshly authenticated upload paths; real Hermes still executes tools and owns files, history and preview/download/delete handlers. Unique artifact names prevent state from earlier runs selecting the wrong card. Quiet-tool scenarios explicitly approve the real runtime request.

Active tool disclosures now expand to show arriving data, consistent with AGENTS.md; completed tools fold unless the user has chosen otherwise. Real browser checks exposed replacement of the rendered user/assistant occurrence when saved history acquired storage IDs. Both receipt and omitted-history reconciliation preserve the display identity, keeping focused DOM and disclosure choices. Regression tests cover both paths. Home-to-chat transcript registration transfers pending focus after the new route mounts while retaining the persistent composer. Existing assertions were retained for manual disclosure choices, chronology, scrolling and saved history.

The first complete visual iteration finished with 61 passes, one intentional desktop skip and eight failures. A host Cron Create button could be scrolled under the host fixed header; the test now exercises accessible keyboard activation. Six streaming checks included the response toolbar as a fifth timeline entry; they now scope the chronology assertion to timeline children and explicitly verify Copy response separately. Short touch landscape exposed inconsistent CSS/JavaScript compact rules: the composer now uses the same short-touch condition as CSS and updates on viewport resize, retaining focus. All nine applicable cases passed in a targeted desktop/mobile rerun (38.9s); the desktop phone-landscape case remains intentionally skipped.

A subsequent workflow run reached 27 passes before stopping to fix an attachment-test race (exit 130 after an already reported failure). Its camera input bypassed the disabled UI while the previous upload receipt was still being consumed. The test now waits for Attachment options to become enabled, then verifies the same authenticated camera upload and focused composer. The targeted desktop/mobile rerun passed both cases (6.0s), without a runtime change or state reset.

The next workflow iteration passed all 39 desktop cases, then found a mobile artifact confirmation disappearing during a same-Project metadata refresh (46 total passes before interruption, exit 130). A focused test reproduced the unwanted third artifacts fetch. Artifact loading now watches profile and Project ID as separate Vue watch sources, so replacing metadata for the same ID retains pagination and the confirmation. The browser workflow now updates the real Project name with the dialog open, waits for the new heading, and verifies all 55 cards before confirming deletion. Both desktop and mobile passed (16.8s). No assertions or scenarios were removed.

Another iteration exposed an Inbox setup race: the test viewed a clarification before leaving, allowing the shell to mark its notice read/deleted before the test polled for it. A read-only query of the isolated synthetic fixture confirmed both flags on the newest clarification row. Setup now witnesses the real native prompt acceptance and leaves before viewing the request; all original navigation, exact scoped DELETE, pending-request, reload and answer assertions remain. All eight desktop/mobile variants passed (4.5m). That interrupted run also found the host memory-pressure alert alongside the intended plugin error; the interrupted-inference check now scopes its alert locator to the plugin. Containers and state were retained throughout.

The next full workflow run reported all 78 tests passed (16.3m), but its enclosing interactive command returned 143. That is not counted as a clean gate exit. A temporary supervisor outside the repository now runs the same unfiltered integration and visual commands sequentially, recording their actual npm exit codes/signals independently of the interactive command session. No test selection, fixture reset or production behavior changed for this rerun.

## Gates

| Command                                             | Exit | Evidence                                                                            |
| --------------------------------------------------- | ---- | ----------------------------------------------------------------------------------- |
| `vp fmt`                                            | 0    | Formatter completed.                                                                |
| `vp lint`                                           | 0    | No diagnostics.                                                                     |
| `npm test`                                          | 0    | 37 files; 1,024 tests passed (49.63s).                                              |
| `PYTHONPATH=.hermes-source:plugin npm run test:api` | 0    | 127 passed in 11.59s.                                                               |
| `npm run build`                                     | 0    | `vue-tsc -b` and plugin build succeeded.                                            |
| `npm run test:env:build`                            | 0    | Image `797ca8afa377` built and explicitly applied; health checks passed.            |
| `npm run test:visual`                               | 0    | 69 passed, 1 intentional desktop skip (7.7m); actual npm close code 0, signal null. |
| `npm run test:integration`                          | 0    | 78 passed (16.2m); actual npm close code 0, signal null.                            |

No Python source changed, so the conditional Python quality gate is not applicable.

## Coverage and visual review

`route-pages.spec.ts` directly opens every destination, reloads nested pages, and checks browser traversal plus a streaming session's draft and composer continuity. Existing workflows cover profiles, Project subpages, scheduled output, Inbox, push navigation, attachments, native requests, response branching, scrolling, model/reasoning selection, cancellation and reconnect. Scheduled page tests check aborted reads and late results across resource/profile transitions; filters do not refetch unchanged resources.

Inspected actual mounted-plugin screenshots at desktop and phone sizes, including restored route chat, context usage, focused draft, attachments, model selection, artifact grids and live/completed activity. The rounded composer stays within its bounded shell; phone editing uses the compact input/Send layout, desktop retains controls, and artifact grids use multiple desktop columns and one phone column. Browser assertions verify focus, manual scrolling, authenticated file/camera uploads, previews/downloads/deletion, native selects, arriving tool output, completed collapse and retained manual disclosure choices. Local samples are in ignored `tmp/issue-204-verification/`; screenshots, raw traces and generated state are not committed.

Mobile coverage uses Chromium device emulation and reduced viewport sizes, not native iOS/Android keyboard or installation testing. Real-provider testing was not run; the required real-Hermes stack uses repository inference fixtures. No Python source changed. No commit, push, PR or deployment was performed; `.env` was not read and sibling fixtures were not touched. Generated dist assets are restored out of the diff.

Clean integration exit evidence (temporary supervisor):

```json
{
  "command": "npm run test:integration",
  "started": "2026-11-01T05:39:07.562Z",
  "finished": "2026-11-01T05:55:22.175Z",
  "code": 0,
  "signal": null
}
```

Clean visual exit evidence (temporary supervisor):

```json
{
  "command": "npm run test:visual",
  "started": "2026-11-01T05:55:22.176Z",
  "finished": "2026-11-01T06:03:03.969Z",
  "code": 0,
  "signal": null
}
```

Final output tails:

```text
npm test
Test Files 37 passed (37)
Tests 1024 passed (1024)
Duration 49.63s

PYTHONPATH=.hermes-source:plugin npm run test:api
127 passed in 11.59s

npm run build
vue-tsc -b && node scripts/build-plugin.mjs
✓ built in 15ms

npm run test:env:build
Successfully built 797ca8afa377
Successfully tagged chathermes-issue-204-hermes:latest

npm run test:integration
78 passed (16.2m)

npm run test:visual
1 skipped
69 passed (7.7m)
```

The sole visual skip is the desktop instance of the phone landscape test; its mobile instance passed. There are no skipped integration cases. All required gates have clean exits; no outstanding functional blocker remains.

Successful cleanup: `COMPOSE_PROJECT_NAME=chathermes-issue-204 CHATHERMES_DASHBOARD_PORT=9129 CHATHERMES_MOCKSERVER_PORT=1180 docker compose --project-directory . -f tests/docker/compose.yml --profile android down -v` exited 0. A project-scoped `ps -q` returned no containers. The temporary loopback forward was stopped. Only this project’s resources were removed, after all gates passed. Final formatting, lint and `git diff --check` are clean; no files are staged and generated dist has no diff.
