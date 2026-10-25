import { spawnSync } from "node:child_process";
import {
  compose,
  dashboardURL,
  mockserverURL,
  androidEndpoint,
  serviceContainer,
  dockerExec,
  endpoint,
} from "./compose.mjs";
import { loadFixtures } from "./load-fixtures.mjs";

const args = process.argv.slice(2).filter((arg) => arg !== "--android");
const android =
  process.argv.includes("--android") ||
  args.some(
    (arg, index) =>
      arg === "--project=android" || (arg === "--project" && args[index + 1] === "android"),
  );
// No build/pull/recreate/reset here: explicit rebuilds are a separate operation.
console.log(
  compose(
    ...(android ? ["--profile", "android"] : []),
    "up",
    "-d",
    "--wait",
    "--no-build",
    "--no-recreate",
  ),
);
const hermes = serviceContainer("hermes");
const deterministic = dockerExec(
  hermes,
  "/opt/hermes/.venv/bin/python",
  "-c",
  "import os; print(os.environ.get('TEST_LLM_API_BASE_URL') == 'http://mockserver:1080/v1' and os.environ.get('TEST_LLM_API_KEY') == 'synthetic-test-only')",
);
if (deterministic !== "True")
  throw new Error(
    "Refusing workflow tests against a real-provider container. Use a separate COMPOSE_PROJECT_NAME for deterministic tests.",
  );
await loadFixtures();
console.log(
  `Dashboard: ${dashboardURL()}/chathermes\nMockServer: ${mockserverURL()}\n${android ? `CDP: ${androidEndpoint()}\nnoVNC: ${endpoint(process.env.CHATHERMES_ANDROID_VNC_PORT || 6080)}/?autoconnect=true&resize=scale\n` : ""}Containers remain running; use Compose down -v when finished.`,
);
console.log(compose("images"));
const result = spawnSync(
  process.execPath,
  [
    "node_modules/@playwright/test/cli.js",
    "test",
    ...args,
    ...(args.some((arg) => arg.startsWith("--project"))
      ? []
      : android
        ? ["--project=android"]
        : ["--project=desktop", "--project=mobile"]),
  ],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      CHATHERMES_TEST_SUITE: "workflow",
      CHATHERMES_TEST_URL: dashboardURL(),
      CHATHERMES_TEST_CONTAINER: hermes,
      CHATHERMES_LIVE_CONTAINER: hermes,
    },
  },
);
process.exitCode = result.status ?? 1;
