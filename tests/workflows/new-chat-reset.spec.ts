import { randomUUID } from "node:crypto";
import { test, expect } from "./fixtures";
import { api, runtime } from "./helpers";
import { sessionFromUrl } from "../visual/login";

for (const { scope, action } of [
  { scope: "ordinary", action: "New chat" },
  { scope: "project", action: "New chat" },
  { scope: "project", action: "New Project Chat" },
]) {
  test(`explicit ${action} clears ${scope} drafts and ignores late uploads`, async ({
    page,
  }, info) => {
    if (scope === "project") {
      const workspace = runtime(
        "import pathlib,sys,json; p=pathlib.Path('/opt/data/workflow-tests')/sys.argv[1]; p.mkdir(parents=True); print(json.dumps(str(p)))",
        randomUUID(),
      );
      const made = await api(page, "/api/plugins/chathermes/projects/manage?profile=alpha", {
        action: "create",
        name: `Composer reset ${randomUUID()}`,
        primary_path: workspace,
      });
      expect(made.status).toBe(200);
      await page.goto(
        `${new URL(page.url()).origin}/chathermes?profile=alpha#/projects/${encodeURIComponent(made.body.project.id)}/new?profile=alpha`,
      );
    } else {
      await page.goto(`${new URL(page.url()).origin}/chathermes?profile=alpha#/?profile=alpha`);
    }
    const composer = page.getByRole("textbox", { name: "Message Hermes" });
    const send = page.getByRole("button", { name: "Send message", exact: true });
    await composer.fill(`[workflow-stream] ${randomUUID()}`);
    await send.click();
    await expect(page.locator(".message.assistant")).toContainText("Stream complete.");
    const original = sessionFromUrl(page.url());
    expect(original).toBeTruthy();
    await composer.fill("Private draft from the existing session");
    await composer.blur();
    await page.getByRole("button", { name: "Attachment options", exact: true }).click();
    await page.getByRole("button", { name: "Plan mode", exact: true }).click();
    let release!: () => void;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    let arrived!: () => void;
    const requested = new Promise<void>((resolve) => {
      arrived = resolve;
    });
    await page.route(
      "**/uploads?*",
      async (route) => {
        const response = await route.fetch();
        arrived();
        await held;
        await route.fulfill({ response });
      },
      { times: 1 },
    );
    await page.locator('input[aria-label="Upload files"]').setInputFiles({
      name: "old-draft.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("Old draft attachment"),
    });
    await requested;
    await expect(
      page.getByRole("button", { name: "Remove old-draft.txt", exact: true }),
    ).toBeVisible();
    await expect(page.getByText("Plan mode · next message")).toBeVisible();
    await page.screenshot({ path: info.outputPath("existing-session-draft.png") });
    await page.getByRole("button", { name: "Screen options", exact: true }).click();
    await page.getByRole("menuitem", { name: action, exact: true }).click();
    await expect.poll(() => sessionFromUrl(page.url())).not.toBe(original);
    if (action === "New chat") await expect.poll(() => sessionFromUrl(page.url())).toBeTruthy();
    else await expect.poll(() => new URL(page.url()).hash).toContain("/new?profile=alpha");
    await expect(composer).toHaveValue("");
    await expect(
      page.getByRole("button", { name: "Remove old-draft.txt", exact: true }),
    ).toHaveCount(0);
    await expect(page.getByText("Plan mode · next message")).toHaveCount(0);
    await expect(page.locator(".message")).toHaveCount(0);
    await composer.focus();
    await expect(composer).toBeFocused();
    await page.screenshot({ path: info.outputPath("explicit-new-chat-empty.png") });
    const uploaded = page.waitForResponse((response) => response.url().includes("/uploads?"));
    release();
    await uploaded;
    await composer.fill(`[workflow-stream] Clean new chat ${randomUUID()}`);
    await expect(send).toBeEnabled();
    await send.click();
    await expect(page.locator(".message.assistant")).toContainText("Stream complete.");
    await expect(page.locator(".message.user")).not.toContainText("/plan");
    await expect(page.locator(".message.user")).not.toContainText("old-draft.txt");
    await expect(
      page.getByRole("button", { name: "Remove old-draft.txt", exact: true }),
    ).toHaveCount(0);
    await composer.fill("New session stays editable");
    await expect(composer).toBeFocused();
    await page.screenshot({ path: info.outputPath("new-chat-after-late-upload.png") });
  });
}

for (const scope of ["ordinary", "project"]) {
  test(`late explicit New chat cannot replace a returned ${scope} draft`, async ({
    page,
  }, info) => {
    let destination = "/?profile=alpha";
    if (scope === "project") {
      const workspace = runtime(
        "import pathlib,sys,json; p=pathlib.Path('/opt/data/workflow-tests')/sys.argv[1]; p.mkdir(parents=True); print(json.dumps(str(p)))",
        randomUUID(),
      );
      const made = await api(page, "/api/plugins/chathermes/projects/manage?profile=alpha", {
        action: "create",
        name: `Late creation ${randomUUID()}`,
        primary_path: workspace,
      });
      expect(made.status).toBe(200);
      destination = `/projects/${encodeURIComponent(made.body.project.id)}/new?profile=alpha`;
    }
    await page.goto(`${new URL(page.url()).origin}/chathermes?profile=alpha#${destination}`);
    const composer = page.getByRole("textbox", { name: "Message Hermes" });
    const send = page.getByRole("button", { name: "Send message", exact: true });
    await composer.fill(`[workflow-stream] ${randomUUID()}`);
    await send.click();
    await expect(page.locator(".message.assistant")).toContainText("Stream complete.");
    const original = sessionFromUrl(page.url())!;
    const originalHash = new URL(page.url()).hash;
    await composer.fill("Abandoned old draft");
    let release!: () => void;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    let arrived!: () => void;
    const requested = new Promise<void>((resolve) => {
      arrived = resolve;
    });
    await page.route("**/api/sessions?profile=alpha", async (route) => {
      if (route.request().method() !== "POST") return route.continue();
      const response = await route.fetch();
      arrived();
      await held;
      await route.fulfill({ response });
    });
    await page.getByRole("button", { name: "Screen options", exact: true }).click();
    await page.getByRole("menuitem", { name: "New chat", exact: true }).click();
    await requested;
    await page.evaluate((hash) => {
      location.hash = hash;
    }, destination);
    await expect(composer).toHaveValue("");
    await page.evaluate((hash) => {
      location.hash = hash;
    }, originalHash);
    await expect(page.locator(".message.assistant")).toContainText("Stream complete.");
    const text = `[workflow-stream] Returned draft ${randomUUID()}`;
    await composer.fill(text);
    const completed = page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        response.url().includes("/api/sessions?profile=alpha"),
    );
    release();
    await completed;
    await expect(send).toBeEnabled();
    await send.click();
    await expect(page.locator(".message.assistant")).toHaveCount(2);
    await expect(page.locator(".message.assistant").last()).toContainText("Stream complete.");
    expect(sessionFromUrl(page.url())).toBe(original);
    await expect(page.locator(".message.user").last()).toHaveText(text);
    await composer.fill("Returned session remains editable");
    await expect(composer).toBeFocused();
    await page.screenshot({ path: info.outputPath("late-explicit-creation-ignored.png") });
  });
}
