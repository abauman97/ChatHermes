import { test as base, expect } from "@playwright/test";
import { authenticate, prepareAndroid, prepareDesktop } from "../docker/prepare-browser.mjs";

export const test = base.extend({
  page: async ({ viewport, isMobile, hasTouch, userAgent, baseURL }, use, info) => {
    // Do not request Playwright's built-in page/browser here: Android attaches
    // directly to CDP and must not require a desktop Chromium installation.
    const android = info.project.name === "android";
    const prepared = android
      ? await prepareAndroid()
      : await prepareDesktop({
          headless: true,
          contextOptions: { viewport, isMobile, hasTouch, userAgent, baseURL },
        });
    try {
      if (android) await authenticate(prepared.page, "http://localhost:9119/chathermes");
      await use(prepared.page);
    } finally {
      if (!prepared.page.isClosed())
        await prepared.page
          .screenshot({ path: info.outputPath(`${info.project.name}.png`) })
          .catch(() => {});
      await prepared.browser.close();
    }
  },
});
export { expect };
