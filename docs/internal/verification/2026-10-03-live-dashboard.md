# Live dashboard workflow verification — 2026-10-03

Implemented and verified in `feat/issue-10-live-docker`, exclusively in this
worktree. No push or PR. `npm run live` builds the plugin and pinned image,
starts an authenticated native Hermes dashboard with ChatHermes enabled, and
waits for readiness. `live:visual`, `live:real`, and `live:stop` provide browser
verification, explicit real-provider mode, and volume-preserving shutdown.

The injected `tcp://docker:2375` Docker endpoint failed with an invalid bind
address. The repository's documented alternative, `tcp://172.25.0.2:2375`, returned
a working Docker Engine 29.8.2. No local socket or Compose plugin was available.
The runner supports this exact endpoint correction and leaves other Docker
contexts unchanged. The tested dashboard was `http://172.25.0.2:9121/chathermes`;
existing dashboards on 9119/9120 and their containers were left running.

Docker inspection confirmed only `172.25.0.2:9121 -> 9119/tcp` was published and
only the dedicated named volume `chathermes-test-hermes-test-data` was mounted
at `/opt/data`. No personal Hermes home or host bind mounts were used. Source
revision, source checksum and base image digest are unchanged. Provider secrets
were not needed. Basic auth used only the existing synthetic test credentials.

| Check                                      | Result                                                                      |
| ------------------------------------------ | --------------------------------------------------------------------------- |
| `npm test`                                 | 48 tests passed, 6 files                                                    |
| `npm run test:api` (test virtualenv)       | 27 passed                                                                   |
| `npm run test:docker`                      | 6 passed                                                                    |
| `npm run build`                            | Passed; rebuilt committed assets are byte-identical                         |
| `sh -n tests/docker/run.sh`                | Passed                                                                      |
| Native `/test/verify_seed.py`              | Passed                                                                      |
| Anonymous plugin Projects request          | HTTP 401                                                                    |
| Desktop composer/browser case              | Passed (20.4s)                                                              |
| Mobile composer/browser case               | Passed (14.7s)                                                              |
| Desktop Project and activity cases         | 2 passed (42.2s total)                                                      |
| Mobile Project and activity cases          | 2 passed (40.1s total)                                                      |
| Additional real-history scroll/focus check | Passed at 1280×720 and 390×667                                              |
| `npm run live:stop`                        | Passed; dedicated volume preserved, other containers untouched              |
| Relaunch with `npm run live`               | Passed; authenticated history and desktop/mobile scroll checks passed again |

The first full Playwright invocation was terminated with exit 143 after the
desktop composer case passed, during the following Project case. The remaining
five cases were run in smaller batches and all passed. No browser assertion
failed in those six completed cases. The supplementary scrolling check initially
assumed the short restored transcript would overflow an 844px-tall mobile
viewport; it fits. A shorter viewport exercised actual scrolling. Its navigation
selector was then scoped to the plugin to avoid matching the host navigation.
The final supplementary check passed in both viewports.

Visually inspected real dashboard screenshots for desktop/mobile home, provider
and model selection, arriving activity, completed and reopened tool output,
file uploads, camera image content parts, profiles, native Projects and mobile
navigation. Checked composer focus on home and during active native prompts,
16px inputs, viewport behavior, authenticated attachments, profile isolation,
model runtime locking, sent/activity/response order, disclosure collapse/reopen,
and scroll top/bottom with composer remaining visible. Inspected supplementary
scroll screenshots and settled mobile navigation after the transition.

Artifacts remain ignored under `tests/visual-output/`: the initial desktop
composer directory, `mobile-dashboard/`, `desktop-projects/`, `mobile-projects/`,
and `live-scroll/`. The supplementary script remains untracked in ignored `tmp/`.
No screenshots, traces, credentials, generated state, or session data are committed.

Limitations: Compose itself could not be executed because the daemon client has
no Compose plugin; its equivalent shell workflow was exercised. Model replies
used the deterministic fixture through the actual Hermes agent runtime; no paid
provider integration was run. Physical iOS keyboard/camera hardware was not
available. Native Hermes emitted its existing SQLite WAL warning; the seed check
still passed using its fallback journal mode. No pin was changed to suppress it.
