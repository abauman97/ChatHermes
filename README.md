# ChatHermes

A local Vue PWA for browsing and chatting in Hermes sessions across configured profiles. A same-origin Node proxy keeps each profile's bearer key on the server.

## Run locally

```sh
npm ci
npm run build
# Set CHATHERMES_PROFILES_JSON in a private process environment; see .env.example.
npm start
```

Open `http://127.0.0.1:8787`. For development, start `npm run server:dev` and `npm run dev` separately. Run `npm test` for synthetic proxy, SSE, and component tests.

See [deployment](docs/deployment.md) for profile configuration and security limits, and [API contract](docs/api-contract.md) for the live verification status. The PWA caches only its shell. Offline messaging is unavailable.
