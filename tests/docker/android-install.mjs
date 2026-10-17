import { chromium } from "@playwright/test";
import { openDashboard } from "./android-browser.mjs";
import { execFileSync } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const [container, port] = process.argv.slice(2);
const adb = (...args) =>
  execFileSync("docker", ["exec", container, "adb", ...args], {
    encoding: "utf8",
    timeout: 15000,
    stdio: ["ignore", "pipe", "pipe"],
  });

// Initialize the image's launcher before Chrome caches pin-shortcut support.
// sys.boot_completed can arrive before the default HOME activity is ready.
adb(
  "shell",
  "cmd",
  "package",
  "set-home-activity",
  "com.google.android.apps.nexuslauncher/.NexusLauncherActivity",
);
adb(
  "shell",
  "am",
  "start",
  "-W",
  "-a",
  "android.intent.action.MAIN",
  "-c",
  "android.intent.category.HOME",
);

// This test-only flag skips Chrome onboarding on the image's fresh, rooted AVD.
adb("shell", "am", "force-stop", "com.android.chrome");
adb("shell", "am", "set-debug-app", "--persistent", "com.android.chrome");
adb(
  "shell",
  "echo 'chrome --no-first-run --disable-fre --no-default-browser-check' > /data/local/tmp/chrome-command-line",
);
adb(
  "shell",
  "am",
  "start",
  "-a",
  "android.intent.action.VIEW",
  "-d",
  "http://localhost:9119/chathermes",
  "com.android.chrome",
);
async function connectChrome() {
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      return await chromium.connectOverCDP(`http://127.0.0.1:${port}`, { timeout: 2000 });
    } catch {
      await delay(1000);
    }
  }
  throw new Error("Chrome debugging unavailable");
}
let browser = await connectChrome();

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
  console.log("Cold-starting the installed home-screen app...");
  await browser.close();
  browser = undefined;
  // Pinning can return Chrome to the foreground after HOME was requested.
  // A cold start also verifies the app survives beyond its installation tab.
  adb("shell", "am", "force-stop", "com.android.chrome");
  adb(
    "shell",
    "am",
    "start",
    "-W",
    "-a",
    "android.intent.action.MAIN",
    "-c",
    "android.intent.category.HOME",
  );
  // Launcher may put new icons on a second page instead of the default home.
  const dimensions = adb("shell", "wm", "size").match(/(\d+)x(\d+)/);
  if (!dimensions) throw new Error("Android screen dimensions unavailable");
  const [, width, height] = dimensions.map(Number);
  let opened = false;
  for (let screen = 0; screen < 4 && !opened; screen++) {
    try {
      await tap(/^ChatHermes$/i, 15000, "com.google.android.apps.nexuslauncher");
      opened = true;
    } catch {
      adb(
        "shell",
        "input",
        "swipe",
        String(Math.round(width * 0.8)),
        String(Math.round(height * 0.5)),
        String(Math.round(width * 0.2)),
        String(Math.round(height * 0.5)),
        "300",
      );
    }
  }
  if (!opened) throw new Error("Installed ChatHermes launcher icon unavailable");
  browser = await connectChrome();
  // A regular browser shortcut is insufficient: verify the installed standalone window.
  const deadline = Date.now() + 30000;
  let installed = false;
  while (Date.now() < deadline && !installed) {
    for (const candidate of browser.contexts().flatMap((item) => item.pages())) {
      if (!candidate.url().startsWith("http://localhost:9119/chathermes")) continue;
      installed = await candidate
        .evaluate(() => matchMedia("(display-mode: standalone)").matches)
        .catch(() => false);
      if (installed) break;
    }
    if (!installed) await delay(500);
  }
  if (!installed) throw new Error("Chrome did not launch an installed standalone PWA");
} finally {
  // Disconnect without terminating Chrome or the installed application.
  await browser?.close();
}
