// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { api, ApiError, messageText } from "./hermes-api";
afterEach(() => {
  vi.unstubAllGlobals();
});
describe("dashboard plugin Hermes client", () => {
  it("uses same-origin plugin URLs and browser session cookies without Bearer credentials", async () => {
    const fake = vi.fn(
      async (_input: string, _init?: RequestInit) =>
        new Response(
          JSON.stringify({
            object: "list",
            data: [{ id: "fake" }],
            limit: 30,
            offset: 30,
            has_more: false,
          }),
        ),
    );
    vi.stubGlobal("fetch", fake);
    expect(await api.sessions("alpha", 30)).toMatchObject({
      sessions: [{ id: "fake" }],
      offset: 30,
    });
    await api.sessions("");
    expect(fake.mock.calls[0]?.[0]).toBe(
      "/api/plugins/chathermes/api/sessions?limit=30&offset=30&profile=alpha",
    );
    expect(fake.mock.calls[1]?.[0]).toBe("/api/plugins/chathermes/api/sessions?limit=30&offset=0");
    expect(fake.mock.calls[0]?.[1]).toMatchObject({
      redirect: "manual",
      cache: "no-store",
      credentials: "same-origin",
    });
    const headers = new Headers(fake.mock.calls[0]?.[1]?.headers);
    expect(headers.get("accept")).toBe("application/json");
    expect(headers.has("authorization")).toBe(false);
    expect(JSON.stringify(fake.mock.calls)).not.toContain("Bearer");
  });
  it("uses plugin routes for create, history, rename and fetch-based SSE", async () => {
    const fake = vi.fn(async (input: string, init?: RequestInit) => {
      if (input.includes("/chat/stream"))
        return new Response('event: run.completed\ndata: {"run_id":"run-1"}\n\n', {
          headers: { "content-type": "text/event-stream" },
        });
      const value = input.includes("/messages")
        ? {
            data: [{ role: "assistant", content: "hello" }],
            pagination: { returned: 1, limit: 500 },
          }
        : {
            object: "hermes.session",
            session: { id: "one", title: init?.method === "PATCH" ? "Renamed" : "Original" },
          };
      return new Response(JSON.stringify(value));
    });
    vi.stubGlobal("fetch", fake);
    expect((await api.create("alpha")).id).toBe("one");
    expect((await api.rename("alpha", "one", "Renamed")).title).toBe("Renamed");
    expect(await api.messages("alpha", "one")).toHaveLength(1);
    const frames = [];
    for await (const frame of api.stream("alpha", "one", "Hello")) frames.push(frame);
    expect(frames[0]?.event).toBe("run.completed");
    expect(fake.mock.calls.at(-1)?.[0]).toBe(
      "/api/plugins/chathermes/api/sessions/one/chat/stream?profile=alpha",
    );
    expect(fake.mock.calls.at(-1)?.[1]).toMatchObject({
      method: "POST",
      credentials: "same-origin",
    });
    const headers = new Headers(fake.mock.calls.at(-1)?.[1]?.headers);
    expect(headers.get("accept")).toBe("text/event-stream");
    expect(headers.get("content-type")).toBe("application/json");
  });
  it("uses durable tool history for workspace chats and falls back only for unpersisted drafts", async () => {
    const fake = vi.fn(async (url: string) =>
      url.includes("/workspace/")
        ? new Response(JSON.stringify({ messages: [] }))
        : url.includes("/draft-workspace/")
          ? new Response("{}", { status: 404 })
          : new Response(
              JSON.stringify({
                data: [{ role: "tool", content: "Full native tool output" }],
                pagination: { returned: 1, limit: 500 },
              }),
            ),
    );
    vi.stubGlobal("fetch", fake);
    api.workspace("alpha", "stored-workspace");
    api.workspace("alpha", "draft-workspace");
    expect(await api.messages("alpha", "stored-workspace")).toEqual([
      { role: "tool", content: "Full native tool output" },
    ]);
    expect(fake.mock.calls[0]?.[0]).toContain("/api/sessions/stored-workspace/messages");
    expect(await api.messages("alpha", "draft-workspace")).toEqual([]);
    expect(fake.mock.calls.at(-1)?.[0]).toBe(
      "/api/plugins/chathermes/workspace/sessions/draft-workspace/messages?profile=alpha",
    );
  });
  it("rejects redirects and HTTP failures without following them", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(null, { status: 302, headers: { location: "https://evil.test/" } }),
      ),
    );
    await expect(api.sessions("alpha")).rejects.toThrow("redirected");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("{}", { status: 401 })),
    );
    await expect(api.sessions("alpha")).rejects.toMatchObject({
      status: 401,
    } satisfies Partial<ApiError>);
  });
  it("rejects unsafe profile names before fetch", async () => {
    const fake = vi.fn();
    vi.stubGlobal("fetch", fake);
    for (const name of ["a/b", "../x", "%61", "a?b"])
      await expect(api.sessions(name)).rejects.toThrow("Invalid profile name");
    expect(fake).not.toHaveBeenCalled();
  });
  it("extracts text without interpreting HTML", () => {
    expect(messageText([{ type: "text", text: "<script>fake</script>" }])).toBe(
      "<script>fake</script>",
    );
  });
});

it("wraps Runs image parts in a user message and sends authenticated actions and replay cursor", async () => {
  const fake = vi.fn(async (url: string, _init?: RequestInit) =>
    url.includes("/events")
      ? new Response('id: 43\ndata: {"event":"message.delta","seq":43,"delta":"hi"}\n\n')
      : new Response(JSON.stringify({ run_id: "run_1", status: "started" })),
  );
  vi.stubGlobal("fetch", fake);
  const parts = [
    { type: "text", text: "Describe" },
    { type: "image_url", image_url: { url: "data:image/png;base64,eA==" } },
  ];
  await api.startRun("alpha", "s1", parts, "test-model", "test-provider", "turn-test");
  expect(await new Response(fake.mock.calls[0]?.[1]?.body).json()).toEqual({
    session_id: "s1",
    input: [{ role: "user", content: parts }],
    model: "test-model",
    provider: "test-provider",
    require_model_lock: true,
  });
  const headers = new Headers(fake.mock.calls[0]?.[1]?.headers);
  expect(headers.get("Idempotency-Key")).toBe("turn-test");
  expect(headers.get("accept")).toBe("application/json");
  expect(headers.get("content-type")).toBe("application/json");
  await api.approve("alpha", "run_1", "deny", "req_1");
  await api.steer("alpha", "run_1", "guidance");
  await api.stop("alpha", "run_1");
  const frames = [];
  for await (const frame of api.runEvents("alpha", "run_1", undefined, 42)) frames.push(frame);
  expect(fake.mock.calls.at(-1)?.[0]).toBe(
    "/api/plugins/chathermes/v1/runs/run_1/events?last_seq=42&profile=alpha",
  );
  expect(frames[0]?.id).toBe("43");
  expect(frames[0]?.event).toBe("message.delta");
  expect(fake.mock.calls.every(([, init]) => init?.credentials === "same-origin")).toBe(true);
});
