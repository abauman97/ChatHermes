import { randomUUID } from "node:crypto";
import { test, expect } from "./fixtures";
import { api, runtime } from "./helpers";
import { sessionFromUrl } from "../visual/login";

test("every route opens directly, nested pages reload, and history restores its destination", async ({
  page,
}, info) => {
  const workspace = runtime(
    "import pathlib,sys,json; p=pathlib.Path('/opt/data/workflow-tests')/sys.argv[1]; p.mkdir(parents=True); print(json.dumps(str(p)))",
    randomUUID(),
  );
  const created = await api(page, "/api/plugins/chathermes/projects/manage?profile=default", {
    action: "create",
    name: `Route pages ${randomUUID()}`,
    primary_path: workspace,
  });
  expect(created.status).toBe(200);
  const project = encodeURIComponent(created.body.project.id);
  const saved = runtime(
    "import json,sys; from cron.jobs import create_job,save_job_output; j=create_job(prompt='Synthetic route page',schedule='0 0 1 1 *',name=sys.argv[1],paused=True); p=save_job_output(j['id'],'Route page saved result'); print(json.dumps({'job':j['id'],'run':'output:'+p.stem}))",
    `Route job ${randomUUID()}`,
  );
  const plugin = page.locator(".chathermes-embedded");
  const origin = new URL(page.url()).origin;
  const url = (path: string) =>
    `${origin}/chathermes?profile=default#${path}${path.includes("?") ? "&" : "?"}profile=default`;
  const destinations: Array<[string, string]> = [
    ["/", ".transcript"],
    ["/inbox?scope=profile", 'section[aria-label="Inbox"]'],
    ["/artifacts", 'section[aria-label="Artifacts"]'],
    ["/projects?archived=1", ".projects-page"],
    [`/projects/${project}`, '[aria-label="Selected Project"]'],
    [`/projects/${project}/artifacts`, '[aria-label="Selected Project"] [aria-label="Artifacts"]'],
    [`/projects/${project}/settings`, '[aria-label="Edit project"]'],
    [`/projects/${project}/instructions`, '[aria-label="Edit Instructions"]'],
    ["/scheduled?status=paused", '[aria-label="Scheduled jobs"]'],
    [`/scheduled/${saved.job}`, '[aria-label="Job runs"]'],
    [
      `/scheduled/${saved.job}/${encodeURIComponent(saved.run)}`,
      ".scheduled-page .message.assistant",
    ],
    ["/settings", ".settings-page"],
  ];
  for (const [path, selector] of destinations) {
    await page.goto(url(path));
    await expect(page.locator(".chathermes-embedded").locator(selector)).toBeVisible();
    await page.reload();
    await expect(page.locator(".chathermes-embedded").locator(selector)).toBeVisible();
  }
  await plugin.getByRole("button", { name: "Close settings", exact: true }).click();
  await expect(page.locator(".transcript")).toBeVisible();
  const composer = plugin.getByRole("textbox", { name: "Message Hermes" });
  const prompt = `[workflow-stream] route continuity ${randomUUID()}`;
  await composer.fill(prompt);
  await plugin.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".message.assistant")).toContainText("First visible chunk.");
  await expect
    .poll(() => plugin.locator(".transcript").evaluate((el) => el.contains(document.activeElement)))
    .toBe(true);
  const session = sessionFromUrl(page.url());
  await composer.fill("Draft survives screen navigation");
  await composer.evaluate((el) => el.setAttribute("data-route-composer", "persistent"));
  const open = plugin.getByRole("button", { name: "Open navigation", exact: true });
  if (await open.isVisible()) await open.click();
  await plugin.getByRole("link", { name: "Scheduled", exact: true }).click();
  await expect(plugin.locator(".scheduled-page")).toBeVisible();
  await expect(plugin.getByRole("combobox", { name: "Job status", exact: true })).toHaveValue(
    "active",
  );
  await composer.focus();
  await expect(composer).toBeFocused();
  await expect(composer).toHaveValue("Draft survives screen navigation");
  await page.goBack();
  await expect(page.locator(".message.assistant")).toContainText("Stream complete.");
  expect(sessionFromUrl(page.url())).toBe(session);
  await expect(page.locator(".message.user")).toHaveText(prompt);
  await expect(composer).toHaveAttribute("data-route-composer", "persistent");
  await expect(composer).toHaveValue("Draft survives screen navigation");
  await page.goForward();
  await expect(plugin.locator(".scheduled-page")).toBeVisible();
  await expect(plugin.getByRole("combobox", { name: "Job status", exact: true })).toHaveValue(
    "active",
  );
  await page.goBack();
  await page.reload();
  await expect(page.locator(".message.user")).toHaveText(prompt);
  await expect(page.locator(".message.assistant")).toContainText("Stream complete.");
  await page.screenshot({ path: info.outputPath("route-chat-restored.png") });
});
