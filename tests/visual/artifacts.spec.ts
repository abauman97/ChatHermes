import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { signIn } from "./login";
const png = readFileSync(new URL("../../public/icons/icon-192.png", import.meta.url));
test("native attachments, generated artifacts, reload, preview and deletion", async ({
  page,
}, info) => {
  test.setTimeout(240_000);
  await signIn(page);
  const workspace = info.project.name === "desktop" ? "/tmp" : "/opt/chathermes";
  const findWorkspace = async () => {
    const response = await page.request.get("/api/plugins/chathermes/projects");
    expect(response.status()).toBe(200);
    const { projects } = (await response.json()) as {
      projects: { id: string; path?: string; archived?: boolean; isAuto?: boolean }[];
    };
    return projects.find(
      (project) => project.path === workspace && !project.archived && !project.isAuto,
    );
  };
  let project = await findWorkspace();
  if (!project) {
    const response = await page.request.post("/api/plugins/chathermes/projects/manage", {
      data: {
        action: "create",
        name: `Artifacts ${info.project.name}`,
        primary_path: workspace,
      },
    });
    expect([200, 409]).toContain(response.status());
    // A concurrent test or the native workspace index may already own the path.
    // Resolve the actual project rather than silently skipping the entire test.
    project = response.status() === 200 ? (await response.json()).project : await findWorkspace();
  }
  expect(project, "The artifact workspace must resolve to an active native project").toBeTruthy();
  const projectId = project!.id;
  await page.goto("/chathermes?project=" + encodeURIComponent(projectId) + "&view=project");
  const plugin = page.locator(".chathermes-embedded");
  const composer = plugin.locator(".composer");
  const area = composer.getByRole("textbox", { name: "Message Hermes" });
  const send = composer.getByRole("button", { name: "Send message", exact: true });
  await expect(plugin.getByRole("button", { name: "Choose model", exact: true })).toBeEnabled();
  await expect(plugin.getByRole("region", { name: "Selected Project" })).toContainText(
    "Workspace:",
  );
  await area.click();
  await expect(area).toBeFocused();
  await area.fill("Keep this draft while attaching");
  await expect(send).toBeEnabled({ timeout: 30_000 });
  const imageUpload = page.waitForResponse(
    (response) => response.url().includes("/attachments") && response.request().method() === "POST",
  );
  await composer.locator('input[aria-label="Upload files"]').setInputFiles([
    { name: "uploaded.png", mimeType: "image/png", buffer: png },
    {
      name: "proposal.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\n%%EOF"),
    },
  ]);
  const stagedImage = await imageUpload;
  expect(stagedImage.status()).toBe(201);
  const nativeImage = (await stagedImage.json()).reference as string;
  await expect(composer.getByRole("button", { name: "Remove proposal.pdf" })).toBeVisible({
    timeout: 60_000,
  });
  await expect(area).toHaveValue("Keep this draft while attaching");
  await expect(plugin.locator(".message.user")).toHaveCount(0);
  await composer.getByRole("button", { name: "Remove proposal.pdf" }).click();
  const data = await page.evaluateHandle(() => {
    const transfer = new DataTransfer();
    transfer.items.add(new File(["Synthetic attachment"], "notes.txt", { type: "text/plain" }));
    return transfer;
  });
  await plugin.locator(".app-shell").dispatchEvent("dragenter", { dataTransfer: data });
  await expect(
    page.getByRole("status", { name: "" }).filter({ hasText: "Drop files" }),
  ).toBeVisible();
  await page.screenshot({ path: info.outputPath("drop-overlay.png") });
  await plugin.locator(".app-shell").dispatchEvent("drop", { dataTransfer: data });
  await expect(composer.getByRole("button", { name: "Remove notes.txt" })).toBeVisible({
    timeout: 60_000,
  });
  await expect(plugin.locator(".message.user")).toHaveCount(0);
  await page.screenshot({ path: info.outputPath("pending-attachments.png") });
  const suffix = `${info.project.name}-${Date.now()}`;
  // The official hosted image limits dashboard reads/deletes to /opt/data.
  const generated = `/opt/data/chathermes-artifact-${suffix}.png`;
  await area.fill(
    `Use the terminal tool to run this exact command: cp '${nativeImage}' '${generated}' && printf artifact-ready. Then reply with artifact-ready and MEDIA:${generated} on a separate line. Do not use other tools.`,
  );
  await send.click();
  await expect(plugin.locator(".message.user")).toHaveCount(1);
  await area.fill("Draft while responding");
  await expect(area).toBeFocused();
  await expect(
    plugin.locator(".message.assistant").filter({ hasText: "artifact-ready" }).first(),
  ).toBeVisible({ timeout: 180_000 });
  await expect(send).toBeEnabled({ timeout: 120_000 });
  await expect(area).toHaveValue("Draft while responding");
  await expect(plugin.locator(".message.user img")).toBeVisible({ timeout: 30_000 });
  await expect(plugin.locator(".assistant-turn .artifact-attachment img")).toBeVisible({
    timeout: 30_000,
  });
  await expect
    .poll(() =>
      plugin
        .locator(".assistant-turn .artifact-attachment img")
        .evaluate((img: HTMLImageElement) => img.naturalWidth),
    )
    .toBeGreaterThan(0);
  await expect(plugin.locator(".transcript")).toBeVisible();
  await plugin.locator(".assistant-turn .artifact-attachment").scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath("thread-artifacts.png") });
  await page.reload();
  await expect(plugin.locator(".message.user img")).toBeVisible({ timeout: 30_000 });
  await expect(plugin.locator(".assistant-turn .artifact-attachment img")).toBeVisible({
    timeout: 30_000,
  });
  await plugin.getByRole("button", { name: "Preview uploaded.png", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.screenshot({ path: info.outputPath("image-preview.png") });
  await page.getByRole("button", { name: "Close preview" }).click();
  await expect(
    plugin.getByRole("button", { name: "Preview uploaded.png", exact: true }),
  ).toBeFocused();
  if (info.project.name === "mobile")
    await plugin.getByRole("button", { name: "Open navigation", exact: true }).click();
  await plugin.locator(".artifacts-nav").click();
  const browser = plugin.getByRole("region", { name: "Artifacts", exact: true });
  await expect(browser).toContainText("Uploaded", { timeout: 30_000 });
  await expect(browser).toContainText("Generated");
  await page.screenshot({ path: info.outputPath("global-artifacts.png") });
  const card = browser.locator("article").filter({ hasText: `chathermes-artifact-${suffix}.png` });
  const download = page.waitForEvent("download");
  await card.getByRole("link", { name: "Download" }).click();
  const downloaded = await download;
  expect(downloaded.suggestedFilename()).toBe(`chathermes-artifact-${suffix}.png`);
  expect(readFileSync((await downloaded.path())!)).toEqual(png);
  await card.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(card).toBeVisible();
  await card.getByRole("button", { name: "Delete", exact: true }).click();
  await page.getByRole("button", { name: "Delete file", exact: true }).click();
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await expect(card).toHaveCount(0);
  await page.goto(
    "/chathermes?project=" + encodeURIComponent(projectId) + "&view=project-artifacts",
  );
  const projectBrowser = plugin.getByRole("region", { name: "Artifacts", exact: true });
  await expect(projectBrowser).toContainText("uploaded.png", { timeout: 30_000 });
  const listed = await (
    await page.request.get(
      "/api/plugins/chathermes/artifacts?project_id=" + encodeURIComponent(projectId),
    )
  ).json();
  expect(listed.artifacts.length).toBeGreaterThan(0);
  expect(
    listed.artifacts.every((row: { project_id: string }) => row.project_id === projectId),
  ).toBe(true);
  await page.screenshot({ path: info.outputPath("project-artifacts.png") });
});
