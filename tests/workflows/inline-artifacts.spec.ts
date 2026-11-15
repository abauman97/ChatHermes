import { randomUUID } from "node:crypto";
import { test, expect } from "./fixtures";
import { api, runtime } from "./helpers";
import { mockserverURL } from "../docker/compose.mjs";
import { sessionFromUrl } from "../visual/login";

function frame(delta: object, finish_reason: string | null = null) {
  return `data: ${JSON.stringify({ id: "chatcmpl-inline-artifacts", object: "chat.completion.chunk", created: 1, model: "chathermes-test", choices: [{ index: 0, delta, finish_reason }] })}\n\n`;
}

test("artifact references retain their response positions through streaming and history", async ({
  page,
}, info) => {
  test.setTimeout(150_000);
  const marker = `inline-artifacts-${randomUUID()}`;
  const files = runtime(
    "import pathlib,sys,json,base64; root=pathlib.Path.home()/'cache'/'scratch'/sys.argv[1]; root.mkdir(parents=True); png=base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII='); images=['desktop.png','mobile.png','nested.png']; texts=['report.txt','outer.txt','continuation.txt','reference.txt','hardbreak.txt','terminal.txt','emphasis.txt']; [(root/name).write_bytes(png) for name in images]; [(root/name).write_text('Inline report verification') for name in texts]; print(json.dumps({name:str(root/name) for name in images+texts}))",
    marker,
  );
  const chunks = [
    `Desktop **description**:\nMEDIA:${files["desktop.png"]}\n\n`,
    `Mobile description:\nMEDIA:${files["mobile.png"]}\n\n`,
    `Before &am[report](MEDIA:${files["report.txt"]})p; after.\n\n`,
    `Repeated delivery:\nMEDIA:${files["desktop.png"]}\n\n`,
    `Nested before [x ![a](MEDIA:${files["nested.png"]}) y](MEDIA:${files["outer.txt"]}) nested after.\n\n`,
    `Continuation:\nMEDIA:${files["continuation.txt"]}\n    stays paragraph.\n\n`,
    `Reference label:\nMEDIA:${files["reference.txt"]}\n[docs]: https://example.test/definition\n\n[docs]\n\n`,
    `Description\\\nMEDIA:${files["hardbreak.txt"]}\nAfter hard break.\n\n`,
    "Example `MEDIA:/tmp/private.png` stays text.\n\nFinished [documentation](https://example.test/docs).",
    `\n\n**before[file](MEDIA:${files["emphasis.txt"]})**after`,
    "\n\n` `\n\n---",
    `\n\nTrailing slash\\\nMEDIA:${files["terminal.txt"]}`,
    "\n\n```text\n   \n\t\n```",
  ];
  const installed = await fetch(`${mockserverURL()}/mockserver/expectation`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: marker,
      priority: 40,
      httpRequest: {
        method: "POST",
        path: "/v1/chat/completions",
        body: {
          type: "JSON_PATH",
          jsonPath: `$[?(@.stream == true && @.messages[-1].role == 'user' && @.messages[-1].content =~ /(?s).*${marker}.*/)]`,
        },
      },
      httpResponse: {
        statusCode: 200,
        headers: { "Content-Type": ["text/event-stream"] },
        body:
          frame({ role: "assistant" }) +
          chunks.map((content) => frame({ content })).join("") +
          frame({}, "stop") +
          "data: [DONE]\n\n",
        connectionOptions: { chunkSize: 200, chunkDelay: { timeUnit: "MILLISECONDS", value: 500 } },
      },
    }),
  });
  expect(installed.ok).toBe(true);
  const composer = page.getByRole("textbox", { name: "Message Hermes" });
  await composer.fill(marker);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  const assistant = page.locator("article.message.assistant");
  const cards = assistant.locator(".artifact-card");
  await expect(cards).toHaveCount(1);
  await expect(assistant).not.toContainText("Mobile description:");
  await expect(page.getByRole("button", { name: "Stop response", exact: true })).toBeVisible();
  await composer.fill("Draft while artifacts arrive");
  await expect(composer).toBeFocused();
  await expect(cards).toHaveCount(2);
  // The second image must follow its description, even before the turn completes.
  await expect(assistant.locator(":scope > .markdown-content").nth(1)).toContainText(
    "Mobile description:",
  );
  await expect(assistant).toContainText("Finished");
  await expect(page.getByRole("button", { name: "Stop response", exact: true })).toHaveCount(0);
  const session = sessionFromUrl(page.url())!;
  for (const phase of ["streamed", "reloaded"]) {
    if (phase === "reloaded") await page.reload();
    await expect(cards).toHaveCount(9);
    await expect(assistant.locator(".markdown-content pre")).toHaveCount(1);
    const whitespaceCode = assistant.locator("pre code.language-text");
    expect(await whitespaceCode.textContent()).toBe("   \n\t\n");
    const inlineWhitespaceCode = assistant.locator("p > code").filter({ hasNotText: "MEDIA:" });
    await expect(inlineWhitespaceCode).toHaveCount(1);
    expect(await inlineWhitespaceCode.textContent()).toBe(" ");
    await expect(assistant.locator("hr")).toHaveCount(1);
    await expect(assistant).toContainText("[docs]: https://example.test/definition");
    // The literal URL can auto-link; the reference label must stay unresolved.
    await expect(assistant.getByRole("link", { name: "docs", exact: true })).toHaveCount(0);
    await expect(assistant.locator("strong")).toHaveText(["description", "before"]);
    await expect(assistant).not.toContainText("**");
    const order = await assistant.evaluate((node) =>
      Array.from(node.children).map((child) =>
        child.classList.contains("artifact-card")
          ? `file:${child.querySelector("a[download]")?.getAttribute("aria-label") || child.querySelector("a")?.getAttribute("aria-label")}`
          : child.textContent?.replace(/\s+/g, " ").trim(),
      ),
    );
    expect(order).toEqual([
      "Desktop description:",
      "file:Download desktop.png",
      "Mobile description:",
      "file:Download mobile.png",
      "Before &",
      "file:Download report.txt",
      "after. Repeated delivery: Nested before",
      "file:Download outer.txt",
      "nested after. Continuation:",
      "file:Download continuation.txt",
      "stays paragraph. Reference label:",
      "file:Download reference.txt",
      "[docs]: https://example.test/definition [docs] Description",
      "file:Download hardbreak.txt",
      "After hard break. Example MEDIA:/tmp/private.png stays text. Finished documentation. before",
      "file:Download emphasis.txt",
      "after Trailing slash\\",
      "file:Download terminal.txt",
      "",
    ]);
    await expect(assistant).not.toContainText("<>");
    const hardBreakDescription = assistant
      .locator(":scope > .markdown-content")
      .filter({ hasText: "Description" });
    await expect(hardBreakDescription.locator("br")).toHaveCount(1);
    await expect(cards.locator("button img")).toHaveCount(2);
    await expect
      .poll(() =>
        cards
          .locator("button img")
          .evaluateAll((nodes) =>
            nodes.every((node) => (node as HTMLImageElement).naturalWidth > 0),
          ),
      )
      .toBe(true);
    await cards.first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: info.outputPath(`inline-${phase}-desktop-description.png`) });
    await cards.nth(1).scrollIntoViewIfNeeded();
    await page.screenshot({ path: info.outputPath(`inline-${phase}-mobile-description.png`) });
    await cards.nth(3).scrollIntoViewIfNeeded();
    await page.screenshot({ path: info.outputPath(`inline-${phase}-nested-delivery.png`) });
    await cards.nth(2).scrollIntoViewIfNeeded();
    await page.screenshot({ path: info.outputPath(`inline-${phase}-entity-boundary.png`) });
    await cards.nth(5).scrollIntoViewIfNeeded();
    await page.screenshot({ path: info.outputPath(`inline-${phase}-markdown-structure.png`) });
    await cards.nth(6).evaluate((node) => node.scrollIntoView({ block: "center" }));
    await page.screenshot({ path: info.outputPath(`inline-${phase}-hard-break.png`) });
    await cards.nth(7).evaluate((node) => node.scrollIntoView({ block: "center" }));
    await page.screenshot({ path: info.outputPath(`inline-${phase}-emphasis-boundary.png`) });
    await whitespaceCode.evaluate((node) => node.scrollIntoView({ block: "center" }));
    await page.screenshot({ path: info.outputPath(`inline-${phase}-whitespace-code.png`) });
    await cards.nth(8).scrollIntoViewIfNeeded();
    await page.screenshot({ path: info.outputPath(`inline-${phase}-terminal-escape.png`) });
    await cards.nth(2).getByRole("button", { name: "Preview report.txt", exact: true }).click();
    await expect(page.locator("dialog[open] pre")).toHaveText("Inline report verification");
    await page.getByRole("button", { name: "Close preview", exact: true }).click();
    const href = await cards
      .first()
      .getByRole("link", { name: "Download desktop.png", exact: true })
      .getAttribute("href");
    const address = new URL(href!, page.url());
    expect(address.searchParams.get("session_id")).toBe(session);
    expect(address.searchParams.get("profile")).toBe("default");
    expect((await page.request.get(address.href)).status()).toBe(200);
    expect([401, 403]).toContain(
      (
        await page.request.get(address.href, {
          headers: { Cookie: "", Authorization: "" },
          maxRedirects: 0,
        })
      ).status(),
    );
    address.searchParams.set("session_id", `${session}-missing`);
    expect((await page.request.get(address.href)).status()).toBe(404);
    await composer.fill("Still focusable");
    await expect(composer).toBeFocused();
    expect(
      await page
        .locator(".chathermes-embedded")
        .evaluate((node) => node.scrollWidth <= node.clientWidth + 1),
    ).toBe(true);
  }
  const history = await api(
    page,
    `/api/plugins/chathermes/api/sessions/${session}/messages?profile=default`,
  );
  expect(history.status).toBe(200);
  const messages = history.body.data as { role: string; content: string }[];
  expect(
    messages.filter((message) => message.role === "assistant").map((message) => message.content),
  ).toContain(chunks.join(""));
});
