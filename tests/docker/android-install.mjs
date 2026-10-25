import { tapAndroid } from "./android-controls.mjs";
import { prepareAndroid } from "./prepare-browser.mjs";
import { openInstalledApp } from "./android-pwa.mjs";
import { setTimeout as delay } from "node:timers/promises";
import { pathToFileURL } from "node:url";

export async function installAndroid(device) {
  const prepared = device || (await prepareAndroid());
  const { adb, connectChrome, context, page } = prepared;
  let browser = prepared.browser;
  // Use accessibility labels for Chrome/Android UI, never device-specific coordinates.
  const tap = (pattern, timeout, packageName) => tapAndroid(adb, pattern, timeout, packageName);

  try {
    console.log("Chrome ready; dismissing optional first-run notification prompt...");
    try {
      await tap(/^No thanks$/i, 5000);
    } catch {
      /* Not all Chrome versions show the Android notification introduction. */
    }
    const installed = adb("shell", "dumpsys", "shortcut").includes("shortLabel=ChatHermes,");
    if (!installed) {
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
    }
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
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  await installAndroid();
