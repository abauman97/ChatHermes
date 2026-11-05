export interface WorkerUpdateState {
  available: boolean;
  busy: boolean;
  error: string;
}

// Each mounted tab owns its consent. A controller change in a different tab
// must never turn into a reload here.
export function watchWorkerUpdates(
  registration: ServiceWorkerRegistration,
  container: ServiceWorkerContainer,
  changed: (state: WorkerUpdateState, newlyAvailable: boolean) => void,
  reload: () => void,
  originalController = container.controller,
) {
  let candidate: ServiceWorker | null = null;
  let approved: ServiceWorker | null = null;
  let disposed = false;
  let reloaded = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let error = "";
  const workers = new Set<ServiceWorker>();
  const publish = (fresh = false) => {
    if (!disposed) changed({ available: !!candidate, busy: !!approved, error }, fresh);
  };
  const finish = () => {
    clearTimeout(timer);
    approved = null;
  };
  const check = () => {
    if (disposed || reloaded) return;
    if (approved?.state === "activated" && container.controller === approved) {
      reloaded = true;
      finish();
      reload();
      return;
    }
    if (approved?.state === "redundant") {
      finish();
      error = "This update was replaced. Please try again when the next update is ready.";
    }
    const waiting = registration.waiting;
    const external =
      originalController && container.controller !== originalController
        ? container.controller
        : null;
    const next =
      waiting ||
      external ||
      (originalController && registration.active !== originalController
        ? registration.active
        : null) ||
      (candidate?.state === "activating" || candidate?.state === "activated" ? candidate : null);
    const fresh = !!next && next !== candidate;
    candidate = next;
    if (candidate) observe(candidate);
    publish(fresh);
  };
  function observe(worker: ServiceWorker) {
    if (workers.has(worker)) return;
    workers.add(worker);
    worker.addEventListener("statechange", check);
  }
  const installing = () => {
    if (registration.installing) observe(registration.installing);
    check();
  };
  registration.addEventListener("updatefound", installing);
  container.addEventListener("controllerchange", check);
  installing();
  return {
    update() {
      if (disposed || approved || reloaded) return;
      check();
      const target = candidate;
      if (!target) return;
      approved = target;
      error = "";
      timer = setTimeout(() => {
        finish();
        error = "The update did not finish. You can keep working and try Update again.";
        publish();
      }, 20000);
      publish();
      try {
        if (target.state === "installed")
          target.postMessage({ type: "chathermes.update.activate" });
        check();
      } catch {
        finish();
        error = "Could not activate the update. Please try again.";
        publish();
      }
    },
    dispose() {
      disposed = true;
      finish();
      registration.removeEventListener("updatefound", installing);
      container.removeEventListener("controllerchange", check);
      for (const worker of workers) worker.removeEventListener("statechange", check);
    },
  };
}
