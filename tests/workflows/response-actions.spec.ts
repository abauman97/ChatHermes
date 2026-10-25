import { randomUUID } from "node:crypto";
import { test, expect } from "./fixtures";
import { api, runtime } from "./helpers";
import { authenticate } from "../docker/prepare-browser.mjs";
import { sessionFromUrl } from "../visual/login";
import { projectSessions } from "../../src/features/projects/utils/projects";

// Reuse repository inference expectations; all session/branch traffic still
// reaches Hermes. Clipboard permission/OS behavior remains in the live suite.
test("branching an earlier tool response preserves attachments and parent history", async ({
  page,
}, info) => {
  const plugin = page.locator(".chathermes-embedded");
  const composer = plugin.getByRole("textbox", { name: "Message Hermes" });
  const send = plugin.getByRole("button", { name: "Send message", exact: true });
  const branches = plugin.getByRole("button", { name: "Branch in new chat", exact: true });
  const first = `[workflow-tool] ${randomUUID()}. Run the provided deterministic tool fixture; do not use attachment content.`;
  const later = `[workflow-stream] ${randomUUID()}`;
  const filename = `branch-context-${randomUUID()}.txt`;
  await plugin.locator('input[aria-label="Upload files"]').setInputFiles({
    name: filename,
    mimeType: "text/plain",
    buffer: Buffer.from("Synthetic branch context"),
  });
  await expect(plugin.locator(".composer")).toContainText(filename);
  await composer.fill(first);
  await send.click();
  await expect(plugin.locator(".turn-work")).toBeVisible();
  await expect(plugin.locator(".message.assistant")).toHaveText(
    "Tool completed: workflow-tool-ok.",
  );
  await expect(branches).toBeEnabled();
  const parent = sessionFromUrl(page.url());
  expect(parent).toBeTruthy();
  const parentURL = page.url();

  await composer.fill(later);
  await send.click();
  await expect(plugin.locator(".message.assistant").last()).toContainText("First visible chunk.");
  await expect(branches.first()).toBeDisabled();
  await composer.fill("Focusable parent draft");
  await expect(composer).toBeFocused();
  await expect(plugin.locator(".message.assistant").last()).toContainText("Stream complete.");
  await expect(branches).toHaveCount(2);
  await expect(branches.first()).toBeEnabled();
  await page.screenshot({ path: info.outputPath("response-actions-parent.png") });

  await branches.first().click();
  await expect.poll(() => sessionFromUrl(page.url())).toBeTruthy();
  await expect.poll(() => sessionFromUrl(page.url())).not.toBe(parent);
  const childURL = page.url();
  await expect(plugin.locator(".message.user")).toHaveCount(1);
  await expect(plugin.locator(".message.user")).toContainText(first);
  await expect(plugin.locator(".message.assistant")).toHaveText(
    "Tool completed: workflow-tool-ok.",
  );
  await expect(plugin.locator(".transcript")).toContainText(filename);
  await expect(plugin.locator(".transcript")).not.toContainText(later);
  await expect(plugin.locator(".transcript")).not.toContainText("Stream complete.");
  await composer.fill("Focusable child draft");
  await expect(composer).toBeFocused();
  await page.screenshot({ path: info.outputPath("response-actions-child.png") });

  await page.reload();
  await expect(plugin.locator(".message.user")).toHaveCount(1);
  await expect(plugin.locator(".message.assistant")).toHaveText(
    "Tool completed: workflow-tool-ok.",
  );
  await expect(plugin.locator(".transcript")).toContainText(filename);
  await expect(plugin.locator(".transcript")).not.toContainText(later);
  const followup = `[workflow-continue] ${randomUUID()}`;
  await composer.fill(followup);
  await send.click();
  await expect(plugin.locator(".message.assistant").last()).toHaveText("Recovered conversation.");
  expect(page.url()).toBe(childURL);

  await page.goto(parentURL);
  await expect(plugin.locator(".message.user")).toHaveCount(2);
  await expect(plugin.locator(".message.assistant")).toHaveCount(2);
  await expect(plugin.locator(".transcript")).toContainText(later);
  await expect(plugin.locator(".transcript")).toContainText("Stream complete.");
  await expect(plugin.locator(".transcript")).not.toContainText(followup);
  await expect(plugin.locator(".transcript")).not.toContainText("Recovered conversation.");
});

test("response branches retain Project workspace and profile isolation", async ({ page }, info) => {
  const origin = new URL(page.url()).origin;
  await authenticate(page, `${origin}/chathermes?profile=alpha#/?profile=alpha`);
  const workspace = runtime(
    "import pathlib,sys,json; p=pathlib.Path('/opt/data/workflow-tests')/sys.argv[1]; p.mkdir(parents=True); print(json.dumps(str(p)))",
    randomUUID(),
  );
  const projectLabel = `Branch project ${randomUUID()}`;
  const created = await api(page, "/api/plugins/chathermes/projects/manage?profile=alpha", {
    action: "create",
    name: projectLabel,
    primary_path: workspace,
  });
  expect(created.status).toBe(200);
  const projectName = projectLabel;
  const project = created.body.project.id;
  await page.goto(
    `${origin}/chathermes?profile=alpha#/projects/${encodeURIComponent(project)}?profile=alpha`,
  );
  const plugin = page.locator(".chathermes-embedded");
  const composer = plugin.getByRole("textbox", { name: "Message Hermes" });
  const prompt = `[workflow-stream] ${randomUUID()}`;
  await composer.fill(prompt);
  await plugin.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(plugin.locator(".message.assistant")).toContainText("Stream complete.");
  const branch = plugin.getByRole("button", { name: "Branch in new chat", exact: true });
  await expect(branch).toBeEnabled();
  const parent = sessionFromUrl(page.url());
  expect(parent).toBeTruthy();
  await branch.click();
  await expect.poll(() => sessionFromUrl(page.url())).toBeTruthy();
  await expect.poll(() => sessionFromUrl(page.url())).not.toBe(parent);
  const child = sessionFromUrl(page.url());
  expect(new URL(page.url()).hash).toContain(`project=${encodeURIComponent(project)}`);
  expect(new URL(page.url()).hash).toContain("profile=alpha");
  await expect(plugin.locator(".message.user")).toHaveText(prompt);
  await expect(page.locator(".header-project-subtitle")).toHaveText(projectName);
  await page.reload();
  await expect(page.locator(".topbar-profile")).toHaveText("alpha");
  const detail = await api(
    page,
    `/api/plugins/chathermes/projects/detail?project_id=${encodeURIComponent(project)}&profile=alpha`,
  );
  expect(detail.status).toBe(200);
  expect(detail.body.project.path).toBe(workspace);
  expect(projectSessions(detail.body.project).map((row) => row.id)).toEqual(
    expect.arrayContaining([parent, child]),
  );

  for (const id of [parent, child]) {
    const member = await api(
      page,
      `/api/plugins/chathermes/chat/sessions/${id}/membership?profile=alpha`,
    );
    expect(member.status).toBe(200);
    const denied = await api(
      page,
      `/api/plugins/chathermes/api/sessions/${id}/branch?profile=beta`,
      { response_id: "1" },
    );
    expect(denied.status).toBe(404);
  }
  await page.screenshot({ path: info.outputPath("response-actions-project.png") });
});
