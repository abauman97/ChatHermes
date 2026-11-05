import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { watchWorkerUpdates } from "./workerUpdates";

class Worker extends EventTarget {
  state: ServiceWorkerState = "installed";
  postMessage = vi.fn();
  change(state: ServiceWorkerState) {
    this.state = state;
    this.dispatchEvent(new Event("statechange"));
  }
}
function harness(waiting = true, controlled = true) {
  const old = new Worker();
  old.state = "activated";
  const next = new Worker();
  const registration = Object.assign(new EventTarget(), {
    active: controlled ? old : null,
    waiting: waiting ? next : null,
    installing: null as Worker | null,
  });
  const container = Object.assign(new EventTarget(), { controller: controlled ? old : null });
  const changed = vi.fn();
  const reload = vi.fn();
  const watcher = watchWorkerUpdates(
    registration as unknown as ServiceWorkerRegistration,
    container as unknown as ServiceWorkerContainer,
    changed,
    reload,
  );
  return {
    old,
    next,
    registration,
    container,
    changed,
    reload,
    ...watcher,
    activate() {
      registration.waiting = null;
      registration.active = next;
      next.change("activated");
      container.controller = next;
      container.dispatchEvent(new Event("controllerchange"));
    },
  };
}
afterEach(() => vi.useRealTimers());
describe("tab-local worker update consent", () => {
  it("detects an already waiting worker without activating or reloading", () => {
    const h = harness();
    expect(h.changed).toHaveBeenLastCalledWith({ available: true, busy: false, error: "" }, true);
    expect(h.next.postMessage).not.toHaveBeenCalled();
    expect(h.reload).not.toHaveBeenCalled();
    h.dispose();
  });
  it("detects installing workers at mount and later updatefound events, excluding first install", () => {
    for (const existing of [false, true]) {
      const h = harness(false);
      h.next.state = "installing";
      h.registration.installing = h.next;
      if (existing) {
        h.dispose();
        // A new observer must inspect the installation already in progress.
        const watch = watchWorkerUpdates(
          h.registration as unknown as ServiceWorkerRegistration,
          h.container as unknown as ServiceWorkerContainer,
          h.changed,
          h.reload,
        );
        h.registration.waiting = h.next;
        h.next.change("installed");
        expect(h.changed).toHaveBeenLastCalledWith(
          expect.objectContaining({ available: true }),
          true,
        );
        watch.dispose();
      } else {
        h.registration.dispatchEvent(new Event("updatefound"));
        h.registration.waiting = h.next;
        h.next.change("installed");
        expect(h.changed).toHaveBeenLastCalledWith(
          expect.objectContaining({ available: true }),
          true,
        );
        h.dispose();
      }
    }
    const first = harness(false, false);
    first.registration.active = first.next;
    first.next.change("activated");
    first.container.dispatchEvent(new Event("controllerchange"));
    expect(first.reload).not.toHaveBeenCalled();
    expect(first.changed).toHaveBeenLastCalledWith(
      { available: false, busy: false, error: "" },
      false,
    );
    first.dispose();
  });
  it("reloads exactly once after the approved worker controls this tab", () => {
    const h = harness();
    h.update();
    h.update();
    expect(h.next.postMessage).toHaveBeenCalledExactlyOnceWith({
      type: "chathermes.update.activate",
    });
    expect(h.reload).not.toHaveBeenCalled();
    h.activate();
    h.container.dispatchEvent(new Event("controllerchange"));
    expect(h.reload).toHaveBeenCalledTimes(1);
    h.dispose();
  });
  it("another tab can activate without reloading here; a later click still updates", () => {
    const h = harness();
    h.activate();
    expect(h.reload).not.toHaveBeenCalled();
    expect(h.changed).toHaveBeenLastCalledWith(expect.objectContaining({ available: true }), false);
    h.update();
    expect(h.reload).toHaveBeenCalledTimes(1);
    expect(h.next.postMessage).not.toHaveBeenCalled();
    h.dispose();
  });
  it("does not mistake an unrelated controller for the approved worker", () => {
    const h = harness();
    h.update();
    h.container.controller = new Worker();
    h.container.dispatchEvent(new Event("controllerchange"));
    expect(h.reload).not.toHaveBeenCalled();
    h.dispose();
  });
  it("times out safely and never reloads on late activation without renewed consent", () => {
    vi.useFakeTimers();
    const h = harness();
    h.update();
    vi.advanceTimersByTime(20000);
    expect(h.changed).toHaveBeenLastCalledWith(
      expect.objectContaining({ busy: false, error: expect.stringContaining("try Update again") }),
      false,
    );
    h.activate();
    expect(h.reload).not.toHaveBeenCalled();
    h.update();
    expect(h.reload).toHaveBeenCalledTimes(1);
    h.dispose();
  });
  it("handles activation failures and cleans up listeners on unmount", () => {
    const h = harness();
    h.next.postMessage.mockImplementationOnce(() => {
      throw new Error("gone");
    });
    h.update();
    expect(h.changed).toHaveBeenLastCalledWith(
      expect.objectContaining({ busy: false, error: expect.stringContaining("try again") }),
      false,
    );
    h.update();
    h.dispose();
    h.activate();
    expect(h.reload).not.toHaveBeenCalled();
  });

  it("requires renewed consent when the approved update is replaced", () => {
    const h = harness();
    h.update();
    const replacement = new Worker();
    h.registration.waiting = replacement;
    h.next.change("redundant");
    expect(h.reload).not.toHaveBeenCalled();
    expect(replacement.postMessage).not.toHaveBeenCalled();
    expect(h.changed).toHaveBeenLastCalledWith(
      expect.objectContaining({
        available: true,
        busy: false,
        error: expect.stringContaining("replaced"),
      }),
      true,
    );
    h.update();
    expect(replacement.postMessage).toHaveBeenCalledExactlyOnceWith({
      type: "chathermes.update.activate",
    });
    h.dispose();
  });

  it("detects activation that raced registration before the observer mounted", () => {
    const h = harness();
    h.dispose();
    h.activate();
    const watcher = watchWorkerUpdates(
      h.registration as unknown as ServiceWorkerRegistration,
      h.container as unknown as ServiceWorkerContainer,
      h.changed,
      h.reload,
      h.old as unknown as ServiceWorker,
    );
    expect(h.changed).toHaveBeenLastCalledWith({ available: true, busy: false, error: "" }, true);
    expect(h.reload).not.toHaveBeenCalled();
    watcher.update();
    expect(h.reload).toHaveBeenCalledTimes(1);
    watcher.dispose();
  });
});
