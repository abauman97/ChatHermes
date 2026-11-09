import { randomUUID } from "node:crypto";
import { test, expect } from "./fixtures";
import { api, runtime } from "./helpers";
import { sessionFromUrl } from "../visual/login";

for (const entry of ["project home", "New Project Chat"]) {
  test(`${entry} submits its first message and resumes its runtime choices`, async ({
    page,
  }, info) => {
    const workspace = runtime(
      "import pathlib,sys,json; p=pathlib.Path('/opt/data/workflow-tests')/sys.argv[1]; p.mkdir(parents=True); print(json.dumps(str(p)))",
      randomUUID(),
    );
    const projectName = `First message ${randomUUID()}`;
    const made = await api(page, "/api/plugins/chathermes/projects/manage?profile=alpha", {
      action: "create",
      name: projectName,
      primary_path: workspace,
    });
    expect(made.status).toBe(200);
    const project = made.body.project.id;
    let creations = 0;
    page.on("request", (request) => {
      if (
        request.method() === "POST" &&
        /\/(?:projects\/session|chat\/sessions)\?/.test(request.url())
      )
        creations++;
    });
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
    await expect(page.locator(".project-home")).toBeVisible();
    await expect(page.locator(".header-title")).toHaveText("Projects");
    await expect(page.locator(".header-project-subtitle")).toHaveText(projectName);
    expect(sessionFromUrl(page.url())).toBeFalsy();
    await page.screenshot({ path: info.outputPath("fresh-project-composer.png") });
    if (entry === "New Project Chat") {
      await page.getByRole("button", { name: "Screen options", exact: true }).click();
      await page.getByRole("menuitem", { name: "New Project Chat", exact: true }).click();
      expect(sessionFromUrl(page.url())).toBeFalsy();
    } else
      await page
        .locator(".project-home")
        .getByRole("button", { name: "New chat", exact: true })
        .click();
    await expect(page).toHaveURL(/#\/\?profile=alpha&project=/);
    await expect(page.locator(".header-title")).toHaveText("New chat");
    await expect(page.locator(".header-project-subtitle")).toHaveText(projectName);
    expect(sessionFromUrl(page.url())).toBeFalsy();
    await page.reload();
    await expect(page.locator(".header-project-subtitle")).toHaveText(projectName);
    await page.screenshot({ path: info.outputPath("scoped-home-refreshed.png") });
    expect(creations).toBe(0);
    const composer = page.getByRole("textbox", { name: "Message Hermes" });
    await composer.fill(`[workflow-stream] ${randomUUID()}`);
    await page.getByRole("button", { name: "Send message", exact: true }).click();
    await expect(page.locator(".message.assistant")).toContainText("Stream complete.");
    const stored = sessionFromUrl(page.url())!;
    expect(creations).toBe(1);
    expect(preparations).toEqual([
      { status: 200, model: "chathermes-test", provider: "custom:workflow-legacy" },
    ]);
    expect(new URL(page.url()).hash).not.toContain("project=");
    await expect(page.locator(".header-project-subtitle")).toHaveText(projectName);
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
}

test("scoped Home preserves failed drafts, resets New chat, and isolates profile navigation", async ({
  page,
}, info) => {
  const workspace = runtime(
    "import pathlib,sys,json; p=pathlib.Path('/opt/data/workflow-tests')/sys.argv[1]; p.mkdir(parents=True); print(json.dumps(str(p)))",
    randomUUID(),
  );
  const name = `Draft failure ${randomUUID()}`;
  const made = await api(page, "/api/plugins/chathermes/projects/manage?profile=alpha", {
    action: "create",
    name,
    primary_path: workspace,
  });
  expect(made.status).toBe(200);
  const origin = new URL(page.url()).origin;
  const home = `${origin}/chathermes?profile=alpha#/?profile=alpha&project=${encodeURIComponent(made.body.project.id)}`;
  await page.goto(home);
  const composer = page.getByRole("textbox", { name: "Message Hermes" });
  await expect(page.locator(".header-project-subtitle")).toHaveText(name);
  await composer.fill("Reset this draft");
  await page.getByRole("button", { name: "Screen options", exact: true }).click();
  await page.getByRole("menuitem", { name: "New chat", exact: true }).click();
  await expect(composer).toHaveValue("");
  expect(sessionFromUrl(page.url())).toBeFalsy();
  await expect(page.locator(".header-project-subtitle")).toHaveText(name);
  const uploaded = page.waitForResponse(
    (response) => response.url().includes("/uploads") && response.request().method() === "POST",
  );
  await page.locator('input[aria-label="Upload files"]').setInputFiles({
    name: "retained.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("Synthetic retained draft attachment"),
  });
  expect((await uploaded).status()).toBe(201);
  await expect(page.locator(".composer")).toContainText("retained.txt");
  // Remove only this test's empty workspace, causing real server validation to fail.
  runtime(
    "import pathlib,sys,json; pathlib.Path(sys.argv[1]).rmdir(); print(json.dumps(True))",
    workspace,
  );
  const draft = `[workflow-stream] ${randomUUID()}`;
  await composer.fill(draft);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Request failed (409)");
  await expect(composer).toHaveValue(draft);
  await expect(page.locator(".composer")).toContainText("retained.txt");
  expect(sessionFromUrl(page.url())).toBeFalsy();
  await composer.focus();
  await expect(composer).toBeFocused();
  await page.screenshot({ path: info.outputPath("failed-draft-preserved.png") });
  runtime(
    "import pathlib,sys,json; pathlib.Path(sys.argv[1]).mkdir(); print(json.dumps(True))",
    workspace,
  );
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".message.assistant")).toContainText("Stream complete.");
  const sessionURL = page.url();
  expect(sessionFromUrl(sessionURL)).toBeTruthy();
  await page.goto(home);
  await expect(composer).toHaveValue("");
  await expect(page.locator(".header-project-subtitle")).toHaveText(name);
  await page.goto(
    `${origin}/chathermes?profile=beta#/?profile=beta&project=${encodeURIComponent(made.body.project.id)}`,
  );
  await expect(page.getByRole("alert")).toContainText("Project no longer exists");
  await composer.fill("Editable in another profile");
  await expect(composer).toBeFocused();
  await expect(page.getByRole("button", { name: "Send message", exact: true })).toBeDisabled();
  expect(sessionFromUrl(page.url())).toBeFalsy();
  await page.goto(sessionURL);
  await expect(page.locator(".message.assistant")).toContainText("Stream complete.");
  await expect(composer).toHaveValue("");
  await page.screenshot({ path: info.outputPath("returned-session.png") });
});

for (const rejected of [false, true]) {
  test(`pending first Send retains follow-up and ${rejected ? "rejected original" : "successful handoff"}`, async ({
    page,
  }, info) => {
    const workspace = runtime(
      "import pathlib,sys,json; p=pathlib.Path('/opt/data/workflow-tests')/sys.argv[1]; p.mkdir(parents=True); print(json.dumps(str(p)))",
      randomUUID(),
    );
    const made = await api(page, "/api/plugins/chathermes/projects/manage?profile=alpha", {
      action: "create",
      name: `Pending draft ${randomUUID()}`,
      primary_path: workspace,
    });
    expect(made.status).toBe(200);
    await page.goto(
      `${new URL(page.url()).origin}/chathermes?profile=alpha#/?profile=alpha&project=${encodeURIComponent(made.body.project.id)}`,
    );
    const composer = page.getByRole("textbox", { name: "Message Hermes" });
    await expect(page.locator(".header-project-subtitle")).toContainText("Pending draft");
    async function attach(name: string) {
      const uploaded = page.waitForResponse(
        (r) => r.url().includes("/uploads") && r.request().method() === "POST",
      );
      await page
        .locator('input[aria-label="Upload files"]')
        .setInputFiles({ name, mimeType: "text/plain", buffer: Buffer.from(name) });
      expect((await uploaded).status()).toBe(201);
    }
    await attach("original.txt");
    if (rejected)
      runtime(
        "import pathlib,sys,json; pathlib.Path(sys.argv[1]).rmdir(); print(json.dumps(True))",
        workspace,
      );
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    let arrived!: () => void;
    const pending = new Promise<void>((resolve) => {
      arrived = resolve;
    });
    // Delay the real authenticated response; preserve its status and body.
    await page.route("**/api/plugins/chathermes/projects/session?*", async (route) => {
      const response = await route.fetch();
      arrived();
      await gate;
      await route.fulfill({ response });
    });
    const original =
      "[workflow-stream] Original prompt" +
      (rejected ? "\nLong rejected message line.".repeat(20) : "");
    await composer.fill(original);
    await page.getByRole("button", { name: "Send message", exact: true }).click();
    await pending;
    const exact = "  Follow-up draft\nwith whitespace  ";
    await composer.fill(exact);
    await attach("follow-up.txt");
    await composer.focus();
    release();
    if (rejected) {
      await expect(page.getByRole("alert")).toContainText("Request failed (409)");
      await page.locator(".composer details summary").click();
      await expect(page.locator(".composer details")).toContainText("Original prompt");
      await expect(page.locator(".composer details")).toContainText("original.txt");
      await expect(page.getByRole("button", { name: "Restore unsent message" })).toBeDisabled();
    } else {
      await expect(page).toHaveURL(/#\/chat\//);
      await expect(page.locator(".message.assistant")).toContainText("Stream complete.");
    }
    await expect(composer).toHaveValue(exact);
    await expect(composer).toBeInViewport({ ratio: 1 });
    await expect(composer).toBeFocused();
    await expect(page.getByRole("button", { name: "Remove follow-up.txt" })).toBeVisible();
    await page.screenshot({ path: info.outputPath("pending-draft-retained.png") });
    if (rejected) {
      await composer.fill("");
      await page.getByRole("button", { name: "Remove follow-up.txt" }).click();
      await page.getByRole("button", { name: "Restore unsent message" }).click();
      await expect(composer).toHaveValue(original);
      await expect(composer).toBeFocused();
      await expect(composer).toBeInViewport({ ratio: 1 });
      await expect(page.getByRole("button", { name: "Send message", exact: true })).toBeInViewport({
        ratio: 1,
      });
      await expect(page.getByRole("button", { name: "Remove original.txt" })).toBeVisible();
      await page.screenshot({ path: info.outputPath("rejected-draft-restored.png") });
    }
  });
}
