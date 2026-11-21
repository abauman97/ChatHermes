# Issue #262: final validation on updated main

Worktree: `/opt/data/projects/ChatHermes-issue-262`.
Incoming branch: `maintenance/issue-262-v0233` at
`c1e37b5a3f11d4e7f4df03df058b78691d69166a`.
Reconciled base: `532a5df6348456dfdec4a4fedd6816202a857901`.
Hermes source: `caafe5389ae585ef77387a962aee05b1bcf17029` (v0.23.3).

This continuation preserves the existing compatibility migration and recovery
fixes. The preceding [migration record](2026-11-21-issue262-v0233.md) contains
historical failures and investigations; those results are not substituted for
this run.

## Preservation and reconciliation

Before changing files, saved all incoming modified/untracked nonignored files in
`tmp/issue262-final-review/incoming-work.tar`, a binary tracked diff in
`incoming.patch`, and the complete generated dashboard directory in
`incoming-dist.tar`. The existing visual output was copied to
`incoming-visual-output/` before Playwright could replace it.

Compared the incoming HEAD with the requested existing `origin/main` revision.
Applied upstream source changes using three-way file merges with the incoming
HEAD as common base; files unchanged locally received their upstream content.
All merges completed without conflicts, including API documentation, user
features and the Kanban workflow. This retains upstream completion-summary
validation and its tests. Only after all source merges succeeded, ran
`git reset --mixed 532a5df6348456dfdec4a4fedd6816202a857901` to move this branch
and align its index with that base. No commit or stash commit was created.
Generated assets were excluded from the source merge. A backup comparison found
no incoming source changes outside the files reconciled with upstream.

After building, archived the tested assets in `tested-dist.tar` and restored all
nine incoming generated files byte-for-byte from `incoming-dist.tar`.
`restored-dist-sha256.json` records their hashes. New generated output remains
ignored. The locally restored dist intentionally does not represent the tested
source; the running fixture image and tested archive do. No generated assets,
secrets or temporary artifacts were staged or committed.

## Environment and exact commands

Commands run from this worktree through
`sh tmp/issue262-final-review/check.sh NAME COMMAND...`. That helper sources the
existing `tmp/v0233-compat/env.sh`, records the command in `NAME.command`, its
output in `NAME.log` and its exit status in `results.tsv`. Environment:

- Checkout-local Node v22.23.5 and `node_modules/.bin` precede the host PATH.
- `PYTHONPATH=.hermes-source:plugin` for Python/API/runtime comparisons.
- Checkout-local Chromium under `tmp/playwright-browsers`, selected by
  `CHATHERMES_CHROMIUM`.
- `COMPOSE_PROJECT_NAME=chathermes-262-20261121`.
- Dashboard/MockServer ports 26219/26280, private Docker bind `172.25.0.2`.
- Existing override `tmp/v0233-compat/compose.yml`, subnet `10.232.162.0/24`.
- Secure-context browser origin `http://127.0.0.1:26219` through the existing
  private forwarding process. MockServer uses `http://docker:26280`.

Only this project's Hermes fixture was explicitly replaced. Volumes and retained
state were preserved. Other worktrees and unrelated containers were not changed.
No upstream Hermes source files were modified. No commit, push, PR or production
deployment was performed.

| Command                                                                                                                                  | Result                        |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `uv sync --locked`                                                                                                                       | Exit 0                        |
| `vp fmt`                                                                                                                                 | Exit 0                        |
| `vp fmt --check`                                                                                                                         | Exit 0                        |
| `vp lint`                                                                                                                                | Exit 0                        |
| `uv run ruff format .`                                                                                                                   | Exit 0                        |
| `uv run ruff check --fix .`                                                                                                              | Exit 0                        |
| `uv run ty check`                                                                                                                        | Exit 0                        |
| `npm test`                                                                                                                               | Exit 0; 61 files, 2,119 tests |
| `PYTHONPATH=.hermes-source:plugin uv run pytest`                                                                                         | Exit 0; 831 passed            |
| `PYTHONPATH=.hermes-source:plugin npm run test:api`                                                                                      | Exit 0; 182 passed            |
| `npm run test:docker`                                                                                                                    | Exit 0; 16 passed             |
| `npm run build`                                                                                                                          | Exit 0                        |
| `npm run test:env:build`                                                                                                                 | Exit 0                        |
| `docker compose --project-directory . -f tests/docker/compose.yml -f tmp/v0233-compat/compose.yml up -d --no-build`                      | Exit 0                        |
| `docker compose --project-directory . -f tests/docker/compose.yml -f tmp/v0233-compat/compose.yml up -d --wait --no-build --no-recreate` | Exit 0                        |
| `npm run test:fixtures`                                                                                                                  | Exit 0                        |
| `node scripts/sync-command-parity.mjs --check`                                                                                           | Exit 0                        |
| `node tmp/issue262-final-review/independent-visual.mjs`                                                                                  | Exit 0                        |
| `git diff --check`                                                                                                                       | Exit 0                        |

API tests completed before builds to avoid concurrent replacement of served assets.
The full Python suite used the locked uv-managed Python 3.14 environment and
reviewed local Hermes source. Formatting and lint fixes made no changes to the
incoming source outside the upstream reconciliation.

Initial tested image (before the subsequent identity repair):
`sha256:b2059808bab15a2ebe1e63beea75f152928e7b30b087ab216bb7efbafb9af09c`.
Integration startup verified this image ID and the exact upstream install stamp.
A read-only copy of `/opt/chathermes/plugin` was compared with local files: all
18 plugin Python files and all nine tested generated assets matched byte-for-byte.
`tested-source-sha256.json` fingerprints 389 source/test/config files for the
final drift check; `tested-image.txt` retains the image ID.

## Mounted dashboard visuals

Independent authenticated checks used the actual React-mounted plugin at
1280×900 desktop and 390×844 mobile. Both checked focus on Home and during work,
sent-message/activity ordering, active tool details, completed/manual disclosure
inspection, context-popover bounds, native select text at 16px, authenticated
attachment selection, fixed header bounds and horizontal overflow.

Captures are under `tmp/issue262-final-review/screenshots/`:
`desktop-active.png`, `desktop-context.png`, `desktop-disclosure.png`,
`desktop-select.png`, `desktop-attachment.png`, and matching `mobile-*.png` files.
`observations.json` retains viewport and geometry results. The desktop context
popover top was 509.25px; mobile was 465.25px, with both fully within the viewport.
The active, attachment and context captures on both sizes and mobile disclosure
and select captures were inspected. These fresh mobile captures painted the full
transcript correctly; the earlier historical blank capture did not reproduce in
this scenario. This alone does not identify the historical rendering cause or
verify a native mobile device.

## Full integration gate

The first `npm run test:integration` attempt reached test 190: 188 passed,
one mobile compressed-continuation case failed and one mobile-only duplicate of
a desktop responsive case was skipped. The runner then exited with signal status
143 before the final two tests and summary. No termination signal was sent by
this continuation; the exact external termination cause is unconfirmed. This is
not a completed gate. Output and screenshots are retained in `integration.log`
and `first-integration-output/`. The subsequent full run used a detached process.

### Compressed continuation: pagination prerequisite and native identity

The failed waiting-status assertion followed successful native activity checks:
the API reported `waiting`, included the root and tip aliases and excluded the
stale sibling. An independent reproduction (`compressed-diagnostic`, exit 1)
recorded allowlisted identity, list membership and Project metadata. Project-tree
timing initially suggested a filtering problem, but source inspection ruled
that explanation out for the main sidebar: it receives the global `sessions`
list, not the Project-filtered `visibleSessions` value.

The actual gateway REST list (`data`, distinct from the dashboard list's
`sessions` envelope) placed the failing untracked tip at index 34. Its recency
was 1795299503.8713872, while retained transcript fixtures occupied the head of
the list at 1800000003. The first sidebar page has 30 entries. These intentionally
synthetic future timestamps therefore made the workflow's first-page recency
assumption invalid as retained fixtures accumulated. The product was following
the native order; neither a longer wait nor an activity-status change could add
a row outside that page.

The workflow now explicitly marks its fixture root Open before navigation. The
real plugin tracking reconciliation resolves that root to the tip and supplies
its metadata independently of Recents pagination. An initial fixture-import
failure was corrected by adding the installed plugin directory to that fixture's
Python path, as other repository runtime fixtures do. No runtime source was
patched. The desktop/mobile focused run then passed both cases in 30 seconds
(`open-continuation-browser-import`, exit 0). It retains all original waiting,
stale-sibling and completion checks and adds canonical selection plus a scoped
Home reload and return through the original root URL. The fixture's native Home
node is `__no_project__`; the workflow waits for its loaded membership rather
than passing an early assertion before Project data arrives.

The diagnosis also exposed a separate real UI defect: current Project membership
and sidebar selection compared the root route ID with a tree containing only the
continuation tip. A mounted regression failed before that fix and passes after
it. Foreign-profile and other-session snapshots cannot change scope, and the
root route is preserved. Native settings now retain the resume's top-level
stored identity separately from `info`, preserving recovery/publication behavior.
The pinned cold-resume path returns `session_key`; warm paths may return
`stored_session_id`, and materialized information may supply an updated stored
ID. Separate protocol-state regressions cover both top-level field variants.
All 194 focused native-state/reconnect/Project tests passed.

Intermediate failures remain in `results.tsv` and their named logs:

- `repair-frontend` failed its unchanged memory timing budget (441ms against
  250ms) while Python was running, plus a missing-info fallback.
  `repair-frontend-final` passed all 2,120 tests without competing local suites.
- `identity-frontend` caught two settings-publication assertions after an
  intermediate normalization changed unavailable-info behavior. Keeping the
  stored identity separate resolved them; `stored-identity-frontend` passed
  all 2,121 tests.
- The warm-field-only live attempts failed at loaded scope; the cold-key
  regression failed before adding `session_key` support. After that correction,
  the loaded scope assertion passed, but the original sidebar assertion still
  failed until its Open prerequisite was supplied.

No timing limit, assertion timeout or retry count was relaxed. A passing quiet
rerun does not by itself establish the timing failure's cause. Failure output is
preserved under `first-integration-output/`, `partial-scope-output/`,
`warm-only-output/`, `scope-correct-row-missing-output/` and
`open-fixture-import-output/`. Passing focused screenshots are in
`fixed-continuation-output/`; mobile background-working and desktop completion
captures were inspected.

Final local gates, fresh mounted visuals and the complete detached integration
run have passed. Its source/test/config fingerprint is
`tested-source-sha256.json`; the final preservation audit confirms no source drift.
Android/native-device and real-provider tests are outside the requested
desktop/mobile viewport gate. The container-only legacy Python probes under
`tests/integration/` are excluded from standard local pytest and have not been run
separately.

## Final candidate checks and visual evidence

The final image is
`sha256:4d4ea857178dcec39bd6e4a5f287d00e181e928621c38730199b5f389b0ae6a3`.
`final-attestation.log` verifies all 18 plugin Python files and nine built assets
against that running image. It fingerprints 389 source/test/config files and
restores all nine incoming dist files byte-for-byte. The generated files remain
unstaged, with the tested build archived separately. The final explicit rebuild
reused this same image because its product source and assets were unchanged.

All commands below use the environment documented above. `final-*` logs and
`results.tsv` retain their individual exit statuses.

| Command                                                                                                                    | Final candidate result                                           |
| -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `uv sync --locked`                                                                                                         | Exit 0                                                           |
| `vp fmt`                                                                                                                   | Exit 0                                                           |
| `vp lint`                                                                                                                  | Exit 0                                                           |
| `npm test`                                                                                                                 | Exit 0; 61 files, 2,122 tests                                    |
| `uv run ruff format .`                                                                                                     | Exit 0                                                           |
| `uv run ruff check --fix .`                                                                                                | Exit 0                                                           |
| `uv run ty check`                                                                                                          | Exit 0                                                           |
| `PYTHONPATH=.hermes-source:plugin uv run pytest`                                                                           | Exit 0; 831 passed                                               |
| `PYTHONPATH=.hermes-source:plugin npm run test:api`                                                                        | Exit 0; 182 passed                                               |
| `npm run test:docker`                                                                                                      | Exit 0; 16 passed                                                |
| `npm run build`                                                                                                            | Exit 0                                                           |
| `npm run test:env:build`                                                                                                   | Exit 0                                                           |
| `docker compose --project-directory . -f tests/docker/compose.yml -f tmp/v0233-compat/compose.yml up -d --wait --no-build` | Exit 0                                                           |
| `npm run test:integration -- tests/workflows/sidebar-working.spec.ts --grep 'compressed continuation'`                     | Exit 0; both desktop/mobile cases passed                         |
| `uv run python tmp/issue262-final-review/attest-and-preserve.py`                                                           | Exit 0                                                           |
| `node tmp/issue262-final-review/independent-visual.mjs`                                                                    | Exit 0                                                           |
| `node tmp/issue262-final-review/mobile-repaint.mjs`                                                                        | Exit 0                                                           |
| `uv run python tmp/issue262-final-review/launch-full.py`                                                                   | Exit 0; launched complete integration in its own process session |

The final visual captures overwrite only this continuation's initial named
`screenshots/` paths; those earlier captures are preserved in
`first-source-screenshots/`. Final images cover active work, context popovers,
completed/manual disclosures, native selects and attachments at both viewport
sizes. `mobile-repaint/` additionally captures attachments before scroll, after
scroll and after a 1px viewport resize/restore, and records normal DOM geometry.

The three final attachment PNGs are **byte-identical**, SHA-256
`6c2c6ac194c55600f2784e218532a5c9c2cb9082f529b761c6f59ede93ac0157`.
The retained historical trio in `tmp/v0233-compat/final-visual-repaint/` is also
byte-identical, SHA-256
`55512206716215f55ca9e3fafdb25dad2e9143e2cb3934ad499c69e91273ee80`.
The initial attachment images show the complete transcript. Thus the earlier
record's claimed different paint states are not substantiated by these saved
PNG files; scrolling and resize did not change their captured pixels. No
speculative layout workaround was introduced for that assessment. This is
Chromium mobile emulation, not a native Android/iOS device result.

`final-integration.log` belongs to the full 192-case desktop/mobile run, launched
through `run-full-detached.sh` and the same recorded command
`npm run test:integration`. The launcher uses `start_new_session=True` and closes
all inherited standard streams; it is independent of a long-lived tool session.
The complete run finished with **191 passed, one intentional skip, exit 0, in
40.6 minutes** (`final-integration`, `final-integration.log`). Desktop passed all
96 cases; mobile passed 95 and skipped its duplicate of the narrow-desktop drawer
case, whose responsive coverage passed in the desktop project. The corrected
compressed-continuation workflow passed in the full run on both sizes.

The full screenshot tree is preserved at
`tmp/issue262-final-review/final-integration-output/`, including:

- `sidebar-working-compressed-dfc8a-g-navigation-and-completion-mobile/compressed-completed.png`
- `shell-scrolling-a-long-sid-c15df-when-controls-receive-focus-mobile/long-sidebar-focus.png`
- Matching desktop directories and all other workflow captures.

Final command:
`uv run python tmp/issue262-final-review/final-audit.py` (exit 0,
`final-preservation-audit.log`). All 389 source/test/config files match their
pre-run hashes, all nine incoming generated files match the preserved baseline,
and incoming work has no unexplained changes outside reviewed upstream merges
and the documented repairs. The Git index is empty; HEAD is the requested
`532a5df6348456dfdec4a4fedd6816202a857901`. The Hermes checkout remains clean at
its exact pin. The test container remains healthy on the verified final image.

There are no current blockers within the requested deterministic desktop/mobile
gate. Native Android/iOS devices, real providers and the excluded legacy
container-only Python probes are not covered by this run. All final local gates
passed; intermediate failures remain recorded rather than counted as successes.
No commits, staging, pushes or PR creation were performed. No unrelated worktree
or container was modified, and no environment was destructively reset or cleaned.
