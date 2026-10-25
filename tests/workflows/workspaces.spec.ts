import { randomUUID } from "node:crypto";
import { test, expect } from "./fixtures";
import { api, runtime } from "./helpers";
import { sessionFromUrl } from "../visual/login";

test("Project instructions, workspace chat and generated artifacts survive reload", async ({
  page,
}, info) => {
  const name = `Workflow project ${randomUUID()}`;
  const workspace = runtime(
    "import pathlib,sys,json; p=pathlib.Path('/opt/data/workflow-tests')/sys.argv[1]; p.mkdir(parents=True); print(json.dumps(str(p)))",
    randomUUID(),
  );
  const created = await api(page, "/api/plugins/chathermes/projects/manage?profile=default", {
    action: "create",
    name,
    primary_path: workspace,
  });
  expect(created.status).toBe(200);
  const project = created.body.project.id;
  const origin = new URL(page.url()).origin;
  const projectURL = `${origin}/chathermes?profile=default#/projects/${encodeURIComponent(project)}?profile=default`;
  await page.goto(projectURL);
  await expect(page.getByRole("region", { name: "Selected Project" })).toContainText(workspace);
  await page.getByRole("button", { name: "Screen options", exact: true }).click();
  await page.getByRole("menuitem", { name: "Edit Instructions", exact: true }).click();
  await page
    .getByRole("textbox", { name: /Instructions/ })
    .fill("Synthetic workflow instruction: keep generated files inside this workspace.");
  await page.getByRole("button", { name: "Save instructions", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Instructions saved." })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("textbox", { name: /Instructions/ })).toHaveValue(
    /Synthetic workflow instruction/,
  );
  await page.goto(projectURL);
  await page.getByRole("button", { name: "Screen options", exact: true }).click();
  await page.getByRole("menuitem", { name: "New chat", exact: true }).click();
  await expect.poll(() => sessionFromUrl(page.url())).toBeTruthy();
  const composer = page.getByRole("textbox", { name: "Message Hermes" });
  await composer.fill(`[workflow-project] ${randomUUID()}`);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".message.assistant")).toContainText("Workspace verified.");
  const session = sessionFromUrl(page.url());
  expect(session).toBeTruthy();
  const conversation = page.url();
  const card = page
    .locator(".message.assistant .artifact-card")
    .filter({ hasText: "workflow-artifact.txt" });
  await expect(card).toBeVisible();
  await card
    .getByRole("button", { name: "Preview workflow-artifact.txt", exact: true })
    .press("Enter");
  const dialog = page.locator("dialog[open]");
  await expect(dialog.locator("pre")).toContainText("Generated project artifact");
  await page.screenshot({ path: info.outputPath("project-artifact-preview.png") });
  await dialog.getByRole("button", { name: "Close preview", exact: true }).click();
  // Read the actual authenticated download; Android delegates downloads to its
  // OS, so browser Download events are not a portable completion signal.
  const href = await card
    .getByRole("link", { name: "Download workflow-artifact.txt", exact: true })
    .getAttribute("href");
  expect(await page.evaluate(async (href) => (await fetch(href!)).text(), href)).toBe(
    "Generated project artifact",
  );
  await page.reload();
  await expect(card).toBeVisible();
  await page.goto(projectURL);
  await expect(page.getByRole("navigation", { name: "Project chats" })).not.toBeEmpty();
  await page.goto(conversation);
  await expect(card).toBeVisible();
  expect(
    runtime(
      "import pathlib,sys,json; p=pathlib.Path(sys.argv[1]); print(json.dumps((p/'workflow-artifact.txt').read_text()))",
      workspace,
    ),
  ).toBe("Generated project artifact");
});

test("native saved Cron output restores its exact job and run", async ({ page }, info) => {
  const name = `Workflow scheduled ${randomUUID()}`;
  const seed = runtime(
    "import json,sys; from cron.jobs import create_job,save_job_output; j=create_job(prompt='Synthetic scheduled workflow',schedule='0 0 1 1 *',name=sys.argv[1],paused=True); p=save_job_output(j['id'],'# Scheduled verification\\n\\nSynthetic saved Cron output.'); print(json.dumps({'job':j['id'],'run':'output:'+p.stem}))",
    name,
  );
  const origin = new URL(page.url()).origin;
  await page.goto(`${origin}/chathermes?profile=default#/scheduled?profile=default`);
  await page.getByRole("combobox", { name: "Job status", exact: true }).selectOption("paused");
  await page
    .getByRole("navigation", { name: "Scheduled jobs" })
    .getByRole("button", { name: new RegExp(name) })
    .click();
  await page.getByRole("navigation", { name: "Job runs" }).getByRole("button").first().click();
  await expect(page.locator(".scheduled-page")).toContainText("Synthetic saved Cron output.");
  expect(decodeURIComponent(page.url())).toContain(seed.run);
  await page.reload();
  await expect(page.locator(".scheduled-page")).toContainText("Synthetic saved Cron output.");
  await expect(page.getByRole("textbox", { name: "Message Hermes" })).toBeEnabled();
  await page.screenshot({ path: info.outputPath("scheduled-restored.png") });
});
