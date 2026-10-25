import { setTimeout as delay } from "node:timers/promises";

export async function tapAndroid(adb, pattern, timeout = 15000, packageName) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    try {
      // A failed dump can leave the previous activity's XML behind.
      adb("shell", "rm", "-f", "/data/local/tmp/chathermes-ui.xml");
      adb("shell", "uiautomator", "dump", "/data/local/tmp/chathermes-ui.xml");
      const xml = adb("shell", "cat", "/data/local/tmp/chathermes-ui.xml");
      for (const node of xml.matchAll(/<node\b[^>]*>/g)) {
        if (packageName && !node[0].includes(`package="${packageName}"`)) continue;
        const label = [...node[0].matchAll(/(?:text|content-desc)="([^"]*)"/g)].map((m) => m[1]);
        const bounds = node[0].match(/bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/);
        if (bounds && label.some((text) => pattern.test(text))) {
          const [, x1, y1, x2, y2] = bounds.map(Number);
          if (x2 <= x1 || y2 <= y1 || node[0].includes('enabled="false"')) continue;
          adb(
            "shell",
            "input",
            "tap",
            String(Math.round((x1 + x2) / 2)),
            String(Math.round((y1 + y2) / 2)),
          );
          return;
        }
      }
    } catch {
      /* Android can briefly be busy during activity transitions. */
    }
    await delay(500);
  }
  throw new Error(`Required Android accessibility control unavailable: ${pattern}`);
}
