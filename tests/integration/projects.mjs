// Explicit integration run only; normal Playwright tests remain deterministic.
import { chromium, expect } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
const baseURL = process.env.CHATHERMES_TEST_URL || 'http://127.0.0.1:9119'
const output = 'tests/integration-output/issue-7'
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ executablePath: process.env.CHATHERMES_CHROMIUM })
const results = []
let stage = 'dashboard login'
try {
  stage = 'unauthenticated Project access'
  const anonymous = await browser.newContext({ baseURL })
  expect((await anonymous.request.get('/api/plugins/chathermes/projects')).status()).toBe(401)
  await anonymous.close()
  for (const [name, viewport] of [['desktop', { width: 1280, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
    stage = `${name}: dashboard login`
    const context = await browser.newContext({ baseURL, viewport, isMobile: name === 'mobile', hasTouch: name === 'mobile' })
    const page = await context.newPage()
    const errors = []; page.on('pageerror', error => errors.push(error.message))
    await page.goto('/login?next=/chathermes')
    await page.getByLabel('Username').fill('tester')
    await page.getByLabel('Password', { exact: true }).fill('chathermes-local-test')
    await page.getByRole('button', { name: 'Sign in', exact: true }).click()
    const plugin = page.locator('.chathermes-embedded')
    await expect(plugin).toBeVisible()
    const api = '/api/plugins/chathermes'
    stage = `${name}: native Projects routes`
    const list = await page.request.get(`${api}/projects`)
    expect(list.status()).toBe(200)
    const projects = (await list.json()).projects
    expect(projects.map(p => p.label)).toEqual(expect.arrayContaining(['Hermes Mobile', 'AcumaticaMCP', 'Unavailable workspace']))
    const project = projects.find(p => p.label === 'Hermes Mobile')
    const detail = await page.request.get(`${api}/projects/${project.id}`)
    expect((await detail.json()).project.path).toBe('/tmp/chathermes-issue7-runtime/workspace-a')
    // Real native workspace create and prompt runtime, through dashboard auth.
    stage = `${name}: native Project session creation`
    const created = await page.request.post(`${api}/projects/${project.id}/sessions`)
    expect(created.status()).toBe(201)
    const session = (await created.json()).session
    expect(session.cwd).toBe(project.path)
    stage = `${name}: real chat stream`
    const stream = await page.request.post(`${api}/workspace/sessions/${session.id}/chat/stream`, {
      timeout: 180_000,
      data: { model: 'qwen3.8:27b', provider: 'litellm', input: 'Reply with exactly: ChatHermes integration verified. Do not use tools.' },
    })
    expect(stream.status()).toBe(200)
    const frames = await stream.text()
    const completion = frames.split('\n\n').find(frame => frame.includes('event: run.completed'))
    expect(completion).toBeDefined()
    const payload = JSON.parse(completion.split('data: ')[1])
    expect(payload.usage.model).toBe('qwen3.8:27b')
    expect(frames).not.toContain('Isolated Hermes reply')
    stage = `${name}: UI resume and screenshots`
    await page.goto(`/chathermes?project=${encodeURIComponent(project.id)}&session=${encodeURIComponent(session.id)}`)
    await expect(plugin.locator('.message.assistant').last()).toContainText('ChatHermes integration verified', { timeout: 30_000 })
    const composer = plugin.getByRole('textbox', { name: 'Message Hermes' })
    await composer.click(); await expect(composer).toBeFocused()
    await page.screenshot({ path: `${output}/${name}-real-chat.png`, animations: 'disabled' })
    await page.reload()
    await expect(plugin.locator('.message.assistant').last()).toContainText('ChatHermes integration verified')
    if (name === 'mobile') await plugin.getByRole('button', { name: 'Open navigation', exact: true }).click()
    await expect(plugin.getByRole('button', { name: 'Hermes Mobile', exact: true })).toBeVisible()
    for (const name of ['Hermes Mobile', 'AcumaticaMCP', 'Unavailable workspace']) {
      expect(await plugin.getByRole('button', { name, exact: true }).evaluate(el => el.getBoundingClientRect().height)).toBeGreaterThanOrEqual(48)
    }
    await page.screenshot({ path: `${output}/${name}-projects-list.png`, animations: 'disabled' })
    await page.goto(`/chathermes?project=${encodeURIComponent(project.id)}`)
    const view = plugin.getByRole('region', { name: 'Selected Project' })
    await expect(view).toContainText(project.path)
    await expect(view.getByRole('button', { name: 'New chat', exact: true })).toBeEnabled()
    await composer.click(); await expect(composer).toBeFocused()
    await page.screenshot({ path: `${output}/${name}-project-detail.png`, animations: 'disabled' })
    await page.reload(); await expect(view).toContainText('Hermes Mobile')
    expect(errors).toEqual([])
    // Store only synthetic validation results, no credentials or session data.
    results.push({ viewport: name, projects: projects.length, create: 201, stream: 200, model: 'qwen3.8:27b', projectCreation: 201, workspace: true, resume: true, refresh: true })
    await context.close()
  }
  await writeFile(`${output}/results.json`, JSON.stringify(results, null, 2) + '\n')
  console.log('Real Hermes integration passed at desktop and mobile sizes')
} catch {
  // Playwright request errors include Cookie headers. Never print raw exceptions.
  console.error(`Real Hermes integration failed during ${stage}`)
  process.exitCode = 1
} finally { await browser.close() }
