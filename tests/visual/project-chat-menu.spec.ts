import { expect, test } from '@playwright/test'
import { signIn } from './login'

test('screen actions share styling and create chats in the current project and profile', async ({ page }, info) => {
  await signIn(page)
  const plugin = page.locator('.chathermes-embedded')
  const mobile = info.project.name === 'mobile'
  if (mobile) await plugin.getByRole('button', { name: 'Open navigation', exact: true }).click()
  await plugin.getByRole('combobox', { name: 'Profile', exact: true }).selectOption('test-profile')
  if (mobile) await plugin.getByRole('button', { name: 'Open navigation', exact: true }).click()
  await plugin.getByRole('button', { name: 'Projects', exact: true }).click()
  const workspace = '/tmp/chathermes-issue7-runtime/workspace-a'
  const tree = await (await page.request.get('/api/plugins/chathermes/projects?profile=test-profile')).json()
  const existing = tree.projects.find((row: { path?: string }) => row.path === workspace)
  if (existing) await plugin.getByRole('button', { name: existing.label, exact: true }).click()
  else {
    await plugin.getByRole('button', { name: 'New project', exact: true }).click()
    await plugin.getByLabel('Project name', { exact: true }).fill('Menu regression')
    await plugin.getByLabel('Folder (optional)', { exact: true }).fill(workspace)
    await plugin.getByRole('button', { name: 'Create project', exact: true }).click()
  }
  await expect(plugin.getByRole('region', { name: 'Selected Project' })).toBeVisible()
  if (mobile) {
    const viewport = page.viewportSize()!
    await page.setViewportSize({ width: viewport.width, height: 600 })
    const detail = plugin.getByRole('region', { name: 'Selected Project' })
    await expect.poll(() => detail.evaluate(el => {
      el.scrollTop = el.scrollHeight
      return el.scrollTop
    })).toBeGreaterThan(0)
    await expect(detail.getByRole('button', { name: 'Other chats', exact: true })).toBeVisible()
    await detail.evaluate(el => { el.scrollTop = 0 })
    await page.setViewportSize(viewport)
  }
  const scope = new URL(page.url()).searchParams.get('project')!
  const options = plugin.getByRole('button', { name: 'Screen options', exact: true })
  const menu = plugin.getByRole('menu', { name: 'Screen options' })
  const composer = plugin.getByRole('textbox', { name: 'Message Hermes' })
  await composer.click(); await expect(composer).toBeFocused()
  for (const screen of ['project', 'chat']) {
    await options.click()
    await expect(menu.getByRole('menuitem')).toHaveText(['New chat', 'New project chat', 'Back to dashboard'])
    const styles = await menu.getByRole('menuitem').evaluateAll(items => items.map(item => {
      const css = getComputedStyle(item)
      return [css.color, css.backgroundColor, css.fontSize, css.fontWeight, css.padding, css.borderRadius, css.textAlign, css.minHeight]
    }))
    expect(styles[0]).toEqual(styles[1]); expect(styles[0]).toEqual(styles[2])
    await expect(menu.getByRole('menuitem', { name: 'New chat', exact: true })).toHaveCSS('color', 'rgb(255, 255, 255)')
    await menu.screenshot({ animations: 'disabled', path: info.outputPath(`${screen}-menu-items.png`) })
    await page.screenshot({ animations: 'disabled', path: info.outputPath(`${screen}-screen-menu.png`) })
    const before = new URL(page.url()).searchParams.get('session')
    const created = page.waitForResponse(r => new URL(r.url()).pathname === '/api/plugins/chathermes/projects/session' && r.request().method() === 'POST')
    await menu.getByRole('menuitem', { name: 'New project chat', exact: true }).click()
    const response = await created
    expect(response.status()).toBe(201)
    const requestScope = new URL(response.url()).searchParams
    expect(requestScope.get('project_id')).toBe(scope)
    expect(requestScope.get('profile')).toBe('test-profile')
    await expect(menu).toHaveCount(0)
    await expect.poll(() => new URL(page.url()).searchParams.get('session')).not.toBe(before)
    expect(new URL(page.url()).searchParams.get('project')).toBe(scope)
    expect(new URL(page.url()).searchParams.get('profile')).toBe('test-profile')
    await expect(options).toBeFocused()
    await composer.click(); await expect(composer).toBeFocused()
  }
  await options.click()
  await expect(menu.getByRole('menuitem', { name: 'New project chat', exact: true })).toBeEnabled()
  const ordinaryCreated = page.waitForResponse(r => new URL(r.url()).pathname === '/api/plugins/chathermes/chat/sessions' && r.request().method() === 'POST')
  await menu.getByRole('menuitem', { name: 'New chat', exact: true }).click()
  expect((await ordinaryCreated).status()).toBe(200)
  await expect.poll(() => new URL(page.url()).searchParams.has('project')).toBe(false)
  expect(new URL(page.url()).searchParams.get('profile')).toBe('test-profile')
  await options.click()
  await expect(menu.getByRole('menuitem', { name: 'New project chat', exact: true })).toHaveCount(0)
  await page.screenshot({ animations: 'disabled', path: info.outputPath('ordinary-screen-menu.png') })
})
