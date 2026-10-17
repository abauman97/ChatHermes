import { setTimeout as delay } from "node:timers/promises";

const dashboardUrl = "http://localhost:9119/chathermes";

export async function openDashboard(browser, connectChrome) {
  for (let attempt = 0; attempt < 3; attempt++) {
    let page;
    try {
      const context = browser.contexts()[0];
      page =
        context.pages().find((candidate) => candidate.url().startsWith("http://localhost:9119/")) ||
        context.pages()[0] ||
        (await context.newPage());
      page.setDefaultTimeout(30000);
      await page.goto(dashboardUrl);
      // A replaced Chrome target can retain the successful sign-in cookie.
      if (new URL(page.url()).pathname === "/login") {
        await page.getByLabel("Username").fill("tester");
        await page.getByLabel("Password", { exact: true }).fill("chathermes-local-test");
        await page.getByRole("button", { name: "Sign in", exact: true }).click();
      }
      await page.getByRole("button", { name: "Choose model", exact: true }).waitFor();
      return { browser, context, page };
    } catch (error) {
      // Fresh Android Chrome can replace its startup tab during sign-in. Only
      // recover a lost target/connection; UI timeouts must remain real failures.
      if (attempt === 2 || (!page?.isClosed() && browser.isConnected())) {
        await browser.close();
        throw error;
      }
      console.log("Chrome closed its startup page; reconnecting to the dashboard...");
      await browser.close();
      await delay(500);
      browser = await connectChrome();
    }
  }
}
