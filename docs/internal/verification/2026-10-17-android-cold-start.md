# Android installed-app startup

The reported failure occurred after pinning, at standalone cold-start detection.
Inspection also reproduced Chrome's installation completion returning
`ChromeTabbedActivity` to the foreground after HOME had been requested. The old
launcher then searched and swiped Chrome rather than the Android home screen.

The installer now verifies the pinned app's first standalone launch and composer
before backgrounding and force-stopping Chrome for a cold start. Icon search
checks the resumed Android activity after a missed tap, returns HOME if another
activity took over, and swipes only when the launcher is in front. Recovery is
bounded. Disabled and zero-area native controls are excluded from taps.

Standalone detection accepts same-origin installed windows on the login route
and restores the synthetic dashboard sign-in if needed. Browser shortcuts still
fail verification. Failure messages report local paths and display modes without
query values.

Two fresh Android 14 / Chrome 113 emulator installations passed the revised
first-launch and cold-start checks. The second run triggered the native
foreground interruption and logged its automatic return to HOME before
successfully completing both checks. The final standalone screen and visible
composer were inspected; the emulator remains running for interactive testing.

`npm run test:docker`, `vp lint`, scoped formatting checks, and syntax checks
passed. The launcher suite includes regression cases for interrupted HOME,
second-page icons, bounded recovery, first-launch readiness before force-stop,
login windows, and rejection of regular browser shortcuts.
