/// <reference types="node" />
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vite-plus/test";

const worker = readFileSync("public/push-service-worker.js", "utf8");
const origin = "https://chat.test";
const route = origin + "/chathermes?profile=alpha#/chat/one?profile=alpha";
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
    navigate: vi.fn(async (url: string) => {
      client.url = url;
    }),
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
  const openWindow = vi.fn();
  runInNewContext(worker, {
    URL,
    MessageChannel: Channel,
    URLSearchParams,
    setTimeout,
    clearTimeout,
    self: {
      location: { origin },
      addEventListener: (type: string, fn: any) => {
        handlers[type] = fn;
      },
      clients: { matchAll, openWindow },
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
    openWindow,
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
  it("rejects query-only URLs for viewer attestation and notification navigation", async () => {
    const h = harness();
    h.patch({ url: origin + "/chathermes?profile=alpha&session=one" });
    await h.push();
    expect(h.show).toHaveBeenCalledOnce();
    await h.dispatch("notificationclick", {
      notification: { data: { url: origin + "/chathermes?profile=alpha&session=one" } },
    });
    expect(h.client.focus).not.toHaveBeenCalled();
    expect(h.client.navigate).not.toHaveBeenCalled();
    expect(h.openWindow).not.toHaveBeenCalled();
  });
  it("attests canonical chat hashes despite stale outer routing query", async () => {
    const h = harness();
    h.patch({
      url: origin + "/chathermes?profile=beta&session=stale&view=settings#/chat/one?profile=alpha",
    });
    await h.push();
    expect(h.show).not.toHaveBeenCalled();
  });
  it("does not match query-only notifications to a canonical viewer", async () => {
    const h = harness();
    const close = vi.fn();
    h.notifications.push({
      tag: "chathermes:alpha:one:turn.complete",
      data: { url: origin + "/chathermes?profile=alpha&session=one" },
      close,
    });
    h.patch({ connected: false });
    await h.update();
    expect(close).not.toHaveBeenCalled();
    h.patch({ connected: true });
    await h.update();
    expect(close).not.toHaveBeenCalled();
  });
  it.each(["turn.complete", "approval", "clarify", "attention", "test"])(
    "opens a current %s notification in an existing plugin window",
    async (type) => {
      const h = harness();
      h.client.url = origin + "/chathermes?profile=beta#/settings?profile=beta";
      h.patch({ url: h.client.url, session: "", connected: false });
      const session = type === "test" ? "" : "one";
      await h.push({ type, session_id: session });
      await h.dispatch("notificationclick", { notification: h.notifications[0] });
      expect(h.client.navigate).toHaveBeenCalledExactlyOnceWith(
        origin + "/chathermes?profile=alpha#" + (session ? "/chat/one" : "/") + "?profile=alpha",
      );
      expect(h.openWindow).not.toHaveBeenCalled();
    },
  );
  it.each([
    "",
    "?profile=alpha",
    "?session=one",
    "?profile=alpha&session=one",
    "?view=scheduled&job=audit&scheduled_run=cron_audit_20261019_102136",
    "?profile=alpha&profile=beta&session=one",
    "?profile=../bad&session=one",
    "?session=one&session=two",
    "?session=",
    "?session=%2Fone",
    "?view=scheduled&session=one",
  ])("rejects query-only notification links %s", async (query) => {
    const h = harness();
    await h.dispatch("notificationclick", {
      notification: { data: { url: origin + "/chathermes" + query } },
    });
    expect(h.client.focus).not.toHaveBeenCalled();
    expect(h.client.navigate).not.toHaveBeenCalled();
    expect(h.openWindow).not.toHaveBeenCalled();
  });
  it.each([
    "/settings?session=one",
    "/projects?session=one",
    "/chat/two?profile=alpha",
    "/chat/one?profile=alpha&profile=beta",
    "/chat/%2Fone?profile=alpha",
  ])("does not suppress for a mismatched canonical route %s", async (path) => {
    const h = harness();
    h.patch({ url: origin + "/chathermes#" + path });
    await h.push();
    expect(h.show).toHaveBeenCalledOnce();
  });
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
    { profile: "beta" },
    { session: "two" },
    { session: "" },
    { type: "wrong" },
    { url: origin + "/chathermes" },
    { url: origin + "/chathermes#/projects?profile=alpha&session=one" },
    { url: origin + "/chathermes#/scheduled?profile=alpha&session=one" },
    { url: route.replace("/chat/one", "/chat/two") },
    { url: route + "&profile=beta" },
    { url: "https://other.test/chathermes" },
    { visible: false },
    { visible: undefined },
    { visible: "true" },
  ])("shows for mismatched or hidden state %j", async (patch) => {
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
    expect(h.client.navigate).toHaveBeenCalledWith(route);
  });
  it("accepts default profile and ignores stale WindowClient URL and focus", async () => {
    const h = harness();
    h.patch({ profile: "default", url: origin + "/chathermes?profile=default#/chat/one" });
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
  it("closes only exact session notifications after navigating from Inbox to chat", async () => {
    const h = harness();
    h.patch({ connected: false, session: "", url: origin + "/chathermes#/inbox" });
    await h.push();
    await h.push({ profile: "beta" });
    await h.push({ session_id: "two" });
    await h.update();
    expect(h.notifications.every((n) => n.close.mock.calls.length === 0)).toBe(true);
    h.patch({ connected: true, session: "one", url: route });
    await h.update();
    expect(h.notifications.map((n) => n.close.mock.calls.length)).toEqual([1, 0, 0]);
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
              if (change === "navigation")
                h.patch({ url: origin + "/chathermes?profile=default#/scheduled" });
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
        url.hash = (session ? "/chat/" + session : "/") + "?profile=" + profile;
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
          data: { url: origin + "/chathermes?profile=default#/chat/one" },
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
        data: { url: origin + "/chathermes?profile=beta#/chat/one?profile=beta" },
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

describe("scheduled results", () => {
  const result = {
    title: "Security Audit",
    type: "scheduled",
    session_id: "",
    job_id: "audit",
    run_id: "output:2026-01-01_00-00-00",
    tag: "chathermes:alpha:audit:scheduled",
  };
  it.each([
    "output:2026-01-01_00-00-00",
    "cron_audit_20261019_102136",
    "execution:" + "a".repeat(32),
  ])("displays, opens, and closes the exact native run %s", async (run) => {
    const h = harness();
    h.patch({ visible: false });
    await h.push({ ...result, run_id: run });
    expect(h.show).toHaveBeenCalledOnce();
    const url =
      origin +
      "/chathermes?profile=alpha#/scheduled/audit/" +
      encodeURIComponent(run) +
      "?profile=alpha";
    expect(h.notifications[0].data.url).toBe(url);
    await h.dispatch("notificationclick", { notification: h.notifications[0] });
    expect(h.openWindow).toHaveBeenCalledExactlyOnceWith(url);
    h.patch({
      url,
      session: "",
      connected: false,
      scheduled: true,
      job: "audit",
      run,
      visible: true,
    });
    await h.update();
    expect(h.notifications[0].close).toHaveBeenCalledOnce();
    await h.push({ ...result, run_id: run });
    expect(h.show).toHaveBeenCalledOnce();
    await h.push({
      ...result,
      run_id: run
        .replace("00-00-00", "00-00-01")
        .replace("102136", "102137")
        .replace("aaaa", "bbbb"),
    });
    expect(h.show).toHaveBeenCalledTimes(2);
  });
  it.each([
    "cron_other_20261019_102136",
    "cron_audit_20261019_102136_child",
    "cron_audit_20261019_10213",
    "../secret",
  ])("rejects a transcript outside the exact job run: %s", async (run_id) => {
    const h = harness();
    await h.push({ ...result, run_id });
    expect(h.show).not.toHaveBeenCalled();
  });
  it("opens the existing scheduled result and replaces duplicate tags without renotify", async () => {
    const h = harness();
    h.setClients([]);
    await h.push(result);
    const options = h.show.mock.calls[0]![1];
    expect(options.data.url).toBe(
      origin +
        "/chathermes?profile=alpha#/scheduled/audit/output%3A2026-01-01_00-00-00?profile=alpha",
    );
    expect(options.tag).toBe(result.tag);
    expect(options.renotify).toBe(false);
    expect(h.show.mock.calls[0]![0]).toBe("Security Audit");
    await h.dispatch("notificationclick", { notification: h.notifications[0] });
    expect(h.openWindow).toHaveBeenCalledExactlyOnceWith(options.data.url);
    await h.push(result);
    expect(h.show.mock.calls[1]![1].tag).toBe(options.tag);
  });
  it("focuses an existing client and sends the exact canonical result URL", async () => {
    const h = harness();
    h.client.url = origin + "/chathermes?profile=beta#/settings?profile=beta";
    h.client.navigate = vi.fn(async (url: string) => {
      h.client.url = url;
    });
    await h.push(result);
    await h.dispatch("notificationclick", { notification: h.notifications[0] });
    expect(h.client.focus).toHaveBeenCalledOnce();
    expect(h.client.navigate).toHaveBeenCalledWith(h.notifications[0].data.url);
    expect(h.client.url).toBe(h.notifications[0].data.url);
    expect(h.openWindow).not.toHaveBeenCalled();
  });
  it.each([false, true])(
    "still routes an existing client when focus is denied (navigate rejects: %s)",
    async (navigationDenied) => {
      const h = harness();
      h.client.url = origin + "/chathermes#/settings?profile=alpha";
      h.client.focus.mockRejectedValue(new DOMException("Focus denied", "InvalidAccessError"));
      if (navigationDenied) h.client.navigate.mockRejectedValue(new Error("Navigation denied"));
      await h.push(result);
      await h.dispatch("notificationclick", { notification: h.notifications[0] });
      expect(h.client.navigate).toHaveBeenCalledExactlyOnceWith(h.notifications[0].data.url);
      if (navigationDenied)
        expect(h.client.postMessage).toHaveBeenCalledWith({
          type: "chathermes.navigate",
          url: h.notifications[0].data.url,
        });
      else expect(h.client.url).toBe(h.notifications[0].data.url);
      expect(h.openWindow).not.toHaveBeenCalled();
    },
  );
  it("does not open a second window when an existing client cannot navigate", async () => {
    const h = harness();
    h.client.navigate = vi.fn(async () => {
      throw new Error("navigation rejected");
    });
    h.client.url = origin + "/chathermes#/settings?profile=alpha";
    await h.push(result);
    await h.dispatch("notificationclick", { notification: h.notifications[0] });
    expect(h.client.focus).toHaveBeenCalledOnce();
    expect(h.client.postMessage).toHaveBeenCalledWith({
      type: "chathermes.navigate",
      url: h.notifications[0].data.url,
    });
    expect(h.openWindow).not.toHaveBeenCalled();
  });
  it("does not open a second window when navigate is unavailable", async () => {
    const h = harness();
    delete (h.client as any).navigate;
    h.client.url = origin + "/chathermes#/settings?profile=alpha";
    await h.push(result);
    await h.dispatch("notificationclick", { notification: h.notifications[0] });
    expect(h.client.focus).toHaveBeenCalledOnce();
    expect(h.openWindow).not.toHaveBeenCalled();
  });
  it.each([
    "https://other.test/chathermes#/scheduled/audit/output%3A2026-01-01_00-00-00?profile=alpha",
    origin + "/chathermes#/scheduled/audit/output%3A2026-01-01_00-00-00?profile=alpha&profile=beta",
    origin + "/chathermes#/scheduled/%2E%2E/bad?profile=alpha",
    "http://[invalid",
  ])("ignores invalid scheduled click URLs %s", async (url) => {
    const h = harness();
    await h.dispatch("notificationclick", { notification: { data: { url } } });
    expect(h.client.focus).not.toHaveBeenCalled();
    expect(h.openWindow).not.toHaveBeenCalled();
  });
  it("suppresses only the exact visible scheduled result, without a chat connection", async () => {
    const h = harness();
    h.patch({
      url: origin + "/chathermes#/scheduled/audit/output%3A2026-01-01_00-00-00?profile=alpha",
      session: "",
      connected: false,
      scheduled: true,
      job: "audit",
      run: result.run_id,
    });
    await h.push(result);
    expect(h.show).not.toHaveBeenCalled();
    await h.push({ ...result, run_id: "output:2026-01-02_00-00-00" });
    expect(h.show).toHaveBeenCalledOnce();
  });
  it.each([{ job_id: "../audit" }, { run_id: "output:../secret" }, { profile: "beta" }])(
    "does not confuse invalid or other-profile destinations %j",
    async (change) => {
      const h = harness();
      await h.push({ ...result, ...change });
      expect(h.show).toHaveBeenCalledTimes(change.profile ? 1 : 0);
    },
  );
});
