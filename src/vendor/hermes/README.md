# Hermes shared protocol sources

Vendored unchanged from NousResearch/hermes-agent at
`ac28abc96ce83f22f6b831f80d9007e2aba81f21`, `apps/shared/src/`.
MIT license: see LICENSE. Python gateway contracts remain the source of truth.

ChatHermes uses the transport-independent JsonRpcRequestChannel and generated
wire types. Connection/recovery ownership stays in the plugin adapter because
its authenticated chat facade retains server-owned turns beyond native replay.
Do not add React, Electron, or Desktop application stores to this directory.
Update these files together with the isolated Hermes source pin and contract tests.
