import { setTimeout as delay } from "node:timers/promises";

const origin = "http://localhost:9119";

export async function installedPage(browser, { timeout = 30000, interval = 500 } = {}) {
  const deadline = Date.now() + timeout;
  let targets = [];
  do {
    targets = [];
    for (const page of browser.contexts().flatMap((context) => context.pages())) {
      const url = new URL(page.url());
      if (url.origin !== origin) continue;
      const standalone = await page
        .evaluate(() => matchMedia("(display-mode: standalone)").matches)
        .catch(() => false);
      targets.push(`${url.pathname} (standalone=${standalone})`);
      // A cold start may initially land on the dashboard's login route. Scope
      // changes must not make a real installed window invisible to this check.
      if (standalone) return page;
    }
    if (Date.now() >= deadline) break;
    await delay(interval);
  } while (Date.now() < deadline);
  throw new Error(
    `Chrome did not launch an installed standalone PWA. Local windows: ${targets.join(", ") || "none"}`,
  );
}

export async function openInstalledApp(
  browser,
  { adb, tap, connectChrome },
  { coldStart = false } = {},
) {
  await browser?.close();
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
  // Let Android deliver the activity's background lifecycle before killing it.
  if (coldStart) adb("shell", "am", "force-stop", "com.android.chrome");
  const dimensions = adb("shell", "wm", "size").match(/(\d+)x(\d+)/);
  if (!dimensions) throw new Error("Android screen dimensions unavailable");
  const [, width, height] = dimensions.map(Number);
  let opened = false;
  let screen = 0;
  for (let attempt = 0; attempt < 8 && !opened; attempt++) {
    try {
      await tap(/^ChatHermes$/i, 5000, "com.google.android.apps.nexuslauncher");
      opened = true;
    } catch {
      const resumed = adb("shell", "dumpsys", "activity", "activities")
        .split("\n")
        .filter((line) => /(?:topResumedActivity|mResumedActivity)=/.test(line))
        .join("\n");
      // Completing the pin dialog can foreground Chrome after HOME returned.
      // Swiping there does not search launcher pages; bring HOME back first.
      if (!resumed.includes("com.google.android.apps.nexuslauncher")) {
        console.log("Installation left the launcher; returning to Android HOME...");
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
        continue;
      }
      if (++screen >= 4) break;
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
  // Always discover targets on a fresh connection after the native launch.
  browser = await connectChrome();
  try {
    const page = await installedPage(browser);
    if (new URL(page.url()).pathname === "/login") {
      await page.getByLabel("Username").fill("tester");
      await page.getByLabel("Password", { exact: true }).fill("chathermes-local-test");
      await page.getByRole("button", { name: "Sign in", exact: true }).click();
    }
    await page.getByRole("textbox", { name: "Message Hermes" }).waitFor({ timeout: 30000 });
    return browser;
  } catch (error) {
    await browser.close();
    throw error;
  }
}
