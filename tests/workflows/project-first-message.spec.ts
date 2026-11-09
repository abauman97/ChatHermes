import { randomUUID } from "node:crypto";
import { test, expect } from "./fixtures";
import { api, runtime } from "./helpers";
import { sessionFromUrl } from "../visual/login";

for (const entry of ["project composer", "New Project Chat", "direct draft link"]) {
  test(`${entry} submits its first message and resumes its runtime choices`, async ({
    page,
  }, info) => {
    const workspace = runtime(
      "import pathlib,sys,json; p=pathlib.Path('/opt/data/workflow-tests')/sys.argv[1]; p.mkdir(parents=True); print(json.dumps(str(p)))",
      randomUUID(),
    );
    let projectName = `First message ${randomUUID()}`;
    const made = await api(page, "/api/plugins/chathermes/projects/manage?profile=alpha", {
      action: "create",
      name: projectName,
      primary_path: workspace,
    });
    expect(made.status).toBe(200);
    const project = made.body.project.id;
    const projectCreations: string[] = [];
    page.on("request", (request) => {
      if (request.method() === "POST" && request.url().includes("/projects/session?"))
        projectCreations.push(request.url());
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
      `${new URL(page.url()).origin}/chathermes?profile=alpha#/projects/${encodeURIComponent(project)}${entry === "direct draft link" ? "/new" : ""}?profile=alpha`,
    );
    await expect(page.locator(".chathermes-embedded #prompt")).toBeVisible();
    await expect(page.locator(".header-title")).toHaveText(
      entry === "direct draft link" ? "New chat" : "Projects",
    );
    await expect(page.locator(".header-project-subtitle")).toHaveText(projectName);
    expect(sessionFromUrl(page.url())).toBeFalsy();
    await page.screenshot({ path: info.outputPath("fresh-project-composer.png") });
    if (entry !== "project composer") {
      if (entry === "New Project Chat") {
        await page.getByRole("button", { name: "Screen options", exact: true }).click();
        await page.getByRole("menuitem", { name: "New Project Chat", exact: true }).click();
      }
      await expect
        .poll(() => new URL(page.url()).hash.split("?")[0])
        .toBe(`#/projects/${encodeURIComponent(project)}/new`);
      expect(sessionFromUrl(page.url())).toBeFalsy();
      await expect(page.locator(".header-title")).toHaveText("New chat");
      await expect(page.locator(".header-project-subtitle")).toHaveText(projectName);
      await expect(page.locator("#prompt")).toHaveAttribute(
        "placeholder",
        `Message ${projectName}`,
      );
      await expect(page.locator(".message")).toHaveCount(0);
      await page.locator("#prompt").fill("Unsent draft text");
      await page.reload();
      await expect(page.locator("#prompt")).toHaveValue("");
      await expect(page.locator(".header-project-subtitle")).toHaveText(projectName);
      await page.locator("#prompt").focus();
      await expect(page.locator("#prompt")).toBeFocused();
      await page.screenshot({ path: info.outputPath("new-project-chat-before-send.png") });
      expect(sessionFromUrl(page.url())).toBeFalsy();
      expect(projectCreations).toHaveLength(0);
    }
    const composer = page.getByRole("textbox", { name: "Message Hermes" });
    let releaseCreation!: () => void;
    let creationRequested!: () => void;
    const heldCreation = new Promise<void>((resolve) => {
      releaseCreation = resolve;
    });
    const requestedCreation = new Promise<void>((resolve) => {
      creationRequested = resolve;
    });
    if (entry === "direct draft link") {
      // Delay only transport; the authenticated handler and native creation still run.
      await page.route(
        "**/projects/session?*",
        async (route) => {
          creationRequested();
          await heldCreation;
          await route.continue();
        },
        { times: 1 },
      );
    }
    await composer.fill(`[workflow-stream] ${randomUUID()}`);
    await page.getByRole("button", { name: "Send message", exact: true }).click();
    if (entry === "direct draft link") {
      await requestedCreation;
      await page.getByRole("button", { name: "Attachment options", exact: true }).click();
      await page.getByRole("button", { name: "Plan mode", exact: true }).click();
      await page.locator('input[aria-label="Upload files"]').setInputFiles({
        name: "follow-up.txt",
        mimeType: "text/plain",
        buffer: Buffer.from("Follow-up attachment"),
      });
      await expect(page.getByText("Preparing attachments…", { exact: true })).toHaveCount(0);
      await composer.fill("  Follow-up typed while creating  ");
      await expect(composer).toBeFocused();
      releaseCreation();
      await expect.poll(() => sessionFromUrl(page.url())).toBeTruthy();
      await expect(composer).toHaveValue("  Follow-up typed while creating  ");
      await expect(composer).toBeFocused();
      await expect(
        page.getByRole("button", { name: "Remove follow-up.txt", exact: true }),
      ).toBeVisible();
      await expect(page.getByText("Plan mode · next message")).toBeVisible();
      await composer.fill("Latest edit during canonical attachment");
    }
    await expect(page.locator(".message.assistant")).toContainText("Stream complete.");
    if (entry === "direct draft link") {
      await expect(composer).toHaveValue("Latest edit during canonical attachment");
      await expect(composer).toBeFocused();
      await expect(
        page.getByRole("button", { name: "Remove follow-up.txt", exact: true }),
      ).toBeVisible();
      await page.screenshot({ path: info.outputPath("slow-creation-follow-up.png") });
    }
    const stored = sessionFromUrl(page.url())!;
    expect(projectCreations).toHaveLength(1);
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
    if (entry === "New Project Chat") {
      const destinationPath = runtime(
        "import pathlib,sys,json; p=pathlib.Path('/opt/data/workflow-tests')/sys.argv[1]; p.mkdir(parents=True); print(json.dumps(str(p)))",
        randomUUID(),
      );
      projectName = `Moved chat ${randomUUID()}`;
      const destination = await api(page, "/api/plugins/chathermes/projects/manage?profile=alpha", {
        action: "create",
        name: projectName,
        primary_path: destinationPath,
      });
      expect(destination.status).toBe(200);
      const moved = await api(
        page,
        `/api/plugins/chathermes/api/sessions/${stored}/project?profile=alpha`,
        { project_id: destination.body.project.id },
      );
      expect(moved.status).toBe(200);
      expect(sessionFromUrl(page.url())).toBe(stored);
    }
    await page.reload();
    const picker = page.getByRole("button", { name: "Choose model", exact: true });
    await expect(picker).toContainText("chathermes-test");
    await expect(page.locator(".header-project-subtitle")).toHaveText(projectName);
    await composer.fill(`[workflow-stream] ${randomUUID()}`);
    await page.getByRole("button", { name: "Send message", exact: true }).click();
    await expect(page.locator(".message.assistant")).toHaveCount(2);
    await expect(page.locator(".message.assistant").last()).toContainText("Stream complete.");
    await expect(page.locator(".header-project-subtitle")).toHaveText(projectName);
    expect(sessionFromUrl(page.url())).toBe(stored);
    expect(preparations).toEqual(
      Array(2).fill({ status: 200, model: "chathermes-test", provider: "custom:workflow-legacy" }),
    );
    await composer.fill("Project draft remains editable");
    await expect(composer).toBeFocused();
    await page.screenshot({ path: info.outputPath("project-resumed.png") });
  });
}

test("failed draft preparation preserves attachments for retry and cannot refill a later draft", async ({
  page,
}, info) => {
  const workspace = runtime(
    "import pathlib,sys,json; p=pathlib.Path('/opt/data/workflow-tests')/sys.argv[1]; p.mkdir(parents=True); print(json.dumps(str(p)))",
    randomUUID(),
  );
  const made = await api(page, "/api/plugins/chathermes/projects/manage?profile=alpha", {
    action: "create",
    name: `Draft recovery ${randomUUID()}`,
    primary_path: workspace,
  });
  expect(made.status).toBe(200);
  const draft = `/projects/${encodeURIComponent(made.body.project.id)}/new?profile=alpha`;
  await page.goto(`${new URL(page.url()).origin}/chathermes?profile=alpha#${draft}`);
  const composer = page.getByRole("textbox", { name: "Message Hermes" });
  const send = page.getByRole("button", { name: "Send message", exact: true });
  await expect(composer).toBeVisible();
  const text = `[workflow-stream] ${randomUUID()}`;
  await composer.fill(text);
  await page.locator('input[aria-label="Upload files"]').setInputFiles({
    name: "recovery.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("Draft recovery attachment"),
  });
  await expect(send).toBeEnabled();
  // Keep the real authenticated preparation handler: temporarily move only this
  // test's empty workspace so Hermes reports its unavailable-workspace conflict.
  runtime(
    "import pathlib,sys,json; p=pathlib.Path(sys.argv[1]); p.rename(str(p)+'-unavailable'); print(json.dumps(True))",
    workspace,
  );
  const failedPreparation = page.waitForResponse(
    (response) => response.url().includes("/projects/session?") && response.status() === 409,
  );
  await send.click();
  await failedPreparation;
  await expect(composer).toHaveValue(text);
  await expect(
    page.getByRole("button", { name: "Remove recovery.txt", exact: true }),
  ).toBeVisible();
  await expect(send).toBeEnabled();
  expect(sessionFromUrl(page.url())).toBeFalsy();
  await composer.focus();
  await expect(composer).toBeFocused();
  await page.screenshot({ path: info.outputPath("draft-preparation-recovered.png") });
  runtime(
    "import pathlib,sys,json; p=pathlib.Path(sys.argv[1]); pathlib.Path(str(p)+'-unavailable').rename(p); print(json.dumps(True))",
    workspace,
  );
  await send.click();
  await expect(page.locator(".message.assistant")).toContainText("Stream complete.");
  expect(sessionFromUrl(page.url())).toBeTruthy();
  await expect(composer).toHaveValue("");
  await expect(page.getByRole("button", { name: "Remove recovery.txt", exact: true })).toHaveCount(
    0,
  );

  await page.evaluate((hash) => {
    location.hash = hash;
  }, draft);
  await expect.poll(() => new URL(page.url()).hash).toBe(`#${draft}`);
  await expect(composer).toBeVisible();
  await composer.fill("Abandoned first send");
  runtime(
    "import pathlib,sys,json; p=pathlib.Path(sys.argv[1]); p.rename(str(p)+'-unavailable'); print(json.dumps(True))",
    workspace,
  );
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  let arrived!: () => void;
  const requested = new Promise<void>((resolve) => {
    arrived = resolve;
  });
  await page.route(
    "**/projects/session?*",
    async (route) => {
      arrived();
      await held;
      await route.continue();
    },
    { times: 1 },
  );
  await expect(send).toBeEnabled();
  await send.click();
  await requested;
  await page.evaluate(() => {
    location.hash = "/?profile=alpha";
  });
  await expect.poll(() => new URL(page.url()).hash).toBe("#/?profile=alpha");
  await page.evaluate((hash) => {
    location.hash = hash;
  }, draft);
  await expect.poll(() => new URL(page.url()).hash).toBe(`#${draft}`);
  await composer.fill("New draft after navigation");
  const completed = page.waitForResponse(
    (response) => response.url().includes("/projects/session?") && response.status() === 409,
  );
  release();
  await completed;
  await expect(send).toBeEnabled();
  await expect(composer).toHaveValue("New draft after navigation");
  expect(sessionFromUrl(page.url())).toBeFalsy();
  await page.screenshot({ path: info.outputPath("draft-navigation-race.png") });
  runtime(
    "import pathlib,sys,json; p=pathlib.Path(sys.argv[1]); pathlib.Path(str(p)+'-unavailable').rename(p); print(json.dumps(True))",
    workspace,
  );
});
