import { readFileSync } from "node:fs";
import type { Page } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { dockerExec, serviceContainer } from "../docker/compose.mjs";

// Prerequisites use the runtime's own storage APIs and service UID. They never
// replace Hermes handlers or dispatch the action a workflow intends to verify.
export function runtime(script: string, ...args: string[]) {
  const fixture = readFileSync(new URL("../fixtures/runtime_store.py", import.meta.url), "utf8");
  const container = serviceContainer("hermes");
  const owner = dockerExec(
    container,
    "/opt/hermes/.venv/bin/python",
    "-c",
    "import os; s=os.stat('/opt/data'); print(f'{s.st_uid}:{s.st_gid}')",
  );
  return JSON.parse(
    execFileSync(
      "docker",
      [
        "exec",
        "--user",
        owner,
        container,
        "/opt/hermes/.venv/bin/python",
        "-c",
        `${fixture}\n${script}`,
        ...args,
      ],
      { encoding: "utf8", timeout: 20000, stdio: ["ignore", "pipe", "pipe"] },
    ),
  );
}

export async function api(page: Page, path: string, body?: object) {
  return page.evaluate(
    async ({ path, body }) => {
      const response = await fetch(
        path,
        body
          ? {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            }
          : {},
      );
      return { status: response.status, body: await response.json() };
    },
    { path, body },
  );
}
