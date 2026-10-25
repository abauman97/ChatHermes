import { expect, test } from "@playwright/test";
import { signIn, sessionFromUrl } from "./login";
import { projectSessions } from "../../src/features/projects/utils/projects";

test.use({
  trace: "off",
  launchOptions: {
    executablePath: process.env.CHATHERMES_CHROMIUM,
    args: [
      `--unsafely-treat-insecure-origin-as-secure=${process.env.CHATHERMES_TEST_URL || "http://127.0.0.1:9119"}`,
    ],
  },
});

test("copies and branches an earlier response in the mounted native chat", async ({
  page,
  context,
}, info) => {
  test.setTimeout(240000);
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await signIn(page);
  const plugin = page.locator(".chathermes-embedded");
  const composer = plugin.getByRole("textbox", { name: "Message Hermes" });
  const marker = `BRANCH_FIRST_${info.project.name.toUpperCase()}`;
  const later = `PARENT_LATER_${info.project.name.toUpperCase()}`;
  const filename = `branch-context-${info.project.name}.txt`;
  await plugin.locator('input[aria-label="Upload files"]').setInputFiles({
    name: filename,
    mimeType: "text/plain",
    buffer: Buffer.from("Synthetic branch context"),
  });
  await composer.fill(
    `Use the terminal tool to run printf ${marker}, then reply with exactly ${marker}. Do not read the attachment.`,
  );
  await plugin.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(composer).toBeEnabled();
  await expect(plugin.locator(".message.assistant").last()).toContainText(marker, {
    timeout: 90000,
  });
  await expect(plugin.getByRole("button", { name: "Branch in new chat" })).toBeEnabled({
    timeout: 30000,
  });
  await expect(plugin.locator(".turn-work").last()).toBeVisible();
  const parent = sessionFromUrl(page.url())!;
  await composer.fill(`Reply with exactly ${later}. Do not use tools.`);
  await plugin.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(plugin.locator(".message.assistant").last()).toContainText(later, {
    timeout: 90000,
  });
  const branches = plugin.getByRole("button", { name: "Branch in new chat", exact: true });
  await expect(branches).toHaveCount(2, { timeout: 30000 });
  await expect(branches.first()).toBeEnabled();
  await plugin.getByRole("button", { name: "Copy response", exact: true }).first().click();
  await expect(plugin.getByRole("status").filter({ hasText: "Copied" })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(marker);
  await composer.fill("Focusable draft");
  await expect(composer).toBeFocused();
  await page.screenshot({ path: info.outputPath("response-actions-parent.png") });
  const branched = page.waitForResponse(
    (response) =>
      response.url().includes(`/api/sessions/${parent}/branch`) &&
      response.request().method() === "POST",
    { timeout: 30000 },
  );
  await branches.first().click();
  await page.screenshot({ path: info.outputPath("response-actions-after-branch-click.png") });
  const receipt = await branched;
  expect(receipt.status()).toBe(201);
  const child = (await receipt.json()).id;
  expect(child).not.toBe(parent);
  await expect.poll(() => sessionFromUrl(page.url())).toBe(child);
  await expect(plugin.locator(".message.assistant").last()).toContainText(marker);
  await expect(plugin.locator(".transcript")).not.toContainText(later);
  await expect(plugin.locator(".transcript")).toContainText(filename);
  await composer.fill("Child draft");
  await expect(composer).toBeFocused();
  await page.screenshot({ path: info.outputPath("response-actions-child.png") });
  await page.reload();
  await expect(plugin.locator(".message.assistant").last()).toContainText(marker, {
    timeout: 30000,
  });
  await expect(plugin.locator(".transcript")).not.toContainText(later);
  await expect(plugin.locator(".transcript")).toContainText(filename);
  await page.goto(`/chathermes#/chat/${parent}?profile=default`);
  await expect(plugin.locator(".transcript")).toContainText(later, { timeout: 30000 });
  const denied = await page.request.post(
    `/api/plugins/chathermes/api/sessions/${parent}/branch?profile=alpha`,
    { data: { response_id: "1" } },
  );
  expect(denied.status()).toBe(404);
});

test("native response branches retain their Project workspace", async ({ page }, info) => {
  test.setTimeout(180000);
  await signIn(page);
  const profile = info.project.name === "mobile" ? "beta" : "alpha";
  const foreignProfile = profile === "alpha" ? "beta" : "alpha";
  const catalog = await page.request.get(`/api/plugins/chathermes/projects?profile=${profile}`);
  expect(catalog.ok()).toBeTruthy();
  let project = (await catalog.json()).projects.find(
    (row: { path?: string }) => row.path === "/tmp",
  )?.id;
  if (!project) {
    const made = await page.request.post(
      `/api/plugins/chathermes/projects/manage?profile=${profile}`,
      {
        data: {
          action: "create",
          name: `Branch project ${info.project.name}`,
          primary_path: "/tmp",
        },
      },
    );
    expect(made.ok()).toBeTruthy();
    project = (await made.json()).project.id;
  }
  await page.goto(`/chathermes?profile=${profile}#/projects/${project}?profile=${profile}`);
  const plugin = page.locator(".chathermes-embedded");
  const composer = plugin.getByRole("textbox", { name: "Message Hermes" });
  await composer.fill("Reply with exactly PROJECT_BRANCH_OK. Do not use tools.");
  await plugin.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(plugin.locator(".message.assistant")).toContainText("PROJECT_BRANCH_OK", {
    timeout: 90000,
  });
  const parent = sessionFromUrl(page.url())!;
  const branch = plugin.getByRole("button", { name: "Branch in new chat" });
  await expect(branch).toBeEnabled({ timeout: 30000 });
  await branch.click();
  await expect.poll(() => sessionFromUrl(page.url()), { timeout: 30000 }).not.toBe(parent);
  const child = sessionFromUrl(page.url())!;
  expect(new URL(page.url()).hash).toContain(`project=${encodeURIComponent(project)}`);
  const detail = await page.request.get(
    `/api/plugins/chathermes/projects/detail?project_id=${project}&profile=${profile}`,
  );
  expect(detail.ok()).toBeTruthy();
  const node = (await detail.json()).project;
  expect(node.path).toBe("/tmp");
  expect(projectSessions(node).map((row) => row.id)).toEqual(
    expect.arrayContaining([parent, child]),
  );
  for (const id of [parent, child]) {
    const member = await page.request.get(
      `/api/plugins/chathermes/chat/sessions/${id}/membership?profile=${profile}`,
    );
    expect(member.ok()).toBeTruthy();
    const foreign = await page.request.get(
      `/api/plugins/chathermes/chat/sessions/${id}/membership?profile=${foreignProfile}`,
    );
    expect(foreign.status()).toBe(404);
  }
  await expect(plugin.locator(".message.assistant")).toContainText("PROJECT_BRANCH_OK");
  await page.screenshot({ path: info.outputPath("response-actions-project.png") });
});
