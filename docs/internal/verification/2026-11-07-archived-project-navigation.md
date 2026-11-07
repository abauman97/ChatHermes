# Archived Project return navigation review follow-up

The sidebar **Projects** link now targets the archived list while viewing an
archived Project, including its artifacts, settings and instructions pages. It
uses the guarded backend Project state, so reloading those pages preserves the
destination without depending on browser history. On the list, the link preserves
the current archive filter. Active Projects and unrelated sections still target
the active list. The list's existing **Active projects** / **Archived projects**
menu remains the way to switch lists. The removed workspace return link stays
removed.

Existing work in this checkout was retained. No commit or push was made.

## Regression coverage

- `src/project-header.test.ts` opens an archived list item, checks sidebar returns
  from each Project page with the profile preserved, switches to active Projects,
  and checks that active Projects and unrelated archive queries do not retain the
  archived destination.
- `src/projects.test.ts` now asserts that sidebar navigation preserves the archived
  list and that the list menu switches back to active Projects.
- `tests/workflows/project-header.spec.ts` creates/archives a uniquely named real
  Hermes Project, opens it from the archived list, reloads each of its four pages,
  returns through sidebar Projects, verifies the archived item and selected filter,
  and switches back to the active list. It also checks the archived composer stays
  focusable. Mobile asserts that the navigation drawer leaves the viewport before
  capturing the returned list.

## Validation

- `vp lint`, `vp fmt --check` and `git diff --check`: passed.
- `npm test`: 46 files, 1,436 tests passed.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: 144 passed.
- `npm run test:env:build`: passed, including `npm run build` and the explicit
  Docker image build. Applied with Compose `up -d --wait --no-build`.
- Real dashboard desktop/mobile workflows: eight passed, covering the Project
  header and archived navigation, authenticated file/camera attachments and focus,
  native model/reasoning selection, and tool completion/disclosure reopening.

The first build/lint caught a missing required field in the new test fixture;
it was fixed. The first full unit run exposed the old active-list-reset assertion;
it was updated for the new navigation contract. Subsequent checks passed.

The deterministic environment reused only Compose project
`chathermes-project-header`, its existing override, dashboard port 19442 and
MockServer port 19443. The integration commands used the same environment settings
documented in [the header verification](2026-11-07-project-header.md), with:

```sh
npm run test:integration -- tests/workflows/project-header.spec.ts tests/workflows/navigation.spec.ts tests/workflows/messaging.spec.ts --grep 'Projects header|file and camera|real tool activity|resumed model and reasoning'
npm run test:integration -- tests/workflows/project-header.spec.ts
```

The second command repeats the header/navigation scenario after adding the mobile
drawer-settled assertion for screenshot capture: both desktop and mobile passed.
The initial mobile return image
captured the drawer's closing transition; this was a capture timing issue.

Desktop and mobile screenshots of the opened archived Project and returned list
are local ignored evidence under `tests/visual-output/project-header-*/`, named
`opened-archived-project.png` and `returned-archived-projects.png`. Screenshots were
inspected for readable/truncated labels, available navigation, composer layout and
horizontal overflow. Physical-device/Android and real-provider checks were not
run. Containers and state remain available for inspection. Tracked generated
dashboard assets were restored to their original clean state after the image build;
generated output is not part of the change.

## Pending-detail race follow-up

A deferred-detail regression reproduced the remaining review finding on Project
home, artifacts, settings and instructions: entering a Project cleared
`selectedProject`, so the sidebar incorrectly targeted the active list even
though the catalog already identified the Project as archived. All four pending
return cases failed before the fix.

The sidebar now uses the catalog entry matching the route Project ID while
matching details are unavailable. The lookup requires the current route profile
to match the workspace profile, and loaded matching details take precedence over
catalog archive state. The list preserves its own filter; unrelated sections do
not inherit archive queries. This fallback only determines navigation and does
not promote catalog data into editable Project details or composer state.

Additional unit coverage holds requests pending, returns through the sidebar,
resolves departed details, changes Project IDs, changes profiles with the same
Project ID, ignores late old-profile catalog/detail responses, and checks loaded
detail precedence. The focused header/Projects run passes 87 tests. The new
mounted workflow delays the real authenticated detail request while retaining
the real Hermes catalog and response, then follows the sidebar back before
releasing the detail request.

Follow-up validation:

- `npm test`: 46 files, 1,443 tests passed.
- `npm test -- src/project-header.test.ts src/projects.test.ts`: 87 passed.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: 144 passed.
- `vp fmt`, `vp fmt --check`, `vp lint`, and `git diff --check`: passed.
- `npm run test:env:build`: passed after correcting required catalog fields in
  the new test fixtures; image `33a76221f37b`. Applied only to the existing isolated
  `chathermes-project-header` environment with Compose `up -d --wait --no-build`.
- Mounted dashboard desktop/mobile: 10 passed, including deferred real detail
  requests, existing header/archive navigation, file/camera attachments and focus,
  runtime model/reasoning selection, and tool disclosure completion/reopening.
  The command used the same environment above, plus
  `CHATHERMES_DASHBOARD_URL_HOST=docker`, with:

  ```sh
  npm run test:integration -- tests/workflows/project-header.spec.ts tests/workflows/navigation.spec.ts tests/workflows/messaging.spec.ts --grep 'Projects header|Archived Projects sidebar|file and camera|real tool activity|resumed model and reasoning'
  ```

Screenshots were inspected at both viewport sizes for pending Project navigation,
the archived return list, attachment/composer layout and model selection. The
first pending mobile capture caught the opening drawer transition; the workflow
now waits for the drawer to reach its resting position before capturing it.
The focused repeat passed on both desktop and mobile (2 tests), and its settled
drawer and archived-list screenshots were inspected. That repeat replaced the
full-run screenshot output; current evidence is under
`tests/visual-output/project-header-Archived-Pr-*/` with
`pending-archived-project.png` and `pending-return-archived-projects.png`.
Mobile checks use Chromium's iPhone 13 viewport; physical Android and real-provider
checks were not run. Tracked generated dist assets were restored to HEAD after
building; a pre-build backup is retained in `/tmp/chathermes-pending-archive-backup/`.
Existing source work, containers and state were preserved. No commit or push.
