import { randomUUID } from "node:crypto";
import { test, expect } from "./fixtures";

for (const [choice, expected] of [
  ["Allow once", "Approved once."],
  ["Deny", "Approval denied; command did not run."],
]) {
  test(`real command approval: ${choice}`, async ({ page }, info) => {
    await page
      .getByRole("textbox", { name: "Message Hermes" })
      .fill(`[workflow-approval] ${randomUUID()}`);
    await page.getByRole("button", { name: "Send message", exact: true }).click();
    await expect(page.getByRole("button", { name: choice, exact: true })).toBeVisible();
    await page.screenshot({ path: info.outputPath("approval-pending.png") });
    await page.getByRole("button", { name: choice, exact: true }).click();
    await expect(page.locator(".message.assistant").last()).toContainText(expected);
    await expect(page.getByRole("button", { name: "Stop response", exact: true })).toHaveCount(0);
    await page.reload();
    await expect(page.locator(".message.assistant").last()).toContainText(expected);
  });
}

test("execution finishes after navigating away and restores without resubmission", async ({
  page,
}) => {
  let submissions = 0;
  page.on("websocket", (socket) =>
    socket.on("framesent", ({ payload }) => {
      try {
        if (JSON.parse(String(payload)).method === "prompt.submit") submissions++;
      } catch {
        /* Other WebSocket traffic is unrelated. */
      }
    }),
  );
  await page
    .getByRole("textbox", { name: "Message Hermes" })
    .fill(`[workflow-background] ${randomUUID()}`);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(
    page
      .locator(".activity")
      .filter({ hasText: /terminal/i })
      .first(),
  ).toBeVisible();
  const conversation = page.url();
  await page.goto("about:blank");
  // The live server-side viewer retains execution. Its persisted transcript is
  // the completion condition; no wall-clock wait or browser event is substituted.
  const { api } = await import("./helpers");
  const { sessionFromUrl } = await import("../visual/login");
  const id = sessionFromUrl(conversation)!;
  await page.goto(new URL("/sessions", conversation).href);
  await expect
    .poll(async () => {
      const result = await api(
        page,
        `/api/plugins/chathermes/api/sessions/${id}/messages?profile=default`,
      );
      return JSON.stringify(result.body);
    })
    .toContain("Background execution finished.");
  await page.goto(conversation);
  await expect(page.locator(".message.assistant")).toContainText("Background execution finished.");
  await expect(page.locator(".message.user")).toHaveCount(1);
  expect(submissions).toBe(1);
});

test("thinking streams through Hermes and remains inspectable after completion", async ({
  page,
}) => {
  await page
    .getByRole("textbox", { name: "Message Hermes" })
    .fill(`[workflow-thinking] ${randomUUID()}`);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  const thought = page
    .locator(".activity")
    .filter({ has: page.locator("summary", { hasText: /Thinking|Thought/ }) });
  await expect(thought).toBeVisible();
  await expect(page.locator(".message.assistant")).toContainText("Stream complete.");
  await expect(thought).not.toHaveAttribute("open", "");
  await thought.locator("summary").click();
  await expect(thought).toContainText("Second visible chunk.");
});
