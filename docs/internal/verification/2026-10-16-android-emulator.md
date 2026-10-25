# Android emulator and installed PWA verification

Tested on October 16, 2026 with working daemon-side KVM,
`budtmo/docker-android:emulator_14.0` (Android 14, Chrome 113), and a separate
real-provider Hermes instance built from this checkout with `npm run live`.
The existing Hermes test container was preserved.

The unattended command completed successfully:

```sh
CHATHERMES_INSTANCE=android-verification npm run live:android
```

It booted a fresh device, authenticated to Hermes through Android localhost,
loaded the protected ChatHermes manifest, installed the home-screen web app,
closed Chrome, and cold-started the installed icon. Chrome reported
`display-mode: standalone`; Android reported `WebappActivity`. noVNC was
reachable and its emulator screen was visually inspected.

An additional smoke check inside the installed Android PWA verified a real
model response, an authenticated text-file upload (HTTP 201), 16px composer
text, native keyboard visibility, focus while a request was active, and draft
preservation after the response. Inspected screenshots are in the ignored
`tests/visual-output/android/` directory, including `standalone-keyboard.png`,
`cold-start-verified.png`, and `cold-start-chat-verified.png`.

Docker inspection confirmed zero mounts, automatic container removal, and
logging disabled. The Android stop command removed the device; the Hermes stop
command removed only this verification instance and its anonymous data volume.
No generated dist assets or screenshots are included in the changes.

Validation passed:

- `npm test`: 669 tests.
- `npm run test:api`: 115 tests.
- `npm run test:docker`: 17 tests, including cleanup ownership after replacement.
- `npm run build`, `vp lint`, `vp fmt`, shell and Node syntax checks.
- Chrome's actual authenticated manifest loader: desktop and mobile.
- Dashboard focus, scrolling, profile/model controls, file and synthetic camera
  attachments, real native responses, and completed tool inspection: desktop and mobile.

A broader, separate activity test failed at both viewport sizes:
`chronological activity streams and preserves disclosure choices` expected an
active tool disclosure to have its `open` attribute, but it was collapsed.
That behavior was not changed as part of the Android launcher work. Its failure
screenshots and traces remain in ignored `tests/visual-output/`. Android's
system camera picker was not exercised; camera preview coverage came from the
existing desktop/mobile Playwright checks with a synthetic image.

Live testing exposed and resolved missing manifest credentials, Chrome's
first-run prompt and launcher initialization, native menu timing, stale UI
snapshots, home-screen page selection, the install-to-HOME transition, and
cleanup of an exact container rather than a replacement with the same name.
