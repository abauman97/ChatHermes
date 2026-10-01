# ChatHermes conventions

ChatHermes is exclusively a Hermes dashboard plugin. Do not add standalone SPA, PWA, browser API keys, connection management, or direct cross-origin gateway requests. Vue mounts through the Hermes React plugin SDK; Python routes inherit dashboard authentication and keep gateway credentials on the server.

Keep the interface simple and compatible with the mobile ChatGPT reference images in `docs/reference/chatgpt/`. Use quiet dark surfaces, readable text, a rounded composer, native profile and model selects, and slim thinking/tool disclosures. Active disclosures expand and show arriving data; completed disclosures collapse and remain available to inspect. Preserve the immediate sent-message → activity → assistant-response order.

The composer must stay focusable, including on the home screen and while requests are in flight. Gate sending separately. Keep all inputs and selects at least 16px to avoid iOS focus zoom. Suppress viewport zoom only while the plugin is mounted and restore host settings on unmount. File and camera attachments must travel through authenticated routes or supported image content parts.

Use Hermes's existing profiles, sessions, models, and agent runtime. Preserve cancellation and profile/session isolation. Follow the actual API contract of the pinned test version; model choices must affect the runtime, not only display labels. Never expose secrets in response bodies, errors, screenshots, or logs.

Use `compose.yml` for an isolated Hermes test environment. It must use a dedicated named data volume and must not mount an existing personal Hermes home. Preserve the source and base-image pins for repeatable tests. Never commit `.env`, credentials, generated Hermes state, or user session data.

Run `npm test`, `npm run test:api`, and `npm run build` for relevant changes. Rebuild and include the plugin's committed `dashboard/dist/` assets. Always visually test changes in the actual dashboard plugin at mobile and desktop sizes before committing; inspect screenshots and check focus, scrolling, attachments, selects, and disclosure transitions. Document any test limitation honestly. Do not commit without that visual verification.
