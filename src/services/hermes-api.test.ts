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
    expect(fake.mock.calls[0]?.[0]).toBe("/api/plugins/chathermes/chat/sessions?profile=alpha");
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
