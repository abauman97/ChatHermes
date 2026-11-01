import { randomUUID } from "node:crypto";
import deliveries from "../fixtures/artifact-deliveries.json" with { type: "json" };
import { test, expect } from "./fixtures";
import { api, runtime } from "./helpers";

// Exact public delivery paragraphs from developer session 20261101_144003_02a35d,
// message 99253. Only synthetic images/state are created in the isolated runtime.
const example = deliveries.labeledDeliveries[0]!;
const png =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=";

for (const profile of ["default", "alpha"]) {
  test(`labeled MEDIA images (${profile}) survive native resume/reload with authenticated actions`, async ({
    page,
  }, info) => {
    test.setTimeout(150_000);
    const identity = `media-labeled-${randomUUID()}`;
    const negatives = deliveries.quotedDeliveries.filter(
      (text) => text.includes("Desktop board:") || text.startsWith("Desktop:\n"),
    );
    runtime(
      "import pathlib,sys,json,base64; from hermes_cli.web_server_sessions import _open_session_db_for_profile; sid,text,paths,png,negatives,profile=sys.argv[1:]; paths=json.loads(paths); [(pathlib.Path(p).parent.mkdir(parents=True,exist_ok=True),pathlib.Path(p).write_bytes(base64.b64decode(png))) for p in paths]; db=_open_session_db_for_profile(profile,read_only=False); db.create_session(sid,'api'); db.append_message(sid,'user','Show the screenshots'); db.append_message(sid,'assistant',text); db.append_message(sid,'assistant',(chr(10)*2).join(json.loads(negatives))); db.append_message(sid,'assistant','Pair: MEDIA:'+paths[0]+' MEDIA:'+paths[1]); db.close(); print(json.dumps(True))",
      identity,
      example.text,
      JSON.stringify(example.paths),
      png,
      JSON.stringify(negatives),
      profile,
    );
    const origin = new URL(page.url()).origin;
    await page.goto(`${origin}/chathermes?profile=${profile}#/chat/${identity}?profile=${profile}`);
    for (const phase of ["resume", "reload"]) {
      if (phase === "reload") await page.reload();
      const assistant = page.locator("article.message.assistant").first();
      const cards = assistant.locator(".artifact-card");
      await expect(cards).toHaveCount(6);
      await expect(
        page.locator("article.message.assistant").nth(1).locator(".artifact-card"),
      ).toHaveCount(0);
      await expect(
        page.locator("article.message.assistant").nth(2).locator(".artifact-card"),
      ).toHaveCount(2);
      await expect(page.locator("article.message.assistant").nth(2)).toContainText("Pair:");
      for (const label of example.remaining.split("\n\n"))
        await expect(assistant).toContainText(label);
      await expect(assistant).not.toContainText("MEDIA:");
      const images = cards.locator("button img");
      await expect(images).toHaveCount(6);
      await expect
        .poll(() =>
          images.evaluateAll((nodes) =>
            nodes.every((node) => (node as HTMLImageElement).naturalWidth > 0),
          ),
        )
        .toBe(true);
      const card = cards.first();
      await card
        .getByRole("button", { name: "Preview kanban-board.png", exact: true })
        .first()
        .click();
      const viewer = page.locator("dialog[open]");
      await expect(viewer.locator("img")).toBeVisible();
      await viewer.getByRole("button", { name: "Close preview", exact: true }).click();
      const href = await card
        .getByRole("link", { name: "Download kanban-board.png" })
        .getAttribute("href");
      const address = new URL(href!, origin);
      expect(Object.fromEntries(address.searchParams)).toEqual({
        path: example.paths[0],
        profile,
        session_id: identity,
        name: "kanban-board.png",
      });
      const downloaded = await page.request.get(address.href);
      expect(downloaded.status()).toBe(200);
      expect((await downloaded.body()).equals(Buffer.from(png, "base64"))).toBe(true);
      expect([401, 403]).toContain(
        (
          await page.request.get(address.href, {
            headers: { Cookie: "", Authorization: "" },
            maxRedirects: 0,
          })
        ).status(),
      );
      address.searchParams.set("session_id", `${identity}-missing`);
      expect((await page.request.get(address.href)).status()).toBe(404);
      address.searchParams.set("session_id", identity);
      address.searchParams.set("profile", "beta");
      expect([400, 403, 404]).toContain((await page.request.get(address.href)).status());
      const composer = page.getByRole("textbox", { name: "Message Hermes" });
      await composer.focus();
      await expect(composer).toBeFocused();
      expect(
        await composer.evaluate((node) => parseFloat(getComputedStyle(node).fontSize)),
      ).toBeGreaterThanOrEqual(16);
      expect(
        await page
          .locator(".chathermes-embedded")
          .evaluate((node) => node.scrollWidth <= node.clientWidth + 1),
      ).toBe(true);
      await cards.first().scrollIntoViewIfNeeded();
      await page.screenshot({ path: info.outputPath(`media-labeled-${phase}.png`) });
    }
    expect(
      (
        await api(page, `/api/plugins/chathermes/uploads?profile=${profile}`, {
          name: "wake.txt",
          data: "data:text/plain;base64,d2FrZQ==",
        })
      ).status,
    ).toBe(201);
    // Reconciliation also runs on a 60s interval; a wake during an active scan
    // need not start another scan immediately. Wait for observable library data.
    await expect
      .poll(
        async () => {
          const result = await api(
            page,
            `/api/plugins/chathermes/artifacts?profile=${profile}&limit=100`,
          );
          return result.body.files
            ?.filter((file: { sessionId: string; path: string }) => file.sessionId === identity)
            .map((file: { path: string }) => file.path)
            .sort();
        },
        { timeout: 90_000 },
      )
      .toEqual([...example.paths].sort());
  });
}
