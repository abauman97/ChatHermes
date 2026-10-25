# Hosted profile HTTP routing — 2026-10-23

Validated only in `/opt/data/profiles/developer/cache/scratch/chathermes-503-live`
at HEAD `3c5f069fe995d82b9bc727f29e0ab3112ccf3d15`, with the uncommitted fix.
No deployment, live service changes, commit, push, or PR.

Hermes's `forward_secondary_plugin_request` removes `profile` and dashboard
credentials before forwarding HTTP to a secondary profile's plugin host. The old
ChatHermes handler interpreted the missing selector as the default gateway route.
In a plugin host (`HERMES_PLUGIN_HOST_PROCESS=1`), the fix recovers the verified
`serving_profile_name()` instead. Unknown identities fail closed and conflicting
selectors are rejected. Profile-dependent HTTP helpers use the same resolution.

## Disposable environment

Docker initially had no containers. The launcher used the unique instance
`profile503-20261023-a`, container `chathermes-profile503-20261023-a-hermes`,
and free host port `19263`. The Docker daemon is remote (`docker:2375`), so the
reachable dashboard was `http://docker:19263/chathermes`; only the dashboard
port was published. No bind mounts or personal Hermes state were used.

```sh
CHATHERMES_INSTANCE=profile503-20261023-a \
CHATHERMES_DASHBOARD_PORT=19263 CHATHERMES_BIND_ADDRESS=0.0.0.0 \
CHATHERMES_DASHBOARD_URL_HOST=docker npm run live
```

The launcher alone loaded the root `.env`. No provider values are recorded here.
The official image pulled was
`nousresearch/hermes-agent@sha256:9c5561579f3ffdf333401797094ac3a743738d6c25d40f4331c7bf77b694238d`.
The dashboard reported Hermes v0.22.5; the actual container Python was 3.14.9. The fixture now seeds three profiles:

| Profile | Effective home             | Gateway credential      | Listener         |
| ------- | -------------------------- | ----------------------- | ---------------- |
| default | `/opt/data`                | independently generated | `127.0.0.1:8642` |
| alpha   | `/opt/data/profiles/alpha` | independently generated | shared listener  |
| beta    | `/opt/data/profiles/beta`  | independently generated | shared listener  |

Inspection inside the running container confirmed three distinct nonempty keys,
all profile `.env` files mode 600, no provider key in any profile YAML, matching
provider/model configuration, and default `gateway.multiplex_profiles: true`.
Named configs omit the launch-only multiplex flag. The upstream runtime changed
the default YAML mode to 640; named YAML files remained 600. No key values were
printed. The fixture restart test checks credential stability.

## Observed pre-fix failure and fixed behavior

The baseline used `git show HEAD:plugin/chathermes/dashboard/plugin_api.py` in
this disposable container only, followed by a container restart. The fixed file
was then restored and the container restarted. Both phases used the same homes,
keys, provider configuration, actual Hermes authentication, secondary forwarding,
IPC admission wrapper, and gateway listener. No mocked IPC or gateway was used
for this exercise.

A temporary wrapper around `_target` in the disposable plugin recorded only
verified host identity, host-process flag, selector presence, gateway path, and a
boolean credential match. It recorded no credentials, headers, bodies, or query
values. Raw evidence is under ignored `tmp/profile503/`.

| Authenticated plugin route        | Default baseline → fixed | Alpha baseline → fixed | Beta baseline → fixed |
| --------------------------------- | ------------------------ | ---------------------- | --------------------- |
| `/v1/capabilities`                | 200 → 200                | 503 → 200              | 503 → 200             |
| `/api/sessions?limit=30&offset=0` | 200 → 200                | 503 → 200              | 503 → 200             |
| `/v1/models`                      | 200 → 200                | 503 → 200              | 503 → 200             |
| `/scheduled`                      | 200 → 200                | 200 → 200              | 200 → 200             |

These statuses were observed in authenticated Chromium contexts at desktop
1440×1000 and mobile 390×844. Both phases were repeated by changing profiles with the
plugin's native select; the pre-fix alpha UI visibly displayed `Request failed
(503)`. Composer focus succeeded for all six combinations and
its computed font size was 16px.

For both named hosts the instrumented request had `hosted=true` and no query
profile selector. The baseline selected `/api/sessions`, `/v1/capabilities`, and
`/v1/models`, with that named host's credential; the fixed handler selected
`/p/alpha/...` or `/p/beta/...`, with the matching credential. Default remained
in-process, supporting both unprefixed and explicit `/p/default/...` paths.

An independent real gateway check requested `/p/<profile>/v1/capabilities` with
each of the three keys: all three matching combinations returned 200 and all
six cross-profile combinations returned 401. This establishes that successful
named HTTP requests require the correct route and key together.

The new `tests/visual/profile-routing-live.spec.ts` runs browser `fetch` through
the authenticated dashboard and real gateway. It creates the same session ID in
all three stores with distinct titles, verifies each title independently, checks
capabilities/models/scheduled routes, uploads a synthetic file to each profile's
own home, checks that each selected profile's own title arrives in the UI, checks composer
focus, and deletes the sessions afterward. It also
checks that omitting authentication returns 401 for all three profiles.

## Gates and browser evidence

- `npm test`: 741 passed.
- `. .venv/bin/activate` and development-extra installation completed. Because the
  environment provides dependencies through an existing `PYTHONPATH`, preserve
  that suffix: `PYTHONPATH=/opt/hermes:plugin:$PYTHONPATH npm run test:api -- -rs`:
  140 passed, no skips. An earlier run that replaced the suffix failed on missing
  `ruamel`; this was a test environment issue, resolved before validation.
- The latest container has a slightly different `web_server_profiles.py` from the
  local `/opt/hermes` source. To test the actual image as well, copied the plugin,
  API tests, and `pytest.ini` into `/tmp/validation`, installed its development
  extra in the container, and ran `PYTHONPATH=/opt/hermes:plugin
  /opt/hermes/.venv/bin/python -m pytest tests/plugin_api.test.py -rs`: 140 passed.
- `npm run test:docker`: 19 passed.
- `npm run build`, `vp lint`, `vp fmt`, `vp fmt --check`, and `git diff --check`:
  completed successfully. Dist output remains unchanged from HEAD and was never
  staged. This HEAD already tracks some dist files despite the ignore rule.
- Dedicated profile isolation browser test: desktop and mobile passed, including
  authentication omission, native profile selection, and visible session data.
  The final run used the exact uninstrumented fixed file. Its SHA-256 matched
  between the worktree and `/opt/data/plugins/chathermes/dashboard/plugin_api.py`:
  `c7a1bb7c174313c9f77c79816b793c98a3e48a842f92a69509ca71072324abc7`.
  Command: `CHATHERMES_TEST_URL=http://docker:19263
  CHATHERMES_CHROMIUM=/opt/data/profiles/developer/cache/playwright/chromium-1243/chrome-linux64/chrome
  npm run test:visual -- profile-routing-live`.
- First complete broad browser run: 37 passed, 8 failed, 1 intentionally skipped
  (desktop-only landscape skip). Four failures were browser setup problems:
  the notification spec overrode the executable, and the remote HTTP origin
  needed secure-context treatment for service workers.
- Corrected broad rerun, with both environment overrides and
  `--unsafely-treat-insecure-origin-as-secure=http://docker:19263`: 44 passed,
  3 failed, 1 skipped across split invocations. The command runner terminated
  the long invocation with exit 143 after 45 completed cases (41 passed,
  3 failed, 1 skipped); a separate mobile invocation completed the remaining
  three cases, all passed. All 48 cases therefore have a completed result.
- Remaining broad-suite failures: chronological activity expected the active
  `<details>` to have `open`, but the attribute was absent, on desktop and mobile
  (`live-real.spec.ts:855`); desktop host Cron creation timed out because the
  Hermes mobile header intercepted the Create button (`live-real.spec.ts:18`).
  Cron passed in the earlier desktop run and both mobile runs. Earlier desktop
  focus/project failures passed on the corrected rerun. These failures were not
  hidden or repaired as part of the HTTP routing patch.
- Successful browser coverage included authenticated real-provider terminal chat,
  camera/file attachment previews, model selection, focus during requests,
  scrolling, history and artifact reconstruction, route/unmount transitions,
  service-worker navigation, and controlled tool disclosure transitions at both
  sizes. Desktop/mobile screenshots were opened and visually inspected.

The broader suite was copied into ignored `tmp/profile503/visual/` with screenshot
model-label masks and traces/automatic failure screenshots disabled, to keep
provider configuration out of images. Assertions and application code were not
changed. Its config uses the actual authenticated dashboard at desktop and mobile
sizes. Notification testing additionally requires `CHATHERMES_TEST_URL` and
`CHATHERMES_CHROMIUM` because that spec overrides launch options itself.

Selected screenshot locations (ignored, local only):

- `tmp/profile503/baseline-desktop-alpha.png`
- `tmp/profile503/baseline-mobile-beta.png`
- `tmp/profile503/fixed-desktop-alpha.png`
- `tmp/profile503/fixed-mobile-beta.png`
- `tests/visual-output/profile-routing-live-hoste-78ffb-ssions-and-uploads-isolated-desktop/profile-alpha.png`

Sanitized command evidence: `baseline-results.json`, `fixed-results.json`,
`baseline-routes.jsonl`, `fixed-routes.jsonl`, `effective-profiles.json`,
`gateway-matrix.json`, and
`*-leak-check.json` under `tmp/profile503/`. Captured baseline/fixed plugin
responses and container logs were scanned inside the container against all three
gateway keys and the provider key: zero matching keys. Raw response captures
were deleted after scanning; later probes scanned responses in memory. A final
scan also checked textual browser reports and artifacts against the four keys,
with zero matches; provider-setting strings were redacted from text artifacts.
No keys are stored in these evidence files.

## Runtime limits

This fixes HTTP profile selection. An actual browser probe fetched a fresh
host-issued WebSocket ticket for each profile and used the supported subprotocol:
`default` opened successfully; `alpha` and `beta` both failed the handshake with
HTTP 501 (browser close code 1006). Evidence: `tmp/profile503/websockets.json`.
Hermes refuses secondary-profile plugin WebSockets before ChatHermes executes. Native named-profile chat and cancellation
remain unavailable through that HTTP-only contract; HTTP success does not prove
they work. The buffered IPC contract also cannot stream SSE or access the parent
process's native agent runtime. The gateway listener still comes from server-side
configuration visible to the host; this fixture deliberately gives all hosts the
same listener settings. Different parent/host listener settings need runtime
support or matching server configuration. No upstream routing policy was bypassed.

## Cleanup and final state

`CHATHERMES_INSTANCE=profile503-20261023-a npm run live:stop` completed and removed
only `chathermes-profile503-20261023-a-hermes` and its anonymous `/opt/data` volume.
`docker ps -a` was empty afterward. The test image remains locally cached and
contains no provider settings. The root `.env` remains mode 600 and ignored.
All source/report changes remain uncommitted; the index is empty and dist has no
diff from HEAD. No other checkout was edited.

The final dedicated browser invocation completed with **2 passed (8.7s)** on the
uninstrumented fix, including the visible profile-specific session title after
native select changes. The remaining limits are the three broad-suite UI failures
above and Hermes's observed HTTP-501 refusal of secondary plugin WebSockets.
There is no unresolved blocker to the tested HTTP 503 fix itself.
