import { randomUUID } from "node:crypto";
import { test, expect } from "./fixtures";
import { api, runtime } from "./helpers";
import { sessionFromUrl } from "../visual/login";

test("New Project Chat submits its first message and resumes its runtime choices", async ({
  page,
}, info) => {
  const workspace = runtime(
    "import pathlib,sys,json; p=pathlib.Path('/opt/data/workflow-tests')/sys.argv[1]; p.mkdir(parents=True); print(json.dumps(str(p)))",
    randomUUID(),
  );
  const made = await api(page, "/api/plugins/chathermes/projects/manage?profile=alpha", {
    action: "create",
    name: `First message ${randomUUID()}`,
    primary_path: workspace,
  });
  expect(made.status).toBe(200);
  const project = made.body.project.id;
  const preparations: { status: number; model?: string; provider?: string }[] = [];
  page.on("response", (response) => {
    if (!response.url().includes("/chat/prepare")) return;
    const selection = response.request().postDataJSON();
    preparations.push({
      status: response.status(),
      model: selection.model,
      provider: selection.provider,
    });
  });
  await page.goto(
    `${new URL(page.url()).origin}/chathermes?profile=alpha#/projects/${encodeURIComponent(project)}?profile=alpha`,
  );
  await page.getByRole("button", { name: "Screen options", exact: true }).click();
  await page.getByRole("menuitem", { name: "New Project Chat", exact: true }).click();
  await expect.poll(() => sessionFromUrl(page.url())).toBeTruthy();
  const composer = page.getByRole("textbox", { name: "Message Hermes" });
  await composer.fill(`[workflow-stream] ${randomUUID()}`);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".message.assistant")).toContainText("Stream complete.");
  const stored = sessionFromUrl(page.url())!;
  expect(preparations).toEqual([
    { status: 200, model: "chathermes-test", provider: "custom:workflow-legacy" },
  ]);
  expect(new URL(page.url()).hash).toContain(`project=${encodeURIComponent(project)}`);
  expect(
    (await api(page, `/api/plugins/chathermes/chat/sessions/${stored}/membership?profile=alpha`))
      .status,
  ).toBe(200);
  expect(
    (await api(page, `/api/plugins/chathermes/chat/sessions/${stored}/membership?profile=beta`))
      .status,
  ).toBe(404);
  await page.screenshot({ path: info.outputPath("project-first-message.png") });
  await page.reload();
  const picker = page.getByRole("button", { name: "Choose model", exact: true });
  await expect(picker).toContainText("chathermes-test");
  await composer.fill(`[workflow-stream] ${randomUUID()}`);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".message.assistant")).toHaveCount(2);
  await expect(page.locator(".message.assistant").last()).toContainText("Stream complete.");
  expect(sessionFromUrl(page.url())).toBe(stored);
  expect(preparations).toEqual(
    Array(2).fill({ status: 200, model: "chathermes-test", provider: "custom:workflow-legacy" }),
  );
  await composer.fill("Project draft remains editable");
  await expect(composer).toBeFocused();
  await page.screenshot({ path: info.outputPath("project-resumed.png") });
});
