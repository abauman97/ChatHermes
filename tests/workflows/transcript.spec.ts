import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { test, expect } from "./fixtures";
import { api, runtime } from "./helpers";

const seed = readFileSync(new URL("../fixtures/transcript.py", import.meta.url), "utf8");

test("compacted rotated history pages chronologically, survives reconnect and excludes rewind", async ({
  page,
}, info) => {
  const id = `history-${randomUUID()}`;
  runtime(
    `${seed}\nimport sys,json\nfrom hermes_state import SessionDB\ndb=SessionDB()\ntry: print(json.dumps(seed(db,sys.argv[1])))\nfinally: db.close()`,
    id,
  );
  const plugin = page.locator(".chathermes-embedded");
  const history = plugin.getByRole("log", { name: "Conversation" });
  const earlier = plugin.getByRole("button", { name: "Show earlier messages", exact: true });
  const replies: { returned: number; offset: number }[] = [];
  const nativeReads: boolean[] = [];
  page.on("response", async (response) => {
    if (response.url().includes(`/api/sessions/${id}/messages`)) {
      const body = await response.json().catch(() => null);
      if (body?.pagination) replies.push(body.pagination);
    }
  });
  page.on("websocket", (socket) =>
    socket.on("framesent", ({ payload }) => {
      const frame = JSON.parse(String(payload));
      if (["session.resume", "session.activate"].includes(frame.method))
        nativeReads.push(frame.params?.omit_messages === true);
    }),
  );
  const origin = new URL(page.url()).origin;
  const url = `${origin}/chathermes?profile=default#/chat/${id}?profile=default`;
  await page.goto(url);
  await expect(history).toContainText("Replacement saved answer");
  await expect(earlier).toBeVisible();
  await expect(history).not.toContainText("Persisted prompt 000");
  expect(replies.length).toBeGreaterThan(0);
  expect(replies.every((page) => page.returned <= 120)).toBe(true);
  expect(replies[0]?.offset).toBe(0);
  expect(nativeReads.length).toBeGreaterThan(0);
  expect(nativeReads.every(Boolean)).toBe(true);
  await expect(history).not.toContainText("INTERNAL COMPACTION SUMMARY");
  await expect(history).not.toContainText("Persisted prompt 168");
  const area = plugin.getByRole("textbox", { name: "Message Hermes" });
  await area.fill("Draft stays focusable while browsing history");
  await expect(area).toBeFocused();

  // A programmatic top scroll exercises the same observable scrolling contract
  // as wheel/touch and must automatically request a second bounded page.
  await history.evaluate((element) => {
    element.scrollTop = 0;
    element.dispatchEvent(new Event("scroll"));
  });
  await expect.poll(() => replies.some((page) => page.offset === 120)).toBe(true);
  await expect(history).toContainText("Persisted prompt 060");
  await expect(history).not.toContainText("Persisted prompt 000");
  // Capture a visible message's screen position before fallback prepends.
  const text = await history.evaluate((element) => {
    const top = element.getBoundingClientRect().top;
    return (
      [...element.querySelectorAll<HTMLElement>(".message.user")].find(
        (row) => row.getBoundingClientRect().bottom > top,
      )?.innerText || ""
    );
  });
  const anchor = history.locator(".message.user").filter({ hasText: text });
  const before = await anchor.boundingBox();
  await earlier.evaluate((element) => (element as HTMLButtonElement).click());
  await expect(history).toContainText("Persisted prompt 000");
  const after = await history.locator(".message.user").filter({ hasText: text }).boundingBox();
  expect(Math.abs((after?.y || 0) - (before?.y || 0))).toBeLessThan(3);
  await expect(earlier).toHaveCount(0);
  await expect(plugin.getByRole("separator", { name: "Context compacted" })).toHaveCount(3);
  const prompts = await history.locator(".message.user").allTextContents();
  expect(prompts.filter((text) => text.includes("Persisted prompt"))).toHaveLength(168);
  for (let n = 0; n < 168; n++)
    expect(prompts[n]).toContain(`Persisted prompt ${String(n).padStart(3, "0")}`);
  await history.evaluate((element) => {
    element.scrollTop = 0;
  });
  await page.screenshot({ path: info.outputPath("history-oldest.png") });
  await plugin
    .getByRole("separator", { name: "Context compacted" })
    .first()
    .scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath("history-compaction.png") });

  // Actual connectivity recovery, no route mocks or fabricated native frames.
  await page.context().setOffline(true);
  await expect(plugin.getByRole("status").filter({ hasText: "offline" }).first()).toBeVisible();
  await page.context().setOffline(false);
  await expect(plugin.getByRole("separator", { name: "Context compacted" })).toHaveCount(3);
  await expect(history).toContainText("Persisted prompt 000");
  await expect(area).toHaveValue("Draft stays focusable while browsing history");
  await page.reload();
  await expect(history).toContainText("Replacement saved answer");
  await expect(history).not.toContainText("Persisted prompt 000");
  await expect(earlier).toBeVisible();
  const response = await api(
    page,
    `/api/plugins/chathermes/api/sessions/${id}/messages?transcript=1&include_compacted=true&order=latest&limit=120&profile=default`,
  );
  expect(response.status).toBe(200);
  expect(response.body.transcript.has_more).toBe(true);
  expect(JSON.stringify(response.body)).not.toContain("INTERNAL COMPACTION SUMMARY");
});

test("live tool response survives a changed backfill cursor without moving the reader", async ({
  page,
}, info) => {
  const id = `stream-history-${randomUUID()}`;
  runtime(
    `${seed}\nimport sys,json\nfrom hermes_state import SessionDB\ndb=SessionDB()\ntry: print(json.dumps(seed(db,sys.argv[1])))\nfinally: db.close()`,
    id,
  );
  const origin = new URL(page.url()).origin;
  await page.goto(`${origin}/chathermes?profile=default#/chat/${id}?profile=default`);
  const plugin = page.locator(".chathermes-embedded");
  const history = plugin.getByRole("log", { name: "Conversation" });
  const area = plugin.getByRole("textbox", { name: "Message Hermes" });
  const earlier = plugin.getByRole("button", { name: "Show earlier messages", exact: true });
  await expect(history).toContainText("Replacement saved answer");
  const saved = await api(
    page,
    `/api/plugins/chathermes/api/sessions/${id}/messages?transcript=1&limit=120&profile=default`,
  );
  await area.fill(`[workflow-context] ${randomUUID()}`);
  await plugin.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(plugin.locator(".turn-work").last()).toBeVisible();
  await area.fill("Draft during live history backfill");
  await expect(area).toBeFocused();
  await history.evaluate((element) => {
    element.scrollTop = 0;
    element.dispatchEvent(new Event("scroll"));
  });
  await expect
    .poll(
      async () =>
        (
          await api(
            page,
            `/api/plugins/chathermes/api/sessions/${id}/messages?transcript=1&limit=120&offset=120&revision=${saved.body.transcript.revision}&profile=default`,
          )
        ).status,
    )
    .toBe(409);
  await expect(earlier).toBeEnabled();
  await earlier.evaluate((element) => (element as HTMLButtonElement).click());
  await expect(history).toContainText("Persisted prompt 060");
  const marker = plugin.getByRole("separator", { name: "Context compacted" }).first();
  await marker.scrollIntoViewIfNeeded();
  const before = await marker.boundingBox();
  await expect(history.locator(".message.assistant").last()).toHaveText(
    "Tool completed: workflow-context-ok.",
  );
  await expect(plugin.getByRole("button", { name: "Stop response", exact: true })).toHaveCount(0);
  await expect
    .poll(async () => {
      const after = await marker.boundingBox();
      return before && after ? Math.abs(after.y - before.y) : Infinity;
    })
    .toBeLessThan(3);
  await expect(
    history.locator(".message.user").filter({ hasText: "[workflow-context]" }),
  ).toHaveCount(1);
  await expect(
    history
      .locator(".message.assistant")
      .filter({ hasText: "Tool completed: workflow-context-ok." }),
  ).toHaveCount(1);
  await expect(area).toHaveValue("Draft during live history backfill");
  await expect(history).not.toContainText("INTERNAL COMPACTION SUMMARY");
  await page.screenshot({ path: info.outputPath("history-live-complete.png") });
  await page.reload();
  await expect(history.locator(".message.assistant").last()).toHaveText(
    "Tool completed: workflow-context-ok.",
  );
  await expect(
    history.locator(".message.user").filter({ hasText: "[workflow-context]" }),
  ).toHaveCount(1);
  const work = plugin.locator(".turn-work").last();
  if (await work.locator(".work-summary").isVisible()) await work.locator(".work-summary").click();
  const tool = plugin
    .locator(".activity")
    .filter({ hasText: /terminal/i })
    .last();
  await tool.locator("summary").click();
  await expect(tool).toContainText("workflow-context-ok");
});

test("archived multipart user and assistant images load through authenticated row addresses", async ({
  page,
}, info) => {
  const id = `image-history-${randomUUID()}`;
  const png =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aZ1sAAAAASUVORK5CYII=";
  runtime(
    `import sys,json\nfrom hermes_state import SessionDB\ndb=SessionDB()\ntry:\n db.create_session(sys.argv[1],source='desktop')\n image={'type':'image_url','image_url':{'url':'data:image/png;base64,'+sys.argv[2]}}\n db.append_message(sys.argv[1],'user',[{'type':'text','text':'Archived user image'},image])\n db.append_message(sys.argv[1],'assistant',[{'type':'text','text':'Archived assistant image'},image])\n for n in range(130): db.append_message(sys.argv[1],'user' if n%2==0 else 'assistant','Image history filler '+str(n))\n db.archive_and_compact(sys.argv[1],[{'role':'user','content':'INTERNAL IMAGE SUMMARY','_compressed_summary':True}])\n print(json.dumps({'id':sys.argv[1]}))\nfinally: db.close()`,
    id,
    png,
  );
  const origin = new URL(page.url()).origin;
  await page.goto(`${origin}/chathermes?profile=default#/chat/${id}?profile=default`);
  const plugin = page.locator(".chathermes-embedded");
  const history = plugin.getByRole("log", { name: "Conversation" });
  await expect(history).toContainText("Image history filler 129");
  await expect(history).not.toContainText("Archived user image");
  await plugin
    .getByRole("button", { name: "Show earlier messages", exact: true })
    .evaluate((element) => (element as HTMLButtonElement).click());
  await expect(history).toContainText("Archived user image");
  await expect(history).toContainText("Archived assistant image");
  const images = history.locator('img[src*="/artifact-images/"]');
  await expect(images).toHaveCount(2);
  await expect
    .poll(() =>
      images.evaluateAll((nodes) =>
        nodes.every(
          (node) =>
            (node as HTMLImageElement).complete && (node as HTMLImageElement).naturalWidth === 1,
        ),
      ),
    )
    .toBe(true);
  const address = await images.first().getAttribute("src");
  expect(address).toContain("profile=default");
  const saved = await api(
    page,
    `/api/plugins/chathermes/api/sessions/${id}/messages?transcript=1&limit=120&offset=120&profile=default`,
  );
  expect(JSON.stringify(saved.body)).not.toContain("data:image/");
  await expect(history).not.toContainText("INTERNAL IMAGE SUMMARY");
  await images.first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath("history-archived-images.png") });
});
