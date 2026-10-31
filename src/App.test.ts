// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { mount as vueMount, flushPromises } from "@vue/test-utils";
import { createChatHermesRouter } from "./router";
function routeUrl() {
  return new URL(location.hash.slice(1) || "/", location.origin);
}
const mount: typeof vueMount = (component, options = {}) =>
  vueMount(component, {
    ...options,
    global: {
      ...options.global,
      plugins: [...(options.global?.plugins || []), createChatHermesRouter()],
    },
  });
import { computed, ref } from "vue";
import { api } from "./services/hermes-api";
import App from "./App.vue";
import SessionSidebar from "./features/sessions/components/SessionSidebar.vue";
import ScheduledPage from "./features/scheduled/components/ScheduledPage.vue";
import type { Session } from "./types/hermes";
import * as push from "./features/notifications/services/push";
import * as nativeSession from "./features/chat/runtime/native-session";
beforeEach(() => {
  vi.spyOn(api, "tracking").mockResolvedValue({ tracking: [], sessions: [] });
});
beforeEach(() => {
  history.replaceState({}, "", "/chathermes?profile=alpha#/?profile=alpha");
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  history.replaceState({}, "", "/chathermes");
  localStorage.clear();
});
const json = (value: unknown) =>
  new Response(JSON.stringify(value), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
function mockFetch(fake: (input: string, init?: RequestInit) => Promise<Response>) {
  vi.stubGlobal("fetch", async (input: string, init?: RequestInit) => {
    if (input.endsWith("/profiles"))
      return json({ profiles: [{ name: "alpha" }, { name: "beta" }] });
    if (/\/projects(?:\?|$)/.test(input)) return json({ projects: [] });
    if (input.includes("/v1/models")) return json({ data: [{ id: "Instant" }] });
    return fake(input, init);
  });
}
function deferred<T>() {
  let resolve!: (value: T) => void, reject!: (reason: Error) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
const streaming = { features: { native_chat: true } };
describe("settings page", () => {
  it("reports mounted native session and connection through home, views, profiles and unmount", async () => {
    const factory = nativeSession.useNativeSession;
    let owner!: ReturnType<typeof factory>;
    vi.spyOn(nativeSession, "useNativeSession").mockImplementation((callback) => {
      owner = factory(callback);
      owner.attach = vi.fn(async () => {
        owner.connection.value = "ready";
      });
      return owner;
    });
    mockFetch(
      vi.fn(async (input) =>
        json(
          input.includes("/capabilities")
            ? { features: { native_chat: true } }
            : { sessions: [], total: 0 },
        ),
      ),
    );
    const addEventListener = vi.fn(),
      removeEventListener = vi.fn(),
      publish = vi.fn();
    vi.stubGlobal("navigator", {
      onLine: true,
      serviceWorker: {
        ready: Promise.resolve({ active: { postMessage: publish } }),
        addEventListener,
        removeEventListener,
      },
    });
    vi.spyOn(push, "state").mockResolvedValue({
      supported: false,
      permission: "unsupported",
      subscribed: false,
      available: false,
      error: "",
    });
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
    vi.spyOn(document, "hasFocus").mockReturnValue(false);
    const wrapper = mount(App);
    await flushPromises();
    const listener = addEventListener.mock.calls.find((call) => call[0] === "message")![1];
    const postMessage = vi.fn();
    const query = () =>
      listener({ data: { type: "chathermes.session.query" }, ports: [{ postMessage }] });
    query();
    expect(postMessage).toHaveBeenLastCalledWith(
      expect.objectContaining({ profile: "alpha", session: "", connected: false }),
    );
    history.replaceState({}, "", "/chathermes?profile=alpha#/chat/push_one?profile=alpha");
    window.dispatchEvent(new PopStateEvent("popstate"));
    await flushPromises();
    query();
    expect(postMessage).toHaveBeenLastCalledWith({
      type: "chathermes.session",
      url: location.href,
      profile: "alpha",
      session: "push_one",
      connected: true,
      visible: false,
    });
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
    document.dispatchEvent(new Event("visibilitychange"));
    query();
    expect(postMessage).toHaveBeenLastCalledWith(
      expect.objectContaining({
        profile: "alpha",
        session: "push_one",
        connected: true,
        visible: true,
      }),
    );
    owner.connection.value = "stale";
    await flushPromises();
    query();
    expect(publish).toHaveBeenLastCalledWith(
      expect.objectContaining({ session: "push_one", connected: false }),
    );
    expect(postMessage).toHaveBeenLastCalledWith(
      expect.objectContaining({ session: "push_one", connected: false }),
    );
    owner.connection.value = "ready";
    await flushPromises();
    await wrapper.get(".scheduled-nav").trigger("click");
    await flushPromises();
    query();
    expect(postMessage).toHaveBeenLastCalledWith(
      expect.objectContaining({ session: "", connected: false }),
    );
    history.replaceState({}, "", "/chathermes?profile=beta#/chat/push_two?profile=beta");
    window.dispatchEvent(new PopStateEvent("popstate"));
    await flushPromises();
    query();
    expect(postMessage).toHaveBeenLastCalledWith(
      expect.objectContaining({ profile: "beta", session: "push_two", connected: true }),
    );
    wrapper.unmount();
    expect(publish).toHaveBeenLastCalledWith(
      expect.objectContaining({ session: "", connected: false }),
    );
    expect(removeEventListener).toHaveBeenCalledWith("message", listener);
  });
  it("renders the ChatHermes title without a sidebar logo", async () => {
    mockFetch(vi.fn(async () => json({ sessions: [], total: 0 })));
    const wrapper = mount(App);
    await flushPromises();
    expect(wrapper.get(".brand").text()).toContain("ChatHermes");
    expect(wrapper.find(".brand img").exists()).toBe(false);
    wrapper.unmount();
  });

  it("shows a global Keep Screen Awake toggle that persists across profiles and remounts", async () => {
    mockFetch(vi.fn(async () => json({ sessions: [], total: 0 })));
    const request = vi.fn().mockResolvedValue({
      released: false,
      release: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    vi.stubGlobal("navigator", { wakeLock: { request } });
    const wrapper = mount(App);
    await flushPromises();
    await wrapper.get(".drawer-settings").trigger("click");
    await flushPromises();
    const toggle = wrapper.get('input[aria-labelledby="wake-lock-heading"]');
    expect(toggle.element).toMatchObject({ checked: false });
    await toggle.setValue(true);
    await flushPromises();
    expect(request).toHaveBeenCalledWith("screen");
    expect(localStorage.getItem("chathermes.keep-screen-awake")).toBe("true");
    expect(wrapper.get("#settings-app-heading").text()).toBe("Global settings");
    await wrapper.get("#settings-profile").setValue("beta");
    await flushPromises();
    expect(wrapper.get('input[aria-labelledby="wake-lock-heading"]').element).toMatchObject({
      checked: true,
    });
    wrapper.unmount();
    const restored = mount(App);
    await flushPromises();
    expect(request).toHaveBeenCalledTimes(2);
    await restored.get(".drawer-settings").trigger("click");
    const restoredToggle = restored.get('input[aria-labelledby="wake-lock-heading"]');
    expect(restoredToggle.element).toMatchObject({ checked: true });
    await restoredToggle.setValue(false);
    expect(localStorage.getItem("chathermes.keep-screen-awake")).toBe("false");
    restored.unmount();
  });

  it("refreshes profile status and rejects stale status and action results after switching profiles", async () => {
    mockFetch(vi.fn(async () => json({ sessions: [], total: 0 })));
    const oldState = deferred<push.PushState>(),
      action = deferred<void>();
    const enabled = {
      supported: true,
      permission: "granted" as const,
      subscribed: true,
      available: true,
      error: "",
    };
    const state = vi
      .spyOn(push, "state")
      .mockImplementation(async (p) =>
        p === "alpha" ? enabled : { ...enabled, subscribed: false },
      );
    const disable = vi.spyOn(push, "unsubscribe").mockReturnValue(action.promise);
    const wrapper = mount(App);
    await flushPromises();
    await wrapper.get(".drawer-settings").trigger("click");
    await flushPromises();
    expect(wrapper.get(".push-setting").text()).toContain("Notifications for alpha");
    await wrapper.get(".push-setting button").trigger("click");
    await flushPromises();
    expect(disable).toHaveBeenCalledWith("alpha");
    state.mockImplementation((p) =>
      p === "alpha" ? oldState.promise : Promise.resolve({ ...enabled, subscribed: false }),
    );
    await wrapper.get("#profile-field").setValue("beta");
    await flushPromises();
    await wrapper.get(".drawer-settings").trigger("click");
    await flushPromises();
    expect(wrapper.get(".push-setting").text()).toContain("Notifications for beta");
    expect(wrapper.get(".push-setting").text()).toContain("Notifications disabled for beta");
    action.reject(new Error("Alpha action failed"));
    await flushPromises();
    expect(wrapper.get(".push-setting").text()).not.toContain("Alpha action failed");
    await wrapper.get("#profile-field").setValue("alpha");
    await flushPromises();
    await wrapper.get("#profile-field").setValue("beta");
    await flushPromises();
    oldState.resolve(enabled);
    await flushPromises();
    await wrapper.get(".drawer-settings").trigger("click");
    await flushPromises();
    expect(wrapper.get(".push-setting button").text()).toBe("Enable notifications");
    expect(state).toHaveBeenCalledWith("beta");
    wrapper.unmount();
  });

  it("opens a dedicated settings page, closes the drawer and restores focus", async () => {
    mockFetch(vi.fn(async () => json({ sessions: [], total: 0 })));
    const wrapper = mount(App, { attachTo: document.body });
    await flushPromises();
    const sidebar = wrapper.get(".sidebar");
    expect(sidebar.findAll('[aria-label="New chat"]')).toHaveLength(1);
    expect(sidebar.get(".profile-field").element.nextElementSibling).toBe(
      sidebar.get(".drawer-chat").element,
    );
    expect(sidebar.get(".drawer-chat").element.nextElementSibling).toBe(
      sidebar.get(".drawer-settings").element,
    );
    expect(wrapper.find(".push-setting").exists()).toBe(false);
    expect(sidebar.find(".sidebar-foot .drawer-chat").exists()).toBe(true);
    await wrapper.get('[aria-label="Open navigation"]').trigger("click");
    await flushPromises();
    await wrapper.get('[aria-label="Settings"]').trigger("click");
    await flushPromises();
    const panel = wrapper.get(".settings-page");
    expect(panel.get("h2").element).toBe(document.activeElement);
    expect(wrapper.get(".drawer-settings").attributes("aria-current")).toBe("page");
    expect(routeUrl().pathname).toBe("/settings");
    expect(wrapper.get('[aria-label="Open navigation"]').attributes("aria-expanded")).toBe("false");
    expect(panel.text()).toContain("Enable notifications");
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flushPromises();
    expect(wrapper.find(".settings-page").exists()).toBe(false);
    expect(wrapper.get(".drawer-settings").element).toBe(document.activeElement);
    expect(wrapper.get('[aria-label="Open navigation"]').attributes("aria-expanded")).toBe("false");
    await wrapper.get('[aria-label="Open navigation"]').trigger("click");
    await flushPromises();
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flushPromises();
    expect(wrapper.get('[aria-label="Open navigation"]').element).toBe(document.activeElement);
    wrapper.unmount();
  });
  it("preserves the composer draft and live runtime across settings history", async () => {
    const factory = nativeSession.useNativeSession;
    let owner!: ReturnType<typeof factory>;
    vi.spyOn(nativeSession, "useNativeSession").mockImplementation((callback) => {
      owner = factory(callback);
      owner.attach = vi.fn(async () => {
        owner.connection.value = "ready";
      });
      return owner;
    });
    history.replaceState({}, "", "/chathermes?profile=alpha#/chat/live-chat?profile=alpha");
    const fake = vi.fn(async (input: string) =>
      json(
        input.includes("/capabilities")
          ? { features: { native_chat: true } }
          : { sessions: [], total: 0 },
      ),
    );
    mockFetch(fake);
    const wrapper = mount(App, { attachTo: document.body });
    await flushPromises();
    const close = vi.spyOn(owner, "close");
    owner.busy.value = true;
    const composer = wrapper.get(".composer").element;
    const textarea = wrapper.get("textarea");
    await textarea.setValue("Unsent draft");
    const chatUrl = location.href;
    await wrapper.get(".drawer-settings").trigger("click");
    await flushPromises();
    const settingsUrl = location.href;
    expect(wrapper.get(".settings-page").text()).toContain("Settings");
    expect(wrapper.find('[role="dialog"][aria-label="Settings"]').exists()).toBe(false);
    const chatRequests = () => fake.mock.calls.filter(([url]) => !url.includes("/inbox?"));
    const requests = chatRequests().length;
    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    expect(wrapper.find(".settings-page").exists()).toBe(true);
    for (const url of [chatUrl, settingsUrl, chatUrl]) {
      history.replaceState({}, "", url);
      window.dispatchEvent(new PopStateEvent("popstate"));
      await flushPromises();
      expect(wrapper.find(".settings-page").exists()).toBe(url === settingsUrl);
    }
    await flushPromises();
    expect(close).not.toHaveBeenCalled();
    expect(owner.attach).toHaveBeenCalledTimes(1);
    expect(owner.busy.value).toBe(true);
    // Reopening the chat checks Inbox again without reloading its runtime/history.
    expect(chatRequests()).toHaveLength(requests);
    expect(wrapper.get(".composer").element).toBe(composer);
    expect((textarea.element as HTMLTextAreaElement).value).toBe("Unsent draft");
    for (const selector of [".projects-nav", ".artifacts-nav"]) {
      await wrapper.get(selector).trigger("click");
      await flushPromises();
      expect(wrapper.get(".composer").element).toBe(composer);
      expect((textarea.element as HTMLTextAreaElement).value).toBe("Unsent draft");
      expect(owner.busy.value).toBe(true);
      history.replaceState({}, "", chatUrl);
      window.dispatchEvent(new PopStateEvent("popstate"));
      await flushPromises();
    }
    expect(nativeSession.useNativeSession).toHaveBeenCalledTimes(1);
    expect(owner.attach).toHaveBeenCalledTimes(1);
    expect(close).not.toHaveBeenCalled();
    await textarea.trigger("focus");
    await flushPromises();
    expect(textarea.attributes("disabled")).toBeUndefined();
    wrapper.unmount();
  });
  it("loads settings links and returns to archived projects, then keeps profile changes on settings", async () => {
    history.replaceState(
      {},
      "",
      "/chathermes?profile=alpha#/settings?profile=alpha&archived=1&return_to=%2Fprojects%3Fprofile%3Dalpha%26archived%3D1",
    );
    mockFetch(vi.fn(async () => json({ sessions: [], total: 0 })));
    vi.spyOn(push, "state").mockImplementation(async () => ({
      supported: false,
      permission: "unsupported",
      subscribed: false,
      available: false,
      error: "",
    }));
    const wrapper = mount(App);
    await flushPromises();
    expect(wrapper.get(".settings-page").text()).toContain("Notifications for alpha");
    await wrapper.get('[aria-label="Close settings"]').trigger("click");
    await flushPromises();
    expect(routeUrl().pathname).toBe("/projects");
    expect(new URLSearchParams(routeUrl().search).get("archived")).toBe("1");
    await wrapper.get(".drawer-settings").trigger("click");
    await flushPromises();
    expect(
      new URL(routeUrl().searchParams.get("return_to")!, location.origin).searchParams.get(
        "archived",
      ),
    ).toBe("1");
    await wrapper.get("#settings-profile").setValue("beta");
    await flushPromises();
    expect(wrapper.get(".settings-page").text()).toContain("Notifications for beta");
    expect(routeUrl().pathname).toBe("/settings");
    expect(new URLSearchParams(routeUrl().search).get("profile")).toBe("beta");
    await wrapper.get('[aria-label="Close settings"]').trigger("click");
    await flushPromises();
    expect(wrapper.find(".projects-page").exists()).toBe(false);
    wrapper.unmount();
  });
  it("offers screen actions in the top bar while retaining profile settings", async () => {
    mockFetch(vi.fn(async () => json({ sessions: [], total: 0 })));
    const wrapper = mount(App);
    await flushPromises();
    expect(wrapper.get(".drawer-chat").attributes("aria-label")).toBe("New chat");
    expect(wrapper.find(".drawer-settings").exists()).toBe(true);
    await wrapper.get('[aria-label="Screen options"]').trigger("click");
    await flushPromises();
    const menu = wrapper.get('[role="menu"]');
    expect(menu.get('[role="menuitem"]').text()).toBe("New chat");
    await menu.trigger("keydown", { key: "Escape" });
    await flushPromises();
    await flushPromises();
    expect(wrapper.find('[role="menu"]').exists()).toBe(false);
    expect(wrapper.get('[aria-label="Screen options"]').attributes("aria-expanded")).toBe("false");
    wrapper.unmount();
  });
  it("dismisses screen options outside without stealing focus, and preserves toggle, actions and Escape", async () => {
    const fake = vi.fn(async (input: string, init?: RequestInit) =>
      init?.method === "POST"
        ? json({ id: "new-session" })
        : input.includes("/v1/capabilities")
          ? json({})
          : json({ sessions: [], total: 0 }),
    );
    mockFetch(fake);
    const wrapper = mount(App, { attachTo: document.body });
    await flushPromises();
    const button = wrapper.get('[aria-label="Screen options"]');
    await button.trigger("click");
    await flushPromises();
    await wrapper.get('[role="menuitem"]').trigger("pointerdown");
    await flushPromises();
    expect(wrapper.find('[role="menu"]').exists()).toBe(true);
    await button.trigger("click");
    await flushPromises();
    await button.trigger("click");
    await flushPromises();
    await button.trigger("click");
    await flushPromises();
    expect(wrapper.find('[role="menu"]').exists()).toBe(false);
    await button.trigger("click");
    await flushPromises();
    const textarea = wrapper.get("textarea");
    (textarea.element as HTMLTextAreaElement).focus();
    await textarea.trigger("click");
    await flushPromises();
    expect(wrapper.find('[role="menu"]').exists()).toBe(false);
    expect(document.activeElement).toBe(textarea.element);
    await button.trigger("click");
    await flushPromises();
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flushPromises();
    expect(wrapper.find('[role="menu"]').exists()).toBe(false);
    expect(document.activeElement).toBe(button.element);
    await textarea.setValue("Draft");
    await button.trigger("click");
    await flushPromises();
    await wrapper.get('[role="menuitem"]').trigger("click");
    await flushPromises();
    await flushPromises();
    expect(wrapper.find('[role="menu"]').exists()).toBe(false);
    expect(fake.mock.calls.some(([, init]) => init?.method === "POST")).toBe(true);
    expect(document.activeElement).toBe(button.element);
    const removeListener = vi.spyOn(document, "removeEventListener");
    wrapper.unmount();
    expect(removeListener).toHaveBeenCalledWith("click", expect.any(Function));
  });
  it("retains the notification toggle, busy state, status and profile scope inside settings", async () => {
    mockFetch(vi.fn(async () => json({ sessions: [], total: 0 })));
    const subscription = deferred<void>();
    vi.spyOn(push, "state").mockResolvedValue({
      supported: true,
      permission: "granted",
      subscribed: false,
      available: true,
      error: "",
    });
    const subscribe = vi.spyOn(push, "subscribe").mockReturnValue(subscription.promise);
    const unsubscribe = vi.spyOn(push, "unsubscribe").mockResolvedValue();
    const sendTest = vi.spyOn(push, "sendTest").mockResolvedValue();
    const wrapper = mount(App);
    await flushPromises();
    await wrapper.get(".drawer-settings").trigger("click");
    await flushPromises();
    const toggle = wrapper.get(".push-setting button");
    await toggle.trigger("click");
    await flushPromises();
    expect(subscribe).toHaveBeenCalledWith("alpha");
    expect(toggle.text()).toBe("Updating…");
    expect(toggle.attributes("disabled")).toBeDefined();
    vi.mocked(push.state).mockResolvedValue({
      supported: true,
      permission: "granted",
      subscribed: true,
      available: true,
      error: "",
    });
    subscription.resolve();
    await flushPromises();
    expect(toggle.text()).toBe("Disable notifications");
    expect(wrapper.get(".push-setting").text()).toContain(
      "Notifications enabled for alpha on this device.",
    );
    await wrapper.get(".push-setting button:nth-of-type(2)").trigger("click");
    await flushPromises();
    await flushPromises();
    expect(sendTest).toHaveBeenCalledWith("alpha");
    expect(wrapper.get(".push-setting").text()).toContain("Test notification scheduled.");
    await toggle.trigger("click");
    await flushPromises();
    await flushPromises();
    expect(unsubscribe).toHaveBeenCalledWith("alpha");
    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    await flushPromises();
    expect(wrapper.find(".settings-page").exists()).toBe(true);
    await wrapper.get(".projects-nav").trigger("click");
    await flushPromises();
    await flushPromises();
    expect(wrapper.find(".settings-page").exists()).toBe(false);
    wrapper.unmount();
  });
});
describe("profile navigation", () => {
  it.each(["stay", "navigate", "profile"])(
    "refreshes only server-listed scheduled discussion sessions and preserves %s isolation",
    async (action) => {
      history.replaceState({}, "", "/chathermes?profile=alpha#/scheduled?profile=alpha");
      const create = deferred<Response>();
      let rows: Session[] = [];
      const read = vi.fn(async (input: string) =>
        json({ sessions: input.includes("profile=alpha") ? rows : [], total: rows.length }),
      );
      const factory = nativeSession.useNativeSession;
      vi.spyOn(nativeSession, "useNativeSession").mockImplementation((...args) => {
        const owner = factory(...args);
        owner.attach = vi.fn(async () => {});
        return owner;
      });
      mockFetch(async (input, init) => {
        if (input.includes("/capabilities")) return json(streaming);
        if (init?.method === "POST") return create.promise;
        if (input.includes("/api/sessions?")) return read(input);
        if (input.includes("/scheduled")) return json({ jobs: [] });
        return json({});
      });
      const wrapper = mount(App);
      await flushPromises();
      wrapper.findComponent(ScheduledPage).vm.$emit("discuss", "Discuss this output");
      await flushPromises();
      if (action === "navigate") {
        wrapper.findComponent(SessionSidebar).vm.$emit("select", "existing");
        await flushPromises();
      } else if (action === "profile") {
        await wrapper.get(".profile-field").setValue("beta");
        await flushPromises();
      }
      const previousRoute = location.hash;
      const reads = read.mock.calls.length;
      // The create response alone must never manufacture a sidebar row.
      create.resolve(json({ id: "discussion" }));
      await flushPromises();
      expect(read).toHaveBeenCalledTimes(reads + (action === "profile" ? 0 : 1));
      const sidebar = wrapper.findComponent(SessionSidebar);
      expect(sidebar.props("sessions")).toEqual([]);
      if (action === "stay") {
        expect(location.hash).toBe("#/chat/discussion?profile=alpha");
        expect((wrapper.get(".composer textarea").element as HTMLTextAreaElement).value).toBe(
          "Discuss this output",
        );
      } else expect(location.hash).toBe(previousRoute);
      rows = [{ id: "discussion", title: "Persisted discussion" }];
      const [, onCreated] = vi.mocked(nativeSession.useNativeSession).mock.calls.at(-1)!;
      onCreated?.("alpha", "discussion");
      await flushPromises();
      expect(sidebar.props("sessions")).toEqual(action === "profile" ? [] : rows);
      if (action === "profile") {
        await wrapper.get(".profile-field").setValue("alpha");
        await flushPromises();
        expect(wrapper.findComponent(SessionSidebar).props("sessions")).toEqual(rows);
      }
      wrapper.unmount();
    },
  );
  it("keeps global navigation in the drawer and exposes screen actions from the top-right menu", async () => {
    mockFetch(
      vi.fn(async (input: string) =>
        input.includes("/v1/capabilities") ? json({}) : json({ sessions: [], total: 0 }),
      ),
    );
    const wrapper = mount(App);
    await flushPromises();
    expect(wrapper.find(".drawer-chat").exists()).toBe(true);
    expect(wrapper.find(".projects-nav").exists()).toBe(true);
    expect(wrapper.find(".scheduled-nav").exists()).toBe(true);
    expect(wrapper.find(".topbar .topbar-profile").classes()).toContain("sr-only");
    expect(wrapper.find(".screen-menu .topbar-profile").exists()).toBe(false);
    expect(wrapper.findAll(".drawer-chat")).toHaveLength(1);
    expect(wrapper.find(".drawer-chat").attributes("disabled")).toBeUndefined();
    await wrapper.get('[aria-label="Screen options"]').trigger("click");
    await flushPromises();
    expect(wrapper.get('[role="menu"]').get('[role="menuitem"]').text()).toBe("New chat");
    expect(wrapper.get('[aria-label="Screen options"]').attributes("aria-expanded")).toBe("true");
    await wrapper.get('[role="menuitem"]').trigger("click");
    await flushPromises();
    expect(wrapper.find('[role="menu"]').exists()).toBe(false);
    wrapper.unmount();
  });
  it("rejects invalid profile names without requesting or storing credentials", async () => {
    const fake = vi.fn(async (input: string) =>
      input.includes("/v1/capabilities")
        ? json({})
        : json({ sessions: [{ id: "one", title: "Alpha session" }], total: 1 }),
    );
    mockFetch(fake);
    const wrapper = mount(App);
    await flushPromises();

    history.pushState({}, "", "/chathermes?profile=..%2Fx#/?profile=../x");
    dispatchEvent(new PopStateEvent("popstate"));
    await flushPromises();
    expect(location.hash).toBe("#/");
    expect(fake.mock.calls.some(([url]) => url.includes("../x"))).toBe(false);
    expect(localStorage.length).toBe(0);
    wrapper.unmount();
  });
  it("clears old history when browser navigation selects the current or another profile", async () => {
    mockFetch(
      vi.fn(async (input: string) =>
        input.includes("/v1/capabilities")
          ? json({})
          : input.includes("/messages")
            ? json([{ role: "assistant", content: "Private history" }])
            : input.includes("profile=alpha")
              ? json({ sessions: [{ id: "one", title: "Alpha session" }], total: 1 })
              : json({ sessions: [{ id: "two", title: "Current session" }], total: 1 }),
      ),
    );
    const wrapper = mount(App);
    await flushPromises();
    wrapper.findComponent(SessionSidebar).vm.$emit("select", "one");
    await flushPromises();
    expect(wrapper.text()).toContain("Private history");
    history.pushState({}, "", "/chathermes");
    dispatchEvent(new PopStateEvent("popstate"));
    await flushPromises();
    expect(wrapper.get(".topbar-profile").text()).toBe("Current profile");
    expect(wrapper.text()).not.toContain("Private history");
    expect(wrapper.text()).not.toContain("Alpha session");
    expect(wrapper.text()).toContain("Current session");
    history.pushState({}, "", "/chathermes?profile=alpha#/?profile=alpha");
    dispatchEvent(new PopStateEvent("popstate"));
    await flushPromises();
    expect(wrapper.get(".topbar-profile").text()).toBe("alpha");
    expect(wrapper.text()).not.toContain("Private history");
    expect(wrapper.text()).toContain("Alpha session");
    wrapper.unmount();
  });
  it("shows PATCH failures when renaming", async () => {
    mockFetch(
      vi.fn(async (input: string, init?: RequestInit) => {
        if (init?.method === "PATCH") throw new TypeError("Failed to fetch");
        return input.includes("/v1/capabilities")
          ? json({})
          : json({ sessions: [{ id: "one", title: "Original" }], total: 1 });
      }),
    );
    const wrapper = mount(App);
    await flushPromises();
    wrapper.findComponent(SessionSidebar).vm.$emit("rename", "one", "New title");
    await flushPromises();
    expect(wrapper.get('.sidebar [role="alert"]').text()).toContain("Failed to fetch");
    expect(wrapper.text()).toContain("Original");
    expect(wrapper.text()).not.toContain("New title");
    wrapper.unmount();
  });
  it("uses Hermes page offsets when pinned sessions are included beyond the limit", async () => {
    const fake = vi.fn(async (input: string) =>
      input.includes("/v1/capabilities")
        ? json({})
        : input.includes("offset=30")
          ? json({
              object: "list",
              data: [
                { id: "pin", title: "Pinned" },
                { id: "second", title: "Second page" },
              ],
              limit: 30,
              offset: 30,
              has_more: false,
            })
          : json({
              object: "list",
              data: [
                { id: "pin", title: "Pinned" },
                { id: "first", title: "First page" },
              ],
              limit: 30,
              offset: 0,
              has_more: true,
            }),
    );
    mockFetch(fake);
    const wrapper = mount(App);
    await flushPromises();
    await wrapper.get(".load-more").trigger("click");
    await flushPromises();
    await flushPromises();
    expect(fake.mock.calls.some(([input]) => String(input).includes("offset=30"))).toBe(true);
    expect(wrapper.findAll(".session-row")).toHaveLength(3);
    expect(wrapper.text()).toContain("Second page");
    wrapper.unmount();
  });
  it("clears the previous profile sessions when switching", async () => {
    const fake = vi.fn(async (input: string) => {
      const value = input.includes("/v1/capabilities")
        ? streaming
        : input.includes("profile=alpha")
          ? { sessions: [{ id: "alpha-one", title: "Alpha only" }], total: 1 }
          : input.includes("profile=beta")
            ? { sessions: [{ id: "beta-one", title: "Beta only" }], total: 1 }
            : {};
      return new Response(JSON.stringify(value), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });
    mockFetch(fake);
    const wrapper = mount(App);
    await flushPromises();
    expect(wrapper.text()).toContain("Alpha only");
    await wrapper.get(".profile-field").setValue("beta");
    await flushPromises();
    await flushPromises();
    expect(wrapper.text()).toContain("Beta only");
    expect(wrapper.text()).not.toContain("Alpha only");
    wrapper.unmount();
  });
  it("keeps the session list request alive when a conversation is selected", async () => {
    const list = deferred<Response>();
    const fake = vi.fn((input: string) =>
      input.includes("/v1/capabilities")
        ? Promise.resolve(json(streaming))
        : input.includes("/messages")
          ? Promise.resolve(json([]))
          : input.includes("/api/sessions?")
            ? list.promise
            : Promise.resolve(json({})),
    );
    mockFetch(fake);
    const wrapper = mount(App);
    await flushPromises();
    expect(wrapper.text()).toContain("Loading sessions…");
    wrapper.findComponent(SessionSidebar).vm.$emit("select", "shared");
    await flushPromises();
    list.resolve(json({ sessions: [{ id: "shared", title: "Still loading" }], total: 1 }));
    await flushPromises();
    expect(wrapper.text()).toContain("Still loading");
    expect(wrapper.text()).not.toContain("Loading sessions…");
    wrapper.unmount();
  });
  it("does not let an older list request clear a newer loading state or show its error", async () => {
    const alpha = deferred<Response>(),
      beta = deferred<Response>();
    mockFetch(
      vi.fn((input: string) =>
        input.includes("/v1/capabilities")
          ? Promise.resolve(json({}))
          : input.includes("profile=alpha")
            ? alpha.promise
            : input.includes("profile=beta")
              ? beta.promise
              : Promise.resolve(json({})),
      ),
    );
    const wrapper = mount(App);
    await flushPromises();
    await wrapper.get(".profile-field").setValue("beta");
    await flushPromises();
    await flushPromises();
    alpha.reject(new Error("Old profile failed"));
    await flushPromises();
    expect(wrapper.text()).toContain("Loading sessions…");
    expect(wrapper.text()).not.toContain("Old profile failed");
    beta.resolve(json({ sessions: [{ id: "shared", title: "Beta session" }], total: 1 }));
    await flushPromises();
    expect(wrapper.text()).toContain("Beta session");
    expect(wrapper.text()).not.toContain("Loading sessions…");
    wrapper.unmount();
  });
  it("does not apply a delayed rename to the next profile with the same session ID", async () => {
    const rename = deferred<Response>();
    mockFetch(
      vi.fn((input: string, init?: RequestInit) =>
        input.includes("/v1/capabilities")
          ? Promise.resolve(json({}))
          : init?.method === "PATCH"
            ? rename.promise
            : input.includes("profile=alpha")
              ? Promise.resolve(
                  json({ sessions: [{ id: "shared", title: "Alpha title" }], total: 1 }),
                )
              : input.includes("profile=beta")
                ? Promise.resolve(
                    json({ sessions: [{ id: "shared", title: "Beta title" }], total: 1 }),
                  )
                : Promise.resolve(json({})),
      ),
    );
    const wrapper = mount(App);
    await flushPromises();
    wrapper.findComponent(SessionSidebar).vm.$emit("rename", "shared", "Renamed alpha");
    await wrapper.get(".profile-field").setValue("beta");
    await flushPromises();
    await flushPromises();
    rename.resolve(json({ id: "shared", title: "Renamed alpha" }));
    await flushPromises();
    expect(wrapper.text()).toContain("Beta title");
    expect(wrapper.text()).not.toContain("Renamed alpha");
    wrapper.unmount();
  });
  it("discards a popstate session when the user switches profile before capabilities return", async () => {
    const betaCapabilities = deferred<Response>();
    mockFetch(
      vi.fn((input: string) =>
        input.includes("/v1/capabilities?profile=beta")
          ? betaCapabilities.promise
          : input.includes("/v1/capabilities")
            ? Promise.resolve(json(streaming))
            : input.includes("/messages")
              ? Promise.resolve(json([]))
              : input.includes("/api/sessions?")
                ? Promise.resolve(json({ sessions: [], total: 0 }))
                : Promise.resolve(json({})),
      ),
    );
    const wrapper = mount(App);
    await flushPromises();
    history.pushState({}, "", "/chathermes?profile=beta#/chat/beta-one?profile=beta");
    dispatchEvent(new PopStateEvent("popstate"));
    await flushPromises();
    await wrapper.get(".profile-field").setValue("alpha");
    betaCapabilities.resolve(json(streaming));
    await flushPromises();
    expect((wrapper.get(".profile-field").element as HTMLInputElement).value).toBe("alpha");
    expect(wrapper.get(".composer textarea").attributes("disabled")).toBeUndefined();
    expect(routeUrl().search).toBe("?profile=alpha");
    wrapper.unmount();
  });
  it("clears unsent text on session and profile changes", async () => {
    mockFetch(
      vi.fn((input: string) =>
        input.includes("/v1/capabilities")
          ? Promise.resolve(json(streaming))
          : input.includes("/messages")
            ? Promise.resolve(json([]))
            : input.includes("/api/sessions?")
              ? Promise.resolve(json({ sessions: [], total: 0 }))
              : Promise.resolve(json({})),
      ),
    );
    const wrapper = mount(App);
    await flushPromises();
    wrapper.findComponent(SessionSidebar).vm.$emit("select", "first");
    await flushPromises();
    await wrapper.get(".composer textarea").setValue("secret draft");
    wrapper.findComponent(SessionSidebar).vm.$emit("select", "second");
    await flushPromises();
    expect((wrapper.get(".composer textarea").element as HTMLTextAreaElement).value).toBe("");
    await wrapper.get(".composer textarea").setValue("another draft");
    await wrapper.get(".profile-field").setValue("beta");
    await flushPromises();
    expect((wrapper.get(".composer textarea").element as HTMLTextAreaElement).value).toBe("");
    wrapper.unmount();
  });
  it("does not select an in-flight create after a newer session selection or show its stale error", async () => {
    const create = deferred<Response>();
    mockFetch(
      vi.fn((input: string, init?: RequestInit) =>
        input.includes("/v1/capabilities")
          ? Promise.resolve(json(streaming))
          : init?.method === "POST"
            ? create.promise
            : input.includes("/messages")
              ? Promise.resolve(json([]))
              : input.includes("/api/sessions?")
                ? Promise.resolve(
                    json({ sessions: [{ id: "existing", title: "Existing" }], total: 1 }),
                  )
                : Promise.resolve(json({})),
      ),
    );
    const wrapper = mount(App);
    await flushPromises();
    wrapper.findComponent(SessionSidebar).vm.$emit("create");
    wrapper.findComponent(SessionSidebar).vm.$emit("select", "existing");
    create.reject(new Error("Stale create failed"));
    await flushPromises();
    expect(location.hash).toBe("#/chat/existing?profile=alpha");
    expect(wrapper.text()).not.toContain("Stale create failed");
    wrapper.unmount();
  });
  it("does not select a completed create after a newer session selection", async () => {
    const create = deferred<Response>();
    mockFetch(
      vi.fn((input: string, init?: RequestInit) =>
        input.includes("/v1/capabilities")
          ? Promise.resolve(json(streaming))
          : init?.method === "POST"
            ? create.promise
            : input.includes("/messages")
              ? Promise.resolve(json([]))
              : input.includes("/api/sessions?")
                ? Promise.resolve(
                    json({ sessions: [{ id: "existing", title: "Existing" }], total: 1 }),
                  )
                : Promise.resolve(json({})),
      ),
    );
    const wrapper = mount(App);
    await flushPromises();
    wrapper.findComponent(SessionSidebar).vm.$emit("create");
    wrapper.findComponent(SessionSidebar).vm.$emit("select", "existing");
    create.resolve(json({ id: "new" }));
    await flushPromises();
    expect(location.hash).toBe("#/chat/existing?profile=alpha");
    expect(wrapper.findComponent(SessionSidebar).props("sessions")).not.toContainEqual({
      id: "new",
    });
    wrapper.unmount();
  });
  it.each(["refresh", "pagination"])(
    "keeps empty lists authoritative until persistence, updates a listed title, and reconciles via %s",
    async (source) => {
      const initial = deferred<Response>();
      const beforeTitle = deferred<Response>();
      let settle!: () => void;
      const factory = nativeSession.useNativeSession;
      vi.spyOn(nativeSession, "useNativeSession").mockImplementation(
        (callback, onCreated, onTitle) => {
          settle = callback;
          const owner = factory(callback, onCreated, onTitle);
          owner.attach = vi.fn(async () => {});
          return owner;
        },
      );
      const read = vi.fn(() => initial.promise);
      mockFetch(async (input, init) => {
        if (input.includes("/capabilities")) return json(streaming);
        if (init?.method === "POST") return json({ id: "draft", title: "New draft" });
        if (input.includes("/api/sessions?")) return read();
        return json({});
      });
      const wrapper = mount(App);
      await flushPromises();
      const sidebar = wrapper.findComponent(SessionSidebar);
      sidebar.vm.$emit("create");
      await flushPromises();
      expect(location.hash).toBe("#/chat/draft?profile=alpha");
      expect(sidebar.props("sessions")).toEqual([]);
      expect(read).toHaveBeenCalledTimes(1);
      const [, onCreated, onTitle] = vi.mocked(nativeSession.useNativeSession).mock.calls.at(-1)!;
      // A normal refresh before persistence cannot manufacture a sidebar row.
      read.mockImplementation(async () => json({ sessions: [], total: 0 }));
      sidebar.vm.$emit("retry");
      await flushPromises();
      expect(read).toHaveBeenCalledTimes(2);
      expect(sidebar.props("sessions")).toEqual([]);
      // Reliable native persistence triggers the follow-up and wins over the
      // initial list, even if that older request ignores its abort signal.
      read.mockImplementation(async () => json({ sessions: [{ id: "draft" }], total: 1 }));
      onCreated?.("alpha", "draft");
      await flushPromises();
      initial.resolve(json({ sessions: [{ id: "existing" }], total: 1 }));
      await flushPromises();
      expect(sidebar.props("sessions")).toEqual([{ id: "draft" }]);
      read.mockImplementation(() => beforeTitle.promise);
      settle();
      await flushPromises();
      read.mockImplementation(async () =>
        json({ sessions: [{ id: "draft", title: "Hermes title" }], total: 1 }),
      );
      const readsBeforeTitle = read.mock.calls.length;
      onTitle?.("alpha", "draft", "Hermes title");
      await flushPromises();
      expect(read).toHaveBeenCalledTimes(readsBeforeTitle);
      expect(sidebar.props("sessions")).toEqual([{ id: "draft", title: "Hermes title" }]);
      beforeTitle.resolve(json({ sessions: [{ id: "draft", title: "Old title" }], total: 1 }));
      await flushPromises();
      expect(sidebar.props("sessions")).toEqual([{ id: "draft", title: "Hermes title" }]);
      read.mockImplementation(async () =>
        json({ sessions: [{ id: "draft", title: "Saved title" }], total: 1 }),
      );
      if (source === "pagination") sidebar.vm.$emit("more");
      else settle();
      await flushPromises();
      expect(sidebar.props("sessions")).toEqual([{ id: "draft", title: "Saved title" }]);
      read.mockImplementation(async () => json({ sessions: [], total: 0 }));
      settle();
      await flushPromises();
      expect(sidebar.props("sessions")).toEqual([]);
      wrapper.unmount();
    },
  );
  it("ignores another profile's input and title callbacks and loads its server list on return", async () => {
    const factory = nativeSession.useNativeSession;
    vi.spyOn(nativeSession, "useNativeSession").mockImplementation((callback, created, title) => {
      const owner = factory(callback, created, title);
      owner.attach = vi.fn(async () => {});
      return owner;
    });
    let alphaRows: Session[] = [];
    const read = vi.fn((input: string) =>
      json({ sessions: input.includes("profile=alpha") ? alphaRows : [], total: 1 }),
    );
    mockFetch(async (input) => {
      if (input.includes("/capabilities")) return json(streaming);
      if (input.includes("/api/sessions?")) return read(input);
      return json({});
    });
    const wrapper = mount(App);
    await flushPromises();
    const [, onCreated, onTitle] = vi.mocked(nativeSession.useNativeSession).mock.calls.at(-1)!;
    await wrapper.get(".profile-field").setValue("beta");
    await flushPromises();
    const reads = read.mock.calls.length;
    alphaRows = [{ id: "alpha-draft", title: "Alpha title" }];
    onCreated?.("alpha", "alpha-draft");
    onTitle?.("alpha", "alpha-draft", "Alpha title");
    await flushPromises();
    expect(read).toHaveBeenCalledTimes(reads);
    expect(routeUrl().searchParams.get("profile")).toBe("beta");
    expect(wrapper.findComponent(SessionSidebar).props("sessions")).toEqual([]);
    await wrapper.get(".profile-field").setValue("alpha");
    await flushPromises();
    expect(wrapper.findComponent(SessionSidebar).props("sessions")).toEqual(alphaRows);
    expect(routeUrl().pathname).toBe("/");
    wrapper.unmount();
  });
  it.each(["archive", "delete"])(
    "does not resurrect a submitted draft after %s or a late title",
    async (action) => {
      const factory = nativeSession.useNativeSession;
      vi.spyOn(nativeSession, "useNativeSession").mockImplementation((callback, created, title) => {
        const owner = factory(callback, created, title);
        owner.attach = vi.fn(async () => {});
        return owner;
      });
      let rows: Session[] = [];
      const stale = deferred<Response>();
      const read = vi.fn(async () => json({ sessions: rows, total: rows.length }));
      mockFetch(async (input, init) => {
        if (input.includes("/capabilities")) return json(streaming);
        if (init?.method === "POST") return json({ id: "draft" });
        if (input.includes("/api/sessions?")) return read();
        return json({});
      });
      const wrapper = mount(App);
      await flushPromises();
      const sidebar = wrapper.findComponent(SessionSidebar);
      sidebar.vm.$emit("create");
      await flushPromises();
      expect(sidebar.props("sessions")).toEqual([]);
      const [, onCreated, onTitle] = vi.mocked(nativeSession.useNativeSession).mock.calls.at(-1)!;
      rows = [{ id: "draft" }];
      onCreated?.("alpha", "draft");
      await flushPromises();
      expect(sidebar.props("sessions")).toEqual(rows);
      read.mockImplementationOnce(() => stale.promise);
      sidebar.vm.$emit("more");
      await flushPromises();
      sidebar.vm.$emit(action, "draft");
      await flushPromises();
      stale.resolve(json({ sessions: [{ id: "draft", title: "Stale row" }], total: 1 }));
      await flushPromises();
      const reads = read.mock.calls.length;
      onTitle?.("alpha", "draft", "Late title");
      await flushPromises();
      expect(sidebar.props("sessions")).toEqual([]);
      expect(routeUrl().pathname).toBe("/");
      expect(read).toHaveBeenCalledTimes(reads);
      // Even a later response with an archived/deleted row stays filtered.
      sidebar.vm.$emit("retry");
      await flushPromises();
      expect(sidebar.props("sessions")).toEqual([]);
      wrapper.unmount();
    },
  );
  it("does not clear a newer profile's creation state when an older creation finishes", async () => {
    const alpha = deferred<Response>(),
      beta = deferred<Response>();
    mockFetch(async (input, init) => {
      if (input.includes("/capabilities")) return json({});
      if (init?.method === "POST")
        return input.includes("profile=alpha") ? alpha.promise : beta.promise;
      return json({ sessions: [], total: 0 });
    });
    const wrapper = mount(App);
    await flushPromises();
    wrapper.findComponent(SessionSidebar).vm.$emit("create");
    await wrapper.get(".profile-field").setValue("beta");
    await flushPromises();
    wrapper.findComponent(SessionSidebar).vm.$emit("create");
    alpha.resolve(json({ id: "alpha-draft" }));
    await flushPromises();
    expect(wrapper.findComponent(SessionSidebar).props("busy")).toBe(true);
    expect(wrapper.findComponent(SessionSidebar).props("sessions")).toEqual([]);
    beta.resolve(json({ id: "beta-draft" }));
    await flushPromises();
    expect(wrapper.findComponent(SessionSidebar).props("busy")).toBe(false);
    expect(location.hash).toBe("#/chat/beta-draft?profile=beta");
    wrapper.unmount();
  });
  it("allows a successful create to select its new session when selection is unchanged", async () => {
    mockFetch(
      vi.fn((input: string, init?: RequestInit) =>
        input.includes("/v1/capabilities")
          ? Promise.resolve(json(streaming))
          : init?.method === "POST"
            ? Promise.resolve(json({ id: "new" }))
            : input.includes("/messages")
              ? Promise.resolve(json([]))
              : input.includes("/api/sessions?")
                ? Promise.resolve(json({ sessions: [], total: 0 }))
                : Promise.resolve(json({})),
      ),
    );
    const wrapper = mount(App);
    await flushPromises();
    wrapper.findComponent(SessionSidebar).vm.$emit("create");
    await flushPromises();
    expect(location.hash).toBe("#/chat/new?profile=alpha");
    wrapper.unmount();
  });
});

describe("profile model inventory", () => {
  it("defaults to each profile provider and sends provider/model changes to the runtime", async () => {
    const turns: { profile: string; body: Record<string, unknown> }[] = [];
    const factory = nativeSession.useNativeSession;
    vi.spyOn(nativeSession, "useNativeSession").mockImplementation((callback) => {
      const owner = factory(callback);
      let profile = "",
        session = "";
      owner.attach = vi.fn(async (p, id) => {
        profile = p;
        session = id;
        owner.connection.value = "ready";
      });
      owner.submit = vi.fn(async (_text, prepare, selection) => {
        turns.push({
          profile,
          body: { session_id: session, input: await prepare(), ...selection },
        });
      });
      return owner;
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string, init?: RequestInit) => {
        const profile = input.includes("profile=beta") ? "beta" : "alpha";
        if (input.endsWith("/profiles"))
          return json({ profiles: [{ name: "alpha" }, { name: "beta" }] });
        if (input.includes("/api/model/options"))
          return json({
            provider: profile,
            model: `${profile}-default`,
            providers: [
              {
                slug: profile,
                name: profile,
                is_current: true,
                models: [`${profile}-default`, `${profile}-extra`],
              },
              { slug: "custom:other", name: "Other", models: ["shared-model"] },
            ],
          });
        if (input.includes("/v1/models"))
          return json({
            data: [
              { id: "base", parent: null },
              { id: "Instant", parent: "base" },
            ],
          });
        if (input.includes("/v1/capabilities")) return json(streaming);
        if (input.includes("/messages")) return json({ data: [] });
        if (init?.method === "POST") return json({ session: { id: `${profile}-session` } });
        return json({ data: [], has_more: false });
      }),
    );
    const wrapper = mount(App);
    await flushPromises();
    expect(wrapper.get(".model-pill").text()).toBe("alpha-default");
    await wrapper.get(".model-pill").trigger("click");
    await flushPromises();
    expect(wrapper.get('[data-provider="alpha"]').text()).toContain("Current");
    await wrapper.get('[data-provider="alpha"]').trigger("click");
    await flushPromises();
    expect(
      wrapper.findAll(".model-option").map((item) => item.text().replace("✓", "").trim()),
    ).toEqual(["alpha-default", "alpha-extra"]);
    await wrapper.get('[data-model="alpha-default"]').trigger("click");
    await flushPromises();
    await wrapper.get("textarea").setValue("default turn");
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    await flushPromises();
    expect(turns[0]).toEqual({
      profile: "alpha",
      body: {
        session_id: "alpha-session",
        input: "default turn",
        model: "alpha-default",
        provider: "alpha",
      },
    });
    await wrapper.get(".model-pill").trigger("click");
    await flushPromises();
    await wrapper.get('[data-provider="custom:other"]').trigger("click");
    await flushPromises();
    await wrapper.get('[data-model="shared-model"]').trigger("click");
    await flushPromises();
    await wrapper.get("textarea").setValue("other turn");
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    await flushPromises();
    expect(turns[1]?.body).toMatchObject({
      model: "shared-model",
      provider: "custom:other",
    });
    await wrapper.get(".model-pill").trigger("click");
    await flushPromises();
    await wrapper.get('[data-provider=""]').trigger("click");
    await flushPromises();
    expect(wrapper.findAll(".model-option").map((item) => item.text())).toEqual(["Instant"]);
    await wrapper.get('[data-model="Instant"]').trigger("click");
    await flushPromises();
    await wrapper.get("textarea").setValue("route turn");
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    await flushPromises();
    expect(turns[2]?.body).toEqual({
      session_id: "alpha-session",
      input: "route turn",
      model: "Instant",
    });
    await wrapper.get(".profile-field").setValue("beta");
    await flushPromises();
    await flushPromises();
    expect(wrapper.get(".model-pill").text()).toBe("beta-default");
    await wrapper.get(".model-pill").trigger("click");
    await flushPromises();
    expect(wrapper.get('[data-provider="beta"]').text()).toContain("Current");
    await wrapper.get('[data-provider="beta"]').trigger("click");
    await flushPromises();
    expect(
      wrapper.findAll(".model-option").map((item) => item.text().replace("✓", "").trim()),
    ).toEqual(["beta-default", "beta-extra"]);
    await wrapper.get('[data-model="beta-extra"]').trigger("click");
    await flushPromises();
    await wrapper.get("textarea").setValue("beta turn");
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    await flushPromises();
    expect(turns[3]).toEqual({
      profile: "beta",
      body: {
        session_id: "beta-session",
        input: "beta turn",
        model: "beta-extra",
        provider: "beta",
      },
    });
    wrapper.unmount();
  });

  it("ignores late inventory from a previous profile and falls back to the configured default and routes", async () => {
    const old = deferred<Response>();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string) => {
        if (input.endsWith("/profiles"))
          return json({ profiles: [{ name: "alpha" }, { name: "beta" }] });
        if (input.includes("/api/model/options"))
          return input.includes("profile=alpha")
            ? old.promise
            : new Response("{}", { status: 404 });
        if (input.includes("/v1/models"))
          return json({
            default_model: "saved",
            data: [
              { id: "base", parent: null },
              { id: "route", parent: "base" },
            ],
          });
        if (input.includes("/v1/capabilities")) return json(streaming);
        return json({ data: [] });
      }),
    );
    const wrapper = mount(App);
    await flushPromises();
    expect(wrapper.get("textarea").attributes("disabled")).toBeUndefined();
    await wrapper.get(".profile-field").setValue("beta");
    await flushPromises();
    await flushPromises();
    old.resolve(
      json({
        provider: "alpha",
        model: "old-model",
        providers: [{ slug: "alpha", name: "Alpha", models: ["old-model"], is_current: true }],
      }),
    );
    await flushPromises();
    expect(wrapper.get(".model-pill").text()).toBe("saved");
    await wrapper.get(".model-pill").trigger("click");
    await flushPromises();
    expect(wrapper.findAll(".provider-option").map((item) => item.text())).toEqual([
      "Model routes",
    ]);
    await wrapper.get('[data-provider=""]').trigger("click");
    await flushPromises();
    expect(
      wrapper.findAll(".model-option").map((item) => item.text().replace("✓", "").trim()),
    ).toEqual(["saved", "route"]);
    expect(wrapper.text()).not.toContain("old-model");
    wrapper.unmount();
  });
});

describe("TUI-only chat execution", () => {
  it.each([true, false])("ignores saved REST turns with native capability %s", async (enabled) => {
    history.replaceState({}, "", "/chathermes?profile=alpha#/chat/s1?profile=alpha");
    const pointer = 'chathermes.run.v1:["alpha","s1"]';
    const idempotency = 'chathermes.run-idempotency.v1:["alpha","s1"]';
    localStorage.setItem(pointer, "legacy-run");
    localStorage.setItem(idempotency, "legacy-attempt");
    const factory = nativeSession.useNativeSession;
    let owner!: ReturnType<typeof factory>;
    vi.spyOn(nativeSession, "useNativeSession").mockImplementation((callback) => {
      owner = factory(callback);
      owner.attach = vi.fn(async () => {
        owner.connection.value = "ready";
      });
      owner.submit = vi.fn(async () => {});
      return owner;
    });
    const fetch = vi.fn(async (url: string) =>
      json(
        url.includes("/capabilities")
          ? {
              features: { native_chat: enabled },
            }
          : url.includes("/messages")
            ? { messages: [{ role: "assistant", content: "Saved history" }] }
            : { sessions: [{ id: "s1" }], total: 1 },
      ),
    );
    mockFetch(fetch);
    const wrapper = mount(App, { attachTo: document.body });
    await flushPromises();
    const prompt = wrapper.get("textarea");
    expect(prompt.attributes("disabled")).toBeUndefined();
    await prompt.setValue("Continue");
    const send = wrapper.get('[aria-label="Send message"]');
    if (enabled) {
      expect(owner.attach).toHaveBeenCalledExactlyOnceWith("alpha", "s1");
      await send.trigger("click");
      await flushPromises();
      await flushPromises();
      expect(owner.submit).toHaveBeenCalledWith(
        "Continue",
        expect.any(Function),
        expect.any(Object),
        expect.any(Array),
      );
    } else {
      expect(send.attributes("disabled")).toBeDefined();
      expect(owner.attach).not.toHaveBeenCalled();
      expect(owner.submit).not.toHaveBeenCalled();
      expect(wrapper.text()).toContain("Saved history");
    }
    expect(fetch.mock.calls.some(([url]) => /\/runs|\/chat\/stream/.test(url))).toBe(false);
    expect(localStorage.getItem(pointer)).toBe("legacy-run");
    expect(localStorage.getItem(idempotency)).toBe("legacy-attempt");
    wrapper.unmount();
  });
});

describe("native clarification submission", () => {
  it("passes an option to the response handler exactly once, retains errors for retry and resets new requests", async () => {
    history.replaceState({}, "", "/chathermes?profile=alpha#/chat/s1?profile=alpha");
    const factory = nativeSession.useNativeSession;
    let owner!: ReturnType<typeof factory>;
    const approval = ref<Record<string, unknown>>();
    const response = deferred<void>();
    const answer = vi.fn(() => response.promise);
    vi.spyOn(nativeSession, "useNativeSession").mockImplementation((callback) => {
      owner = { ...factory(callback), approval: computed(() => approval.value) };
      owner.attach = vi.fn(async () => {
        owner.connection.value = "ready";
      });
      owner.answer = answer;
      return owner;
    });
    mockFetch(async (url) =>
      json(url.includes("/capabilities") ? streaming : { sessions: [], total: 0 }),
    );
    const wrapper = mount(App);
    await flushPromises();
    const request = {
      id: "clarify-1",
      method: "clarify",
      params: {
        session_id: "runtime",
        questions: [{ qid: "q0", question: "Colour?", choices: ["Blue (Recommended)", "Green"] }],
      },
    };
    approval.value = { ...request.params, request_id: request.id, kind: request.method };
    await flushPromises();
    await wrapper.get(".clarification-other input").setValue("Draft");
    await wrapper.get(".clarification-choices button").trigger("click");
    await flushPromises();
    await wrapper.get(".clarification-choices button").trigger("click");
    await flushPromises();
    expect(answer).toHaveBeenCalledExactlyOnceWith("clarify-1", {
      answers: { q0: "Blue (Recommended)" },
    });
    expect(wrapper.get("textarea").attributes("disabled")).toBeUndefined();
    response.reject(new Error("rejected"));
    await flushPromises();
    expect(wrapper.text()).toContain("Clarification could not be settled.");
    answer.mockImplementation(async () => {});
    await wrapper.get(".clarification-choices button").trigger("click");
    await flushPromises();
    await flushPromises();
    expect(answer).toHaveBeenCalledTimes(2);
    await wrapper.get(".clarification-other input").setValue("Old draft");
    approval.value = { ...request.params, request_id: "clarify-2", kind: request.method };
    await flushPromises();
    expect((wrapper.get(".clarification-other input").element as HTMLInputElement).value).toBe("");
    await wrapper.get(".clarification-other input").setValue("Exact other response");
    await wrapper.get(".clarification-card form").trigger("submit");
    await flushPromises();
    await flushPromises();
    expect(answer).toHaveBeenLastCalledWith("clarify-2", {
      answers: { q0: "Exact other response" },
    });
    wrapper.unmount();
  });
});

describe("native approval controls", () => {
  it("renders stacked approve and deny actions and sends the exact choice", async () => {
    history.replaceState({}, "", "/chathermes?profile=alpha#/chat/s1?profile=alpha");
    const factory = nativeSession.useNativeSession;
    const answer = vi.fn(async () => {});
    vi.spyOn(nativeSession, "useNativeSession").mockImplementation((callback) => {
      const owner = factory(callback);
      owner.attach = vi.fn(async () => {
        owner.connection.value = "ready";
        owner.busy.value = true;
      });
      owner.busy.value = true;
      owner.answer = answer;
      return {
        ...owner,
        approval: computed(() => ({
          request_id: "approve-1",
          kind: "approval",
          command: "synthetic command",
          choices: ["once", "session", "always", "deny"],
        })),
      };
    });
    mockFetch(async (url) =>
      json(url.includes("/capabilities") ? streaming : { sessions: [], total: 0 }),
    );
    const wrapper = mount(App);
    await flushPromises();
    const choices = wrapper.get(".approval-choices");
    expect(choices.classes()).toContain("grid-cols-1");
    const buttons = choices.findAll("button");
    expect(buttons.map((button) => button.text())).toEqual([
      "Allow once",
      "Allow for session",
      "Always allow",
      "Deny",
    ]);
    for (const button of buttons) expect(button.classes()).toContain("w-full");
    expect(buttons[0]!.element.className).toContain("bg-[#303030]");
    expect(buttons[0]!.element.className).toContain("px-[14px]");
    expect(buttons[0]!.element.className).toContain("py-[10px]");
    expect(buttons[0]!.element.className).toContain("rounded-xl");
    expect(buttons[0]!.element.className).toContain("text-left");
    expect(buttons[0]!.element.className).not.toContain("bg-[#15803d]");
    expect(buttons[3]!.element.className).toContain("text-red-500");
    expect(buttons[3]!.element.className).not.toContain("bg-[#b91c1c]");
    await buttons[0]!.trigger("click");
    await flushPromises();
    await flushPromises();
    expect(answer).toHaveBeenLastCalledWith("approve-1", { choice: "once" });
    await buttons[3]!.trigger("click");
    await flushPromises();
    await flushPromises();
    expect(answer).toHaveBeenLastCalledWith("approve-1", { choice: "deny" });
    expect(wrapper.get("textarea").attributes("disabled")).toBeUndefined();
    wrapper.unmount();
  });
});

describe("native secret prompts", () => {
  it("renders a masked native secret prompt and sends its exact value result", async () => {
    const factory = nativeSession.useNativeSession;
    let owner!: ReturnType<typeof factory>;
    vi.spyOn(nativeSession, "useNativeSession").mockImplementation((callback) => {
      owner = factory(callback);
      owner.attach = vi.fn(async () => {
        owner.connection.value = "ready";
      });
      return owner;
    });
    history.replaceState({}, "", "/chathermes?profile=alpha#/chat/secret-chat?profile=alpha");
    mockFetch(
      vi.fn(async (input) =>
        json(
          input.includes("/capabilities")
            ? { features: { native_chat: true } }
            : { sessions: [], total: 0 },
        ),
      ),
    );
    const wrapper = mount(App);
    await flushPromises();
    const answer = vi.spyOn(owner, "answer").mockResolvedValue();
    owner.requests.value = [
      {
        id: "secret-request-id",
        method: "secret",
        params: {
          session_id: "secret-chat",
          env_var: "API_TOKEN",
          prompt: "Enter deployment token",
        },
      },
    ];
    await flushPromises();
    expect(wrapper.text()).toContain("Enter deployment token");
    const input = wrapper.get('input[type="password"]');
    expect(input.attributes("autocomplete")).toBe("off");
    await input.setValue("sensitive-value");
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    await flushPromises();
    expect(answer).toHaveBeenCalledWith("secret-request-id", { value: "sensitive-value" });
    expect((input.element as HTMLInputElement).value).toBe("");
    wrapper.unmount();
  });
});

it("keeps the mobile drawer open when selecting a profile and dismisses it for pages", async () => {
  mockFetch(vi.fn(async () => json({ sessions: [], total: 0 })));
  const wrapper = mount(App);
  await flushPromises();
  await wrapper.get('[aria-label="Open navigation"]').trigger("click");
  await wrapper.get("#profile-field").setValue("alpha");
  await flushPromises();
  expect(wrapper.get('[aria-label="Open navigation"]').attributes("aria-expanded")).toBe("true");
  await wrapper.get(".projects-nav").trigger("click");
  await flushPromises();
  await wrapper.get('[aria-label="Open navigation"]').trigger("click");
  await wrapper.get(".projects-nav").trigger("click");
  await flushPromises();
  expect(wrapper.get('[aria-label="Open navigation"]').attributes("aria-expanded")).toBe("false");
  expect(wrapper.find(".projects-page").exists()).toBe(true);
  wrapper.unmount();
});

it("switches an already-open viewer for canonical notification links and ignores removed query links", async () => {
  const listeners: ((event: MessageEvent) => void)[] = [];
  vi.stubGlobal("navigator", {
    onLine: true,
    serviceWorker: {
      ready: Promise.resolve({ active: { postMessage: vi.fn() } }),
      addEventListener: (name: string, listener: (event: MessageEvent) => void) => {
        if (name === "message") listeners.push(listener);
      },
      removeEventListener: vi.fn(),
    },
  });
  const factory = nativeSession.useNativeSession;
  let owner!: ReturnType<typeof factory>;
  vi.spyOn(nativeSession, "useNativeSession").mockImplementation((callback) => {
    owner = factory(callback);
    owner.attach = vi.fn(async () => {
      owner.connection.value = "ready";
    });
    return owner;
  });
  mockFetch(
    vi.fn(async (input) => {
      const url = new URL(input, location.origin);
      if (url.pathname.endsWith("/scheduled/output")) {
        expect(url.searchParams.get("profile")).toBe("beta");
        expect(url.searchParams.get("job_id")).toBe("audit");
        expect(url.searchParams.get("run_id")).toBe("output:2025-01-01_00-00-00");
        return json({
          messages: [],
          output: "Exact older scheduled result " + "Full output. ".repeat(400) + "RESULT END",
        });
      }
      if (url.pathname.endsWith("/scheduled/runs"))
        return json({
          runs: [{ id: "output:2026-01-01_00-00-00", started_at: 200, source: "cron_output" }],
          offset: 0,
          limit: 30,
          has_more: true,
        });
      if (url.pathname.endsWith("/scheduled"))
        return json({ jobs: [{ id: "audit", name: "Security Audit", state: "completed" }] });
      return json(
        input.includes("/capabilities")
          ? { features: { native_chat: true } }
          : { sessions: [], total: 0 },
      );
    }),
  );
  history.replaceState({}, "", "/chathermes?profile=alpha#/chat/one?profile=alpha");
  const wrapper = mount(App);
  await flushPromises();
  const dispatch = (url: string) =>
    listeners.forEach((listener) =>
      listener(
        new MessageEvent("message", {
          data: { type: "chathermes.navigate", url: location.origin + url },
        }),
      ),
    );
  dispatch("/chathermes?profile=alpha&session=two");
  await flushPromises();
  expect(owner.attach).toHaveBeenCalledExactlyOnceWith("alpha", "one");
  dispatch("/chathermes?profile=alpha#/chat/two?profile=alpha");
  await flushPromises();
  expect(owner.attach).toHaveBeenCalledTimes(2);
  expect(owner.attach).toHaveBeenLastCalledWith("alpha", "two");
  expect(routeUrl().pathname).toBe("/chat/two");
  expect(nativeSession.useNativeSession).toHaveBeenCalledOnce();
  dispatch("/chathermes?profile=beta#/scheduled/audit/output%3A2025-01-01_00-00-00?profile=beta");
  await flushPromises();
  await flushPromises();
  expect(routeUrl().pathname).toBe("/scheduled/audit/output%3A2025-01-01_00-00-00");
  expect(wrapper.get(".scheduled-page").text()).toContain("Security Audit");
  expect(wrapper.get(".scheduled-page").text()).toContain("Exact older scheduled result");
  expect(wrapper.get(".scheduled-page").text()).toContain("RESULT END");
  expect(wrapper.get(".topbar-profile").text()).toBe("beta");
  wrapper.unmount();
});

describe("local mobile drawer swipes", () => {
  let wrapper: ReturnType<typeof mount>;
  let clock = 0;
  beforeEach(async () => {
    clock = 0;
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: true })),
    );
    mockFetch(async () => json({ sessions: [], total: 0 }));
    wrapper = mount(App);
    await flushPromises();
    vi.spyOn(wrapper.get(".sidebar").element, "getBoundingClientRect").mockReturnValue({
      width: 300,
    } as DOMRect);
    vi.spyOn(wrapper.get(".transcript").element, "getBoundingClientRect").mockReturnValue({
      top: 68,
      bottom: 600,
    } as DOMRect);
  });
  afterEach(() => wrapper.unmount());
  async function touch(
    target: Element,
    type: string,
    x: number,
    y = 200,
    elapsed = 100,
    count = 1,
  ) {
    clock += elapsed;
    const event = new Event(type, { bubbles: true, cancelable: true });
    const touches = Array.from({ length: count }, (_, identifier) => ({
      identifier,
      clientX: x,
      clientY: y,
    }));
    Object.defineProperties(event, {
      touches: { value: type === "touchend" ? [] : touches },
      changedTouches: { value: touches },
      timeStamp: { value: clock },
    });
    target.dispatchEvent(event);
    await flushPromises();
    return event;
  }
  const opened = () => wrapper.get(".mobile-menu").attributes("aria-expanded") === "true";
  async function swipe(target: Element, start: number, end: number, elapsed = 400) {
    await touch(target, "touchstart", start);
    await touch(target, "touchmove", end, 200, elapsed);
    await touch(target, "touchend", end);
  }

  it("tracks the finger, snaps by distance, and closes on a left drawer swipe", async () => {
    const transcript = wrapper.get(".transcript").element;
    await touch(transcript, "touchstart", 80);
    expect(wrapper.find(".scrim").exists()).toBe(false);
    const move = await touch(transcript, "touchmove", 200, 205, 400);
    expect(move.defaultPrevented).toBe(true);
    expect(wrapper.get(".sidebar").attributes("style")).toContain("translate: -180px 0");
    expect(wrapper.get(".scrim").attributes("style")).toContain("opacity: 0.4");
    expect(opened()).toBe(false);
    await touch(transcript, "touchend", 200);
    expect(opened()).toBe(true);
    expect(wrapper.get(".sidebar").attributes("style") || "").not.toContain("translate:");
    await swipe(wrapper.get(".brand").element, 240, 100);
    expect(opened()).toBe(false);
  });

  it("snaps short slow drags back and accepts a short fast flick", async () => {
    const transcript = wrapper.get(".transcript").element;
    await swipe(transcript, 80, 130);
    expect(opened()).toBe(false);
    expect(wrapper.find(".scrim").exists()).toBe(false);
    await swipe(transcript, 80, 130, 40);
    expect(opened()).toBe(true);
    await swipe(wrapper.get(".brand").element, 240, 210);
    expect(opened()).toBe(true);
    await swipe(wrapper.get(".brand").element, 240, 210, 30);
    expect(opened()).toBe(false);
  });

  it("abandons vertical, wrong-direction, cancelled, and multitouch contacts", async () => {
    const transcript = wrapper.get(".transcript").element;
    await touch(transcript, "touchstart", 80);
    const vertical = await touch(transcript, "touchmove", 85, 250);
    expect(vertical.defaultPrevented).toBe(false);
    await touch(transcript, "touchmove", 250, 260);
    await touch(transcript, "touchend", 250, 260);
    expect(opened()).toBe(false);
    await swipe(transcript, 240, 80);
    expect(opened()).toBe(false);
    for (const type of ["touchcancel", "touchmove"]) {
      await touch(transcript, "touchstart", 80);
      await touch(transcript, "touchmove", 250);
      await touch(transcript, type, 250, 200, 100, 2);
      await touch(transcript, "touchend", 250);
      expect(opened()).toBe(false);
      expect(wrapper.find(".scrim").exists()).toBe(false);
    }
  });

  it("excludes the left 30px, controls, code, composer, header, and other pages", async () => {
    const transcript = wrapper.get(".transcript").element;
    await swipe(transcript, 29, 250);
    expect(opened()).toBe(false);
    for (const selector of [".composer", "textarea", ".topbar"]) {
      await swipe(wrapper.get(selector).element, 80, 250);
      expect(opened()).toBe(false);
    }
    for (const tag of ["button", "a", "select", "summary", "pre", "code"]) {
      const control = document.createElement(tag);
      const child = document.createElement("span");
      control.append(child);
      transcript.append(control);
      await swipe(child, 80, 250);
      expect(opened()).toBe(false);
      control.remove();
    }
    await wrapper.get(".drawer-settings").trigger("click");
    await flushPromises();
    await swipe(wrapper.get(".main-panel").element, 80, 250);
    expect(opened()).toBe(false);
  });

  it("keeps backdrop taps and menu buttons working, suppressing the click after dragging", async () => {
    await wrapper.get(".mobile-menu").trigger("click");
    expect(opened()).toBe(true);
    const scrim = wrapper.get(".scrim").element;
    await touch(scrim, "touchstart", 350);
    await touch(scrim, "touchmove", 330, 200, 400);
    await touch(scrim, "touchend", 330);
    await wrapper.get(".scrim").trigger("click");
    expect(opened()).toBe(true);
    vi.spyOn(Date, "now").mockReturnValue(Date.now() + 500);
    await wrapper.get(".scrim").trigger("click");
    expect(opened()).toBe(false);
    await wrapper.get(".mobile-menu").trigger("click");
    await swipe(wrapper.get(".scrim").element, 350, 200);
    expect(opened()).toBe(false);
  });

  it("excludes the composer area behind the backdrop and desktop gestures", async () => {
    await wrapper.get(".mobile-menu").trigger("click");
    const scrim = wrapper.get(".scrim").element;
    await touch(scrim, "touchstart", 350, 650);
    await touch(scrim, "touchmove", 200, 650);
    await touch(scrim, "touchend", 200, 650);
    expect(opened()).toBe(true);
    await wrapper.get(".mobile-close").trigger("click");
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: false })),
    );
    await swipe(wrapper.get(".transcript").element, 80, 250);
    expect(opened()).toBe(false);
  });

  it("never registers gestures on document or window", async () => {
    wrapper.unmount();
    const documentListeners = vi.spyOn(document, "addEventListener");
    const windowListeners = vi.spyOn(window, "addEventListener");
    wrapper = mount(App);
    await flushPromises();
    for (const listeners of [documentListeners, windowListeners])
      expect(listeners.mock.calls.some(([name]) => /^(touch|pointer)/.test(name))).toBe(false);
    await swipe(document.body, 80, 250);
    expect(opened()).toBe(false);
  });

  it("discards an expired flick and cancels tracking on navigation or desktop resize", async () => {
    const transcript = wrapper.get(".transcript").element;
    await touch(transcript, "touchstart", 80);
    await touch(transcript, "touchmove", 130, 200, 40);
    await touch(transcript, "touchend", 130, 200, 200);
    expect(opened()).toBe(false);
    await touch(transcript, "touchstart", 80);
    await touch(transcript, "touchmove", 250);
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: false })),
    );
    await touch(transcript, "touchend", 250);
    expect(opened()).toBe(false);
    expect(wrapper.find(".scrim").exists()).toBe(false);
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: true })),
    );
    await touch(transcript, "touchstart", 80);
    await touch(transcript, "touchmove", 250);
    history.replaceState({}, "", "/chathermes?profile=alpha#/settings?profile=alpha");
    window.dispatchEvent(new PopStateEvent("popstate"));
    await flushPromises();
    expect(opened()).toBe(false);
    expect(wrapper.find(".scrim").exists()).toBe(false);
    expect(wrapper.get(".sidebar").attributes("style") || "").not.toContain("translate:");
  });
});

describe("manual session tracking", () => {
  const rows = [
    { id: "recent", title: "Recent untracked", last_active: 30 },
    { id: "open", title: "Listed open", last_active: 20 },
  ];
  const old = { id: "old", title: "Older open", last_active: 1 };
  const tracked = [
    { session_id: "old", status: "open" as const, updated_at: "2026-10-29T12:00:00Z" },
    { session_id: "open", status: "open" as const, updated_at: "2026-10-28T12:00:00Z" },
  ];
  function setup() {
    vi.mocked(api.tracking).mockResolvedValue({ tracking: tracked, sessions: [old, rows[1]!] });
    mockFetch(async (input) =>
      json(
        input.includes("/capabilities")
          ? {}
          : {
              sessions: input.includes("offset=30") ? [old] : rows,
              offset: input.includes("offset=30") ? 30 : 0,
              limit: 30,
              has_more: !input.includes("offset=30"),
            },
      ),
    );
  }
  it("resolves older Open summaries, sorts by activation and deduplicates across pages and reload", async () => {
    setup();
    let wrapper = mount(App);
    await flushPromises();
    expect(wrapper.find('[aria-label="Active"]').text()).toMatch(/Older open.*Listed open/s);
    expect(wrapper.find('[aria-label="Recents"]').text()).toContain("Recent untracked");
    expect(wrapper.find('[aria-label="Recents"]').text()).not.toContain("Listed open");
    await wrapper.find(".load-more").trigger("click");
    await flushPromises();
    expect(wrapper.findAll(".session-row")).toHaveLength(3);
    expect(vi.mocked(api.tracking)).toHaveBeenCalledWith("alpha", expect.any(AbortSignal));
    wrapper.unmount();
    wrapper = mount(App);
    await flushPromises();
    expect(wrapper.find('[aria-label="Active"]').text()).toContain("Older open");
    wrapper.unmount();
  });
  it("settles immediately, rolls back failure, and leaves the native owner untouched", async () => {
    setup();
    const request = deferred<never>();
    const track = vi.spyOn(api, "track").mockReturnValue(request.promise);
    const factory = nativeSession.useNativeSession;
    const close = vi.fn(),
      stop = vi.fn();
    vi.spyOn(nativeSession, "useNativeSession").mockImplementation((...args) => {
      const owner = factory(...args);
      owner.close = close;
      owner.stop = stop;
      return owner;
    });
    const wrapper = mount(App);
    await flushPromises();
    close.mockClear();
    stop.mockClear();
    const select = wrapper.findComponent(SessionSidebar).emitted("select");
    await wrapper.get('button[aria-label="Mark Older open settled"]').trigger("click");
    expect(wrapper.find('[aria-label="Active"]').text()).not.toContain("Older open");
    expect(wrapper.find('[aria-label="Recents"]').text()).toContain("Older open");
    expect(track).toHaveBeenCalledWith("alpha", "old", "settled");
    request.reject(new Error("Tracking save failed"));
    await flushPromises();
    expect(wrapper.find('[aria-label="Active"]').text()).toContain("Older open");
    expect(wrapper.get('[role="alert"]').text()).toContain("Tracking save failed");
    expect(wrapper.findComponent(SessionSidebar).emitted("select")).toEqual(select);
    expect(close).not.toHaveBeenCalled();
    expect(stop).not.toHaveBeenCalled();
    wrapper.unmount();
  });
  it("reloads metadata by profile and ignores a late write from the previous profile", async () => {
    setup();
    vi.mocked(api.tracking).mockImplementation(async (profile) =>
      profile === "alpha" ? { tracking: tracked, sessions: [old] } : { tracking: [], sessions: [] },
    );
    const request = deferred<never>();
    vi.spyOn(api, "track").mockReturnValue(request.promise);
    const wrapper = mount(App);
    await flushPromises();
    await wrapper.get('button[aria-label="Mark Older open settled"]').trigger("click");
    await wrapper.get("#profile-field").setValue("beta");
    await flushPromises();
    expect(wrapper.find('[aria-label="Active"]').exists()).toBe(false);
    request.reject(new Error("obsolete failure"));
    await flushPromises();
    expect(wrapper.text()).not.toContain("obsolete failure");
    expect(wrapper.text()).not.toContain("Older open");
    expect(vi.mocked(api.tracking)).toHaveBeenCalledWith("beta", expect.any(AbortSignal));
    wrapper.unmount();
  });
  it("replaces cached ancestor IDs when compaction happens between history pages", async () => {
    setup();
    const wrapper = mount(App);
    await flushPromises();
    vi.mocked(api.tracking).mockResolvedValue({
      tracking: [{ session_id: "tip", status: "open", updated_at: tracked[1]!.updated_at }],
      sessions: [{ ...rows[1]!, id: "tip" }],
      aliases: { open: "tip" },
    });
    await wrapper.get(".load-more").trigger("click");
    await flushPromises();
    const sidebar = wrapper.findComponent(SessionSidebar);
    const summaries = sidebar.props("sessions") as Session[];
    expect(summaries.filter((row) => row.id === "tip")).toHaveLength(1);
    expect(summaries.some((row) => row.id === "open")).toBe(false);
    expect(wrapper.find('[aria-label="Active"]').text()).toContain("Listed open");
    expect(wrapper.find('[aria-label="Recents"]').text()).not.toContain("Listed open");
    wrapper.unmount();
  });
  it("refreshes newly created ChatHermes tracking without manufacturing an unpersisted history row", async () => {
    const factory = nativeSession.useNativeSession;
    vi.spyOn(nativeSession, "useNativeSession").mockImplementation((...args) => {
      const owner = factory(...args);
      owner.attach = vi.fn(async () => {});
      return owner;
    });
    mockFetch(async (input) =>
      json(input.includes("/capabilities") ? streaming : { sessions: [], total: 0 }),
    );
    const wrapper = mount(App);
    await flushPromises();
    vi.spyOn(api, "create").mockResolvedValue({ id: "new-chat" });
    vi.mocked(api.tracking).mockResolvedValue({
      tracking: [{ session_id: "new-chat", status: "open", updated_at: "2026-10-29" }],
      sessions: [{ id: "new-chat", title: "Created in ChatHermes" }],
    });
    wrapper.findComponent(SessionSidebar).vm.$emit("create");
    await flushPromises();
    expect(wrapper.find('[aria-label="Active"]').text()).toContain("Created in ChatHermes");
    wrapper.unmount();
  });
  it("keeps chronological history usable when tracking is temporarily unavailable", async () => {
    setup();
    vi.mocked(api.tracking).mockRejectedValue(new Error("offline tracking"));
    const wrapper = mount(App);
    await flushPromises();
    expect(wrapper.find('[aria-label="Recents"]').text()).toContain("Recent untracked");
    expect(wrapper.get('[role="alert"]').text()).toContain("Could not load session tracking");
    wrapper.unmount();
  });
});
