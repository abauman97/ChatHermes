# Web Push operations and delivery

For device setup and Cron delivery, start with [the user guide](../user/notifications.md). This reference covers the detailed transport, persistence, and diagnostic contract.

Serve the Hermes dashboard over trusted HTTPS (localhost is exempt for local
browser development). iOS/iPadOS requires 16.4 or newer and the ChatHermes web
app added to the Home Screen before Web Push is available. Open ChatHermes,
open the navigation drawer, select the footer **Settings** cog, then
**Enable notifications**; the browser's
permission prompt is requested only from that explicit action. Use the same
control to disable notifications for the selected profile on this device. Settings
names that profile and loads its saved status whenever you switch profiles. The
empty/default profile selection resolves to `default`, matching the native API.
Browser permission and the browser PushSubscription are shared; each profile has
its own stored registration. Disabling one removes only that registration and
keeps other profiles enabled. Existing per-profile storage is preserved. Status
uses authenticated `POST /push/status` with the device endpoint and returns only
profile, enabled state and registration ID; deletion uses that ID with the same
profile scope. Subscription keys and endpoints are never returned.

The first `/push/config` request creates a VAPID keypair, persisted with the
Hermes state under `state/chathermes-push.json` (file mode 0600). Back up this
file with Hermes data: losing it invalidates all browser subscriptions. To
regenerate keys intentionally, stop the dashboard and remove this file; each
device must then enable notifications again. Do not copy its private key into
browser configuration or logs.

Set `HERMES_DASHBOARD_PUBLIC_URL` to the dashboard's HTTPS URL for background
push delivery in every dashboard/plugin-host process that drains the outbox.
The VAPID subject uses its origin with the path removed. An absent or invalid
setting fails safely without attempting transport, including **Send test**;
request headers never supply a replacement origin. The Docker fixture seeds
the explicit setting into each profile's dotenv for Hermes's native child loader. The pinned py-vapid 1.9.4
requires a DNS HTTPS origin without a path or explicit port; credentials, query
strings, fragments, localhost, and malformed URLs are rejected. The VAPID
audience remains the push service origin, not the dashboard origin.

Notification titles use the originating Hermes profile name, preserving its case
and spelling; the default profile is titled **default**. Empty or invalid profile
values fall back to **ChatHermes** without changing the routing identity. The
worker accepts queued legacy **ChatHermes** titles and displays the validated
profile name; mismatched titles are rejected. Explicit tests use the same profile
title rule. Completion and failed/interrupted
notifications use the committed final assistant row verified against the successful native completion and pre-submission watermark, read from the owning profile and redacted before delivery. This
is authoritative even when the runtime rewrites its streamed response. Reasoning,
tool output and usage are excluded. Missing completion text produces an empty
body rather than a generic substitute. Approval/clarification alerts and explicit
tests retain their explanatory text. Native secret requests use the existing
generic **Hermes needs attention.** alert; request prompts and secret values are
never included in push payloads. Enabled notifications can display assistant
content on the device's lock screen; use platform notification privacy settings
or disable that profile if needed. The full serialized UTF-8 payload is bounded
to 3000 bytes (below the encrypted Web Push record limit), truncating only the
body at a Unicode code point boundary with an ellipsis. The worker preserves that
body, with a defensive 3000-code-point cap. Tapping opens the existing
`/chathermes?profile=…#/chat/…?profile=…` route and native viewer recovery. The
session ID is the stored dashboard session, even when Hermes resumes it under a
different runtime alias. Native `message.complete` already maps to completion or
attention; derived completion events do not schedule an additional push. The service
worker is scoped to `/chathermes` and does not cache dashboard/API responses.
Notifications are suppressed only when the exact originating profile and session
is visible and its native viewer is connected in a mounted ChatHermes plugin.
Both fresh plugin visibility and current window visibility must be explicitly
visible; focus is not required. Hidden windows, home, other sessions/profiles,
other views, and disconnected viewers receive notifications. The worker asks every same-origin window for fresh plugin state
(profile, session, connection, visibility, and current SPA URL), failing open on
missing or invalid replies or unknown visibility. It never relies on stale
WindowClient URLs or cached state. When a session becomes visibly connected, all
matching ChatHermes tagged notifications close,
including notifications from earlier events. Opening or clicking through to a
disconnected session retains its notification until it is visibly connected. Display and
cleanup are serialized and state is rechecked after display to cover connection
races. Sessionless test notifications remain available to inspect.
Each handshake uses a message channel with a 300 ms timeout. After the two
parallel handshake rounds settle, still-present positive clients are confirmed
individually. Matching notifications close at that confirmation, and suppression
stops on a confirmed target; neither action waits for another client's reply. In Settings,
**Send test** uses the same authenticated push transport and always shows an
explicit content-free test notification, even with a connected viewer.
A successful test request means scheduling succeeded, not that the device received it.

Enable INFO logging for the ChatHermes dashboard modules to trace structured
`ChatHermes push` records: `event.detected`, `owner.notify` (including duplicates),
`sender.notify`, `sender.scheduled`, `deliver.config` (matching enabled subscription count and availability),
`pywebpush.attempt`, `pywebpush.result` (success and HTTP status), and
`deliver.expired` (404/410 removal). Failures include exception classes and bounded transport metadata; provider response bodies are excluded because they may echo notification content.
Records contain kind/profile/session/subscription IDs, never endpoints, keys, credentials,
or conversation content. Push failures and unavailable browser support do not
change chat execution.

The shipped plugin-root `pyproject.toml` declares `pywebpush==2.5.0` and
`py-vapid==1.9.4` (Python import name `py_vapid`). Accept the Hermes installer’s
Python dependency prompt, or use its `--yes-deps` option for an authorized
noninteractive install. Copy-only/older installations require the explicit
same-runtime command or `install:plugin -- --python` option in
[deployment](deployment.md), followed by a dashboard
restart. The test image installs this same declaration rather than supplying
a separate test-only Web Push package. Both key generation and delivery imports
must work before the configuration reports available. If the
Notifications control reports the service unavailable, verify HTTPS, browser
permission, Home Screen installation (iOS), and that this library is installed.

See [profile-title verification](../internal/verification/2026-10-08-push-profile-titles.md)
for exact test results and browser/transport verification limitations.

Completion delivery is persisted in `state/chathermes-completions.sqlite3`.
Each device is marked delivered only after provider success; failures retry after
restart. A crash after sending but before recording success can repeat the same
notification tag. New subscriptions do not receive old completions. Browser
closure leaves a native server viewer attached while work runs; execution does
not survive loss of the host/runtime process by virtue of the push outbox.

## Static asset cache and worker updates

`npm run build` discovers the production entry, CSS, JavaScript chunks and shipped
manifest/icons, writes `dist/precache-manifest.json`, and embeds it in the existing
push worker. SHA-256 revisions cover each asset's bytes; a deterministic release
identifier covers the asset manifest and worker source. No caching dependency is
installed. Keep the generated distribution out of Git.

Installation fetches every required asset with same-origin credentials, bypasses
HTTP caches and rejects redirects, unsuccessful responses and revision mismatches.
The install event completes only after every cache write is present. A failed
installation removes its incomplete release cache and leaves the active worker
and cache intact. Interrupted installs are removed by the next successful
activation. Deploy the complete distribution together; an install racing deployment
fails safely and can retry rather than mixing stable filenames from two builds.

The pinned host loads JavaScript/CSS from `/dashboard-plugins/@<profile>/chathermes/dist/`
and PWA metadata from `/api/plugins/chathermes/assets/dist/`. The authenticated
worker route binds the native dashboard serving profile, adding only that profile's
static asset aliases. Other profiles' plugin URLs remain network-only because they
may own different plugin copies. An unnamed/custom serving home caches only the
unscoped asset URLs. No profile list, session, credential or API response is cached.

Updates install into the browser's waiting lifecycle. The mounted plugin detects
already-waiting and newly installed workers and shows **Update** / **Not now**.
The popup warns that Update reloads this tab and may interrupt drafts, uploads,
or work in progress. It does not steal composer focus or block editing. **Not now**
only dismisses the popup; **Update available** remains available to reopen it.
There is no activation or reload from dismissal, a timeout, or a controller change.

Only **Update** requests `skipWaiting` from the waiting worker. The requesting tab
reloads once that exact worker is activated and controls it. Other tabs never
reload automatically; their reminder still permits a later user-approved reload,
even after another tab activates the worker. Failed/replaced/timed-out updates
remain retryable. Unmount removes lifecycle listeners and cancels pending reload
consent. No client claim or notification permission request is added.
Closing all controlled windows also permits normal browser activation.

Activation retains older verified caches while plugin windows are open, so another
tab can still load its older hashed JavaScript/CSS chunks. Stable entry/CSS URLs
never fall back to another release. A later activation with no plugin windows
removes older ChatHermes caches, including abandoned installs, without deleting
other apps' caches. Retained releases can consume storage until that activation or
browser eviction. A first installation controls pages on their next navigation.
The plugin registers the same authenticated worker on mount in secure browsers
with Service Worker support, independently of Push API availability. Push still
waits for activation before subscription; failed first installs reject and can
retry. An existing active worker remains usable while an update waits.

Only exact allowlisted same-origin GET asset URLs are served from the current
release cache, with previously verified hashed chunks also available from retained
releases for older tabs. Query strings, explicit authorization or native gateway-ticket headers, range requests,
navigations, dashboard host resources, uploads and dynamic endpoints bypass it.
After browser cache eviction, network fallback must match the expected revision;
it never writes runtime responses into the cache. Static assets can be read while
offline, but dashboard startup, authentication and sessions still need the network.
This is not offline application support. Browser storage remains subject to eviction.

`precache.test.ts` covers discovery, revisions, cache lifecycle/failures and request
boundaries. `tests/workflows/precache.spec.ts` exercises the deployed worker in the
real dashboard on desktop/mobile: failed update, waiting update during streaming,
draft/focus retention, offline static reads, dismissal, already-waiting detection,
user-approved reload and independent consent across two tabs. Focused update tests
cover lifecycle races, failure, timeout and unmount; cache tests cover natural cleanup
and retention of verified older chunks during forced activation.
It changes only the isolated fixture container's worker metadata and restores it;
it does not claim native Home Screen installation or real push delivery coverage.
