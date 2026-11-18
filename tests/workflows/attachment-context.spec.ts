import { randomUUID } from "node:crypto";
import { test, expect } from "./fixtures";
import { api, runtime } from "./helpers";
import { sessionFromUrl } from "../visual/login";

test("attachment review cases preserve Markdown grammar and literal recovered references", async ({
  page,
}, info) => {
  const identity = `attachment-grammar-${randomUUID()}`;
  const path = `/opt/data/workflow-tests/${identity}/retained.txt`;
  const pixel = "![pixel](https://attacker.invalid/x)";
  const image =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=";
  const messages = [
    ...["Attached Context", "Context Warnings"].map(
      (marker) => `\`\n${pixel}\n--- ${marker} ---\nend\``,
    ),
    `Ask\n\n--- Attached Context ---\n\n\`\`\`text\n@file:${pixel}\n\`\`\``,
    `**Retained upload**\nAttached file retained.txt: ${path}\nMEDIA:${path}\n\n[ordinary link](https://example.invalid/docs)\n\n![real](${image})\n\n--- Attached Context ---\n@tool:search @file:${path}`,
  ];
  const external: string[] = [];
  page.on("request", (request) => {
    if (request.url().startsWith("https://attacker.invalid/")) external.push(request.url());
  });
  // Count attempts even though the test safeguard aborts outbound traffic.
  await page.route("https://attacker.invalid/**", (route) => route.abort());
  runtime(
    "import pathlib,sys,json; from hermes_cli.web_server_sessions import _open_session_db_for_profile; sid,path,messages=sys.argv[1:]; p=pathlib.Path(path); p.parent.mkdir(parents=True,exist_ok=True); p.write_text('Retained grammar regression artifact'); db=_open_session_db_for_profile('default',read_only=False); db.create_session(sid,'api',cwd=str(p.parent)); [db.append_message(sid,'user',content) for content in json.loads(messages)]; db.close(); print(json.dumps(True))",
    identity,
    path,
    JSON.stringify(messages),
  );
  const origin = new URL(page.url()).origin;
  await page.goto(`${origin}/chathermes?profile=default#/chat/${identity}?profile=default`);
  const plugin = page.locator(".chathermes-embedded");
  for (const phase of ["resume", "reload"]) {
    if (phase === "reload") await page.reload();
    const users = plugin.locator(".message.user");
    await expect(users).toHaveCount(messages.length);
    for (let index = 0; index < 3; index++) {
      const user = users.nth(index);
      await expect(user.locator("img, a, .artifact-card")).toHaveCount(0);
      await expect(user).toContainText(index === 2 ? `@file:${pixel}` : pixel);
      await expect(user).not.toContainText("--- Attached Context ---");
      await expect(user).not.toContainText("end");
      if (index < 2) await expect(user.locator("code")).toContainText(pixel);
    }
    const control = users.last();
    await expect(control.locator("strong")).toHaveText("Retained upload");
    await expect(control).toContainText("@tool:search");
    await expect(control.locator(".message-content img")).toHaveCount(1);
    await expect(control.getByRole("link", { name: "ordinary link" })).toHaveAttribute(
      "href",
      "https://example.invalid/docs",
    );
    const href = await control
      .getByRole("link", { name: "Download retained.txt" })
      .getAttribute("href");
    const url = new URL(href!, origin);
    expect(url.searchParams.get("session_id")).toBe(identity);
    const download = await page.request.get(url.href);
    expect(download.status()).toBe(200);
    expect(await download.text()).toBe("Retained grammar regression artifact");
    url.searchParams.set("profile", "beta");
    expect((await page.request.get(url.href)).status()).toBe(404);
    const composer = plugin.getByRole("textbox", { name: "Message Hermes" });
    await composer.fill("Focusable after grammar review");
    await expect(composer).toBeFocused();
    await users.first().scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({ path: info.outputPath(`grammar-${phase}.png`) });
    expect(external).toEqual([]);
  }
});

test("truncation preserves original code quotation and only retained authenticated cards", async ({
  page,
}, info) => {
  const identity = `attachment-quotation-${randomUUID()}`;
  const path = `/opt/data/workflow-tests/${identity}/retained.txt`;
  const messages = ["Attached Context", "Context Warnings"].flatMap((marker) => {
    const examples = ["MEDIA:/tmp/private.pdf", "Attached file private.pdf: /tmp/private.pdf"].map(
      (delivery) => `\`\n${delivery}\n--- ${marker} ---\nend\``,
    );
    return [
      ...examples,
      `Retained upload\nAttached file retained.txt: ${path}\nMEDIA:${path}\n${examples[0]}\nMEDIA:/tmp/discarded.pdf`,
    ];
  });
  runtime(
    "import pathlib,sys,json; from hermes_cli.web_server_sessions import _open_session_db_for_profile; sid,path,messages=sys.argv[1:]; p=pathlib.Path(path); p.parent.mkdir(parents=True,exist_ok=True); p.write_text('Retained quotation regression artifact'); db=_open_session_db_for_profile('default',read_only=False); db.create_session(sid,'api',cwd=str(p.parent)); [db.append_message(sid,'user',content) for content in json.loads(messages)]; db.close(); print(json.dumps(True))",
    identity,
    path,
    JSON.stringify(messages),
  );
  const origin = new URL(page.url()).origin;
  await page.goto(`${origin}/chathermes?profile=default#/chat/${identity}?profile=default`);
  const plugin = page.locator(".chathermes-embedded");
  for (const phase of ["resume", "reload"]) {
    if (phase === "reload") await page.reload();
    const users = plugin.locator(".message.user");
    await expect(users).toHaveCount(6);
    for (let index = 0; index < messages.length; index++) {
      const user = users.nth(index);
      await expect(user.locator(".artifact-card")).toHaveCount(index % 3 === 2 ? 1 : 0);
      await expect(user).toContainText(
        index % 3 === 1 ? "Attached file private.pdf: /tmp/private.pdf" : "MEDIA:/tmp/private.pdf",
      );
      await expect(user).not.toContainText("--- Attached Context ---");
      await expect(user).not.toContainText("--- Context Warnings ---");
      await expect(user).not.toContainText("discarded.pdf");
    }
    for (const card of await users.locator(".artifact-card").all()) {
      const href = await card
        .getByRole("link", { name: "Download retained.txt" })
        .getAttribute("href");
      const url = new URL(href!, origin);
      expect(url.searchParams.get("profile")).toBe("default");
      expect(url.searchParams.get("session_id")).toBe(identity);
      const download = await page.request.get(url.href);
      expect(download.status()).toBe(200);
      expect(await download.text()).toBe("Retained quotation regression artifact");
      url.searchParams.set("profile", "beta");
      expect((await page.request.get(url.href)).status()).toBe(404);
    }
    const composer = plugin.getByRole("textbox", { name: "Message Hermes" });
    await composer.fill("Focusable after quotation resume");
    await expect(composer).toBeFocused();
    await users.last().scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({ path: info.outputPath(`quotation-${phase}.png`) });
  }
});

// No route mocks: upload, staging, expansion, inference, persistence and native
// resume all run in the authenticated React-mounted plugin.
for (const withWarning of [false, true]) {
  test(`PDF attachment context stays out of live and resumed user bubbles${withWarning ? " with warnings" : ""}`, async ({
    page,
  }, info) => {
    const plugin = page.locator(".chathermes-embedded");
    const composer = plugin.getByRole("textbox", { name: "Message Hermes" });
    await composer.fill("Focusable on home");
    await expect(composer).toBeFocused();
    const prompt = `[workflow-tool] ${randomUUID()} Summarize this PDF. The phrase --- Attached Context --- is legitimate user text.${withWarning ? " @file:missing-attachment-review.pdf" : ""}`;
    const name = "attachment context.pdf";
    const bytes = Buffer.from("%PDF-\x00fixture\n");
    await plugin
      .locator('input[aria-label="Upload files"]')
      .setInputFiles({ name, mimeType: "application/pdf", buffer: bytes });
    await expect(plugin.locator(".composer")).toContainText(name);
    await composer.fill(prompt);
    await plugin.getByRole("button", { name: "Send message", exact: true }).click();
    const user = plugin.locator(".message.user");
    await expect(user.locator(".message-content")).toHaveText(prompt);
    await expect(plugin.locator(".turn-work")).toBeVisible();
    await composer.fill("Draft during attachment processing");
    await expect(composer).toBeFocused();
    await expect(plugin.locator(".activity-active").first()).toBeVisible();
    await plugin
      .locator(".activity-active")
      .first()
      .screenshot({
        path: info.outputPath("attachment-activity-active.png"),
      });
    await page.screenshot({ path: info.outputPath("attachment-context-active.png") });
    await expect(plugin.locator(".message.assistant")).toHaveText(
      "Tool completed: workflow-tool-ok.",
    );
    await expect(plugin.getByRole("button", { name: "Stop response", exact: true })).toHaveCount(0);
    const session = sessionFromUrl(page.url())!;
    expect(session).toBeTruthy();
    const history = await api(
      page,
      `/api/plugins/chathermes/api/sessions/${session}/messages?profile=default`,
    );
    expect(history.status).toBe(200);
    expect(JSON.stringify(history.body)).toContain("binary file, not inlined as text.");
    expect(JSON.stringify(history.body)).toContain("--- Attached Context ---");
    const raw = JSON.stringify(history.body);
    if (withWarning) expect(raw).toContain("--- Context Warnings ---");
    const warning = withWarning
      ? "\n\n--- Context Warnings ---\n- @file:missing-attachment-review.pdf: file not found"
      : "";
    if (withWarning) expect(raw).toContain(warning.replaceAll("\n", "\\n"));
    for (const phase of ["live", "resumed"]) {
      if (phase === "resumed") await page.reload();
      await expect(user.locator(".message-content")).toHaveText(prompt);
      await expect(user).not.toContainText("--- Context Warnings ---");
      await expect(user.locator(".artifact-card")).toHaveCount(1);
      await expect(user).not.toContainText("available on disk");
      if (!withWarning) await expect(user).not.toContainText("@file:");
      await expect(user).not.toContainText("📎");
      const download = user.getByRole("link", { name: `Download ${name}`, exact: true });
      const href = await download.getAttribute("href");
      expect(href).toContain("profile=default");
      const downloaded = await page.evaluate(async (url) => {
        const response = await fetch(url!);
        return {
          status: response.status,
          bytes: [...new Uint8Array(await response.arrayBuffer())],
        };
      }, href);
      expect(downloaded).toEqual({ status: 200, bytes: [...bytes] });
      const foreign = await page.evaluate(
        async (url) => (await fetch(url!.replace("profile=default", "profile=beta"))).status,
        href,
      );
      expect(foreign).toBe(404);
      await composer.fill("Focusable after PDF delivery");
      await expect(composer).toBeFocused();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      // Compact editing hides secondary controls until the user leaves the input.
      await user.locator(".message-content").click();
      await plugin.getByRole("button", { name: "Choose model", exact: true }).click();
      const reasoning = plugin.getByRole("combobox", { name: "Reasoning effort", exact: true });
      await expect(reasoning).toBeVisible();
      expect(
        await reasoning.evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
      ).toBeGreaterThanOrEqual(16);
      await plugin.getByRole("button", { name: "Close model picker" }).click();
      const group = plugin.locator(".turn-work").last().locator(".work-summary");
      if (await group.isVisible()) await group.click();
      const activity = plugin
        .locator(".activity")
        .filter({ hasText: /terminal/i })
        .last();
      await expect(activity).not.toHaveAttribute("open");
      await activity.locator("summary").click();
      await expect(activity).toContainText("workflow-tool-ok");
      await activity.screenshot({
        path: info.outputPath(`attachment-activity-expanded-${phase}.png`),
      });
      await activity.locator("summary").click();
      await expect(activity).not.toHaveAttribute("open");
      await activity.screenshot({
        path: info.outputPath(`attachment-activity-collapsed-${phase}.png`),
      });
      await user.scrollIntoViewIfNeeded();
      await page.screenshot({ path: info.outputPath(`attachment-context-${phase}.png`) });
    }
  });
}

for (const marker of ["Attached Context", "Context Warnings"]) {
  test(`Desktop truncates authored ${marker} in live and saved user messages`, async ({
    page,
  }, info) => {
    const plugin = page.locator(".chathermes-embedded");
    const composer = plugin.getByRole("textbox", { name: "Message Hermes" });
    const prefix = `[workflow-tool] ${randomUUID()} Explain marker handling.`;
    const content = `${prefix}\n\n--- ${marker} ---\n\nAuthored notes accepted for truncation.`;
    await composer.fill(content);
    await plugin.getByRole("button", { name: "Send message", exact: true }).click();
    const user = plugin.locator(".message.user");
    await expect(user.locator(".message-content")).toHaveText(prefix);
    await expect(plugin.locator(".message.assistant")).toHaveText(
      "Tool completed: workflow-tool-ok.",
    );
    const session = sessionFromUrl(page.url())!;
    const history = await api(
      page,
      `/api/plugins/chathermes/api/sessions/${session}/messages?profile=default`,
    );
    expect(history.status).toBe(200);
    expect(JSON.stringify(history.body)).toContain("Authored notes accepted for truncation.");
    await page.reload();
    await expect(user.locator(".message-content")).toHaveText(prefix);
    await expect(user.locator(".artifact-card")).toHaveCount(0);
    await expect(plugin.locator(".message.assistant")).toHaveText(
      "Tool completed: workflow-tool-ok.",
    );
    await composer.fill("Focusable after marker resume");
    await expect(composer).toBeFocused();
    await page.screenshot({ path: info.outputPath("authored-marker-resumed.png") });
  });
}
