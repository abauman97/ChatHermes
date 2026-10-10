# ChatHermes conventions

Use Vite+ (`vp`) for project linting, formatting, tests, and build workflows. Run `vp lint` and `vp fmt` for code quality; `npm test`, `npm run test:api`, and `npm run build` remain the project validation commands. Generated `plugin/chathermes/dashboard/dist/` assets are excluded from lint and formatting; rebuild them with `npm run build` when source changes require updated committed assets.

ChatHermes is exclusively a Hermes dashboard plugin. Do not add standalone SPA, PWA, browser API keys, connection management, or direct cross-origin gateway requests. Vue mounts through the Hermes React plugin SDK; Python routes inherit dashboard authentication and keep gateway credentials on the server.

Keep the interface simple and compatible with the mobile ChatGPT reference images in `docs/reference/chatgpt/`. Use quiet dark surfaces, readable text, a rounded composer, native profile and model selects, and slim thinking/tool disclosures. Active disclosures expand and show arriving data; completed disclosures collapse and remain available to inspect. Preserve the immediate sent-message → activity → assistant-response order.

The composer must stay focusable, including on the home screen and while requests are in flight. Gate sending separately. Keep all inputs and selects at least 16px to avoid iOS focus zoom. Suppress viewport zoom only while the plugin is mounted and restore host settings on unmount. File and camera attachments must travel through authenticated routes or supported image content parts.

Use Hermes's existing profiles, sessions, models, and agent runtime. Preserve cancellation and profile/session isolation. Follow the actual API contract of the pinned test version; model choices must affect the runtime, not only display labels. Never expose secrets in response bodies, errors, screenshots, or logs.

Use `tests/docker/Dockerfile` with `npm run live` for isolated Hermes UI testing. The image extends the latest official Hermes release and starts one disposable real-provider container, without bind mounts or personal Hermes state. Set `TEST_LLM_API_BASE_URL`, `TEST_LLM_API_KEY`, and `TEST_LLM_API_MODEL` in the repository root `.env` file; `npm run live:real` is an alias. Open the printed `/chathermes` URL and sign in with the synthetic credentials. Run `npm run live:stop` after testing to remove only the launcher's owned container and anonymous volume. Old fixture named volumes are left alone. Never commit `.env`, credentials, generated Hermes state, or user session data.

Run `npm test`, `npm run test:api`, and `npm run build` for relevant changes. Rebuild and include the plugin's committed `dashboard/dist/` assets. Always visually test changes in the actual dashboard plugin at mobile and desktop sizes before committing; inspect screenshots and check focus, scrolling, attachments, selects, and disclosure transitions. Document any test limitation honestly. Do not commit without that visual verification.
