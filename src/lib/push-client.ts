export interface PluginSessionState {
  profile: string;
  session: string;
  connected: boolean;
  chat: boolean;
}

export function sessionMessage(
  state: PluginSessionState,
  url: string,
  visibility: string = document.visibilityState,
) {
  return {
    type: "chathermes.session",
    url,
    visible: visibility === "visible",
    profile: state.profile || "default",
    session: state.chat ? state.session : "",
    connected: state.chat && !!state.session && state.connected,
  };
}

/** Only the mounted plugin can attest to its native viewer, with freshly read document visibility, independent of focus. */
export function connectPushClient(
  sw: ServiceWorkerContainer,
  state: () => PluginSessionState,
  url: () => string,
) {
  let mounted = true,
    active: ServiceWorker | null = null;
  const message = () => sessionMessage(state(), url());
  const publish = () => {
    if (mounted) (sw.controller || active)?.postMessage(message());
  };
  const receive = (event: MessageEvent) => {
    if (mounted && event.data?.type === "chathermes.session.query")
      event.ports[0]?.postMessage(message());
  };
  sw.addEventListener("message", receive);
  sw.addEventListener("controllerchange", publish);
  document.addEventListener("visibilitychange", publish);
  void sw.ready
    .then((registration) => {
      active = registration.active;
      publish();
    })
    .catch(() => {});
  publish();
  return {
    publish,
    stop: () => {
      mounted = false;
      // No stale connected state may survive an unmount or a delayed ready promise.
      const worker = sw.controller || active;
      worker?.postMessage({ ...message(), session: "", connected: false, visible: false });
      sw.removeEventListener("message", receive);
      sw.removeEventListener("controllerchange", publish);
      document.removeEventListener("visibilitychange", publish);
    },
  };
}
