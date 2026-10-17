# Focus-based footer padding

Removed the VirtualKeyboard overlay opt-in, keyboard environment inset, and chat
overlap calculation. The browser handles keyboard resizing, with
`interactive-widget=resizes-content` requested while the plugin is mounted.
Viewport settings still restore on unmount. The fixed plugin overlay remains the
Hermes integration boundary; the header, chat, and footer use ordinary flex flow.

Footer bottom padding is normally 12px plus the bottom safe area on narrow screens
and 24px plus the safe area on desktop. Focusing the mobile textarea, including the
existing touch landscape layout, changes footer padding to 4px. Composer bottom
margin stays zero. Blur and plugin remount restore the normal spacing.

Changing padding alone does not prevent a lost click: blur can move both the
footer and the compact composer layout. Send therefore cancels primary pointer
focus transfer when the textarea is focused. Submission still happens on click;
keyboard activation retains native button behavior.

Validation used the actual authenticated Hermes plugin in a separate disposable
container on port 9120. Desktop mouse and mobile CDP touch tests hold the pointer
down, check unchanged Send bounds and textarea focus, release at the original
coordinates, and verify exactly one `chat.submit`, one user message, and zero
textarea blur events. These checks passed. Spacing checks at widths 390, 700,
701, and 1280, remount, transcript scrolling, and reduced touch landscape height
also passed. Screenshots of desktop and mobile focus, Send held down, long drafts,
attachments, model selection, and disclosures were inspected.

`npm test` passed 669 tests; `npm run test:api` passed 115 using the existing
`/tmp/chathermes-shell-venv` environment outside the sandbox. `vp lint`, scoped
`vp fmt --check`, and `npm run build` passed. Generated bundles were restored to
their original tracked state after building the isolated test image.

The full dashboard suite finished with 35 passed, one skipped (desktop is excluded
from the touch landscape case), and two failures. The existing real-provider
`chronological activity streams and preserves disclosure choices` test failed at
the initial active disclosure `open` assertion on both desktop and mobile. The
deterministic streaming terminal, edit, and write disclosure checks passed on
both sizes. The full suite is therefore not green; disclosure behavior was not
changed as part of this footer work.

No physical iPhone or real software keyboard was tested in this session. Mobile
Chromium emulation and reduced viewport tests cannot establish iOS keyboard
geometry. The Android keyboard helper was updated for browser resizing and 4px
focused footer padding and syntax checked, but was not run on a device.
