import type { HistoryState, RouterHistory } from "vue-router";

type NavigationInformation = Parameters<Parameters<RouterHistory["listen"]>[0]>[2];
import { resolvePluginUrl } from "./links";
const namespace = "chathermes";
type Entry = { current: string; position: number; state: HistoryState };
/** Plugin-local metadata; React's usr, key and idx remain host-owned. */
export function createPluginHistory(): RouterHistory {
  let listeners: Array<(to: string, from: string, info: NavigationInformation) => void> = [];
  let paused = false,
    destroyed = false;
  const readLocation = () => resolvePluginUrl(window.location.href) || "/";
  let current = readLocation();
  const readEntry = (): Entry | undefined => window.history.state?.[namespace];
  let position = readEntry()?.position ?? 0;
  let state: HistoryState = readEntry()?.state ?? {};
  const baseUrl = () => {
    const url = new URL(window.location.href);
    return url.pathname + url.search;
  };
  const save = (to: string, data: HistoryState, replace: boolean) => {
    if (destroyed || window.location.pathname !== "/chathermes") return;
    const host = { ...window.history.state };
    if (!replace) {
      if (typeof host.idx === "number") host.idx++;
      if (typeof host.key === "string") host.key = Math.random().toString(36).slice(2, 10);
      position++;
    }
    state = { ...data, position };
    host[namespace] = { current: to, position, state } satisfies Entry;
    window.history[replace ? "replaceState" : "pushState"](host, "", baseUrl() + "#" + to);
    current = to;
  };
  const traverse = () => {
    if (destroyed || window.location.pathname !== "/chathermes") return;
    const from = current,
      to = readLocation(),
      entry = readEntry();
    const delta = entry ? entry.position - position : 0;
    current = to;
    position = entry?.position ?? position;
    state = entry?.state ?? {};
    if (paused) {
      paused = false;
      return;
    }
    if (to === from) return;
    if (!entry || !window.location.hash.startsWith("#/")) save(to, {}, true);
    listeners.slice().forEach((listener) =>
      listener(to, from, {
        delta,
        type: "pop" as NavigationInformation["type"],
        direction: (delta > 0
          ? "forward"
          : delta < 0
            ? "back"
            : "unknown") as NavigationInformation["direction"],
      }),
    );
  };
  window.addEventListener("popstate", traverse);
  window.addEventListener("hashchange", traverse);
  return {
    base: "/chathermes#",
    get location() {
      return current;
    },
    get state() {
      return state;
    },
    createHref: (to) => baseUrl() + "#" + to,
    push: (to, data = {}) => save(to, data, false),
    replace: (to, data = {}) => save(to, data, true),
    go: (delta, triggerListeners = true) => {
      paused = !triggerListeners;
      window.history.go(delta);
    },
    listen: (listener) => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter((item) => item !== listener);
      };
    },
    destroy: () => {
      if (destroyed) return;
      destroyed = true;
      listeners = [];
      window.removeEventListener("popstate", traverse);
      window.removeEventListener("hashchange", traverse);
    },
  };
}
