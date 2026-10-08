import { signIn } from "./login";
import { expect, test } from "@playwright/test";

test("Scheduled native history, saved output, pagination and discussion draft", async ({
  page,
}, testInfo) => {
  await signIn(page);
  const plugin = page.locator(".chathermes-embedded");
  await expect(plugin).toBeVisible();
  if (testInfo.project.name === "mobile")
    await plugin.getByRole("button", { name: "Open navigation" }).click();
  await expect(plugin.locator(".projects-nav").first()).toHaveText("Projects");
  await expect(plugin.locator(".scheduled-nav")).toHaveText("Scheduled");
  await plugin.getByRole("button", { name: "Scheduled", exact: true }).click();
  await expect(plugin.getByRole("navigation", { name: "Scheduled jobs" })).toContainText(
    "Security Audit",
  );
  await page.screenshot({
    animations: "disabled",
    path: testInfo.outputPath("scheduled-jobs.png"),
  });
  const textarea = plugin.getByRole("textbox", { name: "Message Hermes" });
  await textarea.click();
  await expect(textarea).toBeFocused();
  await plugin.getByRole("combobox", { name: "Job status" }).selectOption("paused");
  await expect(plugin.getByRole("navigation", { name: "Scheduled jobs" })).toContainText(
    "Paused audit",
  );
  await plugin.getByRole("combobox", { name: "Job status" }).selectOption("active");
  await plugin
    .getByRole("navigation", { name: "Scheduled jobs" })
    .getByRole("button", { name: /Security Audit/ })
    .click();
  const runs = plugin.getByRole("navigation", { name: "Job runs" }).getByRole("button");
  await expect(runs).toHaveCount(30);
  const jobId = new URL(page.url()).searchParams.get("job")!;
  const history = await (
    await page.request.get(
      "/api/plugins/chathermes/scheduled/runs?job_id=" + encodeURIComponent(jobId),
    )
  ).json();
  expect(history.runs.map((row: { started_at: number }) => row.started_at)).toEqual(
    history.runs
      .map((row: { started_at: number }) => row.started_at)
      .sort((a: number, b: number) => b - a),
  );
  await page.screenshot({
    animations: "disabled",
    path: testInfo.outputPath("scheduled-runs.png"),
  });
  await plugin.getByRole("button", { name: "Load older runs" }).click();
  await expect(runs).toHaveCount(36);
  await runs.first().click();
  await expect(plugin.locator(".message.assistant")).toContainText(
    "Synthetic persisted agent output",
  );
  await expect(plugin.locator(".activity[open]")).toHaveCount(0);
  expect(await plugin.locator(".transcript").evaluate((element) => element.scrollTop)).toBe(0);
  await plugin.locator(".work-summary").click();
  await plugin.locator(".activity summary").click();
  await expect(plugin.locator(".activity pre")).toContainText("Synthetic audit checks passed.");
  await page.screenshot({
    animations: "disabled",
    path: testInfo.outputPath("scheduled-agent-output.png"),
  });
  await plugin.locator(".transcript").evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  await expect(plugin.locator(".message.assistant")).toContainText("Check 29: passed.");
  expect(await plugin.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await plugin.getByRole("button", { name: "← Security Audit", exact: true }).click();
  await runs.nth(1).click();
  await expect(plugin.locator(".message.assistant")).toContainText("Synthetic saved output");
  await page.reload();
  await expect(plugin.locator(".message.assistant")).toContainText("Synthetic saved output");
  await page.screenshot({
    animations: "disabled",
    path: testInfo.outputPath("scheduled-saved-output.png"),
  });
  await plugin.getByRole("button", { name: "Open a chat about this run" }).click();
  await expect(textarea).toHaveValue(
    /Discuss this scheduled job run\.[\s\S]*Synthetic saved output/,
  );
  await expect(plugin.locator(".scheduled-page")).toHaveCount(0);
  await expect(plugin.locator(".message.user")).toHaveCount(0);
  await page.screenshot({
    animations: "disabled",
    path: testInfo.outputPath("scheduled-chat-draft.png"),
  });
  const composer = plugin.locator(".composer");
  await plugin.getByRole("button", { name: "Attachment options" }).click();
  await expect(plugin.getByRole("button", { name: "Take a photo", exact: true })).toBeVisible();
  await composer
    .locator('input[type="file"]')
    .first()
    .setInputFiles({
      name: "audit-notes.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("Synthetic notes about this scheduled run."),
    });
  await expect(composer).toContainText("audit-notes.txt");
  await textarea.fill("Read the attached audit notes");
  const upload = page.waitForResponse(
    (response) => response.url().includes("/uploads") && response.request().method() === "POST",
  );
  await plugin.getByRole("button", { name: "Send message", exact: true }).click();
  expect((await upload).status()).toBe(201);
  await expect(plugin.locator(".message.assistant").last()).toContainText("Isolated Hermes reply", {
    timeout: 60_000,
  });
  await expect(plugin.getByRole("button", { name: "Send message", exact: true })).toBeVisible({
    timeout: 60_000,
  });
  await composer.locator("input[capture]").setInputFiles({
    name: "audit-camera.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1sAAAAASUVORK5CYII=",
      "base64",
    ),
  });
  await expect(composer.locator("img")).toBeVisible();
  await textarea.click();
  await expect(textarea).toBeFocused();
  await page.screenshot({
    animations: "disabled",
    path: testInfo.outputPath("scheduled-attachments.png"),
  });
  if (testInfo.project.name === "mobile")
    await plugin.getByRole("button", { name: "Open navigation" }).click();
  await plugin.getByRole("combobox", { name: "Profile", exact: true }).selectOption("test-profile");
  await expect(textarea).toHaveValue("");
  await expect(plugin.locator(".composer img")).toHaveCount(0);
  if (testInfo.project.name === "mobile")
    await plugin.getByRole("button", { name: "Open navigation" }).click();
  await plugin.getByRole("button", { name: "Scheduled", exact: true }).click();
  await plugin
    .getByRole("navigation", { name: "Scheduled jobs" })
    .getByRole("button", { name: /Security Audit/ })
    .click();
  await runs.nth(1).click();
  await expect(plugin.locator(".message.assistant")).toContainText(
    "Synthetic saved output for test-profile",
  );
  await plugin.getByRole("button", { name: "← Security Audit", exact: true }).click();
  await plugin.getByRole("button", { name: "← Scheduled", exact: true }).click();
  await plugin.getByRole("combobox", { name: "Job status" }).selectOption("paused");
  await plugin
    .getByRole("navigation", { name: "Scheduled jobs" })
    .getByRole("button", { name: /Failed run fixture/ })
    .click();
  await expect(runs).toHaveCount(1);
  await expect(runs).toContainText("Failed");
  await runs.first().click();
  await expect(plugin.locator(".scheduled-page")).toContainText(
    "No output was saved for this run.",
  );
  await expect(plugin.getByRole("button", { name: "Open a chat about this run" })).toHaveCount(0);
  await page.screenshot({
    animations: "disabled",
    path: testInfo.outputPath("scheduled-failed-run.png"),
  });
});
