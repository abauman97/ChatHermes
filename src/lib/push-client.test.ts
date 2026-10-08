// @vitest-environment jsdom
import { describe, expect, it, vi, afterEach, beforeEach } from "vite-plus/test";
import { sessionMessage, connectPushClient } from "./push-client";

describe("mounted plugin session handshake", () => {
  beforeEach(() => vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible"));
  afterEach(() => vi.restoreAllMocks());
  it("carries actual connection and view state with current visibility", () => {
    expect(
      sessionMessage(
        { profile: "", session: "one", connected: true, chat: true },
        "https://chat.test/chathermes?session=one",
      ),
    ).toMatchObject({ profile: "default", session: "one", connected: true, visible: true });
    expect(
      sessionMessage(
        { profile: "alpha", session: "one", connected: false, chat: true },
        "https://chat.test/chathermes",
      ),
    ).toMatchObject({ connected: false });
    expect(
      sessionMessage(
        { profile: "alpha", session: "one", connected: true, chat: false },
        "https://chat.test/chathermes",
      ),
    ).toMatchObject({ session: "", connected: false });
  });
  it.each(["hidden", "unknown", undefined])(
    "reports visibility %s without claiming an active view",
    (visibility) => {
      vi.spyOn(document, "visibilityState", "get").mockReturnValue(
        visibility as DocumentVisibilityState,
      );
      expect(
        sessionMessage(
          { profile: "alpha", session: "one", connected: true, chat: true },
          "https://chat.test/chathermes?profile=alpha&session=one",
        ),
      ).toMatchObject({ visible: false, connected: true });
    },
  );
  it("publishes visibility changes and reads visibility freshly for queries", () => {
    const listeners: Record<string, any> = {},
      postMessage = vi.fn();
    const sw = {
      controller: { postMessage },
      ready: new Promise(() => {}),
      addEventListener: (type: string, fn: any) => {
        listeners[type] = fn;
      },
      removeEventListener: vi.fn(),
    } as unknown as ServiceWorkerContainer;
    const client = connectPushClient(
      sw,
      () => ({ profile: "alpha", session: "one", connected: true, chat: true }),
      () => "https://chat.test/chathermes?profile=alpha&session=one",
    );
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
    document.dispatchEvent(new Event("visibilitychange"));
    expect(postMessage).toHaveBeenLastCalledWith(expect.objectContaining({ visible: false }));
    const reply = vi.fn();
    listeners.message({
      data: { type: "chathermes.session.query" },
      ports: [{ postMessage: reply }],
    });
    expect(reply).toHaveBeenCalledWith(expect.objectContaining({ visible: false }));
    client.stop();
    postMessage.mockClear();
    document.dispatchEvent(new Event("visibilitychange"));
    expect(postMessage).not.toHaveBeenCalled();
  });
  it("responds freshly, publishes on readiness/controller change, and stops on unmount", async () => {
    const listeners: Record<string, any> = {};
    const postMessage = vi.fn();
    let resolveReady!: (value: any) => void;
    const removeEventListener = vi.fn();
    const sw = {
      controller: null,
      ready: new Promise<any>((resolve) => {
        resolveReady = resolve;
      }),
      addEventListener: (type: string, fn: any) => {
        listeners[type] = fn;
      },
      removeEventListener,
    } as unknown as ServiceWorkerContainer;
    let connected = false;
    const client = connectPushClient(
      sw,
      () => ({ profile: "alpha", session: "one", connected, chat: true }),
      () => "https://chat.test/chathermes?profile=alpha&session=one",
    );
    connected = true;
    resolveReady({ active: { postMessage } });
    await Promise.resolve();
    expect(postMessage).toHaveBeenLastCalledWith(expect.objectContaining({ connected: true }));
    const reply = vi.fn();
    connected = false;
    listeners.message({
      data: { type: "chathermes.session.query" },
      ports: [{ postMessage: reply }],
    });
    expect(reply).toHaveBeenCalledWith(
      expect.objectContaining({ connected: false, session: "one" }),
    );
    listeners.controllerchange();
    expect(postMessage).toHaveBeenLastCalledWith(expect.objectContaining({ connected: false }));
    client.stop();
    client.publish();
    expect(postMessage).toHaveBeenLastCalledWith(
      expect.objectContaining({ session: "", connected: false }),
    );
    expect(removeEventListener).toHaveBeenCalledTimes(2);
  });
  it("does not publish a connected session if readiness arrives after unmount", async () => {
    const postMessage = vi.fn(),
      listeners: Record<string, any> = {};
    let resolveReady!: (value: any) => void;
    const sw = {
      ready: new Promise<any>((resolve) => {
        resolveReady = resolve;
      }),
      addEventListener: (type: string, fn: any) => {
        listeners[type] = fn;
      },
      removeEventListener: vi.fn(),
    } as unknown as ServiceWorkerContainer;
    const client = connectPushClient(
      sw,
      () => ({ profile: "alpha", session: "one", connected: true, chat: true }),
      () => "https://chat.test/chathermes?profile=alpha&session=one",
    );
    client.stop();
    resolveReady({ active: { postMessage } });
    await Promise.resolve();
    const reply = vi.fn();
    listeners.message({
      data: { type: "chathermes.session.query" },
      ports: [{ postMessage: reply }],
    });
    expect(postMessage).not.toHaveBeenCalled();
    expect(reply).not.toHaveBeenCalled();
  });
});
