# Hermes v0.23.0 compatibility — 2026-11-09

## Scope and provenance

Isolated worktree: `chathermes-hermes-v023-1794188815`. No commits, pushes,
PRs, installed-plugin changes, other-worktree changes, provider credentials or
real-provider calls are part of this verification.

Reviewed source: Hermes tag `v0.23.0` resolves to
`2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19`. The ignored `.hermes-source`
checkout is detached at that commit, with a clean working tree.

Official multi-platform image:
`nousresearch/hermes-agent:v0.23.0@sha256:adb7890916de63245523492be8f68f9d2095fecbec4e2a6dab7960381f0fc002`.
Its `/opt/hermes/install-stamp.json` commit and image-provenance revision both
match the source pin. The fixture Dockerfile now uses that immutable digest,
checks the stamp at build time, and the integration runner compares the retained
container's verified revision with the current checkout's pin before loading
fixtures or starting browser tests. The image's provenance `version` field is
`0.0.0`; verification uses its exact commit, not that field or a mutable tag.

The native capability identifier and reviewed source, maintained developer guides,
and generated shared gateway types are updated together. Native-only event and
transport adaptations remain in place. No rendering or interaction changes were
needed. Generated types were copied from upstream, then formatted with Vite+.

Tooling: Node 26.12.1 (the environment's installed version; docs recommend Node
22), Vite+ 1.1.0, uv 0.13.7 installed under this worktree's ignored `tmp/`, and
uv-managed Python 3.14.4. `npm ci` and `uv sync --locked` both exited 0.

## Diagnosed compatibility failures

Initial `npm run test:api` exited 1: 179 passed, two artifact tests failed.
Initial full Python suite exited 1: 641 passed, three failed.

- `test_automatic_remote_artifacts_probe_the_runtime_without_local_reads`: the
  new native download helper imports the SSH adapter, which imports
  `tools.environments.file_sync` and its `psutil` dependency. The development
  environment lacked `psutil`; plugin error handling correctly returned a
  sanitized unsupported-operation response. Added only this required root
  development dependency through `uv add --dev`, keeping the plugin runtime
  metadata separate and the root lock synchronized.
- `test_automatic_artifacts_use_native_canonical_security_and_indexing`: v0.23.0
  calls `_fs_owned_session` before selecting a backend and passes the resolved
  session to `_fs_download_path(session=...)`. Absolute paths also consult the
  profile's staged-upload ownership. The old test's synthetic profile/session
  prerequisite and resolver signature no longer supplied that contract. Updated
  only the isolated prerequisites. Native canonicalization, sensitive-file,
  symlink, managed-root, readability and indexing assertions still run.
- `test_profile_copies_get_unique_metadata_only_workspace_members`: native
  `pm.workspace._generate_pyproject` now requires keyword-only `python` to derive
  the target interpreter's marker environment. Pass `sys.executable`; retain
  assertions on distinct metadata-only workspace members and dependency parity.

Source diffs against the previous reviewed commit
`bf0203a794a07aac3ff764972ab9087baa4e4f4e` confirm these changes. The old native
file-download handler selected the SSH backend before checking a session. A new
regression exercises the v0.23.0 handler and verifies a foreign session is refused
before remote backend selection. No production file-security bypass or protocol
fallback was added. Image regressions reject a wrong, placeholder, absent or
missing stamp, and reject an older retained image even if its embedded verifier
accepts its own older pin.

Focused compatibility checks: first attempt exited 1 (one local artifact failure
remained after the new session prerequisite); after supplying the isolated profile
scope, six passed, exit 0. The final image-pin regression suite passed three tests,
exit 0. An initial Ruff check caught B008 on a new default-path expression; moved
the expression to a module constant and subsequent checks pass.

## Independent validation commands

Each command ran independently with stdout/stderr captured under ignored
`tmp/compat-v023/`; exit statuses are in `status.tsv`. Python tests use
`PYTHONPATH=.hermes-source:plugin` and the worktree's uv-managed environment.

| Command                                          | Exit | Result                                                           |
| ------------------------------------------------ | ---- | ---------------------------------------------------------------- |
| `npm test`                                       | 0    | 48 files, 1,490 tests passed after pin/type update               |
| `npm run test:api`                               | 0    | 182 passed                                                       |
| `npm run build`                                  | 0    | TypeScript and plugin assets built                               |
| `PYTHONPATH=.hermes-source:plugin uv run pytest` | 0    | 646 passed, including the retained-image regression              |
| `vp lint`                                        | 0    | Passed                                                           |
| `vp fmt`                                         | 0    | Applied formatting                                               |
| `uv run ruff format .`                           | 0    | Passed                                                           |
| `uv run ruff check --fix .`                      | 0    | Passed                                                           |
| `uv run ty check`                                | 0    | Passed                                                           |
| `uv sync --locked`                               | 0    | Passed after the intentional psutil addition                     |
| `npm run test:env:build`                         | 0    | Immutable release image and build-time stamp verification passed |

## Real Hermes integration

Compose project: `chathermes-v023-1794188815`.
Private Docker-daemon bind address: `172.25.0.2`. Distinct publications:
dashboard 23719, MockServer 23780; unused Android reservations 23760/23723.
Android and real providers were not requested or run.

First `npm run test:integration` exited 1 before tests: Docker's predefined
address pools were exhausted. Following `tests/docker/README.md`, an ignored
`compose.override.yml` supplies unused subnet `10.253.237.0/24`. No other project
network or container was removed. Every subsequent integration command uses
`CHATHERMES_COMPOSE_OVERRIDE` and the same network settings.

The retry exited 1: all 132 desktop/mobile scenarios failed to launch Chromium,
with `Executable doesn't exist at ... chromium_headless_shell-1243/...`.
No browser assertions executed in that attempt. The inherited global browser
path pointed at the installed runtime's tool store. The initial browser install
was terminated (exit 143); the successful retry used
`PLAYWRIGHT_BROWSERS_PATH=$PWD/tmp/compat-v023/browsers` (exit 0), keeping downloaded
browsers local to this worktree. Existing installed Hermes was not used as the
test server.

The next full integration run passed its first seven desktop workflows (artifacts,
automatic artifact delivery, context/focus controls, Allow/Deny approvals,
background execution restoration and thinking disclosures), then its terminal
runner exited 143 without a Playwright summary. The signal's source is unknown;
this does not establish full suite success. The containers and their state were
retained. A fresh explicitly rebuilt image and a detached runner are used for the
final attempt, with a separate output directory.

The rebuilt full run was deliberately interrupted after diagnosing the repeated
Inbox prerequisite failure: exit 130, seven passed, two failed, one interrupted,
122 not run (6.8 minutes). Failures:

- `inbox.spec.ts:8`, global cross-profile Inbox collection: 240-second timeout
  in `authenticate()`, waiting for visible `Choose model`.
- `inbox.spec.ts:86`, repeated Inbox filtering: 90-second timeout at the same
  prerequisite (call at line 133).

The first failure screenshot shows the authenticated alpha Inbox with completed
alpha and beta responses. Inbox intentionally hides the composer:
`src/router/index.ts` gives it no chat/composer metadata, and `src/App.vue`
passes `hide-composer` on non-chat/non-Project routes. The readiness helper always
waits for a model button inside that absent composer. Both behaviors are identical
in the worktree's original HEAD, so this prerequisite mismatch does not depend on
the Hermes source pin. The test later expects an Inbox composer as well. It was
left unchanged under the compatibility-only scope; no UI behavior was changed to
satisfy it. This blocks claiming a fully passing integration suite.

The remaining suite uses the same retained project, revision checks and fixtures:

`npm run test:integration -- --grep-invert='inbox.spec.ts|@installed|@native' --output=tests/integration-output/v023-remaining`

This explicitly excludes 16 Inbox desktop/mobile scenarios and keeps the standard
installed/native exclusions. It selected 116 tests and completed with exit 1: **101 passed, 14 failed, one
intentional mobile skip** (18.6 minutes). The skip is the narrow-desktop drawer
scenario on mobile. The 14 failures are the following seven cases on both desktop
and mobile: Kanban (one), labeled MEDIA (default and alpha), worker clicks,
precache updates, narrow Projects menu and saved Cron restoration. Failure
assertions and root causes:

- Kanban reaches the final Inbox navigation step after real board/task edits,
  attachments, events, archive and delete pass. At `kanban.spec.ts:252`, its
  generic `getByRole("button")` matches both the notification open button and
  the remove button, causing Playwright strict-mode failure. The test and the
  two-button Inbox row are unchanged from the original HEAD.
- Labeled MEDIA (default and alpha) reaches the third assistant paragraph and
  expects two duplicate cards at `media-labeled.spec.ts:42`; it receives zero.
  Those exact paths are already delivered in the first assistant paragraph.
  Existing `AssistantTurn.vue` deduplicates artifacts across blocks in a turn;
  the existing `AssistantTurn.test.ts` explicitly asserts this behavior. Both
  are unchanged from HEAD. The first six labeled cards do render. No artifact
  rendering change is made to satisfy the contradictory expectation.

These are existing workflow/expectation mismatches, separate from the pinned
native API prerequisite changes fixed above. All remaining failures were collected rather than silently filtered.

The Projects narrow-menu test (`project-filter.spec.ts:143`) passes its menu
assertions, then waits for `Message Hermes` on the Projects catalog, another
route that intentionally hides the composer in unchanged HEAD. This is the same
non-chat composer expectation mismatch as Inbox. The saved-Cron test at
`workspaces.spec.ts:83` also loads and reloads the exact saved output successfully,
then fails its final `Message Hermes` enabled assertion on the composer-free
Scheduled route (`workspaces.spec.ts:101`).

The desktop worker-click test (`navigation.spec.ts:116`) and update test
(`precache.spec.ts:8`) fail with `navigator.serviceWorker` undefined at
`register`: the runner reached the remote daemon at insecure
`http://docker:23719`. A private raw TCP forward on runner loopback
`127.0.0.1:33719` preserves HTTP/WebSockets and provides a browser secure context.
The forwarded public readiness endpoint returned HTTP 200. These scenarios were
retried with `CHATHERMES_TEST_URL=http://127.0.0.1:33719`; no browser security
flags or product code changes are needed.

Failure output from the missing-browser attempt remains in
`tests/visual-output/`. Interrupted browser evidence remains in
`tests/integration-output/v023-browser/`; final evidence is written to
`tests/integration-output/v023-final/`. Raw authentication traces are disabled.
The authenticated desktop automatic-artifact and mobile artifact-grid screenshots
were inspected: the native
plugin shows delivered files, a readable transcript, model/profile selects and a
usable composer. The mobile automatic-artifact screenshot also shows the focused
composer, compact controls and delivered-file cards. Workflow assertions check
focus, scrolling, authenticated attachments, selects and disclosure transitions.
These are Chromium mobile viewports, not native Android/iOS keyboard verification.

Containers and volume state are intentionally retained for debugging. No cleanup,
reset, implicit rebuild, Android reinstall or provider-secret logging is performed.
Generated `dashboard/dist/` output is never staged or committed; tracked generated
files were restored after validation.

The final built fixture image is
`sha256:cbe7d86938b5f3fee0f88f21a7844bc1eded0b78bda4fd38c6193827ac54ba6c`.
A post-run invocation of its verifier still reports the exact reviewed commit.
Secure-origin retry: exit 1, two passed and two failed (54.5 seconds). Both
desktop/mobile precache update scenarios pass through loopback. Both worker-click
scenarios register their worker, then fail at `showNotification` with
`No notification permission has been granted for this origin`.

A separate browser metadata probe (exit 0) isolates a headless-shell limitation:
in the secure loopback document, Permissions API reports `granted` but
`Notification.permission` is `denied`, and the worker rejects the notification.
The same probe using the full Chromium executable downloaded into this worktree
(exit 0) reports both permissions `granted` and accepts the notification. Only
permission states, script paths and success/error types are logged. No provider
settings or authentication data are printed.

The two worker-click scenarios were retried with
`CHATHERMES_CHROMIUM=$PWD/tmp/compat-v023/browsers/chromium-1243/chrome-linux64/chrome`
and the same loopback origin, without changing product code. Exit 1: both fail.
Desktop progresses through notification routing to the exact saved scheduled
output, then exceeds 90 seconds focusing the absent Scheduled composer at
`navigation.spec.ts:232`, the same unchanged non-chat composer assumption
described above. Mobile fails on the repeated click at
`navigation.spec.ts:206`: `getNotifications()` returns no notification, so the
synthetic `NotificationEvent` constructor rejects its undefined required member
before dispatch to the worker. This is a remaining synthetic browser-probe
limitation; it is not evidence of actual device notification receipt or a Hermes
runtime dispatch failure. No native tray/FCM delivery claim is made.

## Final outcome and retained evidence

The exact release source and immutable image are implemented and verified. All
requested local test/build/lint/type commands pass. The deterministic real-Hermes
workflows exercise real profiles, model dispatch, cancellation, tools, native
resume, attachments, transcript paging, Projects, Cron and disclosures at desktop
and mobile sizes. Full browser compatibility is **not** established: the complete
run is blocked by the existing composer/locator/deduplication expectation
mismatches and the notification probe limits above. Those unrelated UI contracts
were not changed to make the suite green.

The main remaining-suite log is `tmp/compat-v023/integration-remaining.log`;
secure-origin and full-browser retries are `integration-secure.log` and
`integration-notifications.log` in the same directory. Their separate screenshots
and failure contexts remain in `tests/integration-output/v023-secure/` and
`tests/integration-output/v023-notifications/`. The earlier complete and interrupted
attempts remain in their original output directories. `status.tsv` records every
validation invocation, including unsuccessful attempts. All fixtures/volumes are
retained, with stable network settings in ignored `compose.override.yml` and
`tmp/compat-v023/compose-env.sh`. The private dashboard TCP forward remains
available at `http://127.0.0.1:33719/chathermes`.

No commit, staging, push or PR was performed. Tracked generated dashboard assets
were restored; no dist changes remain in the Git diff. No unrelated dependencies
were added. The sole dependency addition is the native file-contract development
prerequisite `psutil`.
