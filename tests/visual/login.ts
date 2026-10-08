import { expect, type BrowserContext, type Page } from "@playwright/test";
// One real UI sign-in per worker. Keep host cookies only in worker memory;
// each test still has an isolated browser context and authenticates real routes.
// Reusing the session avoids hitting the pinned host's 10/minute password limit.
let cookies: Awaited<ReturnType<BrowserContext["cookies"]>> | undefined;
export async function signIn(page: Page, next = "/chathermes") {
  // Wait for the plugin's runtime mode before tests create a session. The host
  // mount can be visible while its capability/model requests are still loading.
  const ready = next.startsWith("/chathermes")
    ? page
        .waitForResponse(
          (response) =>
            new URL(response.url()).pathname === "/api/plugins/chathermes/v1/capabilities",
        )
        .then((response) => response.finished())
    : Promise.resolve();
  if (cookies) {
    await page.context().addCookies(cookies);
    await page.goto(next);
  } else {
    await page.goto("/login?next=" + encodeURIComponent(next));
    await page.getByLabel("Username").fill("tester");
    await page.getByLabel("Password", { exact: true }).fill("chathermes-local-test");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await page.waitForURL((url) => url.pathname !== "/login");
    cookies = await page.context().cookies();
  }
  await ready;
  if (next.startsWith("/chathermes"))
    await expect(
      page
        .locator(".chathermes-embedded")
        .getByRole("button", { name: "Choose model", exact: true }),
    ).toBeEnabled();
}
