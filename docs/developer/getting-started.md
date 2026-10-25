# Developer setup

Read [AGENTS.md](../../AGENTS.md) before changing the repository. Use the [architecture guide](architecture.md) to find the owning component and the [API contract](api-contract.md) before changing runtime behavior.

## Prepare a checkout

Use Node.js 22 (the asset workflow uses it), npm, Vite+ (`vp`), and Python 3.11+ with venv support. Docker Compose is needed for the real-Hermes environment; Android additionally requires daemon-side KVM.

From the repository root:

```sh
npm ci
python3 -m venv .venv
. .venv/bin/activate
pip install -r tests/requirements.txt
pip install -e 'plugin/chathermes[dev]'
```

The API tests need a complete reviewed Hermes runtime source checkout and its runtime dependencies, not just the plugin package. Missing Hermes imports can skip profile/host contracts; inspect skips before claiming full coverage. Use a separate checkout of Hermes at the [native contract pin](api-contract.md#native-chat-contract) and set `PYTHONPATH` when running them. Do not use personal Hermes state or credentials for deterministic tests.

Follow [testing](testing.md) for checks and dashboard reproduction, then [deployment](deployment.md) to build and install into a development dashboard. Vite alone is not the supported product runtime; verify the React-mounted plugin in Hermes.

## Repository map

| Location                        | Purpose                                                                                               |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `src/`                          | Vue shell, feature controllers, components, and nearby tests; see the architecture ownership table    |
| `src/plugin-entry.ts`           | Hermes React plugin SDK mount and host lifecycle                                                      |
| `plugin/chathermes/`            | Plugin registration, Cron adapter, dependency declaration, and authenticated Python dashboard backend |
| `public/`                       | Push service worker, Home Screen manifest, and icons copied into the build                            |
| `scripts/`                      | Plugin build and local copy/install tools                                                             |
| `tests/`                        | Python contracts, browser workflows, and Docker infrastructure                                        |
| `docs/user/`, `docs/developer/` | Maintained task guides and technical contracts                                                        |
| `docs/internal/`                | Historical plans, verification evidence, and visual references                                        |

For contribution expectations, see [contributing](contributing.md).
