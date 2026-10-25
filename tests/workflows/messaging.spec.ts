import { test, expect } from "./fixtures";
import { mockserverURL } from "../docker/compose.mjs";
import { randomUUID } from "node:crypto";
import { sessionFromUrl } from "../visual/login";

const complete = "First visible chunk. Second visible chunk. Stream complete.";

test("streaming renders progressively and persists once after reload", async ({ page }, info) => {
  const composer = page.getByRole("textbox", { name: "Message Hermes" });
  const send = page.getByRole("button", { name: "Send message", exact: true });
  const prompt = `[workflow-stream] ${randomUUID()}`;
  await composer.fill(prompt);
  await send.click();
  await expect(page.locator(".message.user")).toHaveText(prompt);
  const assistant = page.locator(".message.assistant");
  await expect(assistant).toContainText("First visible chunk.");
  await expect(assistant).not.toContainText("Stream complete.");
  await expect(composer).toBeEnabled();
  await composer.fill("Draft while the response arrives");
  await expect(composer).toBeFocused();
  await expect(assistant).toHaveText(complete);
  await expect(page.getByRole("button", { name: "Stop response", exact: true })).toHaveCount(0);
  await expect(assistant).toHaveCount(1);
  await expect.poll(() => sessionFromUrl(page.url())).toBeTruthy();
  await page.screenshot({ path: info.outputPath("stream-completed.png") });
  await page.reload();
  await expect(page.locator(".message.user")).toHaveText(prompt);
  await expect(assistant).toHaveCount(1);
  await expect(assistant).toHaveText(complete);
});

test("real tool activity completes before one final response", async ({ page }, info) => {
  await page
    .getByRole("textbox", { name: "Message Hermes" })
    .fill(`[workflow-tool] ${randomUUID()}`);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".turn-work").last()).toBeVisible();
  await expect(page.locator(".message.assistant").last()).toContainText(
    "Tool completed: workflow-tool-ok.",
  );
  await expect(page.getByRole("button", { name: "Stop response", exact: true })).toHaveCount(0);
  await expect(page.locator(".activity[open]")).toHaveCount(0);
  const group = page.locator(".turn-work").last().locator(".work-summary");
  if (await group.isVisible()) await group.click();
  const tool = page
    .locator(".activity")
    .filter({ hasText: /terminal/i })
    .last();
  await tool.locator("summary").click();
  await expect(tool).toContainText("workflow-tool-ok");
  await expect(page.locator(".message.assistant")).toHaveCount(1);
  const order = await page
    .locator(".message.user, .turn-work, .message.assistant")
    .evaluateAll((nodes) => nodes.map((node) => node.className));
  expect(order[0]).toContain("user");
  expect(order[order.length - 1]).toContain("assistant");
  await page.screenshot({ path: info.outputPath("tool-completed.png") });
  await page.reload();
  await expect(page.locator(".message.assistant")).toContainText(
    "Tool completed: workflow-tool-ok.",
  );
});

test("interrupted inference settles and the conversation remains usable", async ({
  page,
}, info) => {
  const composer = page.getByRole("textbox", { name: "Message Hermes" });
  await composer.fill(`[workflow-interrupted] ${randomUUID()}`);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".message.assistant")).toContainText(
    "Partial response before interruption.",
  );
  await expect(page.getByRole("button", { name: "Stop response", exact: true })).toHaveCount(0, {
    timeout: 60000,
  });
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByRole("status").filter({ hasText: "Response failed" })).toBeVisible();
  await composer.fill(`[workflow-continue] ${randomUUID()}`);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".message.assistant").last()).toContainText("Recovered conversation.");
  await expect(page.locator(".message.user")).toHaveCount(2);
  await page.screenshot({ path: info.outputPath("recovered.png") });
});

test("selected model reaches the real inference request", async ({ page }) => {
  const marker = randomUUID();
  await page.getByRole("button", { name: "Choose model", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /chathermes-test/ })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "chathermes-alternate", exact: true })
    .click();
  await page.getByRole("textbox", { name: "Message Hermes" }).fill(`[workflow-stream] ${marker}`);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".message.assistant")).toContainText("Stream complete.");
  const verified = await fetch(`${mockserverURL()}/mockserver/verify`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      httpRequest: {
        method: "POST",
        path: "/v1/chat/completions",
        body: {
          type: "JSON_PATH",
          jsonPath: `$[?(@.model == 'chathermes-alternate' && @.stream == true && @.messages[-1].content =~ /(?s).*${marker}.*/)]`,
        },
      },
      times: { atLeast: 1, atMost: 1 },
    }),
  });
  expect(verified.status).toBe(202);
});

test("Stop settles an active response and keeps the composer usable", async ({ page }) => {
  const composer = page.getByRole("textbox", { name: "Message Hermes" });
  await composer.fill(`[workflow-stream] ${randomUUID()}`);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".message.assistant")).toContainText("First visible chunk.");
  await page.getByRole("button", { name: "Stop response", exact: true }).click();
  await expect(page.getByRole("button", { name: "Stop response", exact: true })).toHaveCount(0);
  await composer.fill(`[workflow-continue] ${randomUUID()}`);
  await expect(composer).toBeFocused();
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".message.assistant").last()).toContainText("Recovered conversation.");
});

test("a real clarification resumes the same conversation after answering", async ({ page }) => {
  await page
    .getByRole("textbox", { name: "Message Hermes" })
    .fill(`[workflow-clarify] ${randomUUID()}`);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByText("Choose a workflow direction", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /^Proceed with workflow/ }).click();
  await expect(page.locator(".message.assistant").last()).toContainText("Clarification accepted.");
  await expect(page.locator(".message.user")).toHaveCount(1);
});
