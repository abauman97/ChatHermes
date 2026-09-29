# ChatHermes

Vue 3 + TypeScript + Vite PWA starter for a lightweight Hermes Agent sessions client. The app currently contains the Vite starter screen and an installable static shell; **it does not yet connect to Hermes**. See the [implementation plan](docs/plans/2026-09-29-chathermes.md) for the integration, proxy security model, UI, tests, and deployment milestones.

## Start

Requires Node 20.19+ or 22.12+ (Node 26 used during setup).

```bash
npm ci
npm run dev
```

Run `npm run build` to type-check and generate `dist/` with a manifest, icons, and a service worker. Run `npm run preview` to inspect the production shell. Do not expose this starter as a working Hermes frontend yet.

The intended integration uses Hermes's authenticated `/api/sessions` HTTP API via a same-origin server-side proxy. Never place `API_SERVER_KEY` in browser code or `VITE_*` environment variables; Hermes's API has access to powerful agent tools. The PWA will cache only static assets; offline chat is out of scope.
