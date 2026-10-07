const APP_URL = '/chathermes'

// Chromium WindowClient.url can retain the initial URL after SPA history changes.
// Ask the mounted plugin for its current URL; absent replies fail open to notify.
function currentRoute(client) {
  return new Promise(resolve => {
    const channel = new MessageChannel()
    const finish = value => { clearTimeout(timer); channel.port1.close(); channel.port2.close(); resolve(value) }
    const timer = setTimeout(() => finish(null), 300)
    channel.port1.onmessage = event => finish(event.data?.type === 'chathermes.route' && typeof event.data.url === 'string' ? event.data.url : null)
    try { client.postMessage({ type: 'chathermes.route.query' }, [channel.port2]) } catch { finish(null) }
  })
}

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()))
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()))
self.addEventListener('push', event => {
  let data
  try { data = event.data?.json() } catch { return }
  if (!data || data.title !== 'ChatHermes' || !['turn.complete', 'approval', 'clarify', 'attention', 'test'].includes(data.type)) return
  const profile = typeof data.profile === 'string' && /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(data.profile) ? data.profile : ''
  const session = typeof data.session_id === 'string' && /^[A-Za-z0-9_-]{1,128}$/.test(data.session_id) ? data.session_id : ''
  if (!session && data.type !== 'test') return
  const url = new URL(APP_URL, self.location.origin)
  if (profile) url.searchParams.set('profile', profile)
  if (session) url.searchParams.set('session', session)
  event.waitUntil((async () => {
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    if (data.type !== 'test' && profile) {
      const routes = await Promise.all(clients.filter(client => {
        try { return new URL(client.url).origin === self.location.origin && client.visibilityState === 'visible' && client.focused } catch { return false }
      }).map(currentRoute))
      if (routes.some(route => {
        if (!route) return false
        try {
          const open = new URL(route)
          return open.origin === self.location.origin && open.pathname === APP_URL
            && !open.searchParams.has('view')
            && open.searchParams.getAll('session').length === 1
            && open.searchParams.get('session') === session
            && open.searchParams.getAll('profile').length <= 1
            && (open.searchParams.get('profile') || 'default') === profile
        } catch { return false }
      })) return
    }
    await self.registration.showNotification('ChatHermes', {
      body: typeof data.body === 'string' ? data.body.slice(0, 160) : 'Hermes needs your attention.',
      tag: typeof data.tag === 'string' && /^chathermes:[A-Za-z0-9_-]{1,220}$/.test(data.tag) ? data.tag : `chathermes:${profile}:${session}:${data.type}`,
      data: { url: url.href }, icon: '/api/plugins/chathermes/assets/dist/icons/icon-192.png', badge: '/api/plugins/chathermes/assets/dist/icons/icon-192.png',
    })
  })())
})
self.addEventListener('notificationclick', event => {
  event.notification.close()
  const target = new URL(event.notification.data?.url || APP_URL, self.location.origin)
  if (target.origin !== self.location.origin || target.pathname !== APP_URL) return
  event.waitUntil((async () => {
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    for (const client of clients) {
      if (new URL(client.url).origin === target.origin && new URL(client.url).pathname === APP_URL) {
        await client.focus()
        client.postMessage({ type: 'chathermes.navigate', url: target.href })
        return
      }
    }
    await self.clients.openWindow(target.href)
  })())
})
