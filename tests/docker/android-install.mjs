import { chromium } from "@playwright/test";
import { startChrome, waitForChrome, openDashboard } from "./android-browser.mjs";
import { openInstalledApp } from "./android-pwa.mjs";
import { execFileSync } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const [container, port] = process.argv.slice(2);
const adb = (...args) =>
  execFileSync("docker", ["exec", container, "adb", ...args], {
    encoding: "utf8",
    timeout: 15000,
    stdio: ["ignore", "pipe", "pipe"],
  });

// Android boot completion does not guarantee HOME or Chrome is ready.
const endpoint = `http://127.0.0.1:${port}`;
const connectChrome = () =>
  waitForChrome(endpoint, (url, options) => chromium.connectOverCDP(url, options));
// Open Chrome before probing CDP: on a fresh AVD, adb boot completion leaves
// Chrome's debugging socket absent until its first activity is launched.
let browser = await startChrome(adb, connectChrome);

// Use accessibility labels for Chrome/Android UI, never device-specific coordinates.
async function tap(pattern, timeout = 15000, packageName) {
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
  throw new Error(`Required Android install control unavailable: ${pattern}`);
}

try {
  console.log("Chrome ready; dismissing optional first-run notification prompt...");
  try {
    await tap(/^No thanks$/i, 5000);
  } catch {
    /* Not all Chrome versions show the Android notification introduction. */
  }
  console.log("Signing in to the disposable Hermes dashboard...");
  const dashboard = await openDashboard(browser, connectChrome);
  browser = dashboard.browser;
  const { context, page } = dashboard;
  await page.locator('link[rel="manifest"]').waitFor({ state: "attached" });
  // Inspect Chrome's own fetch, which can differ from an authenticated page fetch.
  const session = await context.newCDPSession(page);
  const manifest = await session.send("Page.getAppManifest");
  const metadata = JSON.parse(manifest.data || "{}");
  await session.detach();
  if (metadata.name !== "ChatHermes" || metadata.display !== "standalone") {
    throw new Error("Chrome could not load the authenticated ChatHermes manifest");
  }
  console.log("Installing ChatHermes from Chrome's native menu...");
  // Chrome snapshots menu entries when opened. Installation eligibility is
  // checked asynchronously after a dynamically injected manifest is fetched.
  let installMenu = false;
  for (let attempt = 0; attempt < 6 && !installMenu; attempt++) {
    await tap(/^More options$/i);
    try {
      await tap(/^(Install app|Add to [Hh]ome screen)$/i, 4000);
      installMenu = true;
    } catch {
      adb("shell", "input", "keyevent", "KEYCODE_BACK");
      await delay(1000);
    }
  }
  if (!installMenu) throw new Error("Chrome did not offer PWA installation");
  await tap(/^(Install|Add)$/i);
  // Newer Chrome first offers a choice, then asks for installation confirmation.
  try {
    await tap(/^Install$/i, 3000);
  } catch {
    /* Earlier Chrome versions need only one confirmation. */
  }
  // Some Chrome builds ask Android's launcher to confirm a home-screen addition.
  try {
    await tap(/^Add to [Hh]ome screen$/i, 15000);
  } catch {
    /* Optional OS dialog. */
  }
  // Wait for Android to persist the pinned app before terminating its installer.
  const pinDeadline = Date.now() + 30000;
  let pinned = false;
  while (Date.now() < pinDeadline && !pinned) {
    pinned = adb("shell", "dumpsys", "shortcut").includes("shortLabel=ChatHermes,");
    if (!pinned) await delay(500);
  }
  if (!pinned) throw new Error("Android did not persist the installed ChatHermes icon");
  const controls = { adb, tap, connectChrome };
  // Android persisting a shortcut does not establish that Chrome has finished
  // initializing its installed app. Verify first launch before killing Chrome.
  console.log("Verifying the installed app's first launch...");
  browser = await openInstalledApp(browser, controls);
  console.log("Cold-starting the installed home-screen app...");
  browser = await openInstalledApp(browser, controls, { coldStart: true });
} finally {
  // Disconnect without terminating Chrome or the installed application.
  await browser?.close();
}
