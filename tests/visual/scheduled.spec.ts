import { signIn } from "./login";
import { expect, test } from "@playwright/test";

test("Scheduled native history, saved output, pagination and session resume menu", async ({
  page,
}, testInfo) => {
  await signIn(page);
  const plugin = page.locator(".chathermes-embedded");
  await expect(plugin).toBeVisible();
  if (testInfo.project.name === "mobile")
    await plugin.getByRole("button", { name: "Open navigation" }).click();
  await expect(plugin.locator(".projects-nav").first()).toHaveText("Projects");
  await expect(plugin.locator(".scheduled-nav")).toHaveText("Scheduled");
  await plugin.getByRole("link", { name: "Scheduled", exact: true }).click();
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
  await expect(plugin.locator(".project-back")).toHaveCount(0);
  await expect(plugin.getByRole("button", { name: "Refresh", exact: true })).toHaveCount(0);
  await plugin.getByRole("button", { name: "Screen options", exact: true }).click();
  await plugin.getByRole("menuitem", { name: "Refresh", exact: true }).click();
  await expect(runs).toHaveCount(30);
  const jobId = decodeURIComponent(new URL(page.url()).hash.slice(1).split("?")[0].split("/")[2]!);
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
  await expect(plugin.locator(".project-back")).toHaveCount(0);
  await expect(plugin.getByRole("button", { name: "Open a chat about this run" })).toHaveCount(0);
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
  await page.goBack();
  await runs.nth(1).click();
  await expect(plugin.locator(".message.assistant")).toContainText("Synthetic saved output");
  await page.reload();
  await expect(plugin.locator(".message.assistant")).toContainText("Synthetic saved output");
  await page.screenshot({
    animations: "disabled",
    path: testInfo.outputPath("scheduled-saved-output.png"),
  });
  await plugin.getByRole("button", { name: "Screen options", exact: true }).click();
  await expect(plugin.getByRole("menuitem", { name: "Resume session", exact: true })).toHaveCount(
    0,
  );
  await plugin.getByRole("menuitem", { name: "Refresh", exact: true }).click();
  await expect(plugin.locator(".message.assistant")).toContainText("Synthetic saved output");
  await page.goBack();
  await runs.first().click();
  await plugin.getByRole("button", { name: "Screen options", exact: true }).click();
  await plugin.getByRole("menuitem", { name: "Resume session", exact: true }).click();
  await expect(plugin.locator(".scheduled-page")).toHaveCount(0);
  await expect(textarea).toHaveValue("");
  await page.screenshot({
    animations: "disabled",
    path: testInfo.outputPath("scheduled-resumed-session.png"),
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
  await plugin.getByRole("link", { name: "Scheduled", exact: true }).click();
  await plugin
    .getByRole("navigation", { name: "Scheduled jobs" })
    .getByRole("button", { name: /Security Audit/ })
    .click();
  await runs.nth(1).click();
  await expect(plugin.locator(".message.assistant")).toContainText(
    "Synthetic saved output for test-profile",
  );
  await page.goBack();
  await page.goBack();
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

// Seed "Issue 97 menu review" with a native run and saved Markdown in the
// disposable Hermes container using its cron and SessionDB helpers.
test("scheduled page menu refreshes each view and resumes a persisted session", async ({
  page,
}, info) => {
  await signIn(page, "/chathermes#/scheduled");
  const plugin = page.locator(".chathermes-embedded");
  const options = plugin.getByRole("button", { name: "Screen options", exact: true });
  const refresh = plugin.getByRole("menuitem", { name: "Refresh", exact: true });
  const resume = plugin.getByRole("menuitem", { name: "Resume Session", exact: true });
  const composer = plugin.getByRole("textbox", { name: "Message Hermes" });
  const screenshot = async (name: string) => {
    expect(await plugin.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
      true,
    );
    await page.screenshot({ animations: "disabled", path: info.outputPath(name + ".png") });
  };
  const refreshView = async (endpoint: string) => {
    await expect(plugin.getByRole("button", { name: "Refresh", exact: true })).toHaveCount(0);
    await options.click();
    await expect(refresh).toBeEnabled();
    await screenshot("menu-" + endpoint);
    const response = page.waitForResponse(
      (response) => new URL(response.url()).pathname.endsWith(endpoint) && response.ok(),
    );
    await refresh.click();
    await response;
    await expect(plugin.getByRole("menu")).toHaveCount(0);
    await expect(options).toBeFocused();
  };
  await refreshView("scheduled");
  await composer.click();
  await expect(composer).toBeFocused();
  await expect(plugin.getByRole("button", { name: "Send message", exact: true })).toBeDisabled();
  await plugin.getByRole("combobox", { name: "Job status" }).selectOption("paused");
  await expect(plugin.getByRole("navigation", { name: "Scheduled jobs" })).toContainText(
    "Issue 97 paused review",
  );
  await plugin.getByRole("combobox", { name: "Job status" }).selectOption("active");
  await plugin
    .getByRole("navigation", { name: "Scheduled jobs" })
    .getByRole("button", { name: /Issue 97 menu review/ })
    .click();
  await expect(plugin.locator(".project-back")).toHaveCount(0);
  const runs = plugin.getByRole("navigation", { name: "Job runs" }).getByRole("button");
  await expect(runs).toHaveCount(2);
  await refreshView("runs");
  await runs.first().click();
  await expect(plugin.locator(".message.assistant")).toContainText("Synthetic scheduled report");
  await expect(plugin.locator(".project-back")).toHaveCount(0);
  await expect(plugin.getByRole("button", { name: "Open a chat about this run" })).toHaveCount(0);
  await expect(plugin.locator(".activity[open]")).toHaveCount(0);
  await plugin.locator(".turn-work .activity summary").click();
  await expect(plugin.locator(".turn-work .activity pre")).toContainText(
    "Synthetic menu checks passed.",
  );
  await screenshot("run-expanded-disclosure");
  await plugin.locator(".transcript").evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  await expect(plugin.locator(".message.assistant")).toContainText("Check 39: passed.");
  await refreshView("output");
  await options.click();
  await expect(resume).toBeEnabled();
  await expect(plugin.locator('[data-test="resume-scheduled-session"]')).toHaveCount(1);
  await screenshot("resume-session-menu");
  await options.press("Escape");
  await expect(plugin.getByRole("menu")).toHaveCount(0);
  await expect(options).toBeFocused();
  await options.click();
  await resume.click();
  await expect(page).toHaveURL(/#\/chat\/cron_/);
  await expect(plugin.locator(".scheduled-page")).toHaveCount(0);
  await expect(plugin.locator(".message.assistant")).toContainText("Synthetic scheduled report");
  await expect(composer).toHaveValue("");
  await screenshot("resumed-session");
  await page.goBack();
  await expect(plugin.locator(".scheduled-page")).toBeVisible();
  await page.goBack();
  await expect(runs).toHaveCount(2);
  await runs.last().click();
  await expect(plugin.locator(".message.assistant")).toContainText("Synthetic saved menu report");
  await refreshView("output");
  await options.click();
  await expect(resume).toHaveCount(0);
  await options.press("Escape");
  await page.reload();
  await expect(plugin.locator(".message.assistant")).toContainText("Synthetic saved menu report");
  await plugin.getByRole("button", { name: "Attachment options" }).click();
  await plugin.locator('input[aria-label="Upload files"]').setInputFiles({
    name: "menu-review.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("Synthetic menu review attachment"),
  });
  await expect(plugin.locator(".composer")).toContainText("menu-review.txt");
  await plugin.locator("input[capture]").setInputFiles({
    name: "menu-camera.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1sAAAAASUVORK5CYII=",
      "base64",
    ),
  });
  await expect(plugin.locator(".composer img")).toBeVisible();
  await composer.click();
  await expect(composer).toBeFocused();
  await screenshot("saved-output-attachments");
});
