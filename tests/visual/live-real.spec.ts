import { expect, test } from "@playwright/test";
import { signIn } from "./login";

test("disposable dashboard composer, attachments and real native response", async ({
  page,
}, info) => {
  test.setTimeout(180_000);
  await signIn(page);
  const plugin = page.locator(".chathermes-embedded");
  const composer = plugin.locator(".composer");
  const area = composer.getByRole("textbox", { name: "Message Hermes" });
  const send = composer.getByRole("button", { name: "Send message", exact: true });
  const picker = composer.getByRole("button", { name: "Choose model", exact: true });
  await expect(plugin).toBeVisible();
  if (info.project.name === "mobile")
    await plugin.getByRole("button", { name: "Open navigation", exact: true }).click();
  const profile = plugin.getByRole("combobox", { name: "Profile", exact: true });
  await profile.selectOption("default");
  await expect(profile).toHaveValue("default");
  await area.click();
  await expect(area).toBeFocused();
  await expect(area).toHaveCSS("font-size", "16px");
  await expect(send).toBeDisabled();
  await area.fill(Array.from({ length: 12 }, (_, index) => `row ${index}`).join("\n"));
  const metrics = await area.evaluate((element) => ({
    height: element.clientHeight,
    scroll: element.scrollHeight,
  }));
  expect(metrics.scroll).toBeGreaterThan(metrics.height);
  await area.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  expect(await area.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await page.screenshot({ path: info.outputPath("composer-focused.png") });
  if (info.project.name === "mobile") {
    const viewport = page.viewportSize()!;
    await page.setViewportSize({ width: viewport.width, height: 420 });
    await expect(area).toBeFocused();
    const box = (await composer.boundingBox())!;
    expect(box.y + box.height).toBeLessThanOrEqual(420);
    await page.screenshot({ path: info.outputPath("composer-short-viewport.png") });
    await page.setViewportSize(viewport);
  }
  await area.fill("");
  await area.evaluate((element) => element.blur());
  await picker.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.screenshot({ path: info.outputPath("model-picker.png") });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await composer.getByRole("button", { name: "Attachment options" }).click();
  await expect(page.getByRole("button", { name: "Take a photo", exact: true })).toBeVisible();
  await composer.locator('input[aria-label="Upload files"]').setInputFiles({
    name: "smoke.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("Synthetic dashboard attachment"),
  });
  await expect(composer).toContainText("smoke.txt");
  await composer.getByRole("button", { name: "Remove smoke.txt" }).click();
  const camera = await page.screenshot();
  await composer.locator("input[capture]").setInputFiles({
    name: "camera.png",
    mimeType: "image/png",
    buffer: camera,
  });
  await expect(composer.locator("img")).toBeVisible();
  await page.screenshot({ path: info.outputPath("camera-attachment.png") });
  await composer.getByRole("button", { name: "Remove camera.png" }).click();

  const uploaded = page.waitForResponse(
    (response) => response.url().includes("/uploads") && response.request().method() === "POST",
  );
  await composer.locator('input[aria-label="Upload files"]').setInputFiles({
    name: "smoke.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("Synthetic dashboard attachment"),
  });
  const prompt =
    "Use the terminal tool to run printf chathermes-smoke-ok, then reply briefly with its output.";
  await area.fill(prompt);
  expect((await uploaded).status()).toBe(201);
  await expect(send).toBeEnabled();
  await send.click();
  await expect(plugin.locator(".message.user").last()).toContainText(prompt);
  await area.fill("draft while responding");
  await expect(area).toBeFocused();
  await expect(plugin.locator(".work-summary").last()).toBeVisible({ timeout: 60_000 });
  await page.screenshot({ path: info.outputPath("streaming.png") });
  await expect(plugin.locator(".message.assistant").last()).toContainText("chathermes-smoke-ok", {
    timeout: 120_000,
  });
  await expect(send).toBeEnabled({ timeout: 120_000 });
  await expect(area).toHaveValue("draft while responding");
  await expect(plugin.locator(".activity[open]")).toHaveCount(0);
  await plugin.locator(".work-summary").last().click();
  const tool = plugin
    .locator(".activity")
    .filter({ has: page.locator("pre", { hasText: "terminal" }) })
    .last();
  await tool.locator("summary").click();
  await expect(tool.locator("pre")).toBeVisible();
  await expect(tool.locator("pre")).toContainText("chathermes-smoke-ok");
  await page.screenshot({ path: info.outputPath("completed.png") });
});

test("native artifact cards preview, download and survive history reconstruction", async ({
  page,
}, info) => {
  test.setTimeout(240_000);
  await signIn(page);
  const plugin = page.locator(".chathermes-embedded");
  const area = plugin.getByRole("textbox", { name: "Message Hermes" });
  const send = plugin.getByRole("button", { name: "Send message", exact: true });
  await area.click();
  await expect(area).toBeFocused();
  const filename = `artifact-${info.project.name}.txt`;
  const imageName = `artifact-${info.project.name}.png`;
  const pdfName = `artifact-${info.project.name}.pdf`;
  const codeName = `artifact-code-filter-${info.project.name}.py`;
  const stream = "BT /F1 18 Tf 32 80 Td (Hermes PDF artifact) Tj ET";
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 320 160] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 6\n0000000000 65535 f \n${offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`)
    .join("")}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const pdfUpload = await page.request.post("/api/plugins/chathermes/uploads", {
    data: {
      name: pdfName,
      type: "application/pdf",
      data: `data:application/pdf;base64,${Buffer.from(pdf).toString("base64")}`,
      size: Buffer.byteLength(pdf),
    },
  });
  expect(pdfUpload.status()).toBe(201);
  const pdfPath = (await pdfUpload.json()).path;
  const data = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 160;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#3176d1";
    ctx.fillRect(0, 0, 240, 160);
    ctx.fillStyle = "white";
    ctx.font = "24px sans-serif";
    ctx.fillText("Hermes artifact", 24, 86);
    return canvas.toDataURL("image/png");
  });
  // Stage through the public authenticated API, then ask the real runtime to
  // return native server file references. No browser interception or fixtures.
  const staged = await page.request.post("/api/plugins/chathermes/uploads", {
    data: { name: imageName, type: "image/png", data, size: 1 },
  });
  expect(staged.status()).toBe(201);
  const imagePath = (await staged.json()).path;
  await plugin.locator('input[aria-label="Upload files"]').setInputFiles({
    name: filename,
    mimeType: "text/plain",
    buffer: Buffer.from("Native artifact preview verification"),
  });
  await expect(send).toBeEnabled();
  await expect(plugin.locator(".message.user")).toHaveCount(0);
  await plugin.locator(".header-title").dispatchEvent("dragenter", {
    dataTransfer: await page.evaluateHandle(() => {
      const data = new DataTransfer();
      data.items.add(new File(["Dragged attachment"], "dragged.txt", { type: "text/plain" }));
      return data;
    }),
  });
  await expect(
    plugin.getByRole("status").filter({ hasText: "Drop files to attach" }),
  ).toBeVisible();
  const dragged = await page.evaluateHandle(() => {
    const data = new DataTransfer();
    data.items.add(new File(["Dragged attachment"], "dragged.txt", { type: "text/plain" }));
    return data;
  });
  await plugin.locator(".header-title").dispatchEvent("drop", { dataTransfer: dragged });
  await expect(plugin.locator(".composer")).toContainText("dragged.txt");
  await expect(plugin.locator(".message.user")).toHaveCount(0);
  await plugin.getByRole("button", { name: "Remove dragged.txt" }).click();
  const prompt = `Use terminal to create /opt/data/${filename} containing exactly 'Generated artifact verification' and /opt/data/${codeName} containing 'print(1)'. Then copy ${imagePath} to /opt/data/${imageName} and ${pdfPath} to /opt/data/${pdfName}. Reply with the plain text 'Modified /opt/data/${codeName}' followed by these three Markdown links exactly: [${filename}](sandbox:/opt/data/${filename}) , [${imageName}](sandbox:/opt/data/${imageName}), and [${pdfName}](sandbox:/opt/data/${pdfName}). Do not emit MEDIA or a link for the Python file. Do not read the files.`;
  await area.fill(prompt);
  await send.click();
  await area.fill("Draft remains available");
  await area.click();
  await expect(area).toBeFocused();
  await expect(plugin.locator(".message.assistant").last()).toContainText(filename, {
    timeout: 180_000,
  });
  // Refill after the response arrives so the send-enabled assertion always
  // checks a nonempty composer after the mobile submission/layout transition.
  await area.fill("Draft remains available");
  await area.click();
  await expect(area).toBeFocused();
  await expect(send).toBeEnabled({ timeout: 180_000 });
  await expect(plugin.locator(".message.assistant").last()).toContainText(codeName);
  await expect(plugin.locator(".artifact-card").filter({ hasText: codeName })).toHaveCount(0);
  const card = plugin
    .locator(".message.assistant .artifact-card")
    .filter({ hasText: filename })
    .first();
  await expect(card).toBeVisible();
  // Activate the accessible button directly: thumbnail arrival and composer
  // blur can move mobile tap coordinates while the transcript scrolls.
  await card.getByRole("button", { name: `Preview ${filename}` }).press("Enter");
  const dialog = plugin.locator("dialog[open]");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("pre")).toContainText("Generated artifact verification", {
    timeout: 30_000,
  });
  await page.screenshot({ path: info.outputPath("artifact-text-preview.png") });
  await dialog.getByRole("button", { name: "Close preview" }).click();
  const download = page.waitForEvent("download");
  await card.getByRole("link", { name: `Download ${filename}` }).click();
  expect((await download).suggestedFilename()).toBe(filename);
  const image = plugin
    .locator(".message.assistant .artifact-card")
    .filter({ hasText: imageName })
    .first();
  await expect(image.locator("img").first()).toBeVisible();
  await image
    .getByRole("button", { name: `Preview ${imageName}` })
    .first()
    .click();
  await expect(plugin.locator("dialog[open] img")).toBeVisible({ timeout: 30_000 });
  await page.screenshot({ path: info.outputPath("artifact-image-preview.png") });
  await plugin.locator("dialog[open]").getByRole("button", { name: "Close preview" }).click();
  const pdfCard = plugin
    .locator(".message.assistant .artifact-card")
    .filter({ hasText: pdfName })
    .first();
  await pdfCard.getByRole("button", { name: `Preview ${pdfName}` }).click();
  await expect(plugin.locator("dialog[open] iframe")).toBeVisible({ timeout: 30_000 });
  // The browser's PDF plugin paints after the frame itself becomes visible.
  await page.waitForTimeout(2000);
  await page.screenshot({ path: info.outputPath("artifact-pdf-preview.png") });
  await plugin.locator("dialog[open]").getByRole("button", { name: "Close preview" }).click();
  await page.screenshot({ path: info.outputPath("artifact-timeline.png") });
  const sessionId = new URL(page.url()).searchParams.get("session");
  expect(sessionId).toBeTruthy();
  await page.reload();
  await expect(
    plugin.locator(".message.assistant .artifact-card").filter({ hasText: filename }).first(),
  ).toBeVisible();
  if (info.project.name === "mobile")
    await plugin.getByRole("button", { name: "Open navigation", exact: true }).click();
  await plugin.locator(".artifacts-nav").click();
  const browser = plugin.getByRole("region", { name: "Artifacts", exact: true });
  await expect(browser).toContainText(filename);
  await expect(browser).toContainText("Uploaded");
  await expect(browser).toContainText("Generated");
  await expect(browser.locator(".artifact-card").filter({ hasText: codeName })).toHaveCount(0);
  await page.screenshot({ path: info.outputPath("artifacts-browser.png") });
  await browser
    .getByRole("button", { name: `Delete ${filename}`, exact: true })
    .last()
    .click();
  await expect(plugin.getByRole("dialog", { name: "Delete artifact" })).toBeVisible();
  await plugin.getByRole("button", { name: "Cancel", exact: true }).click();
  const deletedUrl = await browser
    .locator(".artifact-card")
    .filter({ hasText: filename })
    .last()
    .getByRole("link", { name: `Download ${filename}` })
    .getAttribute("href");
  await browser
    .getByRole("button", { name: `Delete ${filename}`, exact: true })
    .last()
    .click();
  await plugin.getByRole("button", { name: "Delete file", exact: true }).click();
  await expect(plugin.getByRole("dialog", { name: "Delete artifact" })).not.toBeVisible();
  expect((await page.request.get(deletedUrl!)).status()).toBe(404);
  const project = await page.request.post("/api/plugins/chathermes/projects/manage", {
    data: { action: "create", name: `Artifact filter ${info.project.name}` },
  });
  expect(project.ok()).toBeTruthy();
  const projectId = (await project.json()).project.id;
  await page.goto(`/chathermes?project=${encodeURIComponent(projectId)}&view=project-artifacts`);
  await expect(
    plugin
      .getByRole("navigation", { name: "Project view" })
      .getByRole("button", { name: "Artifacts", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(plugin.getByRole("region", { name: "Artifacts", exact: true })).toContainText(
    "No artifacts found.",
  );
  await expect(plugin.getByRole("region", { name: "Artifacts", exact: true })).not.toContainText(
    filename,
  );
  await page.screenshot({ path: info.outputPath("project-artifacts-filter.png") });
});
