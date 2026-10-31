// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { api, ApiError, messageText } from "./hermes-api";
afterEach(() => {
  vi.unstubAllGlobals();
});
describe("dashboard plugin Hermes client", () => {
  it("deletes an Inbox item through its authenticated owning-profile route", async () => {
    const fake = vi.fn(
      async (_input: string, _init?: RequestInit) =>
        new Response(JSON.stringify({ deleted: true })),
    );
    vi.stubGlobal("fetch", fake);
    await expect(api.deleteInboxItem("alpha", 42)).resolves.toEqual({ deleted: true });
    expect(fake).toHaveBeenCalledExactlyOnceWith(
      "/api/plugins/chathermes/inbox/42?profile=alpha",
      expect.objectContaining({ method: "DELETE", credentials: "same-origin", redirect: "manual" }),
    );
    for (const id of [NaN, Infinity, -1, 1.5])
      await expect(api.deleteInboxItem("alpha", id)).rejects.toThrow("Invalid Hermes API path");
    expect(fake).toHaveBeenCalledTimes(1);
  });
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
  it("uses plugin routes for native draft creation, history and rename", async () => {
    const fake = vi.fn(async (input: string, init?: RequestInit) => {
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
    expect(fake.mock.calls[0]?.[0]).toBe(
      "/api/plugins/chathermes/chat/sessions?prepare=1&profile=alpha",
    );
    expect(fake.mock.calls[0]?.[1]).toMatchObject({ method: "POST", credentials: "same-origin" });
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

it("requests a single indexed artifact page with encoded Project and cursor scope", async () => {
  const fake = vi.fn(
    async (_input: string, _init?: RequestInit) =>
      new Response(JSON.stringify({ files: [], nextCursor: null })),
  );
  vi.stubGlobal("fetch", fake);
  const controller = new AbortController();
  await api.artifacts("alpha", "/workspace/project name", "next+/=", controller.signal);
  const url = new URL(fake.mock.calls[0]![0], "https://dashboard.test");
  expect(url.pathname).toBe("/api/plugins/chathermes/artifacts");
  expect(Object.fromEntries(url.searchParams)).toEqual({
    profile: "alpha",
    project_id: "/workspace/project name",
    limit: "50",
    cursor: "next+/=",
  });
  expect(fake).toHaveBeenCalledTimes(1);
  expect(fake.mock.calls[0]?.[1]?.signal).toBe(controller.signal);
});

it("loads a bounded compacted tail and echoes revision-scoped older offsets", async () => {
  const fetcher = vi.fn(
    async (_url: string) =>
      new Response(
        JSON.stringify({
          data: [{ id: 12, role: "user", content: "internal", display_content: "Visible" }],
          pagination: { order: "latest", returned: 120, limit: 120 },
          transcript: { revision: "r1", next_offset: 120, has_more: true },
        }),
      ),
  );
  vi.stubGlobal("fetch", fetcher);
  const page = await api.latestMessages("alpha", "large");
  expect(page).toMatchObject({
    messages: [{ id: "12", content: "Visible" }],
    revision: "r1",
    hasMore: true,
    nextOffset: 120,
  });
  await api.latestMessages("alpha", "large", undefined, 120, "r1");
  expect(fetcher.mock.calls[0]?.[0]).toContain(
    "limit=120&offset=0&order=latest&inline_images=false&include_compacted=true&transcript=1",
  );
  expect(fetcher.mock.calls[1]?.[0]).toContain("offset=120");
  expect(fetcher.mock.calls[1]?.[0]).toContain("revision=r1");
});

it("does not treat an orderless oldest page as the tail on older gateways", async () => {
  const fetcher = vi.fn(
    async (url: string) =>
      new Response(
        JSON.stringify({
          data: url.includes("order=oldest")
            ? [
                { id: 1, role: "user", content: "Old" },
                { id: 2, role: "assistant", content: "New" },
              ]
            : [{ id: 1, role: "user", content: "Old" }],
          pagination: { returned: url.includes("order=oldest") ? 2 : 1, limit: 500 },
        }),
      ),
  );
  vi.stubGlobal("fetch", fetcher);
  expect(await api.latestMessages("alpha", "old")).toMatchObject({
    messages: [{ id: "1" }, { id: "2" }],
    hasMore: false,
  });
  expect(fetcher).toHaveBeenCalledTimes(2);
  expect(fetcher.mock.calls[1]?.[0]).toContain("order=oldest");
  expect(fetcher.mock.calls[1]?.[0]).toContain("include_compacted=true");
});
