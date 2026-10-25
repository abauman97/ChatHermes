# Notification click investigation

Investigated clean `db94acb` (main including PR #156). No commits, pushes, or PRs.

## Click path and evidence before edits

- `push` builds canonical `/chathermes?profile=…#/chat/…?profile=…` or
  `#/scheduled/<job>/<run>?profile=…` destinations in `notification.data.url`.
- `notificationclick` validates the canonical document/hash, finds a same-origin
  `/chathermes` WindowClient, awaits `focus()`, then calls `navigate()`. Only a
  rejected/unavailable `navigate()` reaches the `chathermes.navigate` message.
  `openWindow()` is reserved for no existing plugin client.
- Mounted an isolated real Hermes dashboard using `tests/docker/Dockerfile` and
  `npm run live`, port 9120, separate launcher instance, no bind mounts. The
  latest official image digest was
  `sha256:36099926da316742423544e055d4734777105ffe6341873af5459b957d0c2919`.
  Output was built under ignored `dist/notification-current`, leaving the
  tracked dashboard distribution unchanged.
- Fetched the active worker's authenticated script URL in the signed-in browser:
  `/api/plugins/chathermes/push-service-worker.js`. The fetched body matched
  `public/push-service-worker.js` byte for byte. Baseline SHA-256:
  `9f9458b567988259785834b27f46607578cc0228e337c06d01d41d1a3f8fac21`.
  The repository's existing generated worker also matched. Response headers
  included `Cache-Control: no-cache` and `Service-Worker-Allowed: /chathermes`;
  registration specifies `updateViaCache: "none"`. This rules out a stale asset
  in this isolated reproduction, not in an inaccessible user's installation.
- Called real `WindowClient.navigate()` from the active worker against an
  existing mounted client. Chat, scheduled-run, Settings, and cross-profile
  canonical routes reached and retained their destinations. Same-document
  navigation returned a WindowClient whose URL still described the original
  home document: inspecting that return value alone gives a false negative.
  Actual page URL and mounted destination were checked after navigation.
- Instrumented browser `history.replaceState`/`pushState` before mounting and
  inspected the shipped Hermes `web/src/contexts/ProfileProvider.tsx`.
  Changed outer profile queries are adopted by the host; its profile sync did
  not overwrite these canonical notifications. Plugin history listens to both
  popstate and hashchange, and `applyScope` uses navigation revisions. No
  prior-state restoration was reproduced in the exercised paths.
- Created an actual notification with `registration.showNotification()`, obtained
  it with `getNotifications()`, constructed a `NotificationEvent`, and dispatched
  it with `self.dispatchEvent()` inside the real installed service worker.
  Captured `waitUntil` because a script-created event has no browser-managed
  extendable-event lifetime. No focus/navigate/window APIs were mocked.
  Chromium rejected `focus()` with `InvalidAccessError: Not allowed to focus a
  window.` The event's work rejected and the current page remained unchanged;
  neither navigation nor message fallback ran. Repeating immediately after a
  real page click (`navigator.userActivation.isActive === true`) also rejected.
  A script-dispatched notification event does not confer OS notification-click
  activation privilege.

## Focused change

Catch an existing client's focus rejection and continue into the unchanged
navigation/fallback path. Canonical validation and single-window behavior remain
unchanged. This fixes the browser-proven focus-denial failure path. It does not
prove that a trusted physical notification tap on the reporting device loses
activation, or that this is the only cause of that device's report.

Unit regressions cover denied focus with successful navigation and with rejected
navigation requiring the app message fallback. Both failed before the change.
A mounted-browser regression dispatches the event in the real worker, opens an
existing native session, then a scheduled-run destination, verifies destination
retention and composer focusability, and checks that no second page was created.

## Device and environment limits

The browser is headless desktop Chromium with desktop and iPhone-sized viewports,
using an explicit secure-origin override for the isolated HTTP dashboard. It is
not Safari/iOS. CDP `PWA.install` failed to fetch install information for this
cookie-authenticated dashboard, and `PWA.launch` reported no installed app. Thus
an installed standalone PWA client, background OS notification-center taps,
trusted notification activation, and physical-device focus behavior could not
be verified. Synthetic dispatch exercises the real handler and real browser
APIs, but is not a trusted OS tap. Scheduled test destinations are synthetic;
the route/view is exercised, not a real cron execution or external push delivery.

The initial disposable container was externally killed (Docker exit 137) after
manual probes; it was restarted before regression verification. The unrelated
pre-existing port-9119 container was left alone.

## Validation

- `vp fmt`, `vp lint`, and `git diff --check` passed.
- `npm test`: 725 passed (723 baseline, two new cases).
- Activated this worktree's `.venv`, installed `plugin/chathermes[dev]` and the
  API test harness dependencies; `npm run test:api`: 120 passed.
- `CHATHERMES_BUILD_OUT_DIR=dist/notification-current npm run build` passed.
- For the browser red/green check, swapped only the worker in the launcher's
  disposable **live** `/opt/data/plugins/chathermes/dashboard/dist/` directory.
  Changing `/opt/chathermes/plugin/` alone changes the seed, not the served copy.
  The desktop regression failed on the baseline with the real `InvalidAccessError`
  and passed on the fixed worker. Both desktop and mobile click tests passed.
- Fetched the final active worker script from port 9124: byte-for-byte equality
  with source, SHA-256
  `caae7d6b21c18597938dcb82acd8408884c137193ce2f3068482b27e9a519465`.
- Existing routing suite: 8 passed at desktop/mobile sizes. Its original run
  against plain remote HTTP passed six routing cases but its two message tests
  failed because `navigator.serviceWorker` was unavailable. Reran with a local
  Chromium wrapper adding the secure-origin override: all eight passed. The new
  click suite sets this override itself. No application code was changed for it.
- Inspected desktop chat and mobile scheduled screenshots. Scheduled deliberately
  renders the unavailable-job state for the synthetic job; it retains the
  requested run URL rather than returning home. Composer remained focusable.
- Final click regressions (including native reconnect/loading completion): desktop
  and mobile passed. The real-provider composer/attachment smoke passed on mobile;
  desktop completed its assertions but initially failed teardown with ENOENT for
  a missing Playwright trace artifact. Reran that desktop smoke with `--trace=off`
  and a dedicated ignored output directory: passed. Inspected completed tool,
  native response, and composer screenshots on both sizes. These checks exercise
  profile/model controls, file/camera inputs, scrolling, focus while responding,
  completed disclosure collapse and manual expansion.
- Retried CDP PWA installation using a persistent browser profile as well as the
  initial isolated context; both failed to fetch install information. No claim
  of installed-PWA or trusted notification-center click verification is made.
- Ran `npm run live:stop` for both launcher instances created here. Only their
  owned containers/anonymous volumes were targeted; other containers, worktrees,
  and named volumes were left alone. Generated tracked worker output was restored
  to its clean starting content; build output remains ignored and uncommitted.

The [Service Workers specification](https://www.w3.org/TR/service-workers/#client-focus)
distinguishes focus activation requirements from navigation. The observed
synthetic-event activation failure is evidence for the guarded focus change,
not evidence that trusted OS notification taps fail activation on the reporting
device. The reported physical-device regression remains unconfirmed.
