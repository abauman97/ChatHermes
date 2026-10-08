import { expect, test } from "@playwright/test";
import { signIn } from "./login";

test("composer newlines, mobile focus layout, eight-row scrolling and send recovery", async ({
  page,
}, info) => {
  await signIn(page);
  const composer = page.locator(".composer");
  const area = composer.getByRole("textbox", { name: "Message Hermes" });
  const picker = composer.getByRole("button", { name: "Choose model", exact: true });
  const send = composer.getByRole("button", { name: "Send message", exact: true });
  const attach = composer.getByRole("button", { name: "Attachment options" });
  await expect(picker).toBeVisible();
  await expect(send).toBeDisabled();
  await area.fill("first line");
  await area.press("Enter");
  await area.press("Shift+Enter");
  await area.press("x");
  await expect(area).toHaveValue("first line\n\nx");
  await expect(send).toBeEnabled();
  await expect(area).toBeFocused();
  if (info.project.name === "mobile") {
    await expect(picker).toBeHidden();
    const [input, plus, button] = await Promise.all([
      area.boundingBox(),
      attach.boundingBox(),
      send.boundingBox(),
    ]);
    expect(plus!.x + plus!.width).toBeLessThan(input!.x);
    expect(input!.x + input!.width).toBeLessThan(button!.x);
    expect(Math.abs(input!.y + input!.height - button!.y - button!.height)).toBeLessThan(2);
  } else await expect(picker).toBeVisible();
  await page.screenshot({ path: info.outputPath("composer-focused.png") });
  const beforeGrowth = (await composer.boundingBox())!;
  await area.fill(Array.from({ length: 12 }, (_, index) => `row ${index}`).join("\n"));
  const afterGrowth = (await composer.boundingBox())!;
  expect(afterGrowth.y).toBeLessThan(beforeGrowth.y);
  expect(
    Math.abs(afterGrowth.y + afterGrowth.height - beforeGrowth.y - beforeGrowth.height),
  ).toBeLessThan(2);
  const metrics = await area.evaluate((element) => ({
    height: element.clientHeight,
    scroll: element.scrollHeight,
    line: parseFloat(getComputedStyle(element).lineHeight),
    padding:
      parseFloat(getComputedStyle(element).paddingTop) +
      parseFloat(getComputedStyle(element).paddingBottom),
  }));
  const height = 8 * metrics.line + metrics.padding;
  expect(metrics.height).toBeLessThanOrEqual(Math.ceil(height));
  expect(metrics.height).toBeGreaterThanOrEqual(Math.floor(height));
  expect(metrics.scroll).toBeGreaterThan(metrics.height);
  await expect(area).toHaveCSS("overflow-y", "auto");
  await area.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  expect(await area.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await page.screenshot({ path: info.outputPath("composer-eight-rows.png") });
  if (info.project.name === "mobile") {
    const viewport = page.viewportSize()!;
    await page.setViewportSize({ width: viewport.width, height: 420 });
    await expect(area).toBeFocused();
    await expect(picker).toBeHidden();
    const box = (await composer.boundingBox())!;
    expect(Math.abs(420 - box.y - box.height - 12)).toBeLessThan(1);
    await page.screenshot({ path: info.outputPath("composer-short-viewport.png") });
    await page.setViewportSize(viewport);
  }
  await area.fill("Composer regression [tool]\nsecond line");
  await send.click();
  await expect(page.locator(".message.user").last()).toContainText("second line");
  await expect(page.locator(".activity[open]").first()).toBeVisible();
  await area.fill("draft during response");
  await expect(area).toBeFocused();
  await expect(page.locator(".message.assistant").last()).toContainText("Isolated Hermes reply", {
    timeout: 60_000,
  });
  await expect(send).toBeEnabled({ timeout: 60_000 });
  await expect(area).toHaveValue("draft during response");
  await expect(page.locator(".activity[open]")).toHaveCount(0);
  await area.fill("");
  await expect(send).toBeDisabled();
  await area.evaluate((element) => element.blur());
  await expect(picker).toBeVisible();
  await picker.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await area.click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(area).toBeFocused();
  await attach.click();
  await composer.locator('input[aria-label="Upload files"]').setInputFiles({
    name: "composer.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("synthetic composer attachment"),
  });
  await expect(composer).toContainText("composer.txt");
  await expect(send).toBeEnabled();
  await composer.getByRole("button", { name: "Remove composer.txt" }).click();
  await expect(send).toBeDisabled();
  await page.screenshot({ path: info.outputPath("composer-recovered.png") });
});
