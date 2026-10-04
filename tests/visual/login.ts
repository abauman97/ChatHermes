import type { BrowserContext, Page } from '@playwright/test'
// One real UI sign-in per worker. Keep host cookies only in worker memory;
// each test still has an isolated browser context and authenticates real routes.
// Reusing the session avoids hitting the pinned host's 10/minute password limit.
let cookies: Awaited<ReturnType<BrowserContext['cookies']>> | undefined
export async function signIn(page: Page, next = '/chathermes') {
  if (cookies) {
    await page.context().addCookies(cookies)
    await page.goto(next)
    return
  }
  await page.goto('/login?next=' + encodeURIComponent(next))
  await page.getByLabel('Username').fill('tester')
  await page.getByLabel('Password', { exact: true }).fill('chathermes-local-test')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await page.waitForURL(url => url.pathname !== '/login')
  cookies = await page.context().cookies()
}
