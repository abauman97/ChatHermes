# ChatHermes architecture and implementation plan

## Architecture

ChatHermes is a Vue/TypeScript static PWA. Hermes remains the source of truth for sessions and messages. Each connection profile is saved in this browser’s `localStorage` with a label, normalized API base URL, and bearer key. The browser sends JSON and fetch-based SSE requests directly to the selected base URL. A shared Hermes multiplexer uses a configured `/p/<profile>/` base path. There is no ChatHermes Node server or proxy.

The client constructs only known Hermes session, capability, and run paths. Base URLs are limited to an API root or `/p/<profile>/`; remote URLs require HTTPS and URL credentials are rejected. Requests omit cookies and referrers, disable cache, and use manual redirects. The service worker precaches the app shell and has no runtime API cache. A trusted single-user origin and CORS-enabled Hermes endpoint are prerequisites.

## Implemented work

1. Persist and validate browser connection profiles; provide add, edit, remove, masked key input, and profile selection UI.
2. Route session list, create, read, rename, history, stream, capability, and stop calls to the selected profile with its own bearer key.
3. Keep session navigation, pagination, stale-response guards, streaming state, approval warning, and PWA shell behavior.
4. Remove Node proxy files, server scripts, tsx dependency, server environment example, and Vite API proxy.
5. Cover direct routing, authorization isolation, redirects, URL validation, persistence, and UI session flows with synthetic tests.

## Verification and remaining live checks

Run `npm test`, `npm run build`, and `git diff --check`. Live authenticated Hermes integration is pending: use a disposable session to check list, create, history, stream, rename, and shared multiplexer routing. Do not read existing private transcripts or change gateway configuration. Browser `localStorage` keys are exposed to scripts on the origin and anyone with browser/device access, so deploy only on a trusted single-user origin. Browser CORS, mixed-content, and private-network policies may prevent an HTTPS app from reaching a local HTTP API.
