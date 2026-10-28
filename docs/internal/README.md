# Internal records and references

These records preserve implementation history and verification at a particular point in time. They are not current installation or compatibility guarantees. Start with the [documentation index](../README.md) for maintained guidance.

The former `docs/plans/`, `docs/verification/`, and `docs/reference/` trees moved here with their filenames and contents preserved, apart from link repairs, formatting, and explicit missing-evidence notes. Backticked source paths and commands in historical records describe their original checkout; old documentation paths map to the new trees here, or to `docs/developer/` for architecture, API, and deployment. The former push guide is now `docs/developer/notifications.md`. Use Git history to inspect an original tree.

## Plans

- [2026-09-29-chathermes](plans/2026-09-29-chathermes.md)
- [2026-09-30-chathermes-plugin](plans/2026-09-30-chathermes-plugin.md)
- [2026-10-01-projects](plans/2026-10-01-projects.md)
- [chatgpt-ui-restyle](plans/chatgpt-ui-restyle.md)
- [persistent-tui-gateway](plans/persistent-tui-gateway.md)

## Verification

Reports record what was tested and the limits of that evidence. Older protocol descriptions can be superseded by the [current native contract](../developer/api-contract.md). Ignored local screenshots may not be available; such paths are retained as text rather than broken links.

- [2026-10-01-model-picker](verification/2026-10-01-model-picker.md)
- [2026-10-01-projects](verification/2026-10-01-projects.md)
- [2026-10-03-live-dashboard](verification/2026-10-03-live-dashboard.md)
- [2026-10-03-runs](verification/2026-10-03-runs.md)
- [2026-10-03-streaming](verification/2026-10-03-streaming.md)
- [2026-10-04-native-gate](verification/2026-10-04-native-gate.md)
- [2026-10-04-native-send-fix](verification/2026-10-04-native-send-fix.md)
- [2026-10-04-persistent-tui-integration](verification/2026-10-04-persistent-tui-integration.md)
- [2026-10-04-scheduled](verification/2026-10-04-scheduled.md)
- [2026-10-05-native-session-migration](verification/2026-10-05-native-session-migration.md)
- [2026-10-07-composer-issue-56](verification/2026-10-07-composer-issue-56.md)
- [2026-10-07-push-active-session](verification/2026-10-07-push-active-session.md)
- [2026-10-07-push-notifications](verification/2026-10-07-push-notifications.md)
- [2026-10-08-issue-59-reconnect](verification/2026-10-08-issue-59-reconnect.md)
- [2026-10-08-issue-65-main-merge](verification/2026-10-08-issue-65-main-merge.md)
- [2026-10-08-profile-notifications](verification/2026-10-08-profile-notifications.md)
- [2026-10-08-push-profile-titles](verification/2026-10-08-push-profile-titles.md)
- [2026-10-08-push-visible-session](verification/2026-10-08-push-visible-session.md)
- [2026-10-10-artifacts-issue-35](verification/2026-10-10-artifacts-issue-35.md)
- [2026-10-10-docker-main-integration](verification/2026-10-10-docker-main-integration.md)
- [2026-10-10-issues-94-95](verification/2026-10-10-issues-94-95.md)
- [2026-10-11-artifact-card-layout](verification/2026-10-11-artifact-card-layout.md)
- [2026-10-11-canonical-routing](verification/2026-10-11-canonical-routing.md)
- [2026-10-11-desktop-artifact-filter](verification/2026-10-11-desktop-artifact-filter.md)
- [2026-10-11-issue-114-activity-stream](verification/2026-10-11-issue-114-activity-stream.md)
- [2026-10-11-notification-service](verification/2026-10-11-notification-service.md)
- [2026-10-11-vue-router](verification/2026-10-11-vue-router.md)
- [2026-10-12-artifact-parser-bypasses](verification/2026-10-12-artifact-parser-bypasses.md)
- [2026-10-12-native-image-history-load](verification/2026-10-12-native-image-history-load.md)
- [2026-10-13-notification-store-lock](verification/2026-10-13-notification-store-lock.md)
- [2026-10-16-android-emulator](verification/2026-10-16-android-emulator.md)
- [2026-10-16-keyboard-layers](verification/2026-10-16-keyboard-layers.md)
- [2026-10-16-mobile-shell](verification/2026-10-16-mobile-shell.md)
- [2026-10-17-android-cold-start](verification/2026-10-17-android-cold-start.md)
- [2026-10-17-footer-padding](verification/2026-10-17-footer-padding.md)
- [2026-10-17-send-focus](verification/2026-10-17-send-focus.md)
- [2026-10-18-cron-ui-registration](verification/2026-10-18-cron-ui-registration.md)
- [2026-10-18-global-plugin-profiles-session-connection](verification/2026-10-18-global-plugin-profiles-session-connection.md)
- [2026-10-19-notification-click](verification/2026-10-19-notification-click.md)
- [2026-10-19-uncertain-native-session](verification/2026-10-19-uncertain-native-session.md)
- [2026-10-23-hosted-profile-routing](verification/2026-10-23-hosted-profile-routing.md)
- [2026-10-23-native-gateway-profiles](verification/2026-10-23-native-gateway-profiles.md)
- [2026-10-24-android-private-cdp](verification/2026-10-24-android-private-cdp.md)
- [2026-10-24-issue-152-main-compat](verification/2026-10-24-issue-152-main-compat.md)
- [2026-10-24-native-execution](verification/2026-10-24-native-execution.md)
- [2026-10-25-layered-workflow-tests](verification/2026-10-25-layered-workflow-tests.md)
- [2026-10-25-media-upload-references](verification/2026-10-25-media-upload-references.md)
- [2026-10-25-persisted-image-preview](verification/2026-10-25-persisted-image-preview.md)

- [2026-10-28-transcript-history](verification/2026-10-28-transcript-history.md)

## Visual references

These are ChatGPT design references, not screenshots of ChatHermes.

- [01-empty-home-dark](reference/chatgpt/01-empty-home-dark.jpg)
- [02-navigation-drawer-dark](reference/chatgpt/02-navigation-drawer-dark.jpg)
- [03-message-context-menu-dark](reference/chatgpt/03-message-context-menu-dark.jpg)
- [04-response-instant-mode-dark](reference/chatgpt/04-response-instant-mode-dark.jpg)
- [05-model-selector-thinking-dark](reference/chatgpt/05-model-selector-thinking-dark.jpg)
- [06-composer-keyboard-dark](reference/chatgpt/06-composer-keyboard-dark.jpg)
- [07-streaming-tools-dark](reference/chatgpt/07-streaming-tools-dark.png)
- [08-scheduled-jobs-dark](reference/chatgpt/08-scheduled-jobs-dark.jpg)
