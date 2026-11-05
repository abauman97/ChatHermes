import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { notificationUrl, supported, state, sendTest } from "./push";

class ActivatedWorker extends EventTarget {
  state = "activated";
}

describe("push support", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("sends explicit tests through the authenticated profile route", async () => {
    const fetch = vi.fn(async () => new Response("{}"));
    vi.stubGlobal("fetch", fetch);
    await sendTest("alpha");
    expect(fetch).toHaveBeenCalledWith("/api/plugins/chathermes/push/test?profile=alpha", {
      method: "POST",
      credentials: "same-origin",
    });
    fetch.mockResolvedValue(new Response("{}", { status: 503 }));
    await expect(sendTest("beta")).rejects.toThrow("Could not send a test notification.");
  });
  it("detects secure Push API availability", () => {
    vi.stubGlobal("window", { isSecureContext: true, PushManager: class {} });
    vi.stubGlobal("navigator", { serviceWorker: {} });
    vi.stubGlobal("Notification", { permission: "default" });
    expect(supported()).toBe(true);
  });
  it("rejects insecure or missing Push API", () => {
    vi.stubGlobal("window", { isSecureContext: false, PushManager: class {} });
    vi.stubGlobal("navigator", { serviceWorker: {} });
    vi.stubGlobal("Notification", { permission: "default" });
    expect(supported()).toBe(false);
  });
  it("builds deep links using canonical chat hashes and the host profile query", () => {
    vi.stubGlobal("location", { origin: "https://chat.test" });
    expect(notificationUrl("alpha", "sess_123")).toBe(
      "/chathermes?profile=alpha#/chat/sess_123?profile=alpha",
    );
  });
  it("shows server unavailability even when the config request succeeds", async () => {
    vi.stubGlobal("window", { isSecureContext: true, PushManager: class {} });
    vi.stubGlobal("navigator", {
      serviceWorker: {
        register: vi.fn(async () => ({
          active: new ActivatedWorker(),
          pushManager: { getSubscription: async () => null },
        })),
      },
    });
    vi.stubGlobal("Notification", { permission: "default" });
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ available: false, vapid_public_key: null }))),
    );
    expect(await state()).toEqual({
      supported: true,
      permission: "default",
      subscribed: false,
      available: false,
      error: "Push notifications are unavailable on this server.",
    });
  });
});

describe("profile registrations share one browser subscription", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });
  it("reads stored status, saves the accepted shape, and disables only the selected profile ID", async () => {
    vi.resetModules();
    const push = await import("./push");
    const subscription = {
      endpoint: "https://push.test/device",
      toJSON: () => ({
        endpoint: "https://push.test/device",
        expirationTime: null,
        keys: { p256dh: "key", auth: "auth" },
      }),
      unsubscribe: vi.fn(),
    };
    const manager = {
      getSubscription: vi.fn(async () => subscription),
      subscribe: vi.fn(async () => subscription),
    };
    vi.stubGlobal("window", { isSecureContext: true, PushManager: class {} });
    vi.stubGlobal("navigator", {
      serviceWorker: {
        register: vi.fn(async () => ({ active: new ActivatedWorker(), pushManager: manager })),
      },
    });
    vi.stubGlobal("Notification", {
      permission: "granted",
      requestPermission: vi.fn(async () => "granted"),
    });
    const registrations = new Map<string, string>([["alpha", "alpha_id"]]);
    const fetch = vi.fn(async (input: string, init?: RequestInit) => {
      const url = new URL(input, "https://chat.test"),
        profile = url.searchParams.get("profile") || "default";
      if (url.pathname.endsWith("/config"))
        return new Response(JSON.stringify({ available: true, vapid_public_key: "YWJj" }));
      if (url.pathname.endsWith("/status"))
        return new Response(
          JSON.stringify({
            enabled: registrations.has(profile),
            id: registrations.get(profile) || null,
          }),
        );
      if (init?.method === "DELETE") registrations.delete(profile);
      else registrations.set(profile, profile + "_id");
      return new Response("{}");
    });
    vi.stubGlobal("fetch", fetch);
    expect((await push.state("alpha")).subscribed).toBe(true);
    expect((await push.state("beta")).subscribed).toBe(false);
    await push.subscribe("beta");
    expect(fetch).toHaveBeenCalledWith(
      "/api/plugins/chathermes/push/subscriptions?profile=beta",
      expect.objectContaining({
        credentials: "same-origin",
        body: JSON.stringify({ endpoint: subscription.endpoint, keys: subscription.toJSON().keys }),
      }),
    );
    await push.unsubscribe("alpha");
    expect(fetch).toHaveBeenCalledWith(
      "/api/plugins/chathermes/push/subscriptions/alpha_id?profile=alpha",
      { method: "DELETE", credentials: "same-origin" },
    );
    expect((await push.state("alpha")).subscribed).toBe(false);
    expect((await push.state("beta")).subscribed).toBe(true);
    expect(subscription.unsubscribe).not.toHaveBeenCalled();
    fetch.mockResolvedValue(new Response("{}", { status: 503 }));
    await expect(push.unsubscribe("beta")).rejects.toThrow("Could not load notification status");
    expect(subscription.unsubscribe).not.toHaveBeenCalled();
  });
});

describe("push registration installation lifecycle", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });
  function setup() {
    vi.resetModules();
    class Worker extends EventTarget {
      state = "installing";
      move(state: string) {
        this.state = state;
        this.dispatchEvent(new Event("statechange"));
      }
    }
    const worker = new Worker();
    const registration = { installing: worker, active: null };
    const register = vi.fn(async () => registration);
    vi.stubGlobal("window", { isSecureContext: true, PushManager: class {} });
    vi.stubGlobal("navigator", { serviceWorker: { register } });
    vi.stubGlobal("Notification", { permission: "granted" });
    return { worker, registration, register };
  }
  it("waits through precaching and installation until PushManager can use the worker", async () => {
    const h = setup();
    const push = await import("./push");
    let ready = false;
    const pending = push.registration().then(() => {
      ready = true;
    });
    await vi.waitFor(() => expect(h.register).toHaveBeenCalledTimes(1));
    expect(ready).toBe(false);
    h.worker.move("installed");
    await Promise.resolve();
    expect(ready).toBe(false);
    h.worker.move("activated");
    await pending;
    expect(ready).toBe(true);
    expect(h.register).toHaveBeenCalledWith("/api/plugins/chathermes/push-service-worker.js", {
      scope: "/chathermes",
      updateViaCache: "none",
    });
  });
  it("rejects a failed install and retries registration rather than hanging on ready", async () => {
    const h = setup();
    const push = await import("./push");
    const failed = expect(push.registration()).rejects.toThrow("installation failed");
    await vi.waitFor(() => expect(h.register).toHaveBeenCalledTimes(1));
    h.worker.move("redundant");
    await failed;
    h.worker.move("activated");
    expect(await push.registration()).toBe(h.registration);
    expect(h.register).toHaveBeenCalledTimes(2);
  });
  it("continues using the active push worker while an update is waiting", async () => {
    const h = setup();
    Object.assign(h.registration, { active: new ActivatedWorker(), waiting: h.worker });
    const push = await import("./push");
    expect(await push.registration()).toBe(h.registration);
    expect(h.worker.state).toBe("installing");
  });
});
