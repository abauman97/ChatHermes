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

test("mid-flight resume joins snapshot, persisted history and later deltas exactly once", async ({
  page,
}, info) => {
  const id = `resume-history-${randomUUID()}`;
  runtime(
    `${seed}\nimport sys,json\nfrom hermes_state import SessionDB\ndb=SessionDB()\ntry: print(json.dumps(seed(db,sys.argv[1])))\nfinally: db.close()`,
    id,
  );
  const url = `${new URL(page.url()).origin}/chathermes?profile=default#/chat/${id}?profile=default`;
  const plugin = page.locator(".chathermes-embedded");
  const history = plugin.getByRole("log", { name: "Conversation" });
  const composer = plugin.getByRole("textbox", { name: "Message Hermes" });
  const stop = plugin.getByRole("button", { name: "Stop response", exact: true });
  const prompt = `[workflow-resume] ${randomUUID()}`;
  const answer =
    "Before disconnect. Arrived while disconnected. After live resume. Still streaming. Resume complete.";
  // Observe only allowlisted protocol fields. Never retain tickets or raw frames.
  const snapshots: {
    socket: number;
    runtime: string;
    running: boolean;
    streaming: boolean;
    omitted: boolean;
    user: string;
    text: string;
  }[] = [];
  const deltas: { socket: number; text: string }[] = [];
  const closed = new Set<number>();
  let sockets = 0;
  let submissions = 0;
  page.on("websocket", (socket) => {
    const number = ++sockets;
    const reads = new Set<string>();
    socket.on("close", () => closed.add(number));
    socket.on("framesent", ({ payload }) => {
      for (const line of String(payload).split("\n").filter(Boolean)) {
        const frame = JSON.parse(line);
        if (frame.method === "prompt.submit") submissions++;
        if (["session.resume", "session.activate"].includes(frame.method)) {
          expect(frame.params.profile).toBe("default");
          expect(frame.params.omit_messages).toBe(true);
          reads.add(frame.id);
        }
      }
    });
    socket.on("framereceived", ({ payload }) => {
      for (const line of String(payload).split("\n").filter(Boolean)) {
        const frame = JSON.parse(line);
        if (reads.has(frame.id) && frame.result) {
          const value = frame.result;
          snapshots.push({
            socket: number,
            runtime: value.session_id,
            running: value.running,
            streaming: value.inflight?.streaming === true,
            omitted: value.messages_omitted === true && value.messages.length === 0,
            user: value.inflight?.user || "",
            text: value.inflight?.assistant || "",
          });
        }
        if (frame.method === "event" && frame.params.type === "message.delta")
          deltas.push({ socket: number, text: frame.params.payload.text || "" });
      }
    });
  });
  await page.goto(url);
  await expect(history).toContainText("Replacement saved answer");
  // Fully load the seeded lineage so reconciliation can be compared exactly,
  // independently of the 120-row page rounding exercised by the paging tests.
  const earlier = plugin.getByRole("button", { name: "Show earlier messages", exact: true });
  for (const oldest of ["Persisted prompt 060", "Persisted prompt 000"]) {
    await expect(earlier).toBeEnabled();
    await earlier.evaluate((element) => (element as HTMLButtonElement).click());
    await expect(history).toContainText(oldest);
  }
  await expect(earlier).toHaveCount(0);
  const baseline = await history.locator(".message").allTextContents();
  const boundaries = await plugin.getByRole("separator", { name: "Context compacted" }).count();
  // An independent authenticated viewer witnesses actual server progress while
  // this browser context is offline; it does not inject or intercept any traffic.
  const observerContext = await page
    .context()
    .browser()!
    .newContext({
      storageState: await page.context().storageState(),
    });
  try {
    const observer = await observerContext.newPage();
    let observed = "";
    observer.on("websocket", (socket) =>
      socket.on("framereceived", ({ payload }) => {
        for (const line of String(payload).split("\n").filter(Boolean)) {
          const frame = JSON.parse(line);
          if (frame.method === "event" && frame.params.type === "message.delta")
            observed += frame.params.payload.text || "";
        }
      }),
    );
    await observer.goto(url);
    await expect(observer.locator(".message.assistant").last()).toHaveText(
      "Replacement saved answer",
    );
    await page.bringToFront();
    await composer.fill(prompt);
    await plugin.getByRole("button", { name: "Send message", exact: true }).click();
    await expect(history.locator(".message.assistant").last()).toHaveText("Before disconnect.");
    await expect(stop).toBeVisible();
    await composer.fill("Unsent draft survives live resume");
    await expect(composer).toBeFocused();
    const anchor = history.locator(".message.user").filter({ hasText: "Persisted prompt 160" });
    await anchor.scrollIntoViewIfNeeded();
    // Let the native scroll event settle before taking the reader's anchor.
    await history.evaluate(
      (element) =>
        new Promise<void>((resolve) => {
          element.dispatchEvent(new Event("scroll"));
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        }),
    );
    const before = await anchor.boundingBox();
    const oldSocket = snapshots.at(-1)!.socket;
    const oldRuntime = snapshots.at(-1)!.runtime;
    expect(observed).not.toContain("Arrived while disconnected.");
    await page.context().setOffline(true);
    await expect(plugin.getByRole("status").filter({ hasText: "offline" }).first()).toBeVisible();
    await expect.poll(() => observed).toContain("Arrived while disconnected.");
    await expect(history.locator(".message.assistant").last()).not.toContainText(
      "Arrived while disconnected.",
    );
    await expect(composer).toBeFocused();
    await page.context().setOffline(false);
    await expect
      .poll(() =>
        snapshots.some(
          (value) =>
            value.socket > oldSocket &&
            value.running &&
            value.text.includes("Arrived while disconnected."),
        ),
      )
      .toBe(true);
    const resumed = snapshots.find(
      (value) =>
        value.socket > oldSocket &&
        value.running &&
        value.text.includes("Arrived while disconnected."),
    )!;
    expect(resumed.runtime).toBe(oldRuntime);
    expect(resumed.omitted).toBe(true);
    expect(resumed.streaming).toBe(true);
    expect(resumed.user).toBe(prompt);
    expect(answer.startsWith(resumed.text)).toBe(true);
    expect(resumed.text).not.toContain("Resume complete.");
    await expect(history.locator(".message.assistant").last()).toHaveText(resumed.text.trim());
    await expect(plugin.getByRole("button", { name: "Guide this run", exact: true })).toBeVisible();
    await expect(composer).toBeFocused();
    await expect(composer).toHaveValue("Unsent draft survives live resume");
    expect(Math.abs((await anchor.boundingBox())!.y - before!.y)).toBeLessThan(3);
    await page.screenshot({ path: info.outputPath("history-mid-flight-resumed.png") });
    await expect(history.locator(".message.assistant").last()).toHaveText(answer);
    await expect(stop).toHaveCount(0);
    await expect(plugin.getByRole("button", { name: "Guide this run", exact: true })).toHaveCount(
      0,
    );
    expect(
      deltas
        .filter((value) => value.socket === resumed.socket)
        .map((value) => value.text)
        .join(""),
    ).toBe(answer.slice(resumed.text.length));
    await expect.poll(() => closed.has(oldSocket)).toBe(true);
    expect(submissions).toBe(1);
    expect(page.url()).toBe(url);
    await expect(history.locator(".message")).toHaveCount(baseline.length + 2);
    expect((await history.locator(".message").allTextContents()).slice(0, baseline.length)).toEqual(
      baseline,
    );
    await expect(history.locator(".message.user").filter({ hasText: prompt })).toHaveCount(1);
    await expect(history.locator(".message.assistant").filter({ hasText: answer })).toHaveCount(1);
    await expect(plugin.getByRole("separator", { name: "Context compacted" })).toHaveCount(
      boundaries,
    );
    await expect(history).not.toContainText("INTERNAL COMPACTION SUMMARY");
    const after = await anchor.boundingBox();
    expect(Math.abs(after!.y - before!.y)).toBeLessThan(3);
    await expect(composer).toHaveValue("Unsent draft survives live resume");
    await expect(plugin.getByRole("button", { name: "Send message", exact: true })).toBeEnabled();
    await history.locator(".message.assistant").last().scrollIntoViewIfNeeded();
    await page.screenshot({ path: info.outputPath("history-mid-flight-complete.png") });
    await page.reload();
    await expect(history.locator(".message.assistant").last()).toHaveText(answer);
    await expect(history.locator(".message.user").filter({ hasText: prompt })).toHaveCount(1);
    await expect(history.locator(".message.assistant").filter({ hasText: answer })).toHaveCount(1);
    await expect(stop).toHaveCount(0);
    expect(submissions).toBe(1);
  } finally {
    await page.context().setOffline(false);
    await observerContext.close();
  }
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
