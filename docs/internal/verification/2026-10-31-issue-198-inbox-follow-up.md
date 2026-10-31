# Issue 198 Inbox follow-up verification

Historical verification for `/opt/data/projects/ChatHermes-issue-198`, branch
`feat/issue-198-inbox`, on 2026-10-31. No commit, push, deployment or PR creation.
Existing App, Inbox unit-test and workflow edits were inspected and continued.
No `.env` file was inspected.

## Cause and API evidence

The frontend endpoint allowlist rejected numeric `/inbox/{id}` paths. The shell's
cleanup caught `Invalid Hermes API path.` before any DELETE reached the server.
Shell tests mocked `deleteInboxItem`, so they did not exercise this boundary.
The fix permits that numeric route while retaining path and profile validation.
No hosted serving-profile boundary was relaxed and no native readiness guard
was removed.

An authenticated browser inspection against real Hermes observed:

- Owning-profile `GET /inbox?profile=alpha&scope=profile&limit=100`: HTTP 200,
  matching notification present after opening its native session.
- No browser DELETE for that notification before the allowlist fix.
- Direct authenticated `DELETE /inbox/{id}?profile=alpha`: HTTP 200,
  `{"deleted":true}`.
- A separate beta-scoped lookup returned only beta rows and included its target.

The client regression first failed with `Invalid Hermes API path.` and passed
after the fix. Native workflow cases now observe the actual owning-profile lookup
and successful DELETE response, verify disappearance, reload with the request
still pending, then answer it successfully.

The global reconciliation prerequisite queries the default host for both profiles;
the owning-profile query remains in the direct-open deletion assertion. Querying
the alpha host for both alpha and beta would violate hosted isolation.

## Commands and results

Integration commands below use these explicit settings (no environment-file reads):

```sh
export CHATHERMES_CHROMIUM=/opt/data/profiles/developer/cache/playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
export CHATHERMES_BIND_ADDRESS=0.0.0.0
```

| Command                                                                                                                    | Result                                                             |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `npm run test:integration -- tests/workflows/inbox.spec.ts --grep 'opening a native' --project=desktop` before fix         | 4 failed: rows remained after direct and Inbox opens               |
| `npm test -- src/services/hermes-api.test.ts` before fix                                                                   | New regression failed; 9 passed                                    |
| `npm test -- src/services/hermes-api.test.ts src/inbox.test.ts` after fix                                                  | 22 passed                                                          |
| `npm test`                                                                                                                 | 1,006 passed in 37 files                                           |
| `uv sync --locked`                                                                                                         | Passed                                                             |
| `PYTHONPATH=.hermes-source:plugin npm run test:api`                                                                        | 127 passed, including hosted Inbox read/mutation boundaries        |
| `npm run test:env:build`                                                                                                   | Passed; explicitly built assets and pulled/built Hermes test image |
| `CHATHERMES_BIND_ADDRESS=0.0.0.0 docker compose --project-directory . -f tests/docker/compose.yml up -d --wait --no-build` | Healthy stack with original published bind address restored        |
| `npm run test:integration -- tests/workflows/inbox.spec.ts --grep 'opening a native' --project=desktop` after fix          | 4 passed                                                           |

## Additional validation and visual scope

Final additional commands:

| Command                                                                                                                                                                                            | Result                                                           |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `npm run test:integration -- tests/workflows/inbox.spec.ts --grep 'opening a native' --project=mobile`                                                                                             | 4 passed                                                         |
| `npm run test:integration -- tests/workflows/inbox.spec.ts --grep-invert 'opening a native'`                                                                                                       | 4 passed across desktop/mobile                                   |
| `npm run test:integration -- tests/workflows/navigation.spec.ts tests/workflows/messaging.spec.ts --grep 'session navigation\|file and camera\|real tool activity\|resumed model'`                 | 12 passed across desktop/mobile                                  |
| `vp fmt src/App.vue src/inbox.test.ts src/services/hermes-api.ts src/services/hermes-api.test.ts tests/workflows/inbox.spec.ts docs/internal/verification/2026-10-31-issue-198-inbox-follow-up.md` | Passed                                                           |
| `vp lint`                                                                                                                                                                                          | Passed                                                           |
| `npm run build` after native behavior passed                                                                                                                                                       | Passed; bundle hash matched the tested image's `app-BF2qCaYD.js` |

The four completed integration commands cover 24 distinct cases: eight native
direct/Inbox opens, four collection/reconciliation/direct-history cases, and
twelve navigation/upload/model/tool cases. Desktop and mobile are actual embedded
Hermes dashboard plugin views, with mobile using the Chromium iPhone 13 viewport.
Screenshots were inspected for Inbox lists/selects, pending clarification/approval,
attachment cards, tool disclosure output, and the model/reasoning picker. Tests
also assert composer focus, scrolling rows into view, completed disclosure collapse,
explicit expansion, response ordering, reload persistence and profile isolation.
Real Android hardware, installed-app keyboard geometry and real-provider/push
delivery were not exercised.

## Intermediate test-environment findings

Applying Compose without the retained stack's explicit bind setting changed
published ports to loopback on the remote Docker host. The unreachable fixture
loader was interrupted before browser execution; restoring the original
`0.0.0.0` setting resolved access. No volumes were removed or state reset.

A broad 24-case attempt passed desktop collection, reconciliation/direct-history,
direct native opens, tool activity, model/reasoning and two profile navigation
cases, but encountered native-request setup timeouts in the two Inbox-entry
cases and was subsequently terminated with exit 143. It is not counted as a
passing suite.

Allowlisted timing diagnostics showed draft-preparation HTTP returning 200 after
47.2 seconds, followed by successful native ping/create/resume RPCs within
milliseconds. The initial request-visible assertion now uses the same 90-second
observable setup budget as reopening. Both clarification cases then passed.
Temporary diagnostics were removed; no payloads, gateway tickets or raw traces
were recorded.

The first supplemental non-native Inbox run also ended with signal 143 before
a summary; rerunning the same command completed with all four cases passing.
Interrupted attempts are not counted in the 24 passing cases. Containers and
state remain available for debugging; no cleanup or destructive reset was run.

Finally, `git restore --source=HEAD --worktree -- plugin/chathermes/dashboard/dist`
restored only tracked generated files to their original state. Generated output
remains ignored, with no dist changes in `git status`. `git diff --check` passed.
Nothing was staged, committed or pushed.
