import { expect, test } from '@playwright/test'
import { signIn } from './login'

// Real mounted plugin and worker; only synthetic notification text and sessions.
const origin = new URL(process.env.CHATHERMES_TEST_URL || 'http://127.0.0.1:9119').origin
test.use({ trace: 'off', launchOptions: { executablePath: process.env.CHATHERMES_CHROMIUM, args: ['--unsafely-treat-insecure-origin-as-secure=' + origin] } })
test('worker checks visible connected SPA session and closes matching notifications on reconnect', async ({ page, context }, info) => {
  await context.grantPermissions(['notifications'], { origin })
  await signIn(page)
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  const worker = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker')
  const sessions = () => worker.evaluate(`visibleSessions()`)
  const tags = () => worker.evaluate(`(async () => (await self.registration.getNotifications()).map(n => n.tag).sort())()`)
  await expect.poll(sessions).toEqual([])
  const composer = page.getByRole('textbox', { name: 'Message Hermes' })
  await composer.click(); await expect(composer).toBeFocused()
  await page.screenshot({ path: info.outputPath('push-home.png') })
  await composer.fill('Synthetic notification routing probe [tool] [activity-hold]')
  await page.getByRole('button', { name: 'Send message', exact: true }).click()
  await expect(page.locator('.activity[open]').first()).toBeVisible()
  await composer.click(); await expect(composer).toBeFocused()
  await expect(page.locator('.message.assistant').last()).toContainText('Isolated Hermes reply', { timeout: 30000 })
  await expect(page.locator('.activity[open]')).toHaveCount(0)
  const target = page.url(), params = new URL(target).searchParams
  const profile = params.get('profile') || 'default', session = params.get('session')!
  await expect.poll(sessions).toEqual([{ profile, session }])
  await page.screenshot({ path: info.outputPath('push-connected.png') })
  // WindowClient.url may still contain home. The plugin's state must agree with
  // the current SPA URL, so changing only history cannot attest to another chat.
  await page.evaluate(() => history.replaceState({}, '', '/chathermes?profile=default&session=stale_probe'))
  await expect.poll(sessions).toEqual([])
  await page.evaluate(target => history.replaceState({}, '', target), target)
  await expect.poll(sessions).toEqual([{ profile, session }])

  await context.setOffline(true)
  await expect.poll(sessions).toEqual([])
  await worker.evaluate(async ({ target, origin }) => {
    await self.registration.showNotification('ChatHermes', { body: 'Synthetic retained notification', tag: 'chathermes:matching', data: { url: target } })
    await self.registration.showNotification('ChatHermes', { body: 'Synthetic other profile', tag: 'chathermes:other', data: { url: origin + '/chathermes?profile=other_profile&session=stale_probe' } })
  }, { target, origin })
  await page.evaluate(() => navigator.serviceWorker.controller?.postMessage({ type: 'chathermes.session', profile: 'default', session: '', connected: false }))
  await expect.poll(tags).toEqual(['chathermes:matching', 'chathermes:other'])
  await composer.click(); await expect(composer).toBeFocused()
  await page.screenshot({ path: info.outputPath('push-disconnected.png') })
  await context.setOffline(false)
  await expect.poll(sessions).toEqual([{ profile, session }])
  await expect.poll(tags).toEqual(['chathermes:other'])
  // Returning from another view must also close a pre-existing notification
  // only once the native session is attached again.
  await page.goto('/chathermes?view=scheduled')
  await expect.poll(sessions).toEqual([])
  await worker.evaluate(async target => {
    await self.registration.showNotification('ChatHermes', { body: 'Synthetic unopened session', tag: 'chathermes:matching', data: { url: target } })
  }, target)
  await expect.poll(tags).toEqual(['chathermes:matching', 'chathermes:other'])
  await page.goto(target)
  await expect.poll(sessions).toEqual([{ profile, session }])
  await expect.poll(tags).toEqual(['chathermes:other'])
  await page.goto('/login')
  await expect.poll(sessions).toEqual([])
  await worker.evaluate(async () => { for (const notification of await self.registration.getNotifications()) notification.close() })
})

test('worker displays profile titles and keeps sessionless tests inspectable in the mounted dashboard', async ({ page, context }) => {
  await context.grantPermissions(['notifications'], { origin })
  await signIn(page)
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  const worker = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker')
  // Exercise the real installed worker with synthetic payloads; external push
  // service delivery is covered separately by sender transport unit tests.
  const result = await worker.evaluate(async () => {
    const payloads = [
      { profile: 'Alpha_Name-2', title: 'Alpha_Name-2', session_id: 'stored_session', type: 'turn.complete' },
      { profile: 'default', title: 'default', session_id: '', type: 'test' },
      { profile: 'beta', title: 'ChatHermes', session_id: '', type: 'test' },
      { profile: '', title: 'ChatHermes', session_id: '', type: 'test' },
    ]
    try {
      for (const payload of payloads) {
        const event = new PushEvent('push', { data: JSON.stringify({ ...payload, body: 'Synthetic title probe' }) })
        let pending: Promise<unknown> | undefined
        Object.defineProperty(event, 'waitUntil', { value: (promise: Promise<unknown>) => { pending = promise } })
        self.dispatchEvent(event)
        await pending
      }
      return (await self.registration.getNotifications()).filter(n => n.body === 'Synthetic title probe')
        .map(n => ({ title: n.title, url: n.data.url })).sort((a, b) => a.title.localeCompare(b.title))
    } finally {
      for (const notification of await self.registration.getNotifications()) notification.close()
    }
  })
  expect(result).toEqual([
    { title: 'Alpha_Name-2', url: origin + '/chathermes?profile=Alpha_Name-2&session=stored_session' },
    { title: 'beta', url: origin + '/chathermes?profile=beta' },
    { title: 'ChatHermes', url: origin + '/chathermes' },
    { title: 'default', url: origin + '/chathermes?profile=default' },
  ])
})
