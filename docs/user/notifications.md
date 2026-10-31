# Notifications and Home Screen use

## Inbox

Open **Inbox** in the drawer to see completed responses and requests for attention
across accessible Hermes profiles. Inbox works without browser notification
permission or push subscriptions. Choose **All profiles** or the currently selected
**Profile**, and use **Unread only** to filter the list. Items show their profile,
chat title, event type, time and a short preview, newest first.

Opening an item loads its owning profile and chat. Whenever a chat opens
successfully, its Inbox notifications are deleted, including read items, regardless
of how you navigated there. Deletion is checked again when a final response arrives,
the chat reconnects, and the visible Inbox count refreshes. Matching system push
notifications close while that exact profile/chat is visible and connected.
Deletion is shared across devices. Opening an approval or clarification does not answer or resolve the request;
use the request form in its chat. **Delete read** removes read notifications from
the selected view; replay and reconciliation do not restore them.

Collection runs while the Hermes dashboard server is running, including when
ChatHermes is closed. It recovers missed persisted responses after a disconnect
or server restart. Existing history is baselined when a profile is first discovered,
so installation does not fill Inbox with old responses. Pending requests are
collected while they remain available in the native runtime; requests that were
resolved while the server was stopped cannot be reconstructed from chat history.
The mounted plugin refreshes on foregrounding, gateway changes and periodic polling.

## Enable notifications on a device

1. Access the Hermes dashboard through trusted HTTPS (localhost is exempt for local development).
2. On iOS/iPadOS 16.4 or newer, add ChatHermes to the Home Screen, then open it there. On other supported browsers, Home Screen installation is optional. This is the dashboard plugin's installed entry, not a separate application deployment.
3. Have the dashboard operator set `HERMES_DASHBOARD_PUBLIC_URL` to its public HTTPS URL in every dashboard/plugin-host process that sends push. For the pinned push library, use a DNS HTTPS origin with no path or explicit port; localhost, credentials, query strings, and fragments are rejected. Restart after changing the setting.
4. Open ChatHermes's drawer, choose the footer **Settings** cog, and select **Enable notifications**. Allow the browser permission prompt.
5. Use **Send test** to check delivery. A successful request means the test was scheduled; verify that the device actually shows it.

Settings shows notification status for the selected profile on this device. Enable each desired profile separately. Disabling one profile preserves registrations for other profiles; browser permission is shared.

Notifications identify the originating profile and may show assistant content on the lock screen. Adjust device privacy settings or disable that profile if needed. Tapping a chat notification opens its saved conversation. Notifications are suppressed only while that exact profile/chat is visible and connected; other views and disconnected sessions still receive them.

Browser closure can leave active work attached to the server. This does not guarantee continuation after a host/runtime crash. Failed delivery can retry after restart, and a crash around delivery can repeat a notification. See the [delivery contract](../developer/api-contract.md#completion-and-push-delivery) for guarantees and [push internals](../developer/notifications.md) for operations and diagnosis.

## Enable Cron delivery

To make ChatHermes available in Hermes's Cron **Deliver to** menu, the plugin
must be enabled in the profile that owns the Cron job. Plugin files installed
in the default profile can be globally available, but plugin enablement,
platform configuration, and Cron jobs are profile-scoped. Repeat these steps
for each profile that should send ChatHermes notifications. In that profile's
`config.yaml`, keep any existing entries under `plugins.enabled` and add
`chathermes`:

```yaml
plugins:
  enabled:
    - chathermes
platforms:
  chathermes:
    enabled: true
    home_channel:
      platform: chathermes
      chat_id: scheduled
      name: Scheduled results
```

The `plugins.enabled` entry enables ChatHermes and the
`platforms.chathermes` entry enables the platform and configures its Cron
destination in that profile. Alternatively, set
`CHATHERMES_HOME_CHANNEL=scheduled` in that profile's `.env`; the `plugins`
enablement is still required. The `scheduled` destination targets all enabled
ChatHermes push devices in the profile; use a push subscription ID instead to
target one device. Restart the Hermes dashboard after enabling the plugin and
configuring the destination, then choose **ChatHermes** in Cron's **Deliver
to** selector. This saves `deliver=chathermes`; installation alone does not
configure the destination, and existing Cron jobs are not changed
automatically. A push subscription must be enabled in ChatHermes for the
notification to reach a device.

## Keep subscriptions working

Back up Hermes state with the installation. Losing `state/chathermes-push.json` invalidates subscriptions; each device must enable notifications again. This file contains private keys and must never be shared. See [deployment](../developer/deployment.md) for dependency repair and persistence, or [troubleshooting](troubleshooting.md#notifications-do-not-arrive).
