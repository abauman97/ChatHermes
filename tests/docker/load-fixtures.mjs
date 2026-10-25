import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import { mockserverURL } from "./compose.mjs";

export async function loadFixtures(url = mockserverURL()) {
  const deadline = Date.now() + 60000;
  while (true) {
    try {
      const response = await fetch(`${url}/mockserver/status`, {
        method: "PUT",
        signal: AbortSignal.timeout(3000),
      });
      if (!response.ok) throw new Error("MockServer not ready");
      break;
    } catch {
      if (Date.now() >= deadline)
        throw new Error("Fixture loading: MockServer did not become ready");
      await delay(500);
    }
  }
  const fixtures = JSON.parse(
    await readFile(new URL("./fixtures/inference.json", import.meta.url), "utf8"),
  );
  const response = await fetch(`${url}/mockserver/expectation`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fixtures),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok)
    throw new Error(
      `Fixture loading failed (HTTP ${response.status}); inspect MockServer expectations`,
    );
  console.log(`Loaded ${fixtures.length} inference expectations; containers retained.`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await loadFixtures();
}
