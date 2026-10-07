import { signIn } from './login'
import { expect, test } from '@playwright/test'

test('loaded Projects do not shift during background refreshes', async ({ page }, testInfo) => {
  await page.setViewportSize(testInfo.project.name === 'mobile' ? { width: 390, height: 844 } : { width: 1280, height: 900 })
  // This test holds legacy visibility refreshes; native event refreshes have
  // separate runtime coverage. Keep project responses authenticated and real.
  await page.route('**/api/plugins/chathermes/v1/capabilities**', async route => {
    const response = await route.fetch()
    const body = await response.json()
    await route.fulfill({ json: { ...body, features: { ...body.features, native_chat: false } } })
  })
  await signIn(page, '/chathermes?view=projects')
  await page.waitForURL(url => url.pathname !== '/login')
  const plugin = page.locator('.chathermes-embedded')
  await page.goto('/chathermes?view=projects')
  await expect(plugin.locator('.projects-page')).toBeVisible()
  const projects = plugin.locator('.projects-page')
  await expect(projects.getByRole('button', { name: 'Hermes Mobile', exact: true })).toBeVisible()
  await expect(projects.getByRole('status')).toHaveCount(0)
  const composer = plugin.getByRole('textbox', { name: 'Message Hermes' })
  await composer.click(); await expect(composer).toBeFocused()
  let release!: () => void
  let pending = false
  const gate = new Promise<void>(resolve => { release = resolve })
  // Keep authenticated Hermes responses, but hold refreshes long enough to
  // inspect the layout while the background requests are in flight.
  await page.route(/\/api\/plugins\/chathermes\/projects(?:\?|$)/, async route => {
    const response = await route.fetch()
    pending = true
    await gate
    await route.fulfill({ response })
  })
  for (const archived of [false, true]) {
    await plugin.getByRole('button', { name: 'Screen options', exact: true }).click(); await plugin.getByRole('menuitemradio', { name: archived ? 'Archived projects' : 'Active projects', exact: true }).click()
    await expect.poll(() => pending).toBe(true)
    const list = projects.getByRole('navigation', { name: 'Project list' })
    const before = await list.boundingBox()
    await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')))
    await page.waitForTimeout(400)
    await expect(projects.getByRole('status')).toHaveCount(0)
    expect(await list.boundingBox()).toEqual(before)
    if (archived) await expect(projects).toContainText('No archived projects.')
    await composer.click(); await expect(composer).toBeFocused()
    await page.screenshot({ path: testInfo.outputPath(archived ? 'archived-refresh.png' : 'projects-refresh.png') })
  }
  release()
  await page.unrouteAll({ behavior: 'wait' })
  await plugin.getByRole('button', { name: 'Screen options', exact: true }).click(); await plugin.getByRole('menuitemradio', { name: 'Active projects', exact: true }).click()
  await projects.getByRole('button', { name: 'Hermes Mobile', exact: true }).click()
  const detail = plugin.getByRole('region', { name: 'Selected Project' })
  await expect(plugin.locator('.topbar h1')).toBeVisible()
  const heading = plugin.locator('.topbar h1')
  const before = await heading.boundingBox()
  let finish!: () => void
  const detailGate = new Promise<void>(resolve => { finish = resolve })
  pending = false
  await page.route(/\/api\/plugins\/chathermes\/projects\/detail\?/, async route => {
    const response = await route.fetch(); pending = true
    await detailGate; await route.fulfill({ response })
  })
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')))
  await expect.poll(() => pending).toBe(true)
  await expect(detail.getByRole('status')).toHaveCount(0)
  expect(await heading.boundingBox()).toEqual(before)
  await composer.click(); await expect(composer).toBeFocused()
  await page.screenshot({ path: testInfo.outputPath('project-detail-refresh.png') })
  finish()
  await page.unrouteAll({ behavior: 'wait' })
})
