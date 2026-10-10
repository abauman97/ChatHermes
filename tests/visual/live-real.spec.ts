import { expect, test } from "@playwright/test";
import { signIn } from "./login";

test("disposable dashboard composer, attachments and real native response", async ({
  page,
}, info) => {
  test.setTimeout(180_000);
  await signIn(page);
  const plugin = page.locator(".chathermes-embedded");
  const composer = plugin.locator(".composer");
  const area = composer.getByRole("textbox", { name: "Message Hermes" });
  const send = composer.getByRole("button", { name: "Send message", exact: true });
  const picker = composer.getByRole("button", { name: "Choose model", exact: true });
  await expect(plugin).toBeVisible();
  if (info.project.name === "mobile")
    await plugin.getByRole("button", { name: "Open navigation", exact: true }).click();
  const profile = plugin.getByRole("combobox", { name: "Profile", exact: true });
  await profile.selectOption("default");
  await expect(profile).toHaveValue("default");
  await area.click();
  await expect(area).toBeFocused();
  await expect(area).toHaveCSS("font-size", "16px");
  await expect(send).toBeDisabled();
  await area.fill(Array.from({ length: 12 }, (_, index) => `row ${index}`).join("\n"));
  const metrics = await area.evaluate((element) => ({
    height: element.clientHeight,
    scroll: element.scrollHeight,
  }));
  expect(metrics.scroll).toBeGreaterThan(metrics.height);
  await area.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  expect(await area.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await page.screenshot({ path: info.outputPath("composer-focused.png") });
  if (info.project.name === "mobile") {
    const viewport = page.viewportSize()!;
    await page.setViewportSize({ width: viewport.width, height: 420 });
    await expect(area).toBeFocused();
    const box = (await composer.boundingBox())!;
    expect(box.y + box.height).toBeLessThanOrEqual(420);
    await page.screenshot({ path: info.outputPath("composer-short-viewport.png") });
    await page.setViewportSize(viewport);
  }
  await area.fill("");
  await area.evaluate((element) => element.blur());
  await picker.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.screenshot({ path: info.outputPath("model-picker.png") });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await composer.getByRole("button", { name: "Attachment options" }).click();
  await expect(page.getByRole("button", { name: "Take a photo", exact: true })).toBeVisible();
  await composer.locator('input[aria-label="Upload files"]').setInputFiles({
    name: "smoke.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("Synthetic dashboard attachment"),
  });
  await expect(composer).toContainText("smoke.txt");
  await composer.getByRole("button", { name: "Remove smoke.txt" }).click();
  const camera = await page.screenshot();
  await composer.locator("input[capture]").setInputFiles({
    name: "camera.png",
    mimeType: "image/png",
    buffer: camera,
  });
  await expect(composer.locator("img")).toBeVisible();
  await page.screenshot({ path: info.outputPath("camera-attachment.png") });
  await composer.getByRole("button", { name: "Remove camera.png" }).click();

  await composer.locator('input[aria-label="Upload files"]').setInputFiles({
    name: "smoke.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("Synthetic dashboard attachment"),
  });
  const prompt =
    "Use the terminal tool to run printf chathermes-smoke-ok, then reply briefly with its output.";
  await area.fill(prompt);
  const uploaded = page.waitForResponse(
    (response) => response.url().includes("/uploads") && response.request().method() === "POST",
  );
  await send.click();
  expect((await uploaded).status()).toBe(201);
  await expect(plugin.locator(".message.user").last()).toContainText(prompt);
  await area.fill("draft while responding");
  await expect(area).toBeFocused();
  await expect(plugin.locator(".work-summary").last()).toBeVisible({ timeout: 60_000 });
  await page.screenshot({ path: info.outputPath("streaming.png") });
  await expect(plugin.locator(".message.assistant").last()).toContainText("chathermes-smoke-ok", {
    timeout: 120_000,
  });
  await expect(send).toBeEnabled({ timeout: 120_000 });
  await expect(area).toHaveValue("draft while responding");
  await expect(plugin.locator(".activity[open]")).toHaveCount(0);
  await plugin.locator(".work-summary").last().click();
  const tool = plugin
    .locator(".activity")
    .filter({ has: page.locator("pre", { hasText: "terminal" }) })
    .last();
  await tool.locator("summary").click();
  await expect(tool.locator("pre")).toBeVisible();
  await expect(tool.locator("pre")).toContainText("chathermes-smoke-ok");
  await page.screenshot({ path: info.outputPath("completed.png") });
});
