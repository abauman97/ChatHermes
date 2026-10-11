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
  // Fast or repeated calls may already be summarized by the time the draft is
  // filled. The work block stays visible; settled individual rows may be hidden.
  await expect(
    plugin
      .locator(".turn-work")
      .filter({ has: page.locator(".activity") })
      .last(),
  ).toBeVisible({ timeout: 60_000 });
  await page.screenshot({ path: info.outputPath("streaming.png") });
  await expect(plugin.locator(".message.assistant").last()).toContainText("chathermes-smoke-ok", {
    timeout: 120_000,
  });
  await expect(send).toBeEnabled({ timeout: 120_000 });
  await expect(area).toHaveValue("draft while responding");
  await expect(plugin.locator(".activity[open]")).toHaveCount(0);
  const completedGroup = plugin.locator(".turn-work").last().locator(".work-summary");
  if (await completedGroup.isVisible()) await completedGroup.click();
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
  const cards = browser.locator(".artifact-card");
  const generatedCard = cards.filter({ hasText: filename }).last();
  await expect(generatedCard).toContainText("Generated");
  await expect(
    generatedCard.getByRole("button", { name: `Delete ${filename}`, exact: true }),
  ).toBeVisible();
  await expect(generatedCard.locator("button[title]")).toBeVisible();
  const firstBox = (await cards.nth(0).boundingBox())!;
  const secondBox = (await cards.nth(1).boundingBox())!;
  expect(firstBox.width).toBeLessThanOrEqual(320);
  if (info.project.name === "desktop") {
    expect(secondBox.y).toBe(firstBox.y);
    expect(secondBox.x).toBeGreaterThan(firstBox.x + firstBox.width);
  } else {
    expect(secondBox.x).toBe(firstBox.x);
    expect(secondBox.y).toBeGreaterThan(firstBox.y);
  }
  expect(await browser.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
    true,
  );
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

// Exercise the activity view through the real authenticated plugin/runtime.
// Keep a command running long enough to inspect disclosure and scroll state.
test("chronological activity streams and preserves disclosure choices", async ({ page }, info) => {
  test.setTimeout(180_000);
  await signIn(page);
  const plugin = page.locator(".chathermes-embedded");
  const area = plugin.getByRole("textbox", { name: "Message Hermes" });
  const send = plugin.getByRole("button", { name: "Send message", exact: true });
  await area.fill(
    "First say 'Starting activity check'. Then use terminal to run this exact command: for i in $(seq 1 60); do echo activity-line-$i; done; sleep 6; echo activity-done. Then use terminal again to run printf second-tool-done. Finally reply 'Activity check finished'. Do not combine the two terminal calls.",
  );
  await send.click();
  // Wait for the new-session composer mount before entering the next draft.
  await expect(plugin.locator(".message.user").last()).toContainText("Starting activity check");
  await area.fill("Draft stays focusable");
  await expect(area).toBeFocused();
  const active = plugin.locator(".current-activity .activity:not(.activity-thinking)").first();
  await expect(active).toBeVisible({ timeout: 60_000 });
  await expect(active).not.toHaveAttribute("open");
  await page.screenshot({ path: info.outputPath("activity-live-collapsed.png") });
  await active.locator("summary").click();
  await expect(active).toHaveAttribute("open", "");
  await expect(active.locator("pre")).toContainText("activity-line-", { timeout: 60_000 });
  await active.locator("summary").click();
  await expect(active).not.toHaveAttribute("open");
  await active.locator("summary").click();
  const group = active.locator("xpath=ancestor::section[contains(@class, 'turn-work')]");
  const groupSummary = group.locator(".work-summary");
  if (await groupSummary.isVisible()) {
    await groupSummary.click();
    await groupSummary.click(); // explicitly keep this multi-call run expanded
    await expect(groupSummary).toHaveAttribute("aria-expanded", "true");
  }
  await page.screenshot({ path: info.outputPath("activity-live.png") });
  await expect(send).toBeEnabled({ timeout: 120_000 });
  await expect(plugin.locator(".message.assistant").last()).toContainText(
    "Activity check finished",
  );
  await expect(area).toHaveValue("Draft stays focusable");
  const turn = plugin.locator(".assistant-turn").last();
  const tools = turn
    .locator(".turn-work .activity")
    .filter({ has: page.locator("pre", { hasText: "terminal" }) });
  // A real provider may retry a call. Compare with the authoritative persisted
  // call identities rather than assuming the model executes exactly twice.
  const sessionId = new URL(page.url()).searchParams.get("session")!;
  const saved = await page.request.get(
    `/api/plugins/chathermes/api/sessions/${encodeURIComponent(sessionId)}/messages?profile=default&limit=500&order=oldest&inline_images=false`,
  );
  expect(saved.ok()).toBeTruthy();
  const body = await saved.json();
  const history = Array.isArray(body) ? body : body.data || body.messages;
  const calls = history.flatMap(
    (message: { tool_calls?: { id?: string; function?: { name?: string } }[] }) =>
      (message.tool_calls || []).filter((call) => call.function?.name === "terminal"),
  );
  expect(calls.length).toBeGreaterThanOrEqual(2);
  expect(new Set(calls.map((call: { id: string }) => call.id)).size).toBe(calls.length);
  await expect(tools).toHaveCount(calls.length);
  await expect(tools.first()).toHaveAttribute("open", "");
  await expect(tools.first().locator("pre")).toContainText("activity-done");
  if (await groupSummary.isVisible())
    await expect(groupSummary).toHaveAttribute("aria-expanded", "true");
  // The intro precedes the tool run, and the answer follows it. Reasoning
  // between calls is allowed to split the ordinary run into separate groups.
  const order = await turn.locator(":scope > *").evaluateAll((elements) =>
    elements.map((element) => ({
      text: element.textContent || "",
      tool: element.classList.contains("turn-work"),
    })),
  );
  const firstTool = order.findIndex((row) => row.tool);
  expect(
    order.slice(0, firstTool).some((row) => row.text.includes("Starting activity check")),
  ).toBe(true);
  expect(
    order.slice(firstTool + 1).some((row) => row.text.includes("Activity check finished")),
  ).toBe(true);
  const transcript = plugin.locator(".transcript");
  await transcript.evaluate((element) => {
    element.scrollTop = 0;
  });
  const before = await transcript.evaluate((element) => element.scrollTop);
  // Toggle offscreen without Playwright scrolling the target into view.
  await tools.first().locator("summary").dispatchEvent("click");
  expect(await transcript.evaluate((element) => element.scrollTop)).toBe(before);
  await page.screenshot({ path: info.outputPath("activity-complete.png") });
  await page.reload();
  await expect(plugin.locator(".message.assistant").last()).toContainText(
    "Activity check finished",
  );
  await expect(
    plugin
      .locator(".turn-work .activity")
      .filter({ has: page.locator("pre", { hasText: "terminal" }) }),
  ).toHaveCount(calls.length);
  await expect(plugin.locator(".current-activity")).toHaveCount(0);
  // Retained reasoning has no native duration metadata. Replay must not invent
  // a duration based on how quickly the browser consumed historical events.
  const thoughtLabels = await plugin
    .locator(".assistant-turn > .activity summary")
    .allTextContents();
  expect(thoughtLabels.every((label) => !/\d+(?:\.\d+)?s/.test(label))).toBe(true);
  await page.screenshot({ path: info.outputPath("activity-history.png") });
});

// Deterministic grouped history inside the actual authenticated dashboard.
// Only the attach snapshot is substituted; real-provider tests above cover
// execution. This guarantees adjacent calls regardless of model prose choices.
test("desktop grouped history counts tools and commands with matching chevrons", async ({
  page,
}, info) => {
  await signIn(page);
  const created = await page.request.post("/api/plugins/chathermes/chat/sessions?profile=default", {
    data: {},
  });
  expect(created.ok()).toBeTruthy();
  const body = await created.json();
  const sessionId = (body.session || body).id;
  const call = (id: string, name: string, args = {}) => ({
    id,
    type: "function",
    function: { name, arguments: JSON.stringify(args) },
  });
  const toolResult = (row_id: string, id: string, name: string) => ({
    row_id,
    role: "tool",
    name,
    tool_call_id: id,
    content: JSON.stringify({ output: `Result ${id}`, exit_code: 0 }),
  });
  const messages = [
    { row_id: "u", role: "user", text: "Inspect grouped activity" },
    {
      row_id: "a",
      role: "assistant",
      reasoning: "Review the activity in order.",
      text: "Checking tools.",
      tool_calls: [call("t1", "custom_tool"), call("t2", "custom_tool")],
    },
    toolResult("r1", "t1", "custom_tool"),
    toolResult("r2", "t2", "custom_tool"),
    {
      row_id: "b",
      role: "assistant",
      text: "Checking commands next.",
      tool_calls: [
        call("c1", "terminal", { command: "pwd" }),
        call("c2", "terminal", { command: "git status --short" }),
        call("t3", "custom_tool"),
      ],
    },
    toolResult("r3", "c1", "terminal"),
    toolResult("r4", "c2", "terminal"),
    toolResult("r5", "t3", "custom_tool"),
    { row_id: "c", role: "assistant", text: "Finished." },
  ];
  // Recovery also refreshes authoritative REST history after attachment.
  await page.route(`**/sessions/${sessionId}/messages?*`, (route) =>
    route.fulfill({
      json: {
        data: messages.map((row) => ({
          ...row,
          id: row.row_id,
          content: "text" in row ? row.text : row.content,
          tool_name: "name" in row ? row.name : undefined,
        })),
      },
    }),
  );
  await page.routeWebSocket("**/api/plugins/chathermes/chat/ws?*", (socket) => {
    const server = socket.connectToServer();
    const attachIds = new Set<string>();
    socket.onMessage((message) => {
      const frame = JSON.parse(String(message));
      if (frame.method === "chat.attach") attachIds.add(frame.id);
      server.send(message);
    });
    server.onMessage((message) => {
      const frame = JSON.parse(String(message));
      if (attachIds.has(frame.id) && frame.result) {
        frame.result.messages = messages;
        frame.result.running = false;
        frame.result.queued = false;
        frame.result.inflight = null;
        frame.result.recovery = {
          ...frame.result.recovery,
          complete: false,
          through: 0,
          start: 0,
          base_row_ids: null,
        };
        socket.send(JSON.stringify(frame));
      } else socket.send(message);
    });
  });
  await page.goto(`/chathermes?session=${encodeURIComponent(sessionId)}`);
  const plugin = page.locator(".chathermes-embedded");
  const summaries = plugin.locator(".work-summary");
  await expect(summaries).toHaveCount(2);
  await expect(summaries.nth(0)).toContainText("Used 2 tools");
  await expect(summaries.nth(1)).toContainText("Ran 2 commands, used 1 tool");
  await expect(plugin.locator(".work-timeline .activity:visible")).toHaveCount(0);
  const thought = plugin.locator(".activity-thinking");
  await expect(thought.locator(".work-chevron")).not.toHaveClass(/expanded/);
  await thought.locator("summary").click();
  await expect(thought.locator(".work-chevron")).toHaveClass(/expanded/);
  await expect(thought.locator("pre")).toBeVisible();
  await thought.locator("summary").click();
  await page.screenshot({ path: info.outputPath("grouped-history-collapsed.png") });
  await summaries.nth(0).click();
  await expect(plugin.locator(".work-timeline .activity:visible")).toHaveCount(2);
  const first = plugin.locator(".work-timeline .activity").first();
  await first.locator("summary").click();
  await expect(first.locator("pre")).toContainText("Result t1");
  await summaries.nth(1).click();
  await expect(plugin.locator(".work-timeline .activity:visible")).toHaveCount(5);
  await page.screenshot({ path: info.outputPath("grouped-history-expanded.png") });
});

// Substitute terminal history outcomes inside the real authenticated plugin so
// failure coverage does not depend on the provider choosing to run a bad command.
test("failed and unavailable tool results stay collapsed and inspectable", async ({
  page,
}, info) => {
  await signIn(page);
  const created = await page.request.post("/api/plugins/chathermes/chat/sessions?profile=default", {
    data: {},
  });
  expect(created.ok()).toBeTruthy();
  const body = await created.json();
  const sessionId = (body.session || body).id;
  const messages = [
    { row_id: "u", role: "user", text: "Inspect failed activity" },
    {
      row_id: "a",
      role: "assistant",
      reasoning: "Check the command results.",
      text: "Checking commands.",
      tool_calls: ["failed", "unavailable"].map((id) => ({
        id,
        type: "function",
        function: { name: "terminal", arguments: JSON.stringify({ command: id }) },
      })),
    },
    {
      row_id: "r",
      role: "tool",
      name: "terminal",
      tool_call_id: "failed",
      content: JSON.stringify({ output: "Synthetic command failure", exit_code: 1 }),
    },
    { row_id: "b", role: "assistant", text: "Finished checking." },
  ];
  await page.route(`**/sessions/${sessionId}/messages?*`, (route) =>
    route.fulfill({
      json: {
        data: messages.map((row) => ({
          ...row,
          id: row.row_id,
          content: "text" in row ? row.text : row.content,
          tool_name: "name" in row ? row.name : undefined,
        })),
      },
    }),
  );
  // Keep the real authenticated socket; alter only its attach snapshot before
  // the plugin's message handler reads it.
  await page.addInitScript((messages) => {
    const Socket = window.WebSocket;
    class FailureHistorySocket extends Socket {
      private attachIds = new Set<string>();
      constructor(url: string | URL, protocols?: string | string[]) {
        super(url, protocols);
        if (!new URL(String(url)).pathname.endsWith("/chathermes/chat/ws")) return;
        this.addEventListener("message", (event) => {
          const frame = JSON.parse(event.data);
          if (!this.attachIds.has(frame.id) || !frame.result) return;
          Object.assign(frame.result, {
            messages,
            running: false,
            queued: false,
            inflight: null,
            recovery: {
              ...frame.result.recovery,
              complete: false,
              through: 0,
              start: 0,
              base_row_ids: null,
            },
          });
          Object.defineProperty(event, "data", { value: JSON.stringify(frame) });
        });
      }
      override send(data: Parameters<WebSocket["send"]>[0]) {
        if (typeof data === "string") {
          const frame = JSON.parse(data);
          if (frame.method === "chat.attach") this.attachIds.add(frame.id);
        }
        super.send(data);
      }
    }
    window.WebSocket = FailureHistorySocket;
  }, messages);
  await page.goto(`/chathermes?session=${encodeURIComponent(sessionId)}`);
  const plugin = page.locator(".chathermes-embedded");
  const failures = plugin.locator(".activity-failed");
  await expect(failures).toHaveCount(2);
  await expect(failures.nth(0)).toBeVisible();
  await expect(failures.nth(1)).toBeVisible();
  await expect(failures.nth(0).locator("summary")).toContainText("Failed");
  await expect(failures.nth(1).locator("summary")).toContainText("Result unavailable");
  await expect(plugin.locator(".activity[open]")).toHaveCount(0);
  await expect(plugin.locator(".work-summary")).toHaveAttribute("aria-expanded", "false");
  const area = plugin.getByRole("textbox", { name: "Message Hermes" });
  await area.fill("Draft while inspecting failure");
  await expect(area).toBeFocused();
  await page.screenshot({ path: info.outputPath("failed-activity-collapsed.png") });
  for (const failure of await failures.all()) {
    await failure.locator("summary").click();
    await expect(failure.locator("pre")).toBeVisible();
  }
  await expect(failures.nth(0).locator("pre")).toContainText("Synthetic command failure");
  await page.screenshot({ path: info.outputPath("failed-activity-expanded.png") });
  for (const failure of await failures.all()) {
    await failure.locator("summary").click();
    await expect(failure.locator("pre")).not.toBeVisible();
  }
  await expect(plugin.locator(".activity[open]")).toHaveCount(0);
  await expect(area).toHaveValue("Draft while inspecting failure");
});

// Use the real dashboard mount and authenticated socket, with controlled native
// frames so adjacent calls and out-of-order completion do not depend on a model.
test("streaming summarizes completed work and retains only active ordinary rows", async ({
  page,
}, info) => {
  await signIn(page);
  const created = await page.request.post("/api/plugins/chathermes/chat/sessions?profile=default", {
    data: {},
  });
  expect(created.ok()).toBeTruthy();
  const body = await created.json();
  const sessionId = (body.session || body).id;
  await page.route(`**/sessions/${sessionId}/messages?*`, (route) =>
    route.fulfill({ json: { data: [] } }),
  );
  let sendFrame: ((frame: object) => void) | undefined;
  let runtime = "";
  let seq = 0;
  await page.routeWebSocket("**/api/plugins/chathermes/chat/ws?*", (socket) => {
    const server = socket.connectToServer();
    const attachIds = new Set<string>();
    socket.onMessage((message) => {
      const frame = JSON.parse(String(message));
      if (frame.method === "chat.attach") attachIds.add(frame.id);
      server.send(message);
    });
    server.onMessage((message) => {
      const frame = JSON.parse(String(message));
      if (attachIds.has(frame.id) && frame.result) {
        runtime = frame.result.session_id;
        Object.assign(frame.result, {
          messages: [],
          running: false,
          queued: false,
          inflight: null,
          recovery: {
            ...frame.result.recovery,
            complete: false,
            through: 0,
            start: 0,
            base_row_ids: null,
          },
        });
        sendFrame = (frame) => socket.send(JSON.stringify(frame));
        socket.send(JSON.stringify(frame));
      } else socket.send(message);
    });
  });
  await page.goto(`/chathermes?session=${encodeURIComponent(sessionId)}`);
  const plugin = page.locator(".chathermes-embedded");
  const area = plugin.getByRole("textbox", { name: "Message Hermes" });
  await expect(plugin.getByRole("button", { name: "Choose model", exact: true })).toBeEnabled();
  await expect.poll(() => !!sendFrame).toBe(true);
  const event = (type: string, payload: object = {}) =>
    sendFrame!({
      jsonrpc: "2.0",
      method: "event",
      params: { session_id: runtime, seq: ++seq, type, payload },
    });
  const start = (id: string) =>
    event("tool.start", { tool_id: id, name: "terminal", args: { command: `printf ${id}` } });
  const complete = (id: string, exit_code = 0) =>
    event("tool.complete", {
      tool_id: id,
      name: "terminal",
      result: { output: `Result ${id}`, exit_code },
    });
  sendFrame!({
    jsonrpc: "2.0",
    method: "chat.input",
    params: { text: "Check streaming activity" },
  });
  event("message.start");
  event("message.delta", { text: "Starting activity." });
  start("first");
  const turn = plugin.locator(".assistant-turn").last();
  await expect(turn.locator(".current-activity")).toHaveCount(1);
  complete("first");
  event("message.start");
  event("message.delta", { text: "" });
  start("second");
  start("third");
  await expect(turn.locator(".turn-work")).toHaveCount(1);
  const summary = turn.locator(".work-summary");
  const rows = turn.locator(".work-timeline .activity");
  await expect(summary).toContainText("Ran 1 command");
  await expect(summary).toHaveAttribute("aria-expanded", "false");
  await expect(rows.nth(0)).not.toBeVisible();
  await expect(rows.nth(1)).toBeVisible();
  await expect(rows.nth(2)).toBeVisible();
  await rows.nth(1).locator("summary").click();
  event("tool.progress", { tool_id: "second", name: "terminal", text: "Arriving live output" });
  await expect(rows.nth(1).locator("pre")).toContainText("Arriving live output");
  await area.fill("Focusable draft during streaming");
  await expect(area).toBeFocused();
  await page.screenshot({ path: info.outputPath("stream-group-active.png") });
  complete("third"); // Later call finishes first; preserve source chronology.
  await expect(summary).toContainText("Ran 2 commands");
  await expect(rows.nth(1)).toBeVisible();
  await expect(rows.nth(1)).toHaveAttribute("open", "");
  await expect(rows.nth(2)).not.toBeVisible();
  await expect(area).toBeFocused();
  await summary.click();
  await expect(rows).toHaveCount(3);
  for (const row of await rows.all()) await expect(row).toBeVisible();
  await page.screenshot({ path: info.outputPath("stream-group-expanded.png") });
  await summary.click();
  await expect(rows.nth(1)).toBeVisible();
  await expect(rows.nth(0)).not.toBeVisible();
  complete("second");
  await expect(summary).toContainText("Ran 3 commands");
  await expect(turn.locator(".current-activity")).toHaveCount(0);
  await expect(turn.locator(".work-timeline .activity:visible")).toHaveCount(0);
  start("failure");
  complete("failure", 1);
  start("last");
  await expect(summary).toContainText("1 failed");
  await expect(turn.locator(".activity-failed")).toBeVisible();
  await expect(turn.locator(".activity-failed summary")).toContainText("Failed");
  await expect(turn.locator(".current-activity")).toHaveCount(1);
  await page.screenshot({ path: info.outputPath("stream-group-failed.png") });
  complete("last");
  event("message.complete", { text: "Activity finished.", status: "complete" });
  await expect(turn.locator(".message.assistant").last()).toContainText("Activity finished.");
  await expect(summary).toHaveAttribute("aria-expanded", "false");
  await summary.click();
  await expect(rows.nth(1)).toHaveAttribute("open", "");
  await expect(rows.nth(1).locator("pre")).toContainText("Result second");
  await expect(area).toHaveValue("Focusable draft during streaming");
  const order = await turn
    .locator(":scope > *")
    .evaluateAll((elements) =>
      elements.map((element) =>
        element.classList.contains("turn-work") ? "work" : element.textContent?.trim(),
      ),
    );
  expect(order).toEqual(["Starting activity.", "work", "Activity finished."]);
  await page.screenshot({ path: info.outputPath("stream-group-completed.png") });
});
