# Persistent TUI integration on current main

Integration in the existing `feat/persistent-tui-gateway` worktree, based on
`83625935ea7c579efbbc4c2ff5d892605643bc50`. No commit, push or production deployment.

## Scope and preservation

Reviewed `AGENTS.md`, the plan recovered through `git show 7cda324:docs/plans/persistent-tui-gateway.md`,
`58b0c95..7cda324`, current Scheduled/frontend/backend code, and the first-send stash
in `/opt/data/projects/ChatHermes-reconnect`. Applied the relevant source/test diffs
with manual conflict integration. Rebuilt dist instead of recovering old bundles.

- New Other and Project turns use the authenticated, profile-bound native TUI
  facade, additive viewer transport, bounded replay and native request answers.
  Legacy admitted Runs keep their original runtime and recovery adapter.
- Issue-27 Scheduled routes, history, output, pagination, discussion drafts and
  initial scroll behavior remain. Scheduled source/tests and seed code are preserved.
- Issue-30 Docker source/archive/base-image pins, instance-scoped containers and
  named data volume, explicit bind/port, and provider-agnostic `LLM_API_*` settings
  remain. Compose and the old provider-specific tracked configuration were not restored.
- Fixture runtime/model use an instance-scoped internal network. Only an inbound
  browser relay publishes the dashboard; real mode retains provider access.
  Config validation happens before build/mutations. Temporary config cleanup,
  model selection and native probe guards have Docker regression tests.
- The first-send fix was selectively recovered without popping/applying the stash.
  `native_channel.py`, `native-chat.ts` and its tests exactly match the saved source.
  `hermes-api.ts` combines that fix with Scheduled. Attach/preflight failures reject
  before submission and allow retry; lost submit acknowledgements remain unknown.

## Verification

| Check                                                                                | Result                                                                                                                                       |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm ci`                                                                             | Passed; 152 packages installed, audit reported no vulnerabilities                                                                            |
| `npm test`                                                                           | 111 tests in 13 files passed; exit 0                                                                                                         |
| `PATH=/opt/data/projects/ChatHermes-reconnect/.venv-test/bin:$PATH npm run test:api` | 72 passed; exit 0                                                                                                                            |
| `npm run build`                                                                      | Passed; rebuilt `dashboard/dist/`, including Scheduled and native UI; exit 0                                                                 |
| `npm run test:docker`                                                                | 18 passed; exit 0                                                                                                                            |
| `npm run test:native`                                                                | 84 pinned protocol/lifecycle/contract checks, actual native model/image runtime probe, 18 desktop/mobile socket/browser cases passed; exit 0 |
| Combined `npm run test:visual`                                                       | 38 cases reported passed, `.last-run.json` passed; outer process returned 143, so clean project-specific runs were required                  |
| Final desktop visual run                                                             | `npm run test:visual -- --project=desktop --output=/tmp/chathermes-ptuigateway-desktop-final`: 19 passed, exit 0                             |
| Final mobile visual run                                                              | `npm run test:visual -- --project=mobile --output=/tmp/chathermes-ptuigateway-mobile-final`: 19 passed, exit 0                               |

Both fixture launches used:

```sh
DOCKER_HOST=tcp://172.25.0.2:2375 \
CHATHERMES_INSTANCE=ptuigateway \
CHATHERMES_BIND_ADDRESS=172.25.0.2 \
CHATHERMES_DASHBOARD_PORT=9133 npm run live
```

Browser tests used `CHATHERMES_TEST_URL=http://172.25.0.2:9133` and installed
Chromium at `/opt/data/profiles/developer/home/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`.
The final image is `sha256:1062075bd9120557e44bdf04514782735878cfce2aa206f97468440662d36f8a`;
the source pin remains `3632f9173d218fd24f3fa595d7affa159b0774cd`.
Actual Docker inspection confirmed that Hermes/model only join the internal network
and that Hermes mounts `chathermes-ptuigateway-hermes-data` without host bind mounts.

Visual assertions cover composer focus on Home, while working and at requests;
16px inputs; profile/model selection; uploads and camera image admission/reopen;
stream ordering and disclosure expansion/completion; history and code scrolling;
reload/second viewer, steering, Stop, approvals, clarification; unknown acknowledgements;
first-send attach failure with zero submissions followed by exactly one successful retry;
Scheduled saved output/discussion; Projects; and same-document host viewport restoration.
Screenshots were inspected at desktop/mobile sizes against the reference design.

Full-run screenshots are saved outside tracked state at
`/tmp/chathermes-ptuigateway-full-visual/`. Project-specific final artifacts are in
`/tmp/chathermes-ptuigateway-desktop-final/` and `/tmp/chathermes-ptuigateway-mobile-final/`.
Local test logs are `/tmp/ptui-{unit,api,build,native,visual,desktop-final,mobile-final}.log`.

## Limits

The reviewed native pin still lacks transactional durable admission receipts,
an atomic snapshot/replay watermark and an offline owner lease. Those guarantees
remain explicitly false. Viewer detach follows Hermes's bounded orphan reaper;
unknown prompts are never automatically retried. Physical iOS keyboard/camera,
Safari, launched Desktop-client parity, multi-worker affinity, reverse-proxy prefixes,
process-crash recovery and real-provider behavior were not tested in this integration.
The pinned runtime emitted its SQLite DELETE-journal fallback and an optional
mixture-of-agents tool import warning; the tested native terminal/clarify/image paths passed.
Historical results from `7cda324` are labelled separately and are not this run's evidence.

Cleanup: `DOCKER_HOST=tcp://172.25.0.2:2375 CHATHERMES_INSTANCE=ptuigateway npm run live:stop`
passed. Only the three selected instance containers were removed. Docker inspection
confirmed the named `chathermes-ptuigateway-hermes-data` volume remains; other
pre-existing containers remain running. No test volume was deleted.

Final git checks: HEAD remains `8362593` on `feat/persistent-tui-gateway`, no
unmerged entries or conflict markers, and whitespace checks pass. All changes,
including the regenerated `app-B1h7o90j.js` bundle, remain uncommitted.
