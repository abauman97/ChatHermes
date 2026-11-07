# User documentation screenshots and accuracy review — 2026-11-07

Reviewed the six existing user guides against the current source and authenticated
Hermes dashboard plugin. Kept their organization and limited prose changes to
accuracy fixes and screenshot context. No application code or public APIs changed.

## Accuracy review

| Guide           | Sources and outcome                                                                                                                                                                                                                                                                                                                            |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Getting started | Router, Home page, composer, and messaging workflows: corrected the default destination to Home; checked sending, newline keys, Stop, and editable drafts.                                                                                                                                                                                     |
| Installation    | Plugin metadata, reviewed Hermes plugin CLI, deployment guide, and test-image startup: checked installation syntax, dependency consent, built assets, and profile enablement. No changes needed.                                                                                                                                               |
| Configuration   | Authenticated API proxy, model picker/controller, push configuration, and runtime contracts: checked server-side API keys, per-profile history, and model/provider routing. No changes needed.                                                                                                                                                 |
| Features        | Project pages/actions, session menu, scheduled pages/actions, artifact routes, Kanban UI, and workflow tests: corrected Project management and chat assignment, removed the repository-hierarchy claim, documented model/reasoning restoration and response actions, and replaced the obsolete scheduled follow-up action with Resume Session. |
| Notifications   | Inbox list/actions, collector, push registration, origin validation, and Cron plugin registration: removed nonexistent Unread only and Delete read controls and the event-type display claim; documented the current unread list and individual removal.                                                                                       |
| Troubleshooting | Capability gate, upload limit, file access policy, profile-scoped push/Cron configuration, and recovery behavior: existing guidance remains consistent with the implementation. No changes needed.                                                                                                                                             |

The disclosure documentation matches the current implementation: thinking and tool
bodies start collapsed, including while active, and users can expand them. This
review did not change that behavior.

## Screenshots

All eight PNGs in [the user image directory](../../user/images/) are direct
Playwright captures of the Vue plugin mounted through the Hermes dashboard SDK.
No UI text, DOM content, or pixels were replaced for the captures.

- Mobile: 390 × 844 CSS pixels, Chromium touch/mobile emulation, scale factor 1.
- Desktop: 1440 × 1000 CSS pixels, scale factor 1.
- Locale: en-US; display timezone: America/New_York.
- Fictional scenario: a one-hour community herb workshop for 12 beginners.
- Images cover chat, staged attachment, Project, saved scheduled result, Home,
  navigation, Settings, and a desktop chat overview. Every image was opened and
  visually inspected for readable text, clipping, accurate labels, and private data.
- The eight images total less than 400 KiB; each has alt text and a nearby caption.

Built with `npm run test:env:build`, then used the documented Compose environment
with an additional `chathermes-docs` project and distinct dashboard/MockServer ports
9120/1081. The documentation project reused the built image. The pulled Hermes
image displayed version 0.23.0. Local API tests used the reviewed Hermes source
revision `bf0203a794a07aac3ff764972ab9087baa4e4f4e`.

Browser preparation used `tests/docker/prepare-browser.mjs` and real dashboard
login. Stock MockServer expectations were loaded with the existing fixture loader;
a documentation-specific REST-loaded SSE expectation supplied the workshop answer.
The prompt was: “Help me plan a one-hour community workshop on growing herbs.”
Hermes handled inference dispatch, session creation, streaming, and persistence.
The Project was created through its UI, the notes file through the authenticated
upload control, and the paused sample Cron job/output through native Cron APIs.
Home examples were created through native SessionDB APIs and collected by normal
Inbox reconciliation. No provider credentials or personal sessions were used.

## Validation

- `npm run test:env:build`: passed, including `npm run build`.
- `TZ=UTC npm test`: 1,383 passed, 15 skipped. The initial local-timezone run
  failed one existing Inbox date assertion expecting January 1, 1970; it rendered
  December 31, 1969 in America/New_York. No test or application code was changed.
- `uv sync --locked`: passed.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: 144 passed.
- `npm run test:integration -- tests/workflows/messaging.spec.ts --grep 'real tool activity|Stop settles|newline controls'`:
  six desktop/mobile workflows passed, covering send keys, editable drafts,
  Stop, tool disclosure inspection, response order, and reload persistence.
- Capture assertions checked Project creation, chat reload, staged attachment
  removal, Home messages, composer focus/visibility, model/reasoning controls,
  Settings, and saved scheduled output.
- Vite+ lint and formatting checks passed for the final changes. Relative user-guide
  links, anchors, all eight image references, and PNG dimensions were checked.
- Generated dashboard assets were restored to HEAD after validation; none are
  included in this documentation change. Containers and synthetic state remain
  available for inspection.

## Limits

Mobile screenshots use Chromium emulation, not native iOS or Android hardware.
Camera capture, operating-system notification delivery, Home Screen installation,
and a fresh installation into a user's Hermes home were not exercised. Their
instructions were reviewed against source and existing contracts. The Settings
capture honestly shows browser notification permission disabled; it is not proof
of push delivery. The sample Cron job is paused and its output is synthetic.
