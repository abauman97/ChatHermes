import { profileName, resolvePluginUrl } from "./links";

/** Lives with the host plugin registration, including while Vue is unmounted. */
export function createNotificationNavigation() {
  let handler: ((event: MessageEvent) => unknown) | undefined;
  let pending: MessageEvent | undefined;
  let receivedAt = 0;
  const takePending = () => {
    if (pending && Date.now() - receivedAt >= 10000) {
      pending.ports[0]?.close();
      pending = undefined;
    }
    return pending;
  };
  return {
    pendingUrl: (): string | undefined => takePending()?.data.url,
    receive(this: void, event: MessageEvent) {
      if (
        event.data?.type !== "chathermes.navigate" ||
        typeof event.data.url !== "string" ||
        !resolvePluginUrl(event.data.url)
      )
        return;
      const url = new URL(event.data.url, location.origin);
      const route = new URL(url.hash.slice(1), location.origin);
      const profiles = route.searchParams.getAll("profile");
      if (profiles.length > 1 || (profiles[0] && !profileName.test(profiles[0]))) return;
      if (handler && location.pathname === "/chathermes") {
        void handler(event);
        return;
      }
      pending?.ports[0]?.close();
      pending = event;
      receivedAt = Date.now();
      if (location.pathname === "/chathermes") return;
      // React owns the outer dashboard route. Enter it once; Vue owns the
      // destination and the loaded acknowledgement after the plugin mounts.
      url.search = new URLSearchParams({
        profile: route.searchParams.get("profile") || "default",
      }).toString();
      const host = { ...history.state };
      if (typeof host.idx === "number") host.idx++;
      host.key = Math.random().toString(36).slice(2, 10);
      history.pushState(host, "", url.pathname + url.search + url.hash);
      window.dispatchEvent(new PopStateEvent("popstate", { state: host }));
    },
    connect(navigate: (event: MessageEvent) => unknown) {
      handler = navigate;
      const event = takePending();
      pending = undefined;
      if (event) void navigate(event);
      return () => {
        if (handler === navigate) handler = undefined;
      };
    },
  };
}
export type NotificationNavigation = ReturnType<typeof createNotificationNavigation>;
export const notificationNavigationKey = "chathermes.notificationNavigation";
