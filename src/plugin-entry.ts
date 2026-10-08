type HostReact = {
  createElement: (type: string, props: Record<string, unknown>) => unknown;
  useRef: (initial: HTMLDivElement | null) => { current: HTMLDivElement | null };
  useEffect: (effect: () => (() => void) | void, deps: unknown[]) => void;
};
declare const __CHATHERMES_APP_ASSET__: string;
declare global {
  interface Window {
    __HERMES_PLUGIN_SDK__?: { React: HostReact };
    __HERMES_PLUGINS__?: { register: (name: string, component: () => unknown) => void };
  }
}
const React = window.__HERMES_PLUGIN_SDK__?.React;
if (!React || !window.__HERMES_PLUGINS__) throw new Error("Hermes plugin SDK is unavailable");
const appUrl = new URL(
  __CHATHERMES_APP_ASSET__,
  (document.currentScript as HTMLScriptElement | null)?.src || location.href,
).href;
const pwaHeadTags = [
  ["link", { rel: "manifest", href: "/api/plugins/chathermes/assets/dist/manifest.webmanifest" }],
  [
    "link",
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/api/plugins/chathermes/assets/dist/apple-touch-icon.png",
    },
  ],
  ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
  ["meta", { name: "apple-mobile-web-app-title", content: "ChatHermes" }],
] as const;
function ChatHermesPlugin() {
  const element = React!.useRef(null);
  React!.useEffect(() => {
    let disposed = false;
    const ownedHeadTags: HTMLElement[] = [];
    for (const [tagName, attributes] of pwaHeadTags) {
      const selector =
        tagName === "link" ? `link[rel="${attributes.rel}"]` : `meta[name="${attributes.name}"]`;
      if (document.head.querySelector(selector)) continue;
      const tag = document.createElement(tagName);
      for (const [name, value] of Object.entries(attributes)) tag.setAttribute(name, value);
      tag.setAttribute("data-chathermes-pwa", "true");
      document.head.append(tag);
      ownedHeadTags.push(tag);
    }
    // Mount at the body so transformed host panels cannot contain the fixed overlay.
    const overlay = document.createElement("div");
    overlay.className = "chathermes-plugin chathermes-embedded";
    document.body.append(overlay);
    const viewport = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
    const previousViewport = viewport?.content;
    const ownedViewport = viewport || document.createElement("meta");
    ownedViewport.name = "viewport";
    ownedViewport.content =
      "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover";
    if (!viewport) document.head.append(ownedViewport);
    const preventGesture = (event: Event) => event.preventDefault();
    overlay.addEventListener("gesturestart", preventGesture, { passive: false });
    let app: { mount: (element: HTMLDivElement) => void; unmount: () => void } | undefined;
    void import(/* @vite-ignore */ appUrl)
      .then(({ createChatHermesApp }) => {
        if (disposed || !element.current) return;
        app = createChatHermesApp();
        app!.mount(overlay);
      })
      .catch(() => {
        if (!disposed) {
          overlay.textContent = "ChatHermes could not load.";
          const back = document.createElement("a");
          back.href = "/";
          back.textContent = " Back to dashboard";
          overlay.append(back);
        }
      });
    return () => {
      disposed = true;
      app?.unmount();
      overlay.remove();
      ownedHeadTags.forEach((tag) => tag.remove());
      if (viewport) viewport.content = previousViewport!;
      else ownedViewport.remove();
    };
  }, []);
  return React!.createElement("div", { ref: element, className: "chathermes-plugin" });
}
window.__HERMES_PLUGINS__.register("chathermes", ChatHermesPlugin);
