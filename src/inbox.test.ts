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
      nextCursor: options.limit === 100 && !options.cursor ? "100:1" : null,
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
    options.limit === 100
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
  await wrapper.get('[aria-label="Inbox"]').findAll("li button")[1]!.trigger("click");
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
  await wrapper.get('[aria-label="Inbox"]').findAll("li button")[0]!.trigger("click");
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
