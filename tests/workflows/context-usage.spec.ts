import { randomUUID } from "node:crypto";
import { test, expect } from "./fixtures";
import { sessionFromUrl } from "../visual/login";

test("session context meter, focus visibility and on-demand details in the installed plugin", async ({
  page,
}, info) => {
  const plugin = page.locator(".chathermes-embedded");
  const area = plugin.getByRole("textbox", { name: "Message Hermes" });
  const meter = plugin.locator(".context-meter");
  let usageRequests = 0,
    detailRequests = 0;
  const usageReplies: Record<string, unknown>[] = [];
  let categoryCount = 0;
  page.on("websocket", (socket) => {
    const pending = new Map<string, string>();
    socket.on("framesent", ({ payload }) => {
      try {
        const frame = JSON.parse(String(payload));
        if (frame.method === "session.usage") usageRequests++;
        if (frame.method === "session.context_breakdown") detailRequests++;
        if (frame.id) pending.set(String(frame.id), frame.method);
      } catch {
        /* Ignore unrelated transport frames. */
      }
    });
    socket.on("framereceived", ({ payload }) => {
      for (const line of String(payload).split("\n")) {
        try {
          const frame = JSON.parse(line);
          if (pending.get(String(frame.id)) === "session.usage" && frame.result)
            usageReplies.push(frame.result);
          if (pending.get(String(frame.id)) === "session.context_breakdown" && frame.result)
            categoryCount = frame.result.categories.length;
        } catch {
          /* Ignore unrelated transport frames. */
        }
      }
    });
  });
  await expect(meter).toHaveCount(0);
  await area.fill(`[workflow-context] context-${randomUUID()}`);
  await plugin.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(meter).toHaveCount(1);
  await expect.poll(() => usageRequests).toBeGreaterThan(0);
  await expect(plugin.locator(".turn-work").last()).toBeVisible();
  await area.fill("Preserve the context draft");
  await expect(area).toBeFocused();
  await expect(meter).toBeHidden();
  // Target the class independently of percentage/accessible-name updates. Capture
  // the actual DOM/CSS state at the same point as the focused screenshot.
  const focusState = await meter.evaluate((el) => ({
    count: document.querySelectorAll(".chathermes-embedded .context-meter").length,
    textareaFocused: document.activeElement?.tagName === "TEXTAREA",
    display: getComputedStyle(el).display,
    visibility: getComputedStyle(el).visibility,
    hiddenAncestor: !!el.closest('[style*="display: none"]'),
    width: el.getBoundingClientRect().width,
    height: el.getBoundingClientRect().height,
  }));
  expect(focusState).toMatchObject({
    count: 1,
    textareaFocused: true,
    hiddenAncestor: true,
    width: 0,
    height: 0,
  });
  await info.attach("focused-meter-dom.json", {
    body: JSON.stringify(focusState, null, 2),
    contentType: "application/json",
  });
  await page.screenshot({ path: info.outputPath("context-focused.png") });
  await expect(plugin.locator(".message.assistant").last()).toContainText(
    "Tool completed: workflow-context-ok.",
  );
  await expect(plugin.getByRole("button", { name: "Stop response", exact: true })).toHaveCount(0);
  expect(detailRequests).toBe(0);
  await area.blur();
  await expect(meter).toBeVisible();
  await expect(meter).toContainText(/\d+%/);
  await expect.poll(() => typeof usageReplies.at(-1)?.context_percent).toBe("number");
  const latest = usageReplies.at(-1)!;
  expect(await meter.innerText()).toBe(`${Math.round(Number(latest.context_percent))}%`);
  const panel = plugin.getByRole("dialog", { name: "Context usage", exact: true });
  if (info.project.name === "desktop") {
    await meter.hover();
    await expect(panel).toBeVisible();
  }
  await meter.click();
  await expect(panel).toBeVisible();
  await expect.poll(() => categoryCount).toBeGreaterThan(0);
  await expect(panel.locator("dt")).toHaveCount(categoryCount);
  await expect(panel.locator(".context-breakdown-bar > span")).toHaveCount(categoryCount);
  await expect(panel).toContainText("System prompt");
  await expect(panel).toContainText("Conversation");
  await expect(panel).toContainText("Estimated breakdown");
  await expect(panel).toContainText("tokens ·");
  await expect.poll(() => detailRequests).toBeGreaterThan(0);
  const box = (await panel.boundingBox())!;
  const composer = (await plugin.locator(".composer").boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  expect(box.y + box.height).toBeLessThanOrEqual(composer.y);
  await page.screenshot({ path: info.outputPath("context-open.png") });
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  await meter.click();
  await expect(panel).toBeVisible();
  await page.locator(".topbar").click();
  await expect(panel).toHaveCount(0);
  await meter.click();
  await meter.click();
  await expect(panel).toHaveCount(0);
  await meter.click();
  await area.focus();
  await expect(panel).toHaveCount(0);
  await expect(meter).toBeHidden();
  await expect(area).toBeFocused();
  await expect(area).toHaveValue("Preserve the context draft");
  if (info.project.name === "mobile") {
    await page.setViewportSize({ width: 390, height: 440 });
    await expect(meter).toBeHidden();
    await page.screenshot({ path: info.outputPath("context-keyboard-viewport.png") });
    await area.blur();
    await meter.click();
    await expect(panel).toBeVisible();
    const small = (await panel.boundingBox())!;
    expect(small.y).toBeGreaterThanOrEqual(
      (await plugin.locator(".chat-interface").boundingBox())!.y,
    );
    expect(small.y + small.height).toBeLessThanOrEqual(440);
    await page.screenshot({ path: info.outputPath("context-short-open.png") });
    await page.keyboard.press("Escape");
  }
  // Existing composer controls and completed work remain usable beside the meter.
  const workSummary = plugin.locator(".turn-work").last().locator(".work-summary");
  if (await workSummary.isVisible()) await workSummary.click();
  const activity = plugin
    .locator(".activity")
    .filter({ hasText: /terminal/i })
    .last();
  await expect(activity).not.toHaveAttribute("open");
  await activity.locator("summary").click();
  await expect(activity).toContainText("workflow-context-ok");
  await activity.locator("summary").click();
  await expect(activity).not.toHaveAttribute("open");
  await plugin.getByRole("button", { name: "Choose model", exact: true }).click();
  const reasoning = plugin.getByRole("combobox", { name: "Reasoning effort", exact: true });
  await expect(reasoning).toBeVisible();
  expect(
    await reasoning.evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
  ).toBeGreaterThanOrEqual(16);
  await plugin.getByRole("button", { name: "Close model picker" }).click();
  await plugin.getByRole("button", { name: "Attachment options" }).click();
  await plugin.locator('input[aria-label="Upload files"]').setInputFiles({
    name: "context-check.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("Context usage attachment check"),
  });
  await expect(plugin.getByText("context-check.txt", { exact: true })).toBeVisible();
  await expect(plugin.getByRole("button", { name: "Retry upload context-check.txt" })).toHaveCount(
    0,
  );
  await page.screenshot({ path: info.outputPath("context-attachment.png") });
  await plugin.getByRole("button", { name: "Remove context-check.txt" }).click();
  const session = sessionFromUrl(page.url());
  expect(session).toBeTruthy();
  await page.reload();
  await expect(meter).toHaveCount(1);
  await expect(meter).toBeVisible();
  await expect.poll(() => usageRequests).toBeGreaterThan(1);
  await meter.click();
  await expect.poll(() => categoryCount).toBeGreaterThan(0);
  await expect(panel.locator("dt")).toHaveCount(categoryCount);
  await expect(plugin.locator(".message.assistant").last()).toContainText("workflow-context-ok");
});
