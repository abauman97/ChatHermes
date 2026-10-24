import { chromium } from "@playwright/test";
import { waitForChrome } from "./android-browser.mjs";
import { installedPage } from "./android-pwa.mjs";

const endpoint = process.argv[2] || "http://127.0.0.1:9223";
const browser = await waitForChrome(endpoint, (url, options) =>
  chromium.connectOverCDP(url, options),
);
try {
  const page = await installedPage(browser);
  await page.getByRole("textbox", { name: "Message Hermes" }).waitFor({ timeout: 30000 });
  const ready = await page.evaluate(() => ({
    secure: isSecureContext,
    standalone: matchMedia("(display-mode: standalone)").matches,
    controlled: !!navigator.serviceWorker.controller,
  }));
  if (!ready.secure || !ready.standalone || !ready.controlled) {
    throw new Error("Installed Android app is not ready");
  }
  console.log("Existing installed Android app verified; device retained.");
} finally {
  await browser.close();
}
