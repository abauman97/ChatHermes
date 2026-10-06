const PREFIX = '/api/plugins/chathermes/'
const APP_URL = '/chathermes'

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()))
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()))
self.addEventListener('push', event => {
  let data
  try { data = event.data?.json() } catch { return }
  if (!data || data.title !== 'ChatHermes' || !['turn.complete', 'approval', 'clarify', 'attention'].includes(data.type)) return
  const profile = typeof data.profile === 'string' && /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(data.profile) ? data.profile : ''
  const session = typeof data.session_id === 'string' && /^[A-Za-z0-9_-]{1,128}$/.test(data.session_id) ? data.session_id : ''
  if (!session) return
  const url = new URL(APP_URL, self.location.origin)
  if (profile) url.searchParams.set('profile', profile)
  url.searchParams.set('session', session)
  event.waitUntil((async () => {
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    if (clients.some(client => new URL(client.url).origin === self.location.origin && new URL(client.url).pathname.startsWith(APP_URL) && client.visibilityState === 'visible' && client.focused)) return
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
  if (target.origin !== self.location.origin || !target.pathname.startsWith(APP_URL)) return
  event.waitUntil((async () => {
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    for (const client of clients) {
      if (new URL(client.url).origin === target.origin && new URL(client.url).pathname.startsWith(APP_URL)) {
        await client.focus()
        client.postMessage({ type: 'chathermes.navigate', url: target.href })
        return
      }
    }
    await self.clients.openWindow(target.href)
  })())
})
