// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { flushPromises, mount } from "@vue/test-utils";
import { useWakeLock } from "./useWakeLock";

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

function lock() {
  const target = new EventTarget();
  const sentinel = {
    released: false,
    release: vi.fn(async () => {
      sentinel.released = true;
      target.dispatchEvent(new Event("release"));
    }),
    addEventListener: vi.fn((type: string, listener: EventListenerOrEventListenerObject) =>
      target.addEventListener(type, listener),
    ),
    removeEventListener: vi.fn((type: string, listener: EventListenerOrEventListenerObject) =>
      target.removeEventListener(type, listener),
    ),
    dispatchEvent: (event: Event) => target.dispatchEvent(event),
  };
  return sentinel;
}

describe("useWakeLock", () => {
  const wrappers: ReturnType<typeof mount>[] = [];
  let visibility: ReturnType<typeof vi.spyOn>;
  let request: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    localStorage.clear();
    visibility = vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
    request = vi.fn(async () => lock());
    vi.stubGlobal("navigator", { wakeLock: { request } });
  });
  afterEach(async () => {
    wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
    await flushPromises();
    localStorage.clear();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  function composable() {
    let wake!: ReturnType<typeof useWakeLock>;
    const wrapper = mount({
      setup() {
        wake = useWakeLock();
        return () => null;
      },
    });
    wrappers.push(wrapper);
    return { wake, wrapper };
  }

  async function changeVisibility(state: DocumentVisibilityState) {
    visibility.mockReturnValue(state);
    document.dispatchEvent(new Event("visibilitychange"));
    await flushPromises();
  }

  it("defaults off, persists the global preference, and releases on disable", async () => {
    const sentinel = lock();
    request.mockResolvedValue(sentinel);
    const { wake } = composable();
    expect(request).not.toHaveBeenCalled();
    wake.setEnabled(true);
    await flushPromises();
    expect(request).toHaveBeenCalledExactlyOnceWith("screen");
    expect(localStorage.getItem("chathermes.keep-screen-awake")).toBe("true");
    wake.setEnabled(false);
    await flushPromises();
    expect(sentinel.release).toHaveBeenCalledOnce();
    expect(sentinel.removeEventListener).toHaveBeenCalledWith("release", expect.any(Function));
    expect(localStorage.getItem("chathermes.keep-screen-awake")).toBe("false");
    await changeVisibility("visible");
    expect(request).toHaveBeenCalledTimes(1);
  });

  it("restores an enabled preference but waits until foregrounded", async () => {
    localStorage.setItem("chathermes.keep-screen-awake", "true");
    visibility.mockReturnValue("hidden");
    const { wake } = composable();
    expect(wake.enabled.value).toBe(true);
    expect(request).not.toHaveBeenCalled();
    await changeVisibility("visible");
    expect(request).toHaveBeenCalledExactlyOnceWith("screen");
  });

  it("deduplicates pending and held requests across enable/visibility events", async () => {
    const result = deferred<ReturnType<typeof lock>>();
    request.mockReturnValue(result.promise);
    const { wake } = composable();
    wake.setEnabled(true);
    wake.setEnabled(true);
    await changeVisibility("visible");
    expect(request).toHaveBeenCalledTimes(1);
    result.resolve(lock());
    await flushPromises();
    wake.setEnabled(true);
    await changeVisibility("visible");
    expect(request).toHaveBeenCalledTimes(1);
  });

  it("reacquires after browser release and foregrounding, without background retries", async () => {
    const first = lock(),
      second = lock(),
      third = lock();
    request.mockResolvedValueOnce(first).mockResolvedValueOnce(second).mockResolvedValueOnce(third);
    const { wake } = composable();
    wake.setEnabled(true);
    await flushPromises();
    await first.release();
    await flushPromises();
    expect(request).toHaveBeenCalledTimes(2);
    expect(first.removeEventListener).toHaveBeenCalledWith("release", expect.any(Function));
    await changeVisibility("hidden");
    expect(second.release).toHaveBeenCalledOnce();
    second.dispatchEvent(new Event("release"));
    await flushPromises();
    expect(request).toHaveBeenCalledTimes(2);
    await changeVisibility("visible");
    expect(request).toHaveBeenCalledTimes(3);
  });

  it.each(["disable", "hidden", "unmount", "pagehide"])(
    "releases a late request after %s",
    async (action) => {
      const result = deferred<ReturnType<typeof lock>>();
      request.mockReturnValue(result.promise);
      const { wake, wrapper } = composable();
      wake.setEnabled(true);
      if (action === "disable") wake.setEnabled(false);
      if (action === "hidden") await changeVisibility("hidden");
      if (action === "unmount") wrapper.unmount();
      if (action === "pagehide") window.dispatchEvent(new Event("pagehide"));
      const late = lock();
      result.resolve(late);
      await flushPromises();
      expect(late.release).toHaveBeenCalledOnce();
      expect(late.addEventListener).not.toHaveBeenCalled();
      expect(request).toHaveBeenCalledTimes(1);
    },
  );

  it("does not let a stale result replace or clear a newer pending request", async () => {
    const old = deferred<ReturnType<typeof lock>>(),
      current = deferred<ReturnType<typeof lock>>();
    request.mockReturnValueOnce(old.promise).mockReturnValueOnce(current.promise);
    const { wake } = composable();
    wake.setEnabled(true);
    wake.setEnabled(false);
    wake.setEnabled(true);
    const stale = lock();
    old.resolve(stale);
    await flushPromises();
    expect(stale.release).toHaveBeenCalledOnce();
    await changeVisibility("visible");
    expect(request).toHaveBeenCalledTimes(2);
    const held = lock();
    current.resolve(held);
    await flushPromises();
    stale.dispatchEvent(new Event("release"));
    await changeVisibility("visible");
    expect(request).toHaveBeenCalledTimes(2);
    wake.setEnabled(false);
    await flushPromises();
    expect(held.release).toHaveBeenCalledOnce();
  });

  it("ignores a stale rejection while a newer request is pending", async () => {
    const old = deferred<ReturnType<typeof lock>>(),
      current = deferred<ReturnType<typeof lock>>();
    request.mockReturnValueOnce(old.promise).mockReturnValueOnce(current.promise);
    const { wake } = composable();
    wake.setEnabled(true);
    await changeVisibility("hidden");
    await changeVisibility("visible");
    old.reject(new Error("stale denial"));
    await flushPromises();
    expect(wake.available.value).toBe(true);
    await changeVisibility("visible");
    expect(request).toHaveBeenCalledTimes(2);
    const held = lock();
    current.resolve(held);
    await flushPromises();
    wake.setEnabled(false);
    await flushPromises();
    expect(held.release).toHaveBeenCalledOnce();
  });

  it("does not reacquire on a late release event after disabling the setting", async () => {
    const previous = lock();
    request.mockResolvedValueOnce(previous);
    const { wake } = composable();
    wake.setEnabled(true);
    await flushPromises();
    wake.setEnabled(false);
    previous.dispatchEvent(new Event("release"));
    await flushPromises();
    expect(request).toHaveBeenCalledOnce();
  });

  it("cleans up listeners and the held lock on unmount", async () => {
    const removeDocument = vi.spyOn(document, "removeEventListener");
    const removeWindow = vi.spyOn(window, "removeEventListener");
    const sentinel = lock();
    request.mockResolvedValue(sentinel);
    const { wake, wrapper } = composable();
    wake.setEnabled(true);
    await flushPromises();
    wrapper.unmount();
    await flushPromises();
    expect(sentinel.release).toHaveBeenCalledOnce();
    expect(removeDocument).toHaveBeenCalledWith("visibilitychange", expect.any(Function));
    expect(removeWindow).toHaveBeenCalledWith("pagehide", expect.any(Function));
    expect(removeWindow).toHaveBeenCalledWith("pageshow", expect.any(Function));
    await changeVisibility("visible");
    window.dispatchEvent(new Event("pageshow"));
    sentinel.dispatchEvent(new Event("release"));
    wake.setEnabled(true);
    await flushPromises();
    expect(request).toHaveBeenCalledTimes(1);
  });

  it("releases on pagehide and reacquires on pageshow for back/forward cache restores", async () => {
    const sentinel = lock();
    request.mockResolvedValueOnce(sentinel);
    const { wake } = composable();
    wake.setEnabled(true);
    await flushPromises();
    window.dispatchEvent(new Event("pagehide"));
    await changeVisibility("visible");
    expect(sentinel.release).toHaveBeenCalledOnce();
    expect(request).toHaveBeenCalledTimes(1);
    window.dispatchEvent(new Event("pageshow"));
    await flushPromises();
    expect(request).toHaveBeenCalledTimes(2);
  });

  it("handles unavailable API without errors or requests", async () => {
    vi.stubGlobal("navigator", {});
    const { wake } = composable();
    expect(wake.available.value).toBe(false);
    wake.setEnabled(true);
    await changeVisibility("visible");
    expect(request).not.toHaveBeenCalled();
  });

  it("preserves API support after denial and retries on the next foreground transition", async () => {
    request.mockRejectedValueOnce(new Error("denied"));
    const { wake } = composable();
    wake.setEnabled(true);
    await flushPromises();
    expect(wake.available.value).toBe(true);
    expect(wake.enabled.value).toBe(true);
    expect(request).toHaveBeenCalledTimes(1);
    await changeVisibility("hidden");
    await changeVisibility("visible");
    expect(request).toHaveBeenCalledTimes(2);
  });

  it("does not loop on a lock already released before acquisition resolves", async () => {
    const sentinel = lock();
    sentinel.released = true;
    request.mockResolvedValue(sentinel);
    const { wake } = composable();
    wake.setEnabled(true);
    await flushPromises();
    expect(request).toHaveBeenCalledTimes(1);
    expect(sentinel.addEventListener).not.toHaveBeenCalled();
  });

  it("handles synchronous request errors, release rejection, and blocked storage", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error();
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error();
    });
    request.mockImplementationOnce(() => {
      throw new Error();
    });
    const { wake } = composable();
    wake.setEnabled(true);
    await flushPromises();
    const sentinel = lock();
    sentinel.release.mockRejectedValue(new Error());
    request.mockResolvedValueOnce(sentinel);
    wake.setEnabled(true);
    await flushPromises();
    wake.setEnabled(false);
    await flushPromises();
    expect(sentinel.release).toHaveBeenCalledOnce();
  });
});
