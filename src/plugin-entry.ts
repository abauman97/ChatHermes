type HostReact = {
  createElement: (type: string, props: Record<string, unknown>) => unknown
  useRef: (initial: HTMLDivElement | null) => { current: HTMLDivElement | null }
  useEffect: (effect: () => (() => void) | void, deps: unknown[]) => void
}
declare const __CHATHERMES_APP_ASSET__: string
declare global {
  interface Window {
    __HERMES_PLUGIN_SDK__?: { React: HostReact }
    __HERMES_PLUGINS__?: { register: (name: string, component: () => unknown) => void }
  }
}
const React = window.__HERMES_PLUGIN_SDK__?.React
if (!React || !window.__HERMES_PLUGINS__) throw new Error('Hermes plugin SDK is unavailable')
const appUrl = new URL(__CHATHERMES_APP_ASSET__, (document.currentScript as HTMLScriptElement | null)?.src || location.href).href
function ChatHermesPlugin() {
  const element = React!.useRef(null)
  React!.useEffect(() => {
    let disposed = false
    let app: { mount: (element: HTMLDivElement) => void; unmount: () => void } | undefined
    void import(/* @vite-ignore */ appUrl).then(({ createChatHermesApp }) => {
      if (disposed || !element.current) return
      app = createChatHermesApp()
      app!.mount(element.current)
    }).catch(() => { if (!disposed && element.current) element.current.textContent = 'ChatHermes could not load.' })
    return () => { disposed = true; app?.unmount() }
  }, [])
  return React!.createElement('div', { ref: element, className: 'chathermes-plugin' })
}
window.__HERMES_PLUGINS__.register('chathermes', ChatHermesPlugin)
