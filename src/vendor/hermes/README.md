# Hermes shared protocol sources

Vendored unchanged from NousResearch/hermes-agent at
`ac28abc96ce83f22f6b831f80d9007e2aba81f21`, `apps/shared/src/`.
MIT license: see LICENSE. Python gateway contracts remain the source of truth.

ChatHermes uses the transport-independent JsonRpcRequestChannel and generated
wire types. The current browser adapter connects to the authenticated same-origin native
gateway. The retained plugin facade remains available for compatibility; its
stronger process-local retention is not claimed by native viewers.
Do not add React, Electron, or Desktop application stores to this directory.
Update these files together with the isolated Hermes source pin and contract tests.

`canonical-protocol.ts` is the standalone wire adapter from
`apps/desktop/src/api/canonical-protocol.ts` at Desktop commit
`290080e19e8e143d35f67427e89aed662161faf8` (MIT), with repository formatting and a cryptographic browser UUID helper for
authenticated HTTP origins without `crypto.randomUUID`.
It has no Electron, React, registry, or application-store dependencies. Native
viewers select it only after receiving a canonical revision/generation snapshot;
older native gateways retain their generated legacy contract. The profile is
carried on every RPC in both modes. Native snapshots do not claim the retained
plugin facade's offline-turn lease or an atomic legacy snapshot/replay boundary.
