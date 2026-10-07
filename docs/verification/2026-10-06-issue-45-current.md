# Issue #45 reconciliation onto current main

Ported the uncommitted issue #45 implementation from sibling worktree
`chathermes-issue-45` (base `d84067f`) onto
`codex/issue-45-projects-current` (base `6be581a925ce3a0652a0806c5af9e52f00692b6a`).
Applied the source diff after inspecting both bases; regenerated dashboard assets
with this checkout's build. Main's `native_owners.py` push sender fix and existing
API tests, including the loaded push sender regression, are preserved. The two
instruction API tests are appended to main's suite rather than replacing it.

## Changes

- Center the selected project name in the header, including its conversation
  view; use `Message <project name>` in the composer.
- Move the embedded Hermes Desktop return arrow to the navigation drawer.
- Extend the existing three-dots screen menu with Other chats, Edit instructions,
  Edit/Save project, Archive/Restore project, and confirmed Delete project.
- Present project details and instruction editing on separate pages with URL
  restoration and a return action; remove inline settings and destructive
  controls from the project overview. Keep folder management in the details editor.
- Constrain project content width and give project list rows rounded borders
  and more spacing.
- Add authenticated, profile-scoped instruction read/write routes. Resolve the
  workspace from Hermes's authoritative project data, create `.hermes.md`, or
  preserve an existing `HERMES.md`. Use bounded UTF-8 content, expected-content
  conflict checks, atomic replacement, and generic filesystem errors; reject
  symlinks, hard-linked instruction files, and non-regular files.
- Add frontend coverage for project context, editor navigation, deletion,
  pathless workspaces, stale reads, load failures, and save conflicts; API coverage
  for creation/editing, profile validation, conflicts, alternate filenames,
  malformed/oversized content, and unsafe files.

## Validation

- `npm ci`: completed to install this checkout's dependencies.
- `npm test`: **151 passed**, across 17 files.
- `npm run build`: passed Vue/TypeScript checks and rebuilt
  `plugin/chathermes/dashboard/dist/`.
- System `npm run test:api`: unavailable because system Python has no pytest.
  Equivalent suite passed via
  `uv run --with pytest --with fastapi --with httpx --with ./plugin/chathermes python -m pytest tests/plugin_api.test.py`:
  **86 passed**, including the declared `pywebpush` and `py-vapid` runtime dependencies.
- `git diff --check`: passed.

Live mobile/desktop visual verification is **blocked and not performed**.
The prior issue #45 launcher log ends with
`all predefined address pools have been fully subnetted`. Read-only inspection
of the current Docker networks and their subnets confirms continued occupation
of the default pools. The launcher was not retried, and no shared networks,
containers, or volumes were removed. Browser checks for focus, scrolling,
attachments, selects, and disclosure transitions remain unverified on this build.

No commit, push, or PR was created. The sibling worktree was not modified.
