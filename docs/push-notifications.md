# ChatHermes PWA and Web Push rollout

Serve the Hermes dashboard over trusted HTTPS (localhost is exempt for local
browser development). iOS/iPadOS requires 16.4 or newer and the ChatHermes web
app added to the Home Screen before Web Push is available. Open ChatHermes,
open the navigation drawer and select **Enable notifications**; the browser's
permission prompt is requested only from that explicit action. Use the same
control to disable the device subscription.

The first `/push/config` request creates a VAPID keypair, persisted with the
Hermes state under `state/chathermes-push.json` (file mode 0600). Back up this
file with Hermes data: losing it invalidates all browser subscriptions. To
regenerate keys intentionally, stop the dashboard and remove this file; each
device must then enable notifications again. Do not copy its private key into
browser configuration or logs.

Notifications are intentionally content-free: completed turns, approval,
clarification, or failed/interrupted attention only. Tapping opens the existing
`/chathermes?profile=…&session=…` route and native viewer recovery. The service
worker is scoped to `/chathermes` and does not cache dashboard/API responses.
When ChatHermes is already a focused visible page, notification banners are
suppressed. Push failures and unavailable browser support do not change chat
execution.

Install `pywebpush==2.5.0` in the Hermes dashboard Python environment. If the
Notifications control reports the service unavailable, verify HTTPS, browser
permission, Home Screen installation (iOS), and that this library is installed.
