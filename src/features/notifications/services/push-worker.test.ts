/// <reference types="node" />
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vite-plus/test";

const worker = readFileSync("public/push-service-worker.js", "utf8");
const origin = "https://chat.test";
const route = origin + "/chathermes?profile=alpha&session=one";
function harness() {
  const handlers: Record<string, (event: any) => void> = {};
  let state: any = {
    type: "chathermes.session",
    url: route,
    profile: "alpha",
    session: "one",
    connected: true,
    visible: true,
  };
  const client = {
    focus: vi.fn(async () => {}),
    id: "tab",
    url: origin + "/old-spa-url",
    visibilityState: "visible",
    focused: false,
    postMessage: vi.fn((_message: any, ports: any[]) => {
      if (state && ports) ports[0].postMessage(state);
    }),
  };
  let clients: any[] = [client];
  const notifications: any[] = [];
  const show = vi.fn(async (_title: string, options: any) => {
    notifications.push({ ...options, close: vi.fn() });
  });
  class Channel {
    port1 = { onmessage: undefined as any, close() {} };
    port2 = { postMessage: (data: any) => this.port1.onmessage?.({ data }), close() {} };
  }
  const getNotifications = vi.fn(async () => notifications);
  const matchAll = vi.fn(async () => clients);
  runInNewContext(worker, {
    URL,
    MessageChannel: Channel,
    setTimeout,
    clearTimeout,
    self: {
      location: { origin },
      addEventListener: (type: string, fn: any) => {
        handlers[type] = fn;
      },
      clients: { matchAll, openWindow: vi.fn() },
      registration: { showNotification: show, getNotifications },
    },
  });
  async function dispatch(type: string, fields: any) {
    let pending: any;
    handlers[type]!({
      ...fields,
      waitUntil: (promise: any) => {
        pending = promise;
      },
    });
    await pending;
  }
  const push = (extra: Record<string, any> = {}) => {
    const profile = extra.profile ?? "alpha";
    return dispatch("push", {
      data: {
        json: () => ({
          title: profile || "ChatHermes",
          type: "turn.complete",
          profile,
          session_id: "one",
          body: "Chat text",
          ...extra,
        }),
      },
    });
  };
  const update = () => dispatch("message", { source: client, data: state });
  return {
    client,
    show,
    getNotifications,
    matchAll,
    notifications,
    push,
    update,
    dispatch,
    setState: (value: any) => {
      state = value;
    },
    patch: (value: any) => {
      state = { ...state, ...value };
    },
    setClients: (value: any[]) => {
      clients = value;
    },
  };
}
describe("visible session notifications", () => {
  it.each(["turn.complete", "approval", "clarify", "attention"])(
    "suppresses %s in visible matching tabs",
    async (type) => {
      const h = harness();
      await h.push({ type });
      expect(h.show).not.toHaveBeenCalled();
      expect(h.client.postMessage).toHaveBeenCalledWith(
        { type: "chathermes.session.query" },
        expect.anything(),
      );
    },
  );
  it.each(["turn.complete", "approval", "clarify", "attention"])(
    "delivers %s and retains matching notifications until the visible session reconnects",
    async (type) => {
      const h = harness();
      h.patch({ connected: false, visible: false });
      await h.push({ type });
      const existing = h.notifications[0];
      h.patch({ visible: true });
      await h.update();
      expect(existing.close).not.toHaveBeenCalled();
      await h.push({ type });
      expect(h.show).toHaveBeenCalledTimes(2);
      h.patch({ connected: true });
      await h.update();
      expect(
        h.notifications.every((notification) => notification.close.mock.calls.length === 1),
      ).toBe(true);
      await h.push({ type });
      expect(h.show).toHaveBeenCalledTimes(2);
    },
  );
  it.each([
    { visible: false },
    { profile: "beta", url: route.replace("alpha", "beta") },
    { session: "two", url: route.replace("one", "two") },
  ])("fails open while reconnecting with hidden or mismatched session %j", async (patch) => {
    const h = harness();
    h.patch({ connected: false, ...patch });
    await h.push();
    expect(h.show).toHaveBeenCalledOnce();
    expect(h.notifications[0].close).not.toHaveBeenCalled();
  });
  it("fails open when a reconnecting visible session stops answering queries", async () => {
    const h = harness();
    h.patch({ connected: false });
    await h.update();
    h.setState(null);
    await h.push();
    expect(h.show).toHaveBeenCalledOnce();
    expect(h.notifications[0].close).not.toHaveBeenCalled();
  });
  it.each([
    { connected: false },
    { connected: undefined },
    { connected: null },
    { connected: "true" },
    { profile: "beta" },
    { session: "two" },
    { session: "" },
    { type: "wrong" },
    { url: origin + "/chathermes" },
    { url: route + "&view=projects" },
    { url: route + "&view=scheduled" },
    { url: route + "&session=two" },
    { url: route + "&profile=beta" },
    { url: "https://other.test/chathermes" },
    { visible: false },
    { visible: undefined },
    { visible: "true" },
  ])("shows for mismatched, disconnected or hidden state %j", async (patch) => {
    const h = harness();
    h.patch(patch);
    await h.push();
    expect(h.show).toHaveBeenCalledOnce();
    expect(h.show.mock.calls[0]).toMatchObject(["alpha", { body: "Chat text" }]);
  });
  it.each([undefined, "hidden", "unknown"])(
    "delivers when window visibility is %s even with a positive reply",
    async (visibilityState) => {
      const h = harness();
      Object.assign(h.client, { visibilityState });
      await h.push();
      expect(h.show).toHaveBeenCalledOnce();
      expect(h.notifications[0].close).not.toHaveBeenCalled();
    },
  );
  it("does not use an old positive announcement after the current reply becomes hidden", async () => {
    const h = harness();
    await h.update();
    h.patch({ visible: false });
    await h.push();
    expect(h.show).toHaveBeenCalledOnce();
    expect(h.notifications[0].close).not.toHaveBeenCalled();
  });
  it("rejects window visibility changing while its reply is in flight", async () => {
    const h = harness();
    h.client.postMessage.mockImplementationOnce((_message, ports) => {
      h.client.visibilityState = "hidden";
      ports[0].postMessage({
        type: "chathermes.session",
        url: route,
        profile: "alpha",
        session: "one",
        connected: true,
        visible: true,
      });
    });
    await h.push();
    expect(h.show).toHaveBeenCalledOnce();
    expect(h.notifications[0].close).not.toHaveBeenCalled();
  });
  it("delivers when current client discovery fails instead of using old state", async () => {
    const h = harness();
    await h.update();
    h.matchAll.mockRejectedValue(new Error("Client state unavailable"));
    await h.push();
    expect(h.show).toHaveBeenCalledOnce();
    expect(h.notifications[0].close).not.toHaveBeenCalled();
  });
  it("delivers to a hidden viewer when notification cleanup lookup fails", async () => {
    const h = harness();
    h.patch({ visible: false });
    h.getNotifications.mockRejectedValue(new Error("Notification lookup unavailable"));
    await h.push();
    expect(h.show).toHaveBeenCalledOnce();
  });
  it("fails open for missing clients and absent handshakes", async () => {
    const h = harness();
    h.setClients([]);
    await h.push();
    expect(h.show).toHaveBeenCalledOnce();
    h.setClients([h.client]);
    h.setState(null);
    await h.push();
    expect(h.show).toHaveBeenCalledTimes(2);
  });
  it.each([
    { visibilityState: "visible", focused: true },
    { visibilityState: "visible", focused: false },
    { visibilityState: "hidden", focused: true },
    { visibilityState: "hidden", focused: false },
  ])("requires known visible window activity %j", async (activity) => {
    const h = harness();
    Object.assign(h.client, activity);
    await h.push();
    expect(h.show).toHaveBeenCalledTimes(activity.visibilityState === "visible" ? 0 : 1);
    h.patch({ connected: false });
    await h.push();
    expect(h.show).toHaveBeenCalledTimes(activity.visibilityState === "visible" ? 1 : 2);
  });
  it("suppresses and closes if any tab is visible, independently of another hidden tab", async () => {
    const h = harness();
    h.patch({ visible: false });
    await h.push();
    const other = {
      ...h.client,
      id: "other",
      postMessage: (_message: any, ports: any[]) =>
        ports[0].postMessage({
          type: "chathermes.session",
          url: route,
          profile: "alpha",
          session: "one",
          connected: true,
          visible: true,
        }),
    };
    h.setClients([h.client, other]);
    await h.update();
    expect(h.notifications[0].close).toHaveBeenCalledOnce();
    await h.push();
    expect(h.show).toHaveBeenCalledOnce();
    h.setClients([h.client]);
    await h.push();
    expect(h.show).toHaveBeenCalledTimes(2);
  });
  it("keeps a clicked notification while navigating to a hidden viewer", async () => {
    const h = harness();
    h.patch({ visible: false });
    await h.push();
    h.client.url = route;
    await h.dispatch("notificationclick", { notification: h.notifications[0] });
    expect(h.notifications[0].close).not.toHaveBeenCalled();
    expect(h.client.focus).toHaveBeenCalledOnce();
    expect(h.client.postMessage).toHaveBeenCalledWith({ type: "chathermes.navigate", url: route });
  });
  it("accepts default profile and ignores stale WindowClient URL and focus", async () => {
    const h = harness();
    h.patch({ profile: "default", url: origin + "/chathermes?session=one" });
    await h.push({ profile: "default" });
    expect(h.show).not.toHaveBeenCalled();
  });
  it("retains hidden notifications then closes every matching tag when visible", async () => {
    const h = harness();
    h.patch({ visible: false });
    await h.push();
    await h.push({ type: "approval" });
    await h.push({ profile: "beta" });
    await h.push({ session_id: "two" });
    await h.push({ type: "test", session_id: "" });
    await h.update();
    expect(h.notifications.every((n) => n.close.mock.calls.length === 0)).toBe(true);
    h.patch({ visible: true });
    await h.update();
    expect(h.notifications.map((n) => n.close.mock.calls.length)).toEqual([1, 1, 0, 0, 0]);
  });
  it("rechecks after display to close a notification racing visibility", async () => {
    const h = harness();
    h.patch({ visible: false });
    h.show.mockImplementationOnce(async (_title, options) => {
      h.notifications.push({ ...options, close: vi.fn() });
      h.patch({ visible: true });
      void h.update();
    });
    await h.push();
    expect(h.notifications[0].close).toHaveBeenCalled();
  });
  it("does not trust unsolicited stale state when the current handshake disagrees", async () => {
    const h = harness();
    h.patch({ visible: false });
    await h.push();
    h.patch({ visible: true });
    h.setClients([]);
    await h.update();
    expect(h.notifications[0].close).not.toHaveBeenCalled();
  });
  it.each(
    [
      ["hidden", "delayed"],
      ["hidden", "timeout"],
      ["session change", "delayed"],
      ["session change", "timeout"],
      ["navigation", "delayed"],
      ["navigation", "timeout"],
      ["unmount", "delayed"],
      ["unmount", "timeout"],
      ["removed client", "delayed"],
      ["removed client", "timeout"],
    ].flatMap(([change, handshake]) =>
      ["push", "update"].map((operation) => [change, handshake, operation]),
    ),
  )(
    "retains notifications after a positive reply followed by %s during a second client %s (%s)",
    async (change, handshake, operation) => {
      vi.useFakeTimers();
      try {
        const h = harness();
        h.patch({ visible: false });
        await h.push();
        const existing = h.notifications[0];
        h.patch({ visible: true });
        const slow = {
          id: "slow",
          visibilityState: "visible",
          url: origin + "/other-dashboard-view",
          postMessage: (_message: any, ports: any[]) => {
            setTimeout(() => {
              if (change === "hidden") h.client.visibilityState = "hidden";
              if (change === "session change")
                h.patch({ session: "two", url: route.replace("one", "two") });
              if (change === "navigation") h.patch({ url: origin + "/chathermes?view=scheduled" });
              if (change === "unmount") h.setState(null);
              if (change === "removed client") h.setClients([slow]);
            }, 50);
            if (handshake === "delayed")
              setTimeout(() => ports[0].postMessage({ connected: false }), 200);
          },
        };
        h.setClients([h.client, slow]);
        const pending = operation === "push" ? h.push() : h.update();
        await vi.advanceTimersByTimeAsync(1500);
        await pending;
        expect(h.show).toHaveBeenCalledTimes(operation === "push" ? 2 : 1);
        expect(existing.close).not.toHaveBeenCalled();
        if (operation === "push") expect(h.notifications[1].close).not.toHaveBeenCalled();
      } finally {
        vi.useRealTimers();
      }
    },
  );
  it.each(
    ["delayed", "timeout"].flatMap((handshake) =>
      ["push", "update"].map((operation) => [handshake, operation]),
    ),
  )(
    "rejects an early second-round positive aged by another positive candidate %s (%s)",
    async (handshake, operation) => {
      vi.useFakeTimers();
      try {
        const h = harness();
        h.patch({ visible: false });
        await h.push();
        const existing = h.notifications[0];
        h.patch({ visible: true });
        let queries = 0;
        const slow = {
          id: "slow",
          visibilityState: "visible",
          url: origin + "/other-view",
          postMessage: (_message: any, ports: any[]) => {
            queries++;
            if (queries === 1) {
              ports[0].postMessage({
                type: "chathermes.session",
                url: route,
                profile: "alpha",
                session: "one",
                connected: true,
                visible: true,
              });
              return;
            }
            setTimeout(() => h.patch({ visible: false }), 50);
            if (handshake === "delayed")
              setTimeout(() => ports[0].postMessage({ connected: false }), 200);
          },
        };
        h.setClients([h.client, slow]);
        const pending = operation === "push" ? h.push() : h.update();
        await vi.advanceTimersByTimeAsync(2500);
        await pending;
        expect(h.show).toHaveBeenCalledTimes(operation === "push" ? 2 : 1);
        expect(existing.close).not.toHaveBeenCalled();
        if (operation === "push") expect(h.notifications[1].close).not.toHaveBeenCalled();
      } finally {
        vi.useRealTimers();
      }
    },
  );
  it.each(["push", "update"])(
    "rechecks visibility after getNotifications is pending during %s",
    async (operation) => {
      const h = harness();
      h.patch({ visible: false });
      await h.push();
      const existing = h.notifications[0];
      h.patch({ visible: true });
      let release!: () => void;
      let started!: () => void;
      const waiting = new Promise<void>((resolve) => {
        started = resolve;
      });
      h.getNotifications.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            release = () => resolve(h.notifications);
            started();
          }),
      );
      const pending = operation === "push" ? h.push() : h.update();
      await waiting;
      h.patch({ visible: false });
      release();
      await pending;
      expect(h.show).toHaveBeenCalledTimes(operation === "push" ? 2 : 1);
      expect(existing.close).not.toHaveBeenCalled();
    },
  );
  it("keeps the exact title and real Unicode completion body without splitting surrogate pairs", async () => {
    const h = harness();
    h.setClients([]);
    const body = "Actual assistant reply " + "😀".repeat(250);
    await h.push({ body });
    expect(h.show).toHaveBeenCalledWith("alpha", expect.objectContaining({ body }));
    await h.push({ body: "😀".repeat(3001) });
    expect(h.show.mock.calls[1]![1].body).toBe("😀".repeat(3000));
  });
  it.each(["Alpha_Name-2", "default", "a".repeat(64)])(
    "uses profile %s for titles and session routing for every notification kind",
    async (profile) => {
      const h = harness();
      h.setClients([]);
      for (const type of ["turn.complete", "approval", "clarify", "attention", "test"]) {
        const session = type === "test" ? "" : "stored_session";
        await h.push({ profile, type, session_id: session });
        const url = new URL("/chathermes", origin);
        url.searchParams.set("profile", profile);
        if (session) url.searchParams.set("session", session);
        expect(h.show).toHaveBeenLastCalledWith(
          profile,
          expect.objectContaining({
            tag: `chathermes:${profile}:${session}:${type}`,
            data: { url: url.href },
          }),
        );
      }
      expect(h.show).toHaveBeenCalledTimes(5);
    },
  );
  it.each(["", undefined, null, "../bad", "a".repeat(65)])(
    "uses a safe title fallback for profile %s without adding a route profile",
    async (profile) => {
      const h = harness();
      h.setClients([]);
      await h.push({ profile, title: "ChatHermes" });
      expect(h.show).toHaveBeenCalledWith(
        "ChatHermes",
        expect.objectContaining({
          data: { url: origin + "/chathermes?session=one" },
        }),
      );
    },
  );
  it("accepts queued legacy titles and displays their originating profile", async () => {
    const h = harness();
    h.setClients([]);
    await h.push({ title: "ChatHermes", profile: "beta" });
    expect(h.show).toHaveBeenCalledWith(
      "beta",
      expect.objectContaining({
        data: { url: origin + "/chathermes?profile=beta&session=one" },
      }),
    );
  });
  it.each([
    { title: "beta" },
    { title: "" },
    { title: undefined },
    { title: {} },
    { title: "x".repeat(5000) },
    { type: "unknown" },
    { session_id: "" },
    { session_id: "../bad" },
    { profile: "../bad", title: "../bad" },
  ])("rejects malformed or mismatched payload %j", async (extra) => {
    const h = harness();
    h.setClients([]);
    await h.push(extra);
    expect(h.show).not.toHaveBeenCalled();
  });
  it("always displays test notifications and preserves bounded chat body", async () => {
    const h = harness();
    await h.push({ type: "test", session_id: "", body: "x".repeat(200) });
    expect(h.show).toHaveBeenCalledOnce();
    expect(h.notifications[0].body).toHaveLength(200);
  });
});
