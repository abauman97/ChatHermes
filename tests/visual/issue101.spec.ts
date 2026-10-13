import { expect, test } from "@playwright/test";
import { signIn } from "./login";
import { projectSessions } from "../../src/features/projects/utils/projects";

test("new chat has no suggested prompts and keeps the composer focusable", async ({
  page,
}, info) => {
  await signIn(page);
  const plugin = page.locator(".chathermes-embedded");
  const empty = plugin.locator(".empty-state");
  await expect(empty).toContainText("What can I help with?");
  await expect(empty.getByRole("button")).toHaveCount(0);
  const area = plugin.getByRole("textbox", { name: "Message Hermes" });
  await area.click();
  await expect(area).toBeFocused();
  await expect(area).toHaveCSS("font-size", "16px");
  await expect(plugin.getByRole("button", { name: "Send message", exact: true })).toBeDisabled();
  await page.screenshot({ path: info.outputPath("new-chat.png") });
});

test("subtle Load more still paginates real session rows", async ({ page }, info) => {
  await signIn(page);
  const root = "/api/plugins/chathermes";
  const listed = await page.request.get(`${root}/sessions?limit=100`);
  expect(listed.ok()).toBe(true);
  const body = await listed.json();
  const rows = Array.isArray(body) ? body : body.data || body.sessions;
  for (let index = rows.length; index < 31; index++) {
    const created = await page.request.post(`${root}/sessions`, {
      data: { title: `Pagination check ${index + 1}` },
    });
    expect(created.ok()).toBe(true);
  }
  await page.reload();
  const plugin = page.locator(".chathermes-embedded");
  if (info.project.name === "mobile")
    await plugin.getByRole("button", { name: "Open navigation", exact: true }).click();
  const more = plugin.getByRole("button", { name: "Load more", exact: true });
  await expect(more).toBeVisible();
  await expect(more).toHaveCSS("border-top-width", "0px");
  await page.screenshot({ path: info.outputPath("load-more.png") });
  const count = await plugin.locator(".session-row").count();
  await more.click();
  await expect.poll(() => plugin.locator(".session-row").count()).toBeGreaterThan(count);
  await expect(more).toHaveCount(0);
});

test("session options rename, move to project, archive and delete through authenticated routes", async ({
  page,
}, info) => {
  test.setTimeout(180_000);
  await signIn(page);
  const plugin = page.locator(".chathermes-embedded");
  const root = "/api/plugins/chathermes";
  const title = `Menu check ${info.project.name} ${Date.now()}`;
  const created = await page.request.post(`${root}/sessions`, { data: { title } });
  expect(created.ok()).toBe(true);
  const made = await created.json();
  const id = (made.session || made).id;
  await page.goto(`/chathermes#/chat/${encodeURIComponent(id)}`);
  const area = plugin.getByRole("textbox", { name: "Message Hermes" });
  await expect(plugin.getByRole("button", { name: "Choose model", exact: true })).toBeEnabled();
  await area.fill("Reply with exactly: Menu check ready");
  await plugin.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(plugin.locator(".message.assistant").last()).toContainText("Menu check ready", {
    timeout: 120_000,
  });
  await page.goto("/chathermes");
  const projects = await page.request.get(`${root}/projects`);
  const existing = (await projects.json()).projects.find(
    (row: { path?: string }) => row.path === `/opt/data/issue101-${info.project.name}`,
  );
  let projectId = existing?.id;
  if (!projectId) {
    const project = await page.request.post(`${root}/projects/manage`, {
      data: {
        action: "create",
        name: `Menu project ${info.project.name}`,
        primary_path: `/opt/data/issue101-${info.project.name}`,
      },
    });
    expect(project.ok()).toBe(true);
    projectId = (await project.json()).project.id;
  }
  await page.reload();
  async function openDrawer() {
    if (
      info.project.name === "mobile" &&
      !(await plugin.locator(".sidebar").evaluate((el) => el.classList.contains("translate-x-0")))
    )
      await plugin.getByRole("button", { name: "Open navigation", exact: true }).click();
    await expect
      .poll(async () => Math.round((await plugin.locator(".sidebar").boundingBox())!.x))
      .toBe(0);
  }
  await openDrawer();
  await plugin.getByRole("button", { name: `Options for ${title}`, exact: true }).click();
  await expect(
    plugin.getByRole("button", { name: `Options for ${title}`, exact: true }),
  ).toHaveText("⋮");
  const popup = plugin.getByRole("dialog", { name: "Session options", exact: true });
  await expect(popup).toBeVisible();
  for (const label of ["Rename", "Add to project", "Archive", "Delete"])
    await expect(popup.getByRole("button", { name: label, exact: true })).toBeVisible();
  await page.screenshot({ path: info.outputPath("session-menu.png") });
  await popup.getByRole("button", { name: "Rename", exact: true }).click();
  const renamed = `${title} renamed`;
  await plugin.getByRole("textbox", { name: "Session title" }).fill(renamed);
  await plugin.getByRole("button", { name: "Save title", exact: true }).click();
  await expect(
    plugin.getByRole("button", { name: `Options for ${renamed}`, exact: true }),
  ).toBeVisible();
  await plugin.getByRole("button", { name: `Options for ${renamed}`, exact: true }).click();
  await popup.getByRole("button", { name: "Add to project", exact: true }).click();
  const picker = plugin.getByRole("dialog", { name: "Add to project", exact: true });
  await picker.getByRole("combobox").selectOption(projectId);
  await page.screenshot({ path: info.outputPath("session-project-picker.png") });
  const moved = page.waitForResponse(
    (response) =>
      response.url().includes(`/sessions/${id}/project`) && response.request().method() === "POST",
  );
  await picker.getByRole("button", { name: "Add", exact: true }).click();
  expect((await moved).status()).toBe(200);
  const detail = await page.request.get(
    `${root}/projects/detail?project_id=${encodeURIComponent(projectId)}`,
  );
  expect(projectSessions((await detail.json()).project).some((row) => row.id === id)).toBe(true);
  const projectRow = plugin.locator(".session-row").filter({ hasText: renamed });
  await expect(projectRow.locator(".session-select")).toContainText(
    `Menu project ${info.project.name}`,
  );
  await page.screenshot({ path: `tmp/issue101-verification/item9-${info.project.name}.png` });
  await expect(
    plugin.getByRole("button", { name: `Options for ${renamed}`, exact: true }),
  ).toBeEnabled();
  await plugin.getByRole("button", { name: `Options for ${renamed}`, exact: true }).click();
  await popup.getByRole("button", { name: "Archive", exact: true }).click();
  await expect(
    plugin.getByRole("button", { name: `Options for ${renamed}`, exact: true }),
  ).toHaveCount(0);
  const disposable = await page.request.post(`${root}/sessions`, {
    data: { title: `${title} delete` },
  });
  expect(disposable.ok()).toBe(true);
  const deleteId = (await disposable.json()).session.id;
  await page.reload();
  await openDrawer();
  await plugin.getByRole("button", { name: `Options for ${title} delete`, exact: true }).click();
  await popup.getByRole("button", { name: "Delete", exact: true }).click();
  const confirm = plugin.getByRole("dialog", { name: "Delete conversation", exact: true });
  await page.screenshot({ path: info.outputPath("session-delete-confirmation.png") });
  await confirm.getByRole("button", { name: "Cancel", exact: true }).click();
  expect((await page.request.get(`${root}/api/sessions/${deleteId}`)).status()).toBe(200);
  await plugin.getByRole("button", { name: `Options for ${title} delete`, exact: true }).click();
  await popup.getByRole("button", { name: "Delete", exact: true }).click();
  await confirm.getByRole("button", { name: "Delete conversation", exact: true }).click();
  await expect(
    plugin.getByRole("button", { name: `Options for ${title} delete`, exact: true }),
  ).toHaveCount(0);
  expect((await page.request.get(`${root}/api/sessions/${deleteId}`)).status()).toBe(404);
});

test("profile selection keeps navigation open", async ({ page }, info) => {
  await signIn(page);
  const plugin = page.locator(".chathermes-embedded");
  if (info.project.name === "mobile")
    await plugin.getByRole("button", { name: "Open navigation", exact: true }).click();
  const profile = plugin.getByRole("combobox", { name: "Profile", exact: true });
  await profile.selectOption("default");
  await expect(profile).toHaveValue("default");
  await expect
    .poll(async () => Math.round((await plugin.locator(".sidebar").boundingBox())!.x))
    .toBe(0);
  await page.screenshot({ path: info.outputPath("profile-switch-open.png") });
  await profile.selectOption("");
  await expect(profile).toHaveValue("");
  await expect
    .poll(async () => Math.round((await plugin.locator(".sidebar").boundingBox())!.x))
    .toBe(0);
  await plugin.getByRole("link", { name: "Projects", exact: true }).click();
  await expect(plugin.locator(".projects-page")).toBeVisible();
  if (info.project.name === "mobile")
    await expect(
      plugin.getByRole("button", { name: "Open navigation", exact: true }),
    ).toHaveAttribute("aria-expanded", "false");
});

test("attachment plus is centered and authenticated attachments remain available", async ({
  page,
}, info) => {
  await signIn(page);
  const plugin = page.locator(".chathermes-embedded");
  const attach = plugin.getByRole("button", { name: "Attachment options", exact: true });
  const buttonBox = (await attach.boundingBox())!;
  const iconBox = (await attach.locator("svg").boundingBox())!;
  expect(Math.abs(iconBox.x + iconBox.width / 2 - buttonBox.x - buttonBox.width / 2)).toBeLessThan(
    1,
  );
  expect(
    Math.abs(iconBox.y + iconBox.height / 2 - buttonBox.y - buttonBox.height / 2),
  ).toBeLessThan(1);
  await page.screenshot({ path: info.outputPath("attachment-plus.png") });
  await attach.click();
  await expect(plugin.getByRole("button", { name: "Take a photo", exact: true })).toBeVisible();
  await page.screenshot({ path: info.outputPath("attachment-options.png") });
  await plugin.locator('input[aria-label="Upload files"]').setInputFiles({
    name: "alignment-check.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("Synthetic attachment check"),
  });
  await expect(plugin.locator(".composer")).toContainText("alignment-check.txt");
  await plugin.getByRole("button", { name: "Remove alignment-check.txt" }).click();
  const area = plugin.getByRole("textbox", { name: "Message Hermes" });
  await area.click();
  await expect(area).toBeFocused();
});

test("model picker is centered and keeps model selection available", async ({ page }, info) => {
  await signIn(page);
  const plugin = page.locator(".chathermes-embedded");
  const picker = plugin.getByRole("button", { name: "Choose model", exact: true });
  const controls = (await picker.locator("xpath=..").boundingBox())!;
  console.log("model-position", info.project.name, controls, await picker.boundingBox());
  const pill = (await picker.boundingBox())!;
  expect(Math.abs(pill.x + pill.width / 2 - controls.x - controls.width / 2)).toBeLessThan(1);
  await page.screenshot({ path: info.outputPath("model-centered.png") });
  await picker.click();
  const dialog = plugin.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const options = dialog.locator(".provider-option, .model-option");
  await expect(options.first()).toBeVisible();
  await page.screenshot({ path: info.outputPath("model-options.png") });
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  const area = plugin.getByRole("textbox", { name: "Message Hermes" });
  await area.fill("Focusable composer draft");
  await expect(area).toBeFocused();
});

test("item 7 blue new chat sits between profile and settings", async ({ page }, info) => {
  await signIn(page);
  const plugin = page.locator(".chathermes-embedded");
  if (info.project.name === "mobile")
    await plugin.getByRole("button", { name: "Open navigation", exact: true }).click();
  await expect
    .poll(async () => Math.round((await plugin.locator(".sidebar").boundingBox())!.x))
    .toBe(0);
  const button = plugin.locator(".drawer-chat");
  await expect(button).toHaveCount(1);
  await expect(button).toHaveCSS("background-color", "rgb(37, 99, 235)");
  const profile = (await plugin.locator(".profile-field").boundingBox())!;
  const chat = (await button.boundingBox())!;
  const settings = (await plugin.locator(".drawer-settings").boundingBox())!;
  expect(profile.x + profile.width).toBeLessThan(chat.x);
  expect(chat.x + chat.width).toBeLessThan(settings.x);
  await page.screenshot({ path: `tmp/issue101-verification/item7-${info.project.name}.png` });
  await button.click();
  await expect(plugin.getByRole("textbox", { name: "Message Hermes" })).toBeEnabled();
});

test("item 8 subtle return icon sits beside the sidebar title", async ({ page }, info) => {
  await signIn(page);
  const plugin = page.locator(".chathermes-embedded");
  if (info.project.name === "mobile")
    await plugin.getByRole("button", { name: "Open navigation", exact: true }).click();
  await expect
    .poll(async () => Math.round((await plugin.locator(".sidebar").boundingBox())!.x))
    .toBe(0);
  const back = plugin.getByRole("button", { name: "Return to Hermes Desktop", exact: true });
  await expect(
    plugin.locator(".brand").getByRole("button", { name: "Return to Hermes Desktop" }),
  ).toBeVisible();
  await expect(back).toHaveCSS("color", "rgb(163, 163, 163)");
  await page.screenshot({ path: `tmp/issue101-verification/item8-${info.project.name}.png` });
  await back.click();
  await expect(plugin).toHaveCount(0);
  await expect(page).not.toHaveURL(/\/chathermes/);
});

test("item 10 sidebar header has title and return icon without logo", async ({ page }, info) => {
  await signIn(page);
  const plugin = page.locator(".chathermes-embedded");
  if (info.project.name === "mobile")
    await plugin.getByRole("button", { name: "Open navigation", exact: true }).click();
  await expect
    .poll(async () => Math.round((await plugin.locator(".sidebar").boundingBox())!.x))
    .toBe(0);
  const brand = plugin.locator(".brand");
  await expect(brand).toContainText("ChatHermes");
  await expect(brand.locator("img")).toHaveCount(0);
  await expect(brand.getByRole("button", { name: "Return to Hermes Desktop" })).toBeVisible();
  await page.screenshot({ path: `tmp/issue101-verification/item10-${info.project.name}.png` });
});

test("item 11 saved history names the actual command and tool", async ({ page }, info) => {
  test.setTimeout(180_000);
  await signIn(page);
  const plugin = page.locator(".chathermes-embedded");
  await plugin
    .getByRole("textbox", { name: "Message Hermes" })
    .fill(
      "Use terminal to run printf issue101-history-ok. Then use read_file to read /opt/data/issue101-tool.txt. Reply briefly with the two outputs.",
    );
  await plugin.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(plugin.locator(".message.assistant").last()).toContainText("issue101-history-ok", {
    timeout: 120_000,
  });
  await expect(plugin.getByRole("button", { name: "Stop response", exact: true })).toHaveCount(0, {
    timeout: 120_000,
  });
  await page.reload();
  await expect(plugin.locator(".activity").first()).toBeAttached();
  for (const group of await plugin.locator(".work-summary").all()) {
    if (await group.isVisible()) await group.click();
  }
  const labels = plugin.locator(".activity summary .activity-label");
  await expect(labels.filter({ hasText: "Ran printf issue101-history-ok" })).toBeVisible();
  await expect(labels.filter({ hasText: "Used read_file" })).toBeVisible();
  await page.screenshot({ path: `tmp/issue101-verification/item11-${info.project.name}.png` });
  const read = plugin.locator(".activity").filter({ hasText: "Used read_file" });
  await read.locator("summary").click();
  await expect(read.locator("pre")).toContainText("Synthetic tool verification");
  await page.screenshot({
    path: `tmp/issue101-verification/item11-output-${info.project.name}.png`,
  });
});

test("item 12 live work shows the command without a generic prefix and folds on completion", async ({
  page,
}, info) => {
  test.setTimeout(180_000);
  await signIn(page);
  const plugin = page.locator(".chathermes-embedded");
  const area = plugin.getByRole("textbox", { name: "Message Hermes" });
  await area.fill(
    "Use terminal to run exactly: printf issue101-live-start; sleep 8; printf issue101-live-end. Then reply with issue101-live-end.",
  );
  await plugin.getByRole("button", { name: "Send message", exact: true }).click();
  const active = plugin
    .locator(".activity-active")
    .filter({ has: page.locator(".activity-command-icon") })
    .last();
  await expect(active).toBeVisible({ timeout: 120_000 });
  await expect(active).toHaveAttribute("open", "");
  const label = active.locator(".activity-label");
  await expect(label).toContainText("printf issue101-live-start");
  await expect(label).not.toContainText(/Using tool:|Running command/);
  await expect(active.locator("pre")).toBeVisible();
  await page.screenshot({ path: `tmp/issue101-verification/item12-live-${info.project.name}.png` });
  await area.fill("Focusable live draft");
  await expect(area).toBeFocused();
  await expect(plugin.locator(".message.assistant").last()).toContainText("issue101-live-end", {
    timeout: 120_000,
  });
  await expect(plugin.getByRole("button", { name: "Guide this run", exact: true })).toHaveCount(0, {
    timeout: 120_000,
  });
  await expect(plugin.locator(".activity-active")).toHaveCount(0);
  await expect(plugin.locator(".activity[open]")).toHaveCount(0);
  await expect(area).toHaveValue("Focusable live draft");
  await page.screenshot({
    path: `tmp/issue101-verification/item12-completed-${info.project.name}.png`,
  });
});
