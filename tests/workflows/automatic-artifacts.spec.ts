import { randomUUID } from "node:crypto";
import { test, expect } from "./fixtures";
import { api, runtime } from "./helpers";
import { mockserverURL } from "../docker/compose.mjs";
import { sessionFromUrl } from "../visual/login";

function frame(delta: object, finish_reason: string | null = null) {
  return `data: ${JSON.stringify({ id: "chatcmpl-automatic-artifacts", object: "chat.completion.chunk", created: 1, model: "chathermes-test", choices: [{ index: 0, delta, finish_reason }] })}\n\n`;
}

test("automatic file deliveries survive streaming, native resume, history and indexing", async ({
  page,
}, info) => {
  const marker = `automatic-artifacts-${randomUUID()}`;
  const files = runtime(
    "import pathlib,sys,json; home=pathlib.Path.home(); root=home/'cache'/'scratch'/sys.argv[1]; root.mkdir(parents=True); names=['report.txt','data.csv','legacy.txt','example.txt']; [(root/name).write_text('Automatic artifact verification') for name in names]; print(json.dumps({'report':str(root/'report.txt'),'data':str(root/'data.csv'),'home':'~/'+str((root/'data.csv').relative_to(home)),'legacy':str(root/'legacy.txt'),'example':str(root/'example.txt'),'missing':str(root/'missing.pdf')}))",
    marker,
  );
  const initial = `Files ready.\n\n${files.report.slice(0, -1)}`;
  const rest = `t\n${files.home}\n\n[Report](${files.report})\nMEDIA:${files.legacy}\n\n${files.missing}\n\n\`${files.example}\`\n\nThe example path ${files.example} is discussed here.\n\nDelivery complete.`;
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
          frame({ role: "assistant", reasoning_content: files.example }) +
          frame({ content: initial }) +
          frame({ content: rest }) +
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
  const assistant = page.locator(".message.assistant");
  await expect(assistant).toContainText("Files ready.");
  await expect(assistant.locator(".artifact-card")).toHaveCount(0);
  await composer.fill("Draft during file delivery");
  await expect(composer).toBeFocused();
  await expect(assistant).toContainText("Delivery complete.");
  await expect(page.getByRole("button", { name: "Stop response", exact: true })).toHaveCount(0);
  await expect(assistant.locator(".artifact-card")).toHaveCount(3);
  const session = sessionFromUrl(page.url())!;
  for (const phase of ["live", "resumed"]) {
    if (phase === "resumed") await page.reload();
    const cards = assistant.locator(".artifact-card");
    await expect(cards).toHaveCount(3);
    for (const name of ["report.txt", "data.csv", "legacy.txt"])
      await expect(cards.getByRole("link", { name: `Download ${name}`, exact: true })).toHaveCount(
        1,
      );
    await expect(cards.filter({ hasText: "missing.pdf" })).toHaveCount(0);
    await expect(cards.filter({ hasText: "example.txt" })).toHaveCount(0);
    const report = cards.filter({ hasText: "report.txt" });
    await report.getByRole("button", { name: "Preview report.txt", exact: true }).click();
    await expect(page.locator("dialog[open] pre")).toHaveText("Automatic artifact verification");
    await page.screenshot({ path: info.outputPath(`automatic-${phase}-preview.png`) });
    await page.getByRole("button", { name: "Close preview", exact: true }).click();
    const href = await report
      .getByRole("link", { name: "Download report.txt", exact: true })
      .getAttribute("href");
    expect(await page.evaluate(async (url) => (await fetch(url!)).text(), href)).toBe(
      "Automatic artifact verification",
    );
    await composer.fill("Focusable after resume");
    await expect(composer).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({ path: info.outputPath(`automatic-${phase}.png`) });
  }
  const root = "/api/plugins/chathermes/artifacts?profile=default";
  await expect
    .poll(async () => {
      const result = await api(page, root);
      return result.body.files
        ?.filter((file: { sessionId: string }) => file.sessionId === session)
        .map((file: { path: string }) => file.path)
        .sort((a: string, b: string) => a.localeCompare(b));
    })
    .toEqual([files.report, files.data, files.legacy].sort((a, b) => a.localeCompare(b)));
  // Inspect persisted history through the real dashboard API as well as the
  // native snapshot used by reload. The library must agree with both parsers.
  const history = await api(
    page,
    `/api/plugins/chathermes/api/sessions/${session}/messages?profile=default`,
  );
  expect(history.status).toBe(200);
  expect(JSON.stringify(history.body)).toContain("Delivery complete.");
  const origin = new URL(page.url()).origin;
  await page.goto(`${origin}/chathermes?profile=default#/artifacts?profile=default`);
  const library = page.getByRole("region", { name: "Artifacts", exact: true });
  const reportLink = library
    .getByRole("link", { name: "Download report.txt", exact: true })
    .and(library.locator(`a[href*="${encodeURIComponent(files.report)}"]`));
  await expect(reportLink).toHaveCount(1);
  await expect(reportLink).toHaveAccessibleName("Download report.txt");
  await page.screenshot({ path: info.outputPath("automatic-library.png") });
});
