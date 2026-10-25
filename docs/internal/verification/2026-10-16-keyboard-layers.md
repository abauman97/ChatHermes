# Fixed shell layers with the actual Android keyboard

Reproduced the problem in the installed dashboard plugin on Android 14 / Chrome
113 using the repository's disposable emulator, not a shortened desktop viewport.
Android confirmed `mInputShown=true` and `mIsInputViewShown=true`.

The original `interactive-widget=resizes-content` setting shrank the portrait
viewport from 736px to 485px and moved the footer from y=724 to y=473. Changing
viewport units did not address this explicit request to resize the whole shell.

## Fix

The mounted plugin now requests the normal `resizes-visual` fallback and enables
`navigator.virtualKeyboard.overlaysContent` where supported. The previous browser
option and viewport meta tag are restored on unmount. This is one browser opt-in;
there are no keyboard listeners, measured height estimates, or Vue keyboard state.

The OS keyboard covers the stable shell and its footer. CSS uses the browser's
`keyboard-inset-height` environment value to reserve overlap inside the chat
layer. The composer meets the keyboard while the transcript gets smaller; the
header and footer keep their original coordinates. The footer remains responsible
for all spacing at the screen bottom, and composer bottom margin remains zero.

Landscape testing exposed another failure: the desktop composer layout and eight
textarea rows did not fit above the keyboard. Short screens without hover now use
the compact focused layout. CSS caps textarea height to the available space and
owns its overflow, so long drafts scroll instead of hiding Send behind the keyboard.

## Measured results

Coordinates are CSS pixels relative to the app viewport, excluding Android's bars.

| Case                                    | Viewport height | Header y | Footer y | Composer bottom |
| --------------------------------------- | --------------: | -------: | -------: | --------------: |
| Portrait, keyboard closed               |             736 |        0 |      724 |             724 |
| Portrait, keyboard open (251px)         |             736 |        0 |      724 |             485 |
| Portrait, dismissed with focus retained |             736 |        0 |      724 |             724 |
| Landscape, keyboard closed              |             336 |        0 |      312 |             312 |
| Landscape, keyboard open (200px)        |             336 |        0 |      312 |             136 |

The repeatable `tests/docker/android-keyboard.mjs` check passed in both
orientations, including twelve-row draft growth and scrolling, dismissal with
focus retained, reopening, unchanged draft text, and unchanged viewport/header/
footer geometry. It uses CDP touch input and native Android Back. The emulator's
older Chrome misreports `boundingRect.y`; the check uses the browser-provided
height for its bottom-docked keyboard, which agrees with the CSS inset and screen.

## Other validation and evidence

- Formatting, lint, production build, 669 unit tests, and 115 API tests passed.
- Ten desktop/mobile browser checks passed with the new overlay behavior,
  including real-provider replies, attachments, native profile/model controls,
  completed tool inspection, routing, and host browser-setting restoration.
- After the final landscape correction, nine targeted browser checks passed;
  the touch-only landscape case was intentionally skipped in the desktop project.
- Inspected native portrait/open/grown/dismissed/reopened screenshots and landscape
  screenshots. Device evidence and geometry are in ignored
  `tests/visual-output/android-keyboard/`. The failing baseline is in
  `tests/visual-output/keyboard-probe/`; final browser evidence is in
  `tests/visual-output/keyboard-layers-final/`.
- Used a separate `shell-keyboard` Hermes instance on port 9120 and its own
  Android device. The image was built with `tests/docker/Dockerfile` and
  `npm run live`; iterative frontend builds were copied into that instance's
  `/opt/data/plugins/chathermes/dashboard/dist/` and reloaded with cache disabled.
  No bind mounts or personal Hermes state were used. Generated assets stayed in
  ignored `.shell-validation/dist/` and were not staged or committed.
- Stopped only the `shell-keyboard` Android device and Hermes instance after
  testing. The pre-existing dashboard container on port 9119 was preserved;
  it must load a rebuilt image to pick up these source changes.

This establishes the requested behavior in the Android emulator. It does not
establish iOS Safari parity: browsers without VirtualKeyboard/CSS keyboard-inset
support keep their native overlay/panning behavior. Physical devices were not
available. See the compatibility notes in `docs/architecture.md`.
