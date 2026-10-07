import { expect, test } from '@playwright/test'
import { signIn } from './login'

// Permit the synthetic remote fixture origin to exercise a real service worker.
// No browser push subscription, provider endpoint, or transport credential is used.
const origin = new URL(process.env.CHATHERMES_TEST_URL || 'http://127.0.0.1:9119').origin
test.use({ trace: 'off', launchOptions: { executablePath: process.env.CHATHERMES_CHROMIUM, args: ['--unsafely-treat-insecure-origin-as-secure=' + origin] } })
test('worker confirms SPA route from mounted plugin instead of stale WindowClient URL', async ({ page, context }) => {
  await signIn(page)
  await page.bringToFront()
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  const worker = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker')
  for (const session of ['route_probe_one', 'route_probe_two']) {
    await page.evaluate(session => history.replaceState({}, '', '/chathermes?profile=default&session=' + session), session)
    const route = await worker.evaluate(`(async () => {
      const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      return currentRoute(windows[0]);
    })()`)
    expect(route).toBe(origin + '/chathermes?profile=default&session=' + session)
  }
  await page.goto('/login')
  const route = await worker.evaluate(`(async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    return currentRoute(windows[0]);
  })()`)
  expect(route).toBeNull()
})
