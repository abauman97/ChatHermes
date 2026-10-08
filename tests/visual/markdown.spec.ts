import { signIn } from "./login";
import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

for (const theme of ["dark", "light"] as const) {
  test(`markdown contrast and independent code scrolling with ${theme} host palette`, async ({
    page,
  }, testInfo) => {
    // Use the actual authenticated dashboard and SDK mount, with this checkout's
    // built assets and synthetic history. No saved chats or host settings change.
    await page.route("**/dashboard-plugins/chathermes/dist/**", async (route) => {
      const asset = new URL(route.request().url()).pathname.split("/dist/")[1]!;
      await route.fulfill({
        body: await readFile(resolve("plugin/chathermes/dashboard/dist", asset)),
        contentType: asset.endsWith(".css") ? "text/css" : "text/javascript",
      });
    });
    const line = `const example = "${"long_code_without_breaks_".repeat(80)}";`;
    const fenced = `\n\n\`\`\`js\n${line}\n\`\`\``;
    await page.route("**/api/plugins/chathermes/**", async (route) => {
      const path = new URL(route.request().url()).pathname.split("/api/plugins/chathermes")[1];
      let body: unknown = {};
      if (path === "/profiles") body = { profiles: [{ name: "test-profile" }] };
      else if (path === "/projects") body = { projects: [], scoped_session_ids: [] };
      else if (path === "/api/sessions")
        body = { sessions: [{ id: "markdown-test", title: "Markdown test" }] };
      else if (path?.endsWith("/messages"))
        body = {
          messages: [
            { role: "user", content: "Check `inline code` and ``double backticks``." + fenced },
            {
              role: "assistant",
              content:
                "Readable `inline code` and ``double backticks``." +
                fenced +
                "\n\n> A quoted explanation with `code`.\n>\n> ```\n> " +
                line +
                "\n> ```",
            },
          ],
        };
      else if (path === "/v1/models")
        body = { data: [{ id: "Instant" }], default_model: "Instant" };
      else if (path === "/api/model/options")
        body = { providers: [], model: "Instant", provider: "" };
      return route.fulfill({ json: body });
    });
    await page.emulateMedia({ colorScheme: theme });
    await signIn(page, "/chathermes");
    await expect(page.locator(".chathermes-embedded")).toBeVisible();
    // The host code rule uses --background for its text color. Exercise both
    // palettes without persisting a dashboard theme or adding a plugin theme.
    await page.evaluate((theme) => {
      document.documentElement.style.setProperty(
        "--background",
        theme === "dark" ? "#171717" : "#ffffff",
      );
      document.documentElement.style.setProperty(
        "--foreground",
        theme === "dark" ? "#ffffff" : "#171717",
      );
    }, theme);
    if (testInfo.project.name === "mobile")
      await page
        .locator(".chathermes-embedded")
        .getByRole("button", { name: "Open navigation" })
        .click();
    await page.locator(".session-select").filter({ hasText: "Markdown test" }).click();
    await expect(page.locator(".markdown-content pre")).toHaveCount(3);
    const transcript = page.getByRole("log", { name: "Conversation" });
    for (const container of [page.locator("body"), page.locator(".main-panel"), transcript]) {
      expect(
        await container.evaluate((element) => element.scrollWidth <= element.clientWidth),
      ).toBe(true);
    }
    for (const code of await page.locator(".markdown-content code").all()) {
      await expect(code).toHaveCSS("color", "rgb(255, 255, 255)");
    }
    for (const pre of await page.locator(".markdown-content pre").all()) {
      await expect(pre).toHaveCSS("background-color", "rgb(23, 23, 23)");
      expect(await pre.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
      await pre.evaluate((element) => {
        element.scrollLeft = 200;
      });
      expect(await pre.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
      expect(await transcript.evaluate((element) => element.scrollLeft)).toBe(0);
    }
    // Horizontal touch gestures must be allowed through every ancestor; pinch
    // zoom remains disabled while mounted.
    expect(
      await page
        .locator(".markdown-content pre")
        .first()
        .evaluate((element) => {
          for (
            let ancestor: Element | null = element;
            ancestor;
            ancestor = ancestor.parentElement
          ) {
            const action = getComputedStyle(ancestor).touchAction;
            if (action !== "auto" && action !== "manipulation" && !action.includes("pan-x"))
              return false;
          }
          return true;
        }),
    ).toBe(true);
    await transcript.evaluate((element) => {
      element.scrollTop = 0;
    });
    await page.getByRole("textbox", { name: "Message Hermes" }).click();
    await expect(page.getByRole("textbox", { name: "Message Hermes" })).toBeFocused();
    await page.screenshot({ path: testInfo.outputPath(`markdown-${theme}.png`) });
  });
}
