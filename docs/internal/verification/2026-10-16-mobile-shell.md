# Mobile application shell

The keyboard behavior below was superseded by the real-device fix documented in
`2026-10-16-keyboard-layers.md`.

Implemented the bounded flex shell using SWOL's `src/App.vue` as the reference.
The header and empty safe-area footer sit outside the content scroll region;
the composer has its own nonshrinking dock. The footer owns the bottom safe-area
inset on every page, including pages hiding the composer. Focus no longer removes
bottom spacing. The composer now has zero bottom margin; the shell footer owns
the entire bottom gap (12px/mobile or 24px/desktop plus the safe-area inset).
Footer gaps and model-button text use explicit pixel sizes so the host's 15px
root font cannot reduce them. A scoped flex rule prevents the
host's `.topbar` grid layout from truncating the desktop title.

The mounted plugin requests `interactive-widget=resizes-content` and restores the
original host viewport configuration on unmount. No keyboard detection, viewport
listeners, keyboard state, or runtime/API changes were added.

## Validation

- `vp fmt` and `vp lint` passed (invoked through the local npm executable).
- `npm test`: 669 tests passed.
- `npm run test:api`: 115 tests passed using a temporary Python environment with
  `tests/requirements.txt`; the suite required execution outside the sandbox.
- `npm run build` passed. The final build used
  `CHATHERMES_BUILD_OUT_DIR=.shell-validation/dist` to keep generated assets
  ignored and leave the checkout's pre-existing tracked dist files unchanged.
- Used `npm run live` with `tests/docker/Dockerfile`, the latest official Hermes
  image, synthetic login, and a real provider. No personal Hermes state or bind
  mounts were used.
- The broader desktop/mobile Chromium run passed 28 of 32 checks. The activity
  test failed in both sizes because it expects active tool details to open
  automatically, while the unchanged `ActivityRow.vue` defaults tool details to
  collapsed. The routing test also failed in both sizes because it attempted to
  click attachment options while editing hid the button; the test now blurs first.
- On the final rebuilt image, all 10 targeted desktop/mobile checks passed:
  bounded shell, focus-independent spacing, composer growth, attachments and real
  native response, and canonical routing/host viewport restoration. Chromium was
  version 153.0.8010.12. The full suite's two activity-default failures remain;
  disclosure behavior was not changed by this refactor.
- Inspected desktop and mobile screenshots for scrolling, shortened viewports,
  footer spacing, Settings, profile/model controls, attachments, and streaming and
  completed disclosures. Final screenshots are in ignored
  `tests/visual-output/shell-final/`; the broader run's evidence remains alongside
  it in `tests/visual-output/`.
- Ran `npm run live:stop` to remove the owned container and anonymous volume.

Final targeted command (with the temporary browser path exported):

```sh
npm run test:visual -- --grep 'bounded shell|composer spacing|composer empty focus|disposable dashboard composer|canonical routing preserves' --output=tests/visual-output/shell-final
```

## Device limitations

Follow-up footer correction: removed all composer bottom margin and moved the
normal gap into the footer alongside the safe-area inset. All four targeted
desktop/mobile shell and focus-spacing checks passed, and their shortened-viewport
screenshots were inspected in `tests/visual-output/footer-spacing/`. Formatting,
lint, build, 669 unit tests, and 115 API tests also passed again. The owned
disposable dashboard was stopped after testing. `dvh` remains intentional: `vh`
does not freeze the viewport at load time or prevent layout viewport resizing.

Chromium desktop and iPhone 13 emulation check layout, not physical iOS or Android
keyboards. The shell test supplies a synthetic 34px footer and a shortened layout
viewport; neither proves real nonzero safe-area behavior or keyboard clearance.
No physical devices were available to test keyboard opening, dismissal while
focused, reopening, rotation, or a hardware camera.

CSS-only viewport resizing also lifts the footer. Keeping it at the physical
screen bottom while independently lifting the composer is not guaranteed.
Browsers ignoring `interactive-widget` retain their native overlay/panning
behavior. See the compatibility notes in `docs/architecture.md`.
