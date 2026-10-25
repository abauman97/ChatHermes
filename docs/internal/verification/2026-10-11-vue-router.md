# Vue Router migration verification

Implemented issue 107's hash routing migration in the local Windows checkout.
Each Hermes plugin mount installs its own Vue Router 4 instance. The shell,
native runtime, ChatInterface and scope-keyed composer persist across screen
changes. Project membership is read from Hermes, including automatic project
IDs that are filesystem paths; browsing never changes a session workspace.

## Host compatibility

Plugin history data is namespaced under history.state.chathermes. The adapter
preserves host usr and unrelated fields and maintains host idx/key conventions.
The outer host profile query must remain: the current Hermes profile hydration
otherwise replaces the URL and removes its hash on Back/Forward. A canonical
hash that hydration removes before importing the plugin is recovered once from
the original document Navigation Timing URL. Later host mounts do not restore
that original destination. Legacy plugin routing fields are replaced without
adding a history entry; canonical hashes take precedence.

Duplicate navigation still dismisses the mobile drawer. Settings stores a
validated plugin-relative return_to destination. Scheduled parameters are
watched when the component is reused, with aborted obsolete reads and support
for older saved outputs. Push recognition accepts canonical and legacy chat
links and preserves the visible, connected viewer attestation.

## Checks

- vp fmt and vp lint passed.
- npm test: 444 tests passed across 30 files, with no unhandled async errors.
- npm run build passed; the tracked dashboard bundle replacement was rebuilt.
- API suite: 100 tests passed in the disposable Linux container, using the
  repository-pinned requirements and pytest's importlib mode for dotted test
  filenames. The native Windows attempt encountered 14 POSIX-dependent failures
  (permissions, symlink privilege, and fcntl); the Linux run resolved them.
- Default real-dashboard Playwright suite: all 12 tests passed in 3.3 minutes,
  covering desktop and emulated iPhone-sized Chromium. This includes actual
  provider replies, navigation during streaming, attachments, model selection,
  composer focus and scrolling, artifact previews/downloads and history,
  disclosure choices, drafts and composer instance retention, Back/Forward,
  Settings refresh/return, canonical precedence, and host exit/re-entry.
- Desktop/mobile screenshots were inspected, including mobile streaming,
  desktop artifact history, mobile Settings and desktop Projects. Outputs live
  under ignored tests/visual-output; test logs live under ignored tmp.
- git diff --check passed. No commit was created.

Installed iOS/Safari and HTTPS system push delivery were unavailable. Mobile
layout was verified in Chromium emulation, and canonical worker recognition,
legacy compatibility and viewer attestation were verified by unit tests.

The disposable router-migration container is stopped with npm run live:stop;
the pre-existing test container is outside this run's cleanup scope.
