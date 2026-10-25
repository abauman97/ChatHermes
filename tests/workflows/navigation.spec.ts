import { randomUUID } from "node:crypto";
import { test, expect } from "./fixtures";
import { authenticate } from "../docker/prepare-browser.mjs";

for (const profile of ["default", "alpha", "beta"]) {
  test(`session navigation and restoration stay isolated in ${profile}`, async ({ page }, info) => {
    const origin = new URL(page.url()).origin;
    await authenticate(page, `${origin}/chathermes?profile=${profile}#/?profile=${profile}`);
    const composer = page.getByRole("textbox", { name: "Message Hermes" });
    const prompt = `[workflow-stream] ${profile} ${randomUUID()}`;
    await composer.fill(prompt);
    await page.getByRole("button", { name: "Send message", exact: true }).click();
    await expect(page.locator(".message.assistant")).toContainText("Stream complete.");
    const conversation = page.url();
    const open = page
      .locator(".chathermes-embedded")
      .getByRole("button", { name: "Open navigation", exact: true });
    if (await open.isVisible()) await open.click();
    await page
      .locator(".chathermes-embedded")
      .getByRole("button", { name: "New chat", exact: true })
      .click();
    await expect(page.locator(".message.user")).toHaveCount(0);
    await expect(composer).toBeEnabled();
    await composer.fill(`Draft in ${profile}`);
    await expect(composer).toBeFocused();
    await page.goto(conversation);
    await expect(page.locator(".message.user")).toHaveText(prompt);
    await expect(page.locator(".message.assistant")).toContainText("Stream complete.");
    await page.reload();
    await expect(page.locator(".message.user")).toHaveCount(1);
    await page.screenshot({ path: info.outputPath(`restored-${profile}.png`) });
  });
}

test("browser disconnect recovers without sending the prompt twice", async ({ page }) => {
  const composer = page.getByRole("textbox", { name: "Message Hermes" });
  await composer.fill(`[workflow-stream] ${randomUUID()}`);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".message.assistant")).toContainText("First visible chunk.");
  // A CDP network fault applies to this page on desktop and real Android.
  const cdp = await page.context().newCDPSession(page);
  try {
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", {
      offline: true,
      latency: 0,
      downloadThroughput: -1,
      uploadThroughput: -1,
    });
    await expect(composer).toBeEnabled();
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 0,
      downloadThroughput: -1,
      uploadThroughput: -1,
    });
    await expect(page.locator(".message.assistant")).toContainText("Stream complete.");
    await expect(page.locator(".message.user")).toHaveCount(1);
    await page.reload();
    await expect(page.locator(".message.user")).toHaveCount(1);
    await expect(page.locator(".message.assistant")).toHaveCount(1);
  } finally {
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 0,
      downloadThroughput: -1,
      uploadThroughput: -1,
    });
    await cdp.detach();
  }
});

test("file and camera inputs use authenticated uploads and preserve composer focus", async ({
  page,
}, info) => {
  const composer = page.getByRole("textbox", { name: "Message Hermes" });
  await composer.focus();
  await expect(composer).toBeFocused();
  await expect(composer).toHaveCSS("font-size", "16px");
  const uploaded = page.waitForResponse(
    (response) => response.url().includes("/uploads") && response.request().method() === "POST",
  );
  await page.locator('input[aria-label="Upload files"]').setInputFiles({
    name: "workflow.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("Synthetic workflow upload"),
  });
  expect((await uploaded).status()).toBe(201);
  await expect(page.locator(".composer")).toContainText("workflow.txt");
  await page.getByRole("button", { name: "Remove workflow.txt" }).click();
  await expect(page.getByRole("button", { name: "Remove workflow.txt" })).toHaveCount(0);
  await expect(composer).toBeFocused();
  await page.locator("input[capture]").setInputFiles({
    name: "camera.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=",
      "base64",
    ),
  });
  await expect(page.locator(".composer img")).toBeVisible();
  await page.screenshot({ path: info.outputPath("attachment.png") });
  await page.getByRole("button", { name: "Remove camera.png" }).click();
  await expect(page.getByRole("button", { name: "Remove camera.png" })).toHaveCount(0);
});
