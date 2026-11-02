// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vite-plus/test";
import { createNotificationNavigation } from "./notification-navigation";

afterEach(() => vi.restoreAllMocks());

it.each(["/sessions", "/settings"])(
  "hands off %s to the mounted Vue router without acknowledging early",
  async (host) => {
    history.replaceState(
      { idx: 4, key: "host", usr: { retained: true } },
      "",
      host + "?profile=alpha",
    );
    const bridge = createNotificationNavigation();
    const pop = vi.fn();
    window.addEventListener("popstate", pop);
    const url = location.origin + "/chathermes?profile=stale#/chat/saved?profile=beta";
    const postMessage = vi.fn(),
      close = vi.fn();
    const event = {
      data: { type: "chathermes.navigate", url },
      ports: [{ postMessage, close }],
    } as unknown as MessageEvent;
    bridge.receive(event);
    expect(location.pathname).toBe("/chathermes");
    expect(location.search).toBe("?profile=beta");
    expect(history.state).toMatchObject({ idx: 5, usr: { retained: true } });
    expect(pop).toHaveBeenCalledOnce();
    expect(postMessage).not.toHaveBeenCalled();
    expect(bridge.pendingUrl()).toBe(url);
    const navigate = vi.fn();
    const stop = bridge.connect(navigate);
    expect(navigate).toHaveBeenCalledExactlyOnceWith(event);
    expect(postMessage).not.toHaveBeenCalled();
    bridge.receive(event);
    expect(navigate).toHaveBeenCalledTimes(2);
    expect(pop).toHaveBeenCalledOnce();
    stop();
    window.removeEventListener("popstate", pop);
  },
);

it("does not let an old mount detach a newer router", () => {
  history.replaceState({}, "", "/chathermes#/settings");
  const bridge = createNotificationNavigation();
  const old = bridge.connect(vi.fn());
  const navigate = vi.fn();
  const stop = bridge.connect(navigate);
  old();
  const event = new MessageEvent("message", {
    data: { type: "chathermes.navigate", url: location.origin + "/chathermes#/settings" },
  });
  bridge.receive(event);
  expect(navigate).toHaveBeenCalledExactlyOnceWith(event);
  stop();
});

it.each(["https://other.test/chathermes#/chat/s1", "/sessions#/chat/s1", "/chathermes?session=s1"])(
  "ignores invalid handoff %s",
  (url) => {
    history.replaceState({}, "", "/sessions");
    const bridge = createNotificationNavigation();
    bridge.receive(new MessageEvent("message", { data: { type: "chathermes.navigate", url } }));
    expect(location.pathname).toBe("/sessions");
    expect(bridge.pendingUrl()).toBeUndefined();
  },
);

it("expires a handoff after the worker fallback deadline", () => {
  vi.useFakeTimers();
  try {
    history.replaceState({}, "", "/chathermes#/settings");
    const bridge = createNotificationNavigation();
    const close = vi.fn();
    bridge.receive({
      data: { type: "chathermes.navigate", url: "/chathermes#/chat/saved" },
      ports: [{ close }],
    } as unknown as MessageEvent);
    vi.advanceTimersByTime(10000);
    const navigate = vi.fn();
    const stop = bridge.connect(navigate);
    expect(navigate).not.toHaveBeenCalled();
    expect(close).toHaveBeenCalledOnce();
    expect(bridge.pendingUrl()).toBeUndefined();
    stop();
  } finally {
    vi.useRealTimers();
  }
});

it.each(["/chat/s1?profile=alpha&profile=beta", "/chat/s1?profile=%2Fbad"])(
  "keeps invalid profile handoffs out of the host router: %s",
  (path) => {
    history.replaceState({}, "", "/sessions?profile=alpha");
    const bridge = createNotificationNavigation();
    bridge.receive(
      new MessageEvent("message", {
        data: { type: "chathermes.navigate", url: "/chathermes#" + path },
      }),
    );
    expect(location.pathname).toBe("/sessions");
    expect(bridge.pendingUrl()).toBeUndefined();
  },
);

it("delivers only the latest queued click when mounting is delayed", () => {
  history.replaceState({}, "", "/sessions");
  const bridge = createNotificationNavigation();
  const close = vi.fn(),
    postMessage = vi.fn();
  bridge.receive({
    data: { type: "chathermes.navigate", url: "/chathermes#/chat/first?profile=alpha" },
    ports: [{ close, postMessage }],
  } as unknown as MessageEvent);
  const latest = new MessageEvent("message", {
    data: {
      type: "chathermes.navigate",
      url: "/chathermes#/scheduled/audit/output%3A2026-01-01_00-00-00?profile=beta",
    },
  });
  bridge.receive(latest);
  expect(close).toHaveBeenCalledOnce();
  expect(postMessage).not.toHaveBeenCalled();
  expect(bridge.pendingUrl()).toBe(latest.data.url);
  const navigate = vi.fn();
  const stop = bridge.connect(navigate);
  expect(navigate).toHaveBeenCalledExactlyOnceWith(latest);
  stop();
});

it("queues a host click while the previous Vue mount is still tearing down", () => {
  history.replaceState({}, "", "/chathermes#/settings");
  const bridge = createNotificationNavigation();
  const obsolete = vi.fn();
  const disconnect = bridge.connect(obsolete);
  history.replaceState({}, "", "/sessions");
  const event = new MessageEvent("message", {
    data: { type: "chathermes.navigate", url: "/chathermes#/chat/s1?profile=beta" },
  });
  bridge.receive(event);
  expect(obsolete).not.toHaveBeenCalled();
  const navigate = vi.fn();
  const stop = bridge.connect(navigate);
  disconnect();
  expect(navigate).toHaveBeenCalledExactlyOnceWith(event);
  stop();
});
