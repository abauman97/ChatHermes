// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vite-plus/test";
import { mount, flushPromises } from "@vue/test-utils";
import App from "./App.vue";
import { createChatHermesRouter } from "./router";
import { api } from "./services/hermes-api";
import * as nativeSession from "./features/chat/runtime/native-session";
import type { InboxItem } from "./features/inbox/inbox";
const items: InboxItem[] = [
  {
    id: 1,
    profile: "alpha",
    session: "same",
    event_id: "2",
    kind: "turn.complete",
    occurred: 100,
    title: "Alpha chat",
    preview: "Alpha response",
    read: false,
  },
  {
    id: 2,
    profile: "beta",
    session: "same",
    event_id: "q",
    kind: "approval",
    occurred: 101,
    title: "Beta chat",
    preview: "Approval required",
    read: false,
  },
];
beforeEach(() => {
  history.replaceState({}, "", "/chathermes#/inbox");
  vi.spyOn(api, "tracking").mockResolvedValue({ tracking: [], sessions: [] });
  vi.spyOn(api, "inbox").mockImplementation(async (profile, options = {}) => ({
    items:
      options.limit === 1
        ? items.slice(0, 1)
        : options.scope === "profile"
          ? items.filter((item) => item.profile === (profile || "default"))
          : items,
    unread: 2,
    byProfile: { alpha: 1, beta: 1 },
    nextCursor: null,
  }));
  vi.stubGlobal(
    "fetch",
    vi.fn(
      async (url: string) =>
        new Response(
          JSON.stringify(
            url.includes("/profiles")
              ? { profiles: [{ name: "alpha" }, { name: "beta" }] }
              : url.includes("/projects")
                ? { projects: [] }
                : url.includes("/capabilities")
                  ? { features: { native_chat: true } }
                  : url.includes("/v1/models")
                    ? { data: [] }
                    : url.includes("/model/options")
                      ? { providers: [] }
                      : { sessions: [], total: 0 },
          ),
        ),
    ),
  );
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  history.replaceState({}, "", "/");
});
async function open() {
  const router = createChatHermesRouter();
  const wrapper = mount(App, { global: { plugins: [router] } });
  await flushPromises();
  await flushPromises();
  return wrapper;
}
it("opens Home from the dashboard with compact sidebar navigation and a focusable composer", async () => {
  history.replaceState({}, "", "/chathermes");
  const wrapper = await open();
  expect(wrapper.vm.$route.name).toBe("home");
  expect(wrapper.find('[aria-label="Inbox view"]').exists()).toBe(false);
  expect(wrapper.text()).toContain("Alpha response");
  expect(wrapper.get(".sidebar").classes()).toContain("gap-0.5");
  for (const nav of [".inbox-nav", ".projects-nav", ".scheduled-nav", ".artifacts-nav"]) {
    expect(wrapper.get(nav).classes()).toContain("min-h-[36px]");
    expect(wrapper.get(nav).classes()).toContain("py-1");
  }
  expect(wrapper.get("textarea").attributes("disabled")).toBeUndefined();
  wrapper.unmount();
});
function readyNative() {
  const factory = nativeSession.useNativeSession;
  let activity: ((profile: string, session: string) => void) | undefined;
  vi.spyOn(nativeSession, "useNativeSession").mockImplementation((...args) => {
    activity = args[3];
    const owner = factory(...args);
    owner.attach = vi.fn(async () => {
      owner.connection.value = "ready";
    });
    return owner;
  });
  vi.spyOn(api, "session").mockResolvedValue({ id: "same" });
  return (profile = "alpha", session = "same") => activity!(profile, session);
}
it.each(["direct link", "router navigation"])(
  "deletes the opened session's read and unread notifications through %s, across pages",
  async (path) => {
    readyNative();
    vi.spyOn(api, "inbox").mockImplementation(async (_profile, options = {}) => ({
      items:
        options.limit === 1 ? [] : options.cursor ? [{ ...items[0]!, id: 3, read: true }] : items,
      unread: 2,
      byProfile: {},
      nextCursor: options.scope === "profile" && !options.cursor ? "100:1" : null,
    }));
    const removed = vi.spyOn(api, "deleteInboxItem").mockResolvedValue({});
    if (path === "direct link")
      history.replaceState({}, "", "/chathermes#/chat/same?profile=alpha");
    const wrapper = await open();
    if (path === "router navigation") {
      await wrapper.vm.$router.push("/chat/same?profile=alpha");
      await flushPromises();
    }
    expect(removed.mock.calls).toEqual([
      ["alpha", 1],
      ["alpha", 3],
    ]);
    expect(api.inbox).toHaveBeenCalledWith("alpha", {
      scope: "profile",
      limit: 100,
      cursor: "100:1",
    });
    wrapper.unmount();
  },
);
it("rechecks an already-open session on activity and reopening, including after failed deletion", async () => {
  const activity = readyNative();
  history.replaceState({}, "", "/chathermes#/chat/same?profile=alpha");
  const removed = vi
    .spyOn(api, "deleteInboxItem")
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValue({});
  const wrapper = await open();
  expect(removed).toHaveBeenCalledTimes(1);
  activity();
  await flushPromises();
  expect(removed).toHaveBeenCalledTimes(2);
  activity("beta");
  activity("alpha", "other");
  await flushPromises();
  expect(removed).toHaveBeenCalledTimes(2);
  await wrapper.vm.$router.push("/inbox?profile=alpha");
  await flushPromises();
  activity();
  await flushPromises();
  expect(removed).toHaveBeenCalledTimes(2);
  await wrapper.vm.$router.push("/chat/same?profile=alpha");
  await flushPromises();
  expect(removed).toHaveBeenCalledTimes(3);
  wrapper.unmount();
});
it("cleans up sessions in the implicit default profile", async () => {
  readyNative();
  vi.mocked(api.inbox).mockResolvedValue({
    items: [{ ...items[0]!, profile: "default" }],
    unread: 1,
    byProfile: {},
    nextCursor: null,
  });
  const removed = vi.spyOn(api, "deleteInboxItem").mockResolvedValue({});
  history.replaceState({}, "", "/chathermes#/chat/same");
  const wrapper = await open();
  expect(removed).toHaveBeenCalledWith("", 1);
  wrapper.unmount();
});
it("publishes the same session to the push worker again on final-message/reconnect activity", async () => {
  const activity = readyNative();
  const publish = vi.fn();
  const navigatorWithWorker = { onLine: true, userAgent: navigator.userAgent };
  Object.defineProperty(navigatorWithWorker, "serviceWorker", {
    value: {
      controller: { postMessage: publish },
      ready: Promise.resolve({ active: null }),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
  });
  vi.stubGlobal("navigator", navigatorWithWorker);
  vi.spyOn(api, "deleteInboxItem").mockResolvedValue({});
  history.replaceState({}, "", "/chathermes#/chat/same?profile=alpha");
  const wrapper = await open();
  publish.mockClear();
  activity();
  await flushPromises();
  expect(publish).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({
      type: "chathermes.session",
      profile: "alpha",
      session: "same",
      connected: true,
    }),
  );
  wrapper.unmount();
});
it("does not delete after navigation overtakes an Inbox lookup", async () => {
  readyNative();
  let finish!: (page: Awaited<ReturnType<typeof api.inbox>>) => void;
  vi.mocked(api.inbox).mockImplementation(async (_profile, options = {}) =>
    options.scope === "profile"
      ? new Promise((resolve) => {
          finish = resolve;
        })
      : {
          items: [],
          unread: 0,
          byProfile: {},
          nextCursor: null,
        },
  );
  const removed = vi.spyOn(api, "deleteInboxItem").mockResolvedValue({});
  history.replaceState({}, "", "/chathermes#/chat/same?profile=alpha");
  const wrapper = await open();
  await wrapper.vm.$router.push("/inbox?profile=alpha");
  await flushPromises();
  finish({ items, unread: 2, byProfile: {}, nextCursor: null });
  await flushPromises();
  expect(removed).not.toHaveBeenCalled();
  wrapper.unmount();
});
it("queues a new check when completion arrives during an earlier deletion", async () => {
  const activity = readyNative();
  let finish!: () => void;
  const removed = vi
    .spyOn(api, "deleteInboxItem")
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = () => resolve({});
        }),
    )
    .mockResolvedValue({});
  history.replaceState({}, "", "/chathermes#/chat/same?profile=alpha");
  const wrapper = await open();
  expect(removed).toHaveBeenCalledTimes(1);
  vi.mocked(api.inbox).mockResolvedValue({
    items: [{ ...items[0]!, id: 3 }],
    unread: 1,
    byProfile: {},
    nextCursor: null,
  });
  activity();
  finish();
  await flushPromises();
  expect(removed.mock.calls).toEqual([
    ["alpha", 1],
    ["alpha", 3],
  ]);
  wrapper.unmount();
});
it("keeps notifications when direct native attachment fails", async () => {
  const factory = nativeSession.useNativeSession;
  vi.spyOn(nativeSession, "useNativeSession").mockImplementation((...args) => {
    const owner = factory(...args);
    owner.attach = vi.fn(async () => {
      owner.connection.value = "stale";
    });
    return owner;
  });
  vi.spyOn(api, "session").mockResolvedValue({ id: "same" });
  const removed = vi.spyOn(api, "deleteInboxItem").mockResolvedValue({});
  history.replaceState({}, "", "/chathermes#/chat/same?profile=alpha");
  const wrapper = await open();
  await flushPromises();
  expect(removed).not.toHaveBeenCalled();
  wrapper.unmount();
});
it("shows global notifications and badge, filters profile, and keeps composer focusable with send gated", async () => {
  const wrapper = await open();
  expect(wrapper.get(".inbox-nav").text()).toContain("2");
  const region = wrapper.get('[aria-label="Inbox"]');
  expect(region.text()).toContain("Alpha response");
  expect(region.text()).toContain("Beta chat");
  expect(region.text()).not.toContain("Response completed");
  expect(region.text()).not.toContain("Unread");
  expect(region.text()).toContain("alpha");
  expect(region.text()).toContain("1/1/1970");
  expect(wrapper.get(".composer textarea").attributes("disabled")).toBeUndefined();
  expect(wrapper.get('[aria-label="Send message"]').attributes("disabled")).toBeDefined();
  await region.get("select").setValue("profile");
  await flushPromises();
  expect(region.text()).toContain("No unread notifications");
  wrapper.unmount();
});
it("carries the Inbox select through the route and list prop to scoped reads, including reload", async () => {
  history.replaceState({}, "", "/chathermes?profile=alpha#/inbox?profile=alpha");
  let wrapper = await open();
  const region = wrapper.get('[aria-label="Inbox"]');
  expect(region.text()).toContain("Beta chat");
  await region.get("select").setValue("profile");
  await flushPromises();
  expect(wrapper.vm.$route.query).toMatchObject({ profile: "alpha", scope: "profile" });
  expect(api.inbox).toHaveBeenCalledWith(
    "alpha",
    expect.objectContaining({ scope: "profile", unread: true }),
    expect.any(AbortSignal),
  );
  expect(region.text()).toContain("Alpha response");
  expect(region.text()).not.toContain("Beta chat");
  wrapper.unmount();
  wrapper = await open();
  const reloaded = wrapper.get('[aria-label="Inbox"]');
  expect((reloaded.get("select").element as HTMLSelectElement).value).toBe("profile");
  expect(reloaded.text()).toContain("Alpha response");
  expect(reloaded.text()).not.toContain("Beta chat");
  await reloaded.get("select").setValue("all");
  await flushPromises();
  expect(reloaded.text()).toContain("Beta chat");
  wrapper.unmount();
});
it("navigates to the owning profile and deletes only after successful native attachment", async () => {
  const factory = nativeSession.useNativeSession;
  const attached = vi.fn();
  vi.spyOn(nativeSession, "useNativeSession").mockImplementation((...args) => {
    const owner = factory(...args);
    owner.attach = vi.fn(async (profile, session) => {
      attached(profile, session);
      owner.connection.value = "ready";
    });
    return owner;
  });
  vi.spyOn(api, "session").mockResolvedValue({ id: "same" });
  const removed = vi.spyOn(api, "deleteInboxItem").mockImplementation(async () => {
    expect(attached).toHaveBeenCalledWith("beta", "same");
    return { read: true };
  });
  const wrapper = await open();
  await wrapper.get('[aria-label="Inbox"]').findAll("li .inbox-open")[1]!.trigger("click");
  await flushPromises();
  await flushPromises();
  expect(location.hash).toContain("/chat/same?profile=beta");
  expect(removed).toHaveBeenCalledWith("beta", 2);
  wrapper.unmount();
});
it("keeps unavailable chats unread and shows a retryable error", async () => {
  vi.spyOn(api, "session").mockRejectedValue(new Error("unavailable"));
  const removed = vi.spyOn(api, "deleteInboxItem");
  const wrapper = await open();
  await wrapper.get('[aria-label="Inbox"]').findAll("li .inbox-open")[0]!.trigger("click");
  await flushPromises();
  expect(wrapper.get('[role="alert"]').text()).toContain("remains unread");
  expect(removed).not.toHaveBeenCalled();
  expect(location.hash).toContain("/inbox");
  wrapper.unmount();
});

it("refreshes shared read changes on foregrounding and updates the badge and visible list", async () => {
  vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
  const wrapper = await open();
  vi.mocked(api.inbox).mockResolvedValue({
    items: [items[1]!],
    unread: 1,
    byProfile: { beta: 1 },
    nextCursor: null,
    revision: "2:1:0",
  });
  document.dispatchEvent(new Event("visibilitychange"));
  await flushPromises();
  await flushPromises();
  expect(wrapper.get(".inbox-nav").text()).toContain("1");
  const region = wrapper.get('[aria-label="Inbox"]');
  expect(region.text()).not.toContain("Alpha response");
  expect(region.text()).toContain("Beta chat");
  wrapper.unmount();
});

it("opens a worker notification on its board and task without attaching a chat", async () => {
  const { api: kanbanApi } = await import("./features/kanban/api");
  vi.spyOn(kanbanApi, "boards").mockResolvedValue({ boards: [{ slug: "work" }], current: "work" });
  vi.spyOn(kanbanApi, "workflow").mockResolvedValue({
    columns: [],
    manual: {},
    archived: "archived",
  });
  vi.spyOn(kanbanApi, "board").mockResolvedValue({
    columns: [],
    assignees: [],
    latest_event_id: 0,
  });
  vi.spyOn(kanbanApi, "task").mockResolvedValue({
    task: { id: "t_worker", title: "Worker task", status: "done" },
    comments: [],
    runs: [],
    events: [],
    attachments: [],
    links: { parents: [], children: [] },
  });
  vi.spyOn(kanbanApi, "log").mockResolvedValue({ exists: false, content: "", truncated: false });
  vi.spyOn(api, "session").mockResolvedValue({
    id: "same",
    source: "kanban",
    kanban_task: { board: "work", task: "t_worker" },
  });
  const deletion = vi.spyOn(api, "deleteInboxItem").mockResolvedValue({ deleted: true });
  const wrapper = await open();
  await wrapper.findAll('[data-session="same"] button')[0]!.trigger("click");
  await flushPromises();
  expect(wrapper.vm.$route.name).toBe("kanban");
  expect(wrapper.vm.$route.query).toMatchObject({
    board: "work",
    task: "t_worker",
    profile: "alpha",
  });
  expect(kanbanApi.task).toHaveBeenCalledWith("work", "t_worker");
  expect(deletion).toHaveBeenCalledWith("alpha", 1);
  expect(localStorage.getItem("chathermes.kanban-viewer")).toBe("true");
  expect(wrapper.find(".message.assistant").exists()).toBe(false);
  wrapper.unmount();
  localStorage.removeItem("chathermes.kanban-viewer");
});

it("keeps a worker notification unread when no persisted task can be resolved", async () => {
  vi.spyOn(api, "session").mockResolvedValue({ id: "same", source: "kanban", kanban_task: null });
  const deletion = vi.spyOn(api, "deleteInboxItem");
  const wrapper = await open();
  await wrapper.findAll('[data-session="same"] button')[0]!.trigger("click");
  await flushPromises();
  expect(wrapper.vm.$route.name).toBe("inbox");
  expect(wrapper.get('[role="alert"]').text()).toContain("remains unread");
  expect(deletion).not.toHaveBeenCalled();
  wrapper.unmount();
});

it("shows only five recent global messages on Home and refills after removal without opening", async () => {
  const recent = Array.from({ length: 7 }, (_, index) => ({
    ...items[index % 2]!,
    id: 10 + index,
    session: `recent-${index}`,
    title: `Recent ${index}`,
    occurred: 1000 - index,
  }));
  vi.mocked(api.inbox).mockImplementation(async (_profile, options = {}) => ({
    items: recent.slice(0, options.limit || 50),
    unread: recent.length,
    byProfile: {},
    nextCursor: recent.length > (options.limit || 50) ? "next" : null,
    revision: String(recent.length),
  }));
  const deleted = vi.spyOn(api, "deleteInboxItem").mockImplementation(async (profile, id) => {
    expect(profile).toBe("alpha");
    recent.splice(
      recent.findIndex((item) => item.id === id),
      1,
    );
    return { deleted: true };
  });
  const session = vi.spyOn(api, "session");
  history.replaceState({}, "", "/chathermes");
  const wrapper = await open();
  const region = wrapper.get('[aria-label="Recent inbox messages"]');
  expect(region.findAll("li")).toHaveLength(5);
  expect(region.findAll(".inbox-open").map((row) => row.text())).toEqual(
    recent.slice(0, 5).map((item) => expect.stringContaining(item.title)),
  );
  expect(region.find("select").exists()).toBe(false);
  expect(region.text()).not.toContain("Load More");
  expect(wrapper.find('[data-test="refresh-inbox"]').exists()).toBe(false);
  expect(api.inbox).toHaveBeenCalledWith(
    "",
    expect.objectContaining({ scope: "all", limit: 5, unread: true }),
    expect.any(AbortSignal),
  );
  expect(wrapper.get("textarea").attributes("disabled")).toBeUndefined();
  await region.get('[aria-label="Remove Recent 0 from inbox"]').trigger("click");
  await flushPromises();
  expect(deleted).toHaveBeenCalledExactlyOnceWith("alpha", 10);
  expect(session).not.toHaveBeenCalled();
  expect(wrapper.vm.$route.name).toBe("home");
  expect(region.findAll("li")).toHaveLength(5);
  expect(region.text()).not.toContain("Recent 0");
  expect(region.text()).toContain("Recent 5");
  expect(wrapper.get(".inbox-nav").text()).toContain("6");
  wrapper.unmount();
});

it("removes a full-Inbox message through its owning profile and retains failures for retry", async () => {
  const deleted = vi
    .spyOn(api, "deleteInboxItem")
    .mockRejectedValueOnce(new Error("private failure detail"))
    .mockImplementation(async () => {
      vi.mocked(api.inbox).mockResolvedValue({
        items: [items[0]!],
        unread: 1,
        byProfile: { alpha: 1 },
        nextCursor: null,
        revision: "removed",
      });
      return { deleted: true };
    });
  const session = vi.spyOn(api, "session");
  const wrapper = await open();
  const region = wrapper.get('[aria-label="Inbox"]');
  await region.get('[aria-label="Remove Beta chat from inbox"]').trigger("click");
  await flushPromises();
  expect(region.get('[role="alert"]').text()).toBe(
    "Could not remove this notification. Try again.",
  );
  expect(region.findAll("li")).toHaveLength(2);
  await region.get('[aria-label="Remove Beta chat from inbox"]').trigger("click");
  await flushPromises();
  expect(deleted.mock.calls).toEqual([
    ["beta", 2],
    ["beta", 2],
  ]);
  expect(session).not.toHaveBeenCalled();
  expect(wrapper.vm.$route.name).toBe("inbox");
  expect(region.findAll("li")).toHaveLength(1);
  expect(region.find('[role="alert"]').exists()).toBe(false);
  expect(wrapper.get(".inbox-nav").text()).toContain("1");
  wrapper.unmount();
});

it("guards duplicate removal and ignores a late failure after changing Inbox scope", async () => {
  let fail!: (error: Error) => void;
  const deleted = vi.spyOn(api, "deleteInboxItem").mockImplementation(
    () =>
      new Promise((_resolve, reject) => {
        fail = reject;
      }),
  );
  history.replaceState({}, "", "/chathermes#/inbox?profile=beta");
  const wrapper = await open();
  const region = wrapper.get('[aria-label="Inbox"]');
  const remove = region.get('[aria-label="Remove Alpha chat from inbox"]');
  await remove.trigger("click");
  expect(remove.attributes("disabled")).toBeDefined();
  expect(region.get(".inbox-open").attributes("disabled")).toBeDefined();
  await remove.trigger("click");
  expect(deleted).toHaveBeenCalledExactlyOnceWith("alpha", 1);
  await region.get("select").setValue("profile");
  await flushPromises();
  fail(new Error("obsolete error"));
  await flushPromises();
  expect(region.find('[role="alert"]').exists()).toBe(false);
  expect(region.text()).not.toContain("Alpha chat");
  expect(region.text()).toContain("Beta chat");
  expect(region.get(".inbox-open").attributes("disabled")).toBeUndefined();
  wrapper.unmount();
});

it("keeps empty Home available for a new draft without Inbox controls", async () => {
  vi.mocked(api.inbox).mockResolvedValue({ items: [], unread: 0, byProfile: {}, nextCursor: null });
  history.replaceState({}, "", "/chathermes#/");
  const wrapper = await open();
  expect(wrapper.get('[aria-label="Recent inbox messages"]').text()).toContain(
    "No unread notifications.",
  );
  expect(wrapper.find('[aria-label="Inbox view"]').exists()).toBe(false);
  await wrapper.get("textarea").setValue("New draft");
  expect((wrapper.get("textarea").element as HTMLTextAreaElement).value).toBe("New draft");
  expect(wrapper.get("textarea").attributes("disabled")).toBeUndefined();
  wrapper.unmount();
});

it("does not reload a retired Home preview when removal finishes after navigation", async () => {
  let finish!: () => void;
  vi.spyOn(api, "deleteInboxItem").mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = () => resolve({ deleted: true });
      }),
  );
  history.replaceState({}, "", "/chathermes#/");
  const wrapper = await open();
  await wrapper.get('[aria-label="Remove Alpha chat from inbox"]').trigger("click");
  await wrapper.vm.$router.push("/projects");
  await flushPromises();
  const previewReads = () =>
    vi.mocked(api.inbox).mock.calls.filter(([, options]) => options?.limit === 5).length;
  const before = previewReads();
  finish();
  await flushPromises();
  expect(previewReads()).toBe(before);
  expect(wrapper.vm.$route.name).toBe("projects");
  wrapper.unmount();
});

it("synchronizes sidebar unread indicators across Inbox pages, receipts, reads, removals and reloads without changing tracking", async () => {
  vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
  const sessions = [
    { id: "same", title: "Alpha chat" },
    { id: "older", title: "Older active chat" },
    { id: "read", title: "Read chat" },
  ];
  vi.spyOn(api, "sessions").mockResolvedValue({ sessions, total: 3 });
  const tracking = [
    { session_id: "older", status: "open" as const, updated_at: "2026-10-29" },
    { session_id: "same", status: "settled" as const, updated_at: "2026-10-30" },
  ];
  vi.mocked(api.tracking).mockResolvedValue({ tracking, sessions: [sessions[1]!] });
  const track = vi.spyOn(api, "track");
  let notices = [
    items[1]!,
    { ...items[0]!, id: 3, session: "read", read: true },
    items[0]!,
    { ...items[0]!, id: 4, session: "older", title: "Older active chat" },
  ];
  let revision = 0;
  vi.mocked(api.inbox).mockImplementation(async (_profile, options = {}) => {
    const rows = options.unread ? notices.filter((item) => !item.read) : notices;
    return {
      items: options.limit === 100 ? (options.cursor ? rows.slice(1) : rows.slice(0, 1)) : rows,
      unread: notices.filter((item) => !item.read).length,
      byProfile: {},
      nextCursor: options.limit === 100 && !options.cursor && rows.length > 1 ? "next" : null,
      revision: String(revision),
    };
  });
  vi.spyOn(api, "deleteInboxItem").mockImplementation(async (profile, id) => {
    notices = notices.filter((item) => item.profile !== profile || item.id !== id);
    revision++;
    return { deleted: true };
  });
  history.replaceState({}, "", "/chathermes#/inbox?profile=alpha");
  let wrapper = await open();
  const rows = () => wrapper.findAll(".session-select");
  const unread = () => rows().map((row) => row.find(".session-unread").exists());
  const refresh = async () => {
    revision++;
    document.dispatchEvent(new Event("visibilitychange"));
    await flushPromises();
    await flushPromises();
  };
  expect(rows().map((row) => row.text())).toEqual([
    expect.stringContaining("Older active chat"),
    expect.stringContaining("Alpha chat"),
    expect.stringContaining("Read chat"),
  ]);
  expect(unread()).toEqual([true, true, false]);
  expect(rows()[1]!.find(".font-semibold").text()).toBe("Alpha chat");
  expect(rows()[1]!.find(".sr-only").text()).toBe("Unread");
  expect(rows()[1]!.get(".session-unread").attributes("aria-hidden")).toBe("true");
  expect(api.inbox).toHaveBeenCalledWith(
    expect.any(String),
    { limit: 100, unread: true, cursor: "next" },
    expect.any(AbortSignal),
  );
  // The same ID in beta remains unread after alpha is read externally.
  notices = notices.map((item) =>
    item.profile === "alpha" && item.session === "same" ? { ...item, read: true } : item,
  );
  await refresh();
  expect(unread()).toEqual([true, false, false]);
  await wrapper.vm.$router.push("/inbox?profile=beta");
  await flushPromises();
  expect(unread()).toEqual([false, true, false]);
  await wrapper.vm.$router.push("/inbox?profile=alpha");
  await flushPromises();
  // A new receipt restores the indicator without reopening the settled chat.
  notices = notices.filter((item) => !(item.profile === "alpha" && item.session === "same"));
  notices.push({ ...items[0]!, id: 5 });
  await refresh();
  expect(unread()).toEqual([true, true, false]);
  await wrapper.get('[aria-label="Remove Alpha chat from inbox"]').trigger("click");
  await flushPromises();
  expect(unread()).toEqual([true, false, false]);
  notices = [];
  await refresh();
  expect(unread()).toEqual([false, false, false]);
  expect(wrapper.findAll(".settle-session")).toHaveLength(1);
  expect(track).not.toHaveBeenCalled();
  notices = [{ ...items[0]!, id: 6 }];
  wrapper.unmount();
  wrapper = await open();
  expect(unread()).toEqual([false, true, false]);
  expect(wrapper.findAll(".settle-session")).toHaveLength(1);
  wrapper.unmount();
});

it("retains complete unread state on failed refresh and ignores an overtaken paginated response", async () => {
  vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
  vi.spyOn(api, "sessions").mockResolvedValue({
    sessions: [{ id: "same", title: "Alpha chat" }],
    total: 1,
  });
  history.replaceState({}, "", "/chathermes#/projects?profile=alpha");
  const wrapper = await open();
  expect(wrapper.find(".session-unread").exists()).toBe(true);
  vi.mocked(api.inbox).mockRejectedValue(new Error("offline"));
  document.dispatchEvent(new Event("visibilitychange"));
  await flushPromises();
  expect(wrapper.find(".session-unread").exists()).toBe(true);
  let finish!: (page: Awaited<ReturnType<typeof api.inbox>>) => void;
  vi.mocked(api.inbox).mockImplementation(async (_profile, options = {}) =>
    options.cursor
      ? new Promise((resolve) => {
          finish = resolve;
        })
      : { items, unread: 2, byProfile: {}, nextCursor: "next" },
  );
  document.dispatchEvent(new Event("visibilitychange"));
  await flushPromises();
  vi.mocked(api.inbox).mockResolvedValue({ items: [], unread: 0, byProfile: {}, nextCursor: null });
  document.dispatchEvent(new Event("visibilitychange"));
  await flushPromises();
  expect(wrapper.find(".session-unread").exists()).toBe(false);
  finish({ items, unread: 2, byProfile: {}, nextCursor: null });
  await flushPromises();
  expect(wrapper.find(".session-unread").exists()).toBe(false);
  wrapper.unmount();
});

it("finishes slow unread pagination across poll ticks and projects the current profile", async () => {
  vi.useFakeTimers({ toFake: ["setInterval", "clearInterval"] });
  vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
  vi.spyOn(api, "sessions").mockResolvedValue({
    sessions: [{ id: "same", title: "Shared ID" }],
    total: 1,
  });
  let finish!: (page: Awaited<ReturnType<typeof api.inbox>>) => void;
  let signal!: AbortSignal;
  const scan = vi.mocked(api.inbox).mockImplementation(async (_profile, options = {}, abort) => {
    signal = abort!;
    return options.cursor
      ? new Promise((resolve) => {
          finish = resolve;
        })
      : { items: [items[0]!], unread: 2, byProfile: {}, nextCursor: "next" };
  });
  history.replaceState({}, "", "/chathermes#/projects?profile=alpha");
  const wrapper = await open();
  try {
    await vi.advanceTimersByTimeAsync(45000);
    expect(scan).toHaveBeenCalledTimes(2);
    expect(signal.aborted).toBe(false);
    expect(wrapper.find(".session-unread").exists()).toBe(false);
    await wrapper.vm.$router.push("/projects?profile=beta");
    await flushPromises();
    finish({ items: [items[1]!], unread: 2, byProfile: {}, nextCursor: null });
    await flushPromises();
    expect(wrapper.find(".session-unread").exists()).toBe(true);
    expect(wrapper.get(".inbox-nav").text()).toContain("2");
    scan.mockResolvedValue({ items: [], unread: 0, byProfile: {}, nextCursor: null });
    await vi.advanceTimersByTimeAsync(15000);
    await flushPromises();
    expect(scan).toHaveBeenCalledTimes(3);
    expect(wrapper.find(".session-unread").exists()).toBe(false);
  } finally {
    wrapper.unmount();
    vi.useRealTimers();
  }
});

it("supersedes slow unread scans after removal and keeps the replacement protected from polling", async () => {
  vi.useFakeTimers({ toFake: ["setInterval", "clearInterval"] });
  vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
  const wrapper = await open();
  try {
    const pending: {
      finish: (page: Awaited<ReturnType<typeof api.inbox>>) => void;
      signal: AbortSignal;
    }[] = [];
    vi.mocked(api.inbox).mockImplementation(async (_profile, options = {}, signal) =>
      options.limit === 100
        ? new Promise((finish) => pending.push({ finish, signal: signal! }))
        : { items: [items[1]!], unread: 1, byProfile: {}, nextCursor: null },
    );
    await vi.advanceTimersByTimeAsync(15000);
    expect(pending).toHaveLength(1);
    vi.spyOn(api, "deleteInboxItem").mockResolvedValue({ deleted: true });
    await wrapper.get('[aria-label="Remove Alpha chat from inbox"]').trigger("click");
    await flushPromises();
    expect(pending).toHaveLength(2);
    expect(pending[0]!.signal.aborted).toBe(true);
    pending[0]!.finish({ items, unread: 2, byProfile: {}, nextCursor: null });
    await flushPromises();
    await vi.advanceTimersByTimeAsync(30000);
    expect(pending).toHaveLength(2);
    expect(pending[1]!.signal.aborted).toBe(false);
    pending[1]!.finish({ items: [items[1]!], unread: 1, byProfile: {}, nextCursor: null });
    await flushPromises();
    expect(wrapper.get(".inbox-nav").text()).toContain("1");
    await vi.advanceTimersByTimeAsync(15000);
    expect(pending).toHaveLength(3);
    wrapper.unmount();
    expect(pending[2]!.signal.aborted).toBe(true);
    pending[2]!.finish({ items, unread: 2, byProfile: {}, nextCursor: null });
    await flushPromises();
  } finally {
    if (wrapper.exists()) wrapper.unmount();
    vi.useRealTimers();
  }
});
