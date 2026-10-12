import { expect, test } from "@playwright/test";
import { signIn, sessionFromUrl } from "./login";

test("canonical routing preserves drafts, attachments, and host traversal", async ({
  page,
}, info) => {
  await signIn(page, "/sessions");
  const viewport = await page.locator('meta[name="viewport"]').getAttribute("content");
  await page.evaluate(() => {
    document.documentElement.dataset.routingProbe = "same-document";
  });
  await page
    .locator('a[href="/chathermes"]')
    .first()
    .evaluate((el: HTMLAnchorElement) => el.click());
  const plugin = page.locator(".chathermes-embedded"),
    area = plugin.getByRole("textbox", { name: "Message Hermes" });
  await expect(plugin).toBeVisible();
  await expect(plugin.getByRole("button", { name: "Choose model", exact: true })).toBeEnabled();
  await area.fill("Keep this route draft");
  await area.evaluate((el) => {
    el.setAttribute("data-routing-instance", "original");
  });
  await plugin.getByRole("button", { name: "Attachment options" }).click();
  await plugin.locator('input[aria-label="Upload files"]').setInputFiles({
    name: "routing.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("Synthetic routing attachment"),
  });
  await expect(plugin.locator(".composer")).toContainText("routing.txt");
  const host = await page.evaluate(() => ({ usr: history.state.usr, idx: history.state.idx }));
  const open = async (name: string) => {
    if (info.project.name === "mobile")
      await plugin.getByRole("button", { name: "Open navigation", exact: true }).click();
    await plugin.getByRole("link", { name, exact: true }).click();
  };
  await open("Projects");
  await expect(page).toHaveURL(/#\/projects/);
  await expect(plugin.locator(".projects-page")).toBeVisible();
  await expect(area).toHaveValue("Keep this route draft");
  await expect(area).toHaveAttribute("data-routing-instance", "original");
  expect(await page.evaluate(() => history.state.usr)).toEqual(host.usr);
  expect(await page.evaluate(() => history.state.idx)).toBe(host.idx + 1);
  await page.screenshot({ path: info.outputPath("routing-projects.png") });
  await open("Scheduled");
  await expect(plugin.locator(".scheduled-page")).toBeVisible();
  await expect(plugin.getByRole("button", { name: "Send message", exact: true })).toBeDisabled();
  await expect(area).toHaveValue("Keep this route draft");
  await area.click();
  await expect(area).toBeFocused();
  await page.screenshot({ path: info.outputPath("routing-scheduled.png") });
  await page.goBack();
  await expect(plugin.locator(".projects-page")).toBeVisible();
  await page.goForward();
  await expect(plugin.locator(".scheduled-page")).toBeVisible();
  if (info.project.name === "mobile")
    await plugin.getByRole("button", { name: "Open navigation", exact: true }).click();
  await plugin.getByRole("button", { name: "Settings", exact: true }).click();
  await expect(plugin.locator(".settings-page")).toBeVisible();
  await expect(page).toHaveURL(/#\/settings/);
  await page.screenshot({ path: info.outputPath("routing-settings.png") });
  await plugin.getByRole("button", { name: "Close settings" }).click();
  await expect(plugin.locator(".scheduled-page")).toBeVisible();
  await expect(area).toHaveValue("Keep this route draft");
  await expect(area).toHaveAttribute("data-routing-instance", "original");
  await expect(plugin.locator(".composer")).toContainText("routing.txt");
  await open("Artifacts");
  await expect(plugin.locator('section[aria-label="Artifacts"]')).toBeVisible();
  await page.goBack();
  await expect(plugin.locator(".scheduled-page")).toBeVisible();
  await expect(area).toHaveValue("Keep this route draft");
  await page.reload();
  await expect(plugin.locator(".scheduled-page")).toBeVisible();
  await page
    .locator('a[href="/sessions"]')
    .first()
    .evaluate((el: HTMLAnchorElement) => el.click());
  await expect(plugin).toHaveCount(0);
  expect(await page.locator('meta[name="viewport"]').getAttribute("content")).toBe(viewport);
  expect(await page.evaluate(() => document.documentElement.dataset.routingProbe)).toBeUndefined(); // reload created a fresh document
  await page
    .locator('a[href="/chathermes"]')
    .first()
    .evaluate((el: HTMLAnchorElement) => el.click());
  await expect(plugin).toBeVisible();
  await expect(area).toHaveValue("");
  await expect(area).toHaveCSS("font-size", "16px");
  await page.screenshot({ path: info.outputPath("routing-reentry.png") });
});

test("canonical Settings deep links survive host hydration and refresh", async ({ page }, info) => {
  await signIn(page, "/chathermes#/settings?return_to=%2Fprojects%3Farchived%3D1");
  const plugin = page.locator(".chathermes-embedded");
  await expect(plugin.locator(".settings-page")).toBeVisible();
  expect(new URL(page.url()).searchParams.get("view")).toBeNull();
  expect(new URL(page.url()).searchParams.get("profile")).toBe("default");
  await page.reload();
  await expect(plugin.locator(".settings-page")).toBeVisible();
  await plugin.getByRole("button", { name: "Close settings" }).click();
  await expect(page).toHaveURL(/#\/projects\?archived=1/);
  await expect(plugin.locator(".projects-page")).toBeVisible();
  await page.screenshot({ path: info.outputPath("routing-archived.png") });
});

test("removed outer query routes do not select a session or screen", async ({ page }) => {
  await signIn(
    page,
    "/chathermes?profile=default&session=removed_session&view=scheduled&job=removed_job",
  );
  const plugin = page.locator(".chathermes-embedded");
  await expect(plugin.locator(".header-title")).toHaveText("ChatHermes");
  await expect(plugin.locator(".scheduled-page")).toHaveCount(0);
  await expect(plugin.getByRole("textbox", { name: "Message Hermes" })).toBeVisible();
  expect(new URL(page.url()).hash).toBe("#/");
});

test("canonical notification messages switch an open session; removed query links do not", async ({
  page,
}, info) => {
  await signIn(page);
  const plugin = page.locator(".chathermes-embedded"),
    area = plugin.getByRole("textbox", { name: "Message Hermes" });
  const create = async () => {
    if (info.project.name === "mobile")
      await plugin.getByRole("button", { name: "Open navigation", exact: true }).click();
    await plugin.locator(".drawer-chat").click();
    await expect.poll(() => sessionFromUrl(page.url())).toBeTruthy();
    await expect(plugin.locator(".drawer-chat")).toBeEnabled();
    return page.url();
  };
  const firstUrl = await create(),
    firstId = sessionFromUrl(firstUrl)!;
  await create();
  await expect.poll(() => sessionFromUrl(page.url())).not.toBe(firstId);
  const secondId = sessionFromUrl(page.url());
  await area.fill("Draft in the second session");
  await area.evaluate((el) => el.setAttribute("data-notification-composer", "second"));
  const notify = (url: string) =>
    page.evaluate(
      (target) =>
        navigator.serviceWorker.dispatchEvent(
          new MessageEvent("message", { data: { type: "chathermes.navigate", url: target } }),
        ),
      url,
    );
  await notify(
    new URL("/chathermes?profile=default&session=" + encodeURIComponent(firstId), page.url()).href,
  );
  expect(sessionFromUrl(page.url())).toBe(secondId);
  await expect(area).toHaveValue("Draft in the second session");
  await notify(firstUrl);
  await expect.poll(() => sessionFromUrl(page.url())).toBe(firstId);
  await expect(area).toHaveValue("");
  await expect(area).not.toHaveAttribute("data-notification-composer", "second");
  await expect(
    plugin.locator(".notice").filter({ hasText: /read-only until reconnected|Reconnecting/ }),
  ).toHaveCount(0);
  await area.click();
  await expect(area).toBeFocused();
  await page.screenshot({ path: info.outputPath("canonical-notification-session.png") });
});
