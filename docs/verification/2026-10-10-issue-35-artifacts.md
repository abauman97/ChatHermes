# Issue 35 after upstream main advanced

Base: `5cdaf5a4a572589ad55ba9c8a47cf59f362823d0`.

The artifact integration retains the upstream native viewer, admission/recovery,
execution owner, model preflight, and scope generation guards. The transcript
keeps the explicit `entry.kind === 'turn'` renderer guard. Composer mounting
preserves focus while the first attachment creates a session; sending remains
gated separately from editing.

Compatibility fixes found in the actual dashboard:

- Workspace setup reuses an active native project or creates one. A 409 is
  resolved through the project list and never skips the test.
- The current official image restricts hosted reads/deletion to `/opt/data`.
  Visual outputs use that boundary; native denial is preserved and API-tested.
- Teleported previews must sit above the plugin's z-index 10000. Preview close
  and focus restoration now work at both sizes.
- The desktop title occupies the second header grid column.
- Completed tool disclosures retain a user's expanded state when history
  replaces an activity object. Completion transitions still collapse them.

Final validation:

- `vp fmt` on owned source/docs and `vp lint`: passed.
- `npm test`: 24 files, 357 tests passed.
- `npm run test:api`: 109 tests passed, using the ignored local virtual environment.
- `npm run build`: passed; final app asset `app-DVZxVRQf.js`.
- `npm run test:docker`: 10 tests passed, with PyYAML installed in that environment.
- Default `npm run test:visual`: 4 passed, 0 skipped, in 50.3 seconds.
- Artifact suite repeated against the newly created projects: 2 passed,
  0 skipped, in 20.3 seconds, confirming workspace reuse.
- `git diff --check`: passed.

UI verification used the repository Docker launcher, a fresh anonymous volume,
and `nousresearch/hermes-agent:latest` at digest
`sha256:9774f4f39a9bb8c2f68ce728ed5e99ddbad282163be56764afacf88ed952b784`.
The existing ignored root `.env` supplied the provider settings; none were
assumed from the process environment or printed. The final launcher instance
was `issue35-current`, served at Docker port 9235. Earlier fixture containers
and named volumes were not reused or removed.

Desktop (1280×720) and mobile (Chromium iPhone 13 emulation) screenshots were
inspected for staging/drop, transcript visibility, generated images, previews,
global/project browsers, composer focus/scrolling, model selection, camera
attachments and completed tool inspection. Download bytes matched the original
PNG. Screenshots remain ignored under `tests/visual-output/`, with the repeat
under `workspace-reuse/`. Physical iOS/Safari and a remote execution filesystem
were not visually tested; unsupported remote deletion is covered by API tests.

Upstream `5cdaf5a` reintroduced eight tracked dist files despite `.gitignore`.
Those tracked files are restored to upstream contents after verification, with
the verified build preserved in ignored `tmp/issue35-verified-dist/`. Nothing is
staged, committed, pushed or deployed.
