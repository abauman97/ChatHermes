# Send focus and streamed scrolling

The composer keeps focus during the pointer press so its compact layout and Send
button cannot move before click. The Send handler then focuses the noneditable
conversation synchronously, allowing the mobile keyboard to dismiss. Guidance
messages use the same handoff; pressing Stop does not move focus.

Sending resumes transcript following even when the reader had scrolled up. Focus
moves to the latest message and then the assistant turn as content arrives,
including after asynchronous session creation. Further deltas scroll to the bottom
without repeatedly focusing the same turn. Focusing a new draft or a disclosure
control prevents incoming content from taking focus back. Scrolling up still
disables automatic following. Message containers use `tabindex="-1"` and do not
add tab stops or visual focus outlines. The drawer swipe guard excludes these message containers from its
interactive-control check while preserving protection for actual controls.

Validation used a separate disposable real-provider Hermes plugin on port 9120,
with generated assets built into ignored `tests/build/dist/`. The existing
Android testing instance and its Hermes container were left alone.

- `npm test`: 671 passed, including focus handoff, continued streaming scroll,
  focus retention for a new draft, manual scroll-up, and drawer swipes.
- `npm run test:api`: 115 passed using the existing test Python environment.
- Build, `vp lint`, and scoped formatting checks passed.
- Desktop and mobile dashboard checks covered stable pointer-down/up geometry,
  a single submission, blur only after click, latest-turn focus, restored footer
  padding, repeated streamed text growth, drafting during streaming, manual
  scroll-up, attachments, model selection, routing, and tool disclosures. Real
  provider first sends from home and project-home transcript mounting also passed
  on both sizes. Project test setup waits for Hermes's asynchronous discovery.

Desktop and mobile screenshots were inspected. Mobile tests use Chromium
emulation; physical iOS keyboard dismissal still requires an iPhone check.
