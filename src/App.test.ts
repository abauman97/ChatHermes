// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { mount, flushPromises } from "@vue/test-utils";
import { computed, ref } from "vue";
import App from "./App.vue";
import SessionSidebar from "./features/sessions/components/SessionSidebar.vue";
import * as push from "./features/notifications/services/push";
import * as nativeSession from "./features/chat/runtime/native-session";
beforeEach(() => {
  history.replaceState({}, "", "/chathermes?profile=alpha");
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
    history.replaceState({}, "", "/chathermes?profile=alpha&session=push_one");
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
    query();
    expect(postMessage).toHaveBeenLastCalledWith(
      expect.objectContaining({ session: "", connected: false }),
    );
    history.replaceState({}, "", "/chathermes?profile=beta&session=push_two");
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
  it("renders the ChatHermes logo in the sidebar drawer", async () => {
    mockFetch(vi.fn(async () => json({ sessions: [], total: 0 })));
    const wrapper = mount(App);
    await flushPromises();
    const logo = wrapper.get(".brand-mark");
    expect(logo.element.tagName).toBe("IMG");
    expect(logo.attributes("src")).toBe("/api/plugins/chathermes/assets/dist/icons/icon-192.png");
    expect(logo.attributes("alt")).toBe("");
    wrapper.unmount();
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
    expect(wrapper.get(".push-setting").text()).toContain("Notifications for alpha");
    await wrapper.get(".push-setting button").trigger("click");
    expect(disable).toHaveBeenCalledWith("alpha");
    state.mockImplementation((p) =>
      p === "alpha" ? oldState.promise : Promise.resolve({ ...enabled, subscribed: false }),
    );
    await wrapper.get("#profile-field").setValue("beta");
    await flushPromises();
    await wrapper.get(".drawer-settings").trigger("click");
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
    expect(wrapper.get(".push-setting button").text()).toBe("Enable notifications");
    expect(state).toHaveBeenCalledWith("beta");
    wrapper.unmount();
  });

  it("opens a dedicated settings page, closes the drawer and restores focus", async () => {
    mockFetch(vi.fn(async () => json({ sessions: [], total: 0 })));
    const wrapper = mount(App, { attachTo: document.body });
    await flushPromises();
    const sidebar = wrapper.get(".sidebar");
    expect(sidebar.findAll("button").filter((button) => button.text() === "New chat")).toHaveLength(
      1,
    );
    expect(sidebar.get(".drawer-chat").element.nextElementSibling).toBe(
      sidebar.get(".projects-nav").element,
    );
    expect(wrapper.find(".push-setting").exists()).toBe(false);
    expect(sidebar.find(".sidebar-foot .drawer-chat").exists()).toBe(false);
    await wrapper.get('[aria-label="Open navigation"]').trigger("click");
    await wrapper.get('[aria-label="Settings"]').trigger("click");
    const panel = wrapper.get(".settings-page");
    expect(panel.get("h2").element).toBe(document.activeElement);
    expect(wrapper.get(".drawer-settings").attributes("aria-current")).toBe("page");
    expect(location.search).toContain("view=settings");
    expect(wrapper.get('[aria-label="Open navigation"]').attributes("aria-expanded")).toBe("false");
    expect(panel.text()).toContain("Enable notifications");
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flushPromises();
    expect(wrapper.find(".settings-page").exists()).toBe(false);
    expect(wrapper.get(".drawer-settings").element).toBe(document.activeElement);
    expect(wrapper.get('[aria-label="Open navigation"]').attributes("aria-expanded")).toBe("false");
    await wrapper.get('[aria-label="Open navigation"]').trigger("click");
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
    history.replaceState({}, "", "/chathermes?profile=alpha&session=live-chat");
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
    const settingsUrl = location.href;
    expect(wrapper.get(".settings-page").text()).toContain("Settings");
    expect(wrapper.find('[role="dialog"][aria-label="Settings"]').exists()).toBe(false);
    const requests = fake.mock.calls.length;
    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    expect(wrapper.find(".settings-page").exists()).toBe(true);
    for (const url of [chatUrl, settingsUrl, chatUrl]) {
      history.replaceState({}, "", url);
      window.dispatchEvent(new PopStateEvent("popstate"));
      await flushPromises();
      expect(wrapper.find(".settings-page").exists()).toBe(url === settingsUrl);
    }
    expect(close).not.toHaveBeenCalled();
    expect(owner.attach).toHaveBeenCalledTimes(1);
    expect(owner.busy.value).toBe(true);
    expect(fake.mock.calls).toHaveLength(requests);
    expect(wrapper.get(".composer").element).toBe(composer);
    expect((textarea.element as HTMLTextAreaElement).value).toBe("Unsent draft");
    await textarea.trigger("focus");
    expect(textarea.attributes("disabled")).toBeUndefined();
    wrapper.unmount();
  });
  it("loads settings links and returns to archived projects, then keeps profile changes on settings", async () => {
    history.replaceState(
      {},
      "",
      "/chathermes?profile=alpha&view=settings&return_view=projects&archived=1",
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
    expect(new URLSearchParams(location.search).get("view")).toBe("projects");
    expect(new URLSearchParams(location.search).get("archived")).toBe("1");
    await wrapper.get(".drawer-settings").trigger("click");
    expect(new URLSearchParams(location.search).get("archived")).toBe("1");
    await wrapper.get("#settings-profile").setValue("beta");
    await flushPromises();
    expect(wrapper.get(".settings-page").text()).toContain("Notifications for beta");
    expect(new URLSearchParams(location.search).get("view")).toBe("settings");
    expect(new URLSearchParams(location.search).get("profile")).toBe("beta");
    await wrapper.get('[aria-label="Close settings"]').trigger("click");
    expect(wrapper.find(".projects-page").exists()).toBe(false);
    wrapper.unmount();
  });
  it("offers screen actions in the top bar while retaining profile settings", async () => {
    mockFetch(vi.fn(async () => json({ sessions: [], total: 0 })));
    const wrapper = mount(App);
    await flushPromises();
    expect(wrapper.get(".drawer-chat").text()).toBe("New chat");
    expect(wrapper.find(".drawer-settings").exists()).toBe(true);
    await wrapper.get('[aria-label="Screen options"]').trigger("click");
    const menu = wrapper.get('[role="menu"]');
    expect(menu.get('[role="menuitem"]').text()).toBe("New chat");
    await menu.trigger("keydown", { key: "Escape" });
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
    await wrapper.get('[role="menuitem"]').trigger("pointerdown");
    expect(wrapper.find('[role="menu"]').exists()).toBe(true);
    await button.trigger("click");
    await button.trigger("click");
    await button.trigger("click");
    expect(wrapper.find('[role="menu"]').exists()).toBe(false);
    await button.trigger("click");
    const textarea = wrapper.get("textarea");
    (textarea.element as HTMLTextAreaElement).focus();
    await textarea.trigger("click");
    expect(wrapper.find('[role="menu"]').exists()).toBe(false);
    expect(document.activeElement).toBe(textarea.element);
    await button.trigger("click");
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flushPromises();
    expect(wrapper.find('[role="menu"]').exists()).toBe(false);
    expect(document.activeElement).toBe(button.element);
    await textarea.setValue("Draft");
    await button.trigger("click");
    await wrapper.get('[role="menuitem"]').trigger("click");
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
    const toggle = wrapper.get(".push-setting button");
    await toggle.trigger("click");
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
    expect(sendTest).toHaveBeenCalledWith("alpha");
    expect(wrapper.get(".push-setting").text()).toContain("Test notification scheduled.");
    await toggle.trigger("click");
    await flushPromises();
    expect(unsubscribe).toHaveBeenCalledWith("alpha");
    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    await flushPromises();
    expect(wrapper.find(".settings-page").exists()).toBe(true);
    await wrapper.get(".projects-nav").trigger("click");
    await flushPromises();
    expect(wrapper.find(".settings-page").exists()).toBe(false);
    wrapper.unmount();
  });
});
describe("profile navigation", () => {
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
    expect(wrapper.get('[role="menu"]').get('[role="menuitem"]').text()).toBe("New chat");
    expect(wrapper.get('[aria-label="Screen options"]').attributes("aria-expanded")).toBe("true");
    await wrapper.get('[role="menuitem"]').trigger("click");
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
    const calls = fake.mock.calls.length;
    history.pushState({}, "", "/chathermes?profile=../x");
    dispatchEvent(new PopStateEvent("popstate"));
    await flushPromises();
    expect(wrapper.get('.sidebar [role="alert"]').text()).toContain("Invalid profile name");
    expect(fake).toHaveBeenCalledTimes(calls);
    expect(wrapper.text()).toContain("Alpha session");
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
    history.pushState({}, "", "/chathermes?profile=alpha");
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
    history.pushState({}, "", "/chathermes?profile=beta&session=beta-one");
    dispatchEvent(new PopStateEvent("popstate"));
    await flushPromises();
    await wrapper.get(".profile-field").setValue("alpha");
    betaCapabilities.resolve(json(streaming));
    await flushPromises();
    expect((wrapper.get(".profile-field").element as HTMLInputElement).value).toBe("alpha");
    expect(wrapper.get(".composer textarea").attributes("disabled")).toBeUndefined();
    expect(location.search).toBe("?profile=alpha");
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
    expect(location.search).toBe("?profile=alpha&session=existing");
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
    expect(location.search).toBe("?profile=alpha&session=existing");
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
    expect(location.search).toBe("?profile=alpha&session=new");
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
    expect(wrapper.get('[data-provider="alpha"]').text()).toContain("Current");
    await wrapper.get('[data-provider="alpha"]').trigger("click");
    expect(
      wrapper.findAll(".model-option").map((item) => item.text().replace("✓", "").trim()),
    ).toEqual(["alpha-default", "alpha-extra"]);
    await wrapper.get('[data-model="alpha-default"]').trigger("click");
    await wrapper.get("textarea").setValue("default turn");
    await wrapper.get("form").trigger("submit");
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
    await wrapper.get('[data-provider="custom:other"]').trigger("click");
    await wrapper.get('[data-model="shared-model"]').trigger("click");
    await wrapper.get("textarea").setValue("other turn");
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    expect(turns[1]?.body).toMatchObject({
      model: "shared-model",
      provider: "custom:other",
    });
    await wrapper.get(".model-pill").trigger("click");
    await wrapper.get('[data-provider=""]').trigger("click");
    expect(wrapper.findAll(".model-option").map((item) => item.text())).toEqual(["Instant"]);
    await wrapper.get('[data-model="Instant"]').trigger("click");
    await wrapper.get("textarea").setValue("route turn");
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    expect(turns[2]?.body).toEqual({
      session_id: "alpha-session",
      input: "route turn",
      model: "Instant",
    });
    await wrapper.get(".profile-field").setValue("beta");
    await flushPromises();
    expect(wrapper.get(".model-pill").text()).toBe("beta-default");
    await wrapper.get(".model-pill").trigger("click");
    expect(wrapper.get('[data-provider="beta"]').text()).toContain("Current");
    await wrapper.get('[data-provider="beta"]').trigger("click");
    expect(
      wrapper.findAll(".model-option").map((item) => item.text().replace("✓", "").trim()),
    ).toEqual(["beta-default", "beta-extra"]);
    await wrapper.get('[data-model="beta-extra"]').trigger("click");
    await wrapper.get("textarea").setValue("beta turn");
    await wrapper.get("form").trigger("submit");
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
    expect(wrapper.findAll(".provider-option").map((item) => item.text())).toEqual([
      "Model routes",
    ]);
    await wrapper.get('[data-provider=""]').trigger("click");
    expect(
      wrapper.findAll(".model-option").map((item) => item.text().replace("✓", "").trim()),
    ).toEqual(["saved", "route"]);
    expect(wrapper.text()).not.toContain("old-model");
    wrapper.unmount();
  });
});

describe("TUI-only chat execution", () => {
  it.each([true, false])("ignores saved REST turns with native capability %s", async (enabled) => {
    history.replaceState({}, "", "/chathermes?profile=alpha&session=s1");
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
    const wrapper = mount(App);
    await flushPromises();
    const prompt = wrapper.get("textarea");
    expect(prompt.attributes("disabled")).toBeUndefined();
    await prompt.setValue("Continue");
    const send = wrapper.get('[aria-label="Send message"]');
    if (enabled) {
      expect(owner.attach).toHaveBeenCalledExactlyOnceWith("alpha", "s1");
      await send.trigger("click");
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
    history.replaceState({}, "", "/chathermes?profile=alpha&session=s1");
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
    await wrapper.get(".clarification-choices button").trigger("click");
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
    expect(answer).toHaveBeenCalledTimes(2);
    await wrapper.get(".clarification-other input").setValue("Old draft");
    approval.value = { ...request.params, request_id: "clarify-2", kind: request.method };
    await flushPromises();
    expect((wrapper.get(".clarification-other input").element as HTMLInputElement).value).toBe("");
    await wrapper.get(".clarification-other input").setValue("Exact other response");
    await wrapper.get(".clarification-card form").trigger("submit");
    await flushPromises();
    expect(answer).toHaveBeenLastCalledWith("clarify-2", {
      answers: { q0: "Exact other response" },
    });
    wrapper.unmount();
  });
});

describe("native approval controls", () => {
  it("renders stacked approve and deny actions and sends the exact choice", async () => {
    history.replaceState({}, "", "/chathermes?profile=alpha&session=s1");
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
    expect(answer).toHaveBeenLastCalledWith("approve-1", { choice: "once" });
    await buttons[3]!.trigger("click");
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
    history.replaceState({}, "", "/chathermes?profile=alpha&session=secret-chat");
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
    expect(answer).toHaveBeenCalledWith("secret-request-id", { value: "sensitive-value" });
    expect((input.element as HTMLInputElement).value).toBe("");
    wrapper.unmount();
  });
});
