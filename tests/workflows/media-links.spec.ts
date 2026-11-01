import { randomUUID } from "node:crypto";
import { test, expect } from "./fixtures";
import { api, runtime } from "./helpers";

test("MEDIA links preserve prose, authenticated file actions and resume", async ({
  page,
}, info) => {
  const marker = `media-links-${randomUUID()}`;
  const uploaded = await api(page, "/api/plugins/chathermes/uploads?profile=default", {
    name: "original.txt",
    data: `data:text/plain;base64,${Buffer.from("Uploaded reference content").toString("base64")}`,
  });
  expect(uploaded.status).toBe(201);
  const { identity, path } = runtime(
    "import pathlib,sys,json; from hermes_cli.web_server_sessions import _open_session_db_for_profile; sid=sys.argv[1]; p=pathlib.Path('/opt/data/workflow-tests')/sid; p.mkdir(parents=True); f=p/'a report.txt'; f.write_text('Generated report content'); db=_open_session_db_for_profile('default',read_only=False); db.create_session(sid,'api',cwd=str(p)); db.append_message(sid,'user','Inspect upload\\nAttached file original.txt: '+sys.argv[2]+'\\nMEDIA:\"'+sys.argv[2]+'\"'); db.append_message(sid,'assistant','Here is [the report](<MEDIA:'+str(f)+'>) for review.\\n\\nOrdinary [documentation](https://example.test/docs) stays available.'); db.close(); print(json.dumps({'identity':sid,'path':str(f)}))",
    marker,
    uploaded.body.path,
  );
  const origin = new URL(page.url()).origin;
  const membership = page.waitForResponse((response) =>
    new URL(response.url()).pathname.endsWith(`/chat/sessions/${identity}/membership`),
  );
  await page.goto(`${origin}/chathermes?profile=default#/chat/${identity}?profile=default`);
  expect((await membership).status()).toBe(200);
  for (const phase of ["resume", "reload"]) {
    if (phase === "reload") await page.reload();
    const plugin = page.locator(".chathermes-embedded");
    const cards = plugin.locator(".artifact-card");
    await expect(cards).toHaveCount(2);
    const assistant = plugin.locator("article.message.assistant");
    await expect(assistant).toContainText("Here is for review.");
    await expect(
      assistant.getByRole("link", { name: "documentation", exact: true }),
    ).toHaveAttribute("href", "https://example.test/docs");
    await expect(plugin.locator('[href^="MEDIA:"], [src^="MEDIA:"]')).toHaveCount(0);
    const report = cards.filter({ hasText: "a report.txt" });
    await report.getByRole("button", { name: "Preview a report.txt", exact: true }).click();
    const preview = page.locator("dialog[open]");
    await expect(preview.locator("pre")).toHaveText("Generated report content");
    await preview.getByRole("button", { name: "Close preview", exact: true }).click();
    const href = await report
      .getByRole("link", { name: "Download a report.txt" })
      .getAttribute("href");
    const address = new URL(href!, origin);
    expect(address.pathname).toBe("/api/plugins/chathermes/files/download");
    expect(Object.fromEntries(address.searchParams)).toEqual({
      path,
      profile: "default",
      session_id: identity,
      name: "a report.txt",
    });
    expect(await page.evaluate(async (url) => (await fetch(url)).text(), href!)).toBe(
      "Generated report content",
    );
    const anonymous = await page.request.get(address.href, {
      headers: { Cookie: "", Authorization: "" },
      maxRedirects: 0,
    });
    expect([401, 403]).toContain(anonymous.status());
    const composer = page.getByRole("textbox", { name: "Message Hermes" });
    await composer.focus();
    await expect(composer).toBeFocused();
    expect(
      await composer.evaluate((element) => parseFloat(getComputedStyle(element).fontSize)),
    ).toBeGreaterThanOrEqual(16);
    expect(await plugin.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(
      true,
    );
    await page.screenshot({ path: info.outputPath(`media-links-${phase}.png`) });
  }
});
