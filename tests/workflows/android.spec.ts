import { test, expect } from "./fixtures";
import { chromium } from "@playwright/test";
import { installAndroid } from "../docker/android-install.mjs";
import { waitForChrome } from "../docker/android-browser.mjs";
import { installedPage } from "../docker/android-pwa.mjs";
import { androidEndpoint } from "../docker/compose.mjs";

test("@installed Android installation survives a cold start", async ({ browserName }, info) => {
  expect(browserName).toBe("chromium");
  test.skip(info.project.name !== "android", "Requires the real Android launcher");
  test.setTimeout(180000);
  await installAndroid();
  const browser = await waitForChrome(
    androidEndpoint(),
    (url: string, options: { timeout: number }) => chromium.connectOverCDP(url, options),
  );
  try {
    const page = await installedPage(browser);
    await expect(page.getByRole("textbox", { name: "Message Hermes" })).toBeVisible();
    expect(
      await page.evaluate(
        () => isSecureContext && matchMedia("(display-mode: standalone)").matches,
      ),
    ).toBe(true);
    await page.screenshot({ path: info.outputPath("installed-cold-start.png") });
  } finally {
    await browser.close();
  }
});

test("@native Android keyboard preserves composer geometry in both orientations", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "android", "Requires Android's actual software keyboard");
  await expect(page.getByRole("textbox", { name: "Message Hermes" })).toBeVisible();
  test.setTimeout(120000);
  const { serviceContainer } = await import("../docker/compose.mjs");
  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  await promisify(execFile)(
    process.execPath,
    [
      "tests/docker/android-keyboard.mjs",
      serviceContainer("android"),
      androidEndpoint(),
      info.outputPath("keyboard"),
    ],
    { timeout: 110000 },
  );
});
