// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import App from './App.vue'
import { api } from './lib/hermes-api'
const a = { id: 'p_a', name: 'Project A', primary_path: '/workspace/a', folders: [], workspace_available: true }
const b = { id: 'p_b', name: 'Project B', primary_path: null, folders: [], workspace_available: false }
const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status })
afterEach(() => { vi.unstubAllGlobals(); history.replaceState({}, '', '/chathermes') })
function setup(detail: (id: string) => Promise<Response> = async id => json({ project: id === a.id ? a : b })) {
  const fetch = vi.fn(async (url: string, init?: RequestInit) => {
    if (url.includes('/profiles')) return json({ profiles: [] })
    if (/\/projects(?:\?|$)/.test(url)) return json({ projects: [a, b] })
    if (url.includes('/projects/')) return detail(url.includes(a.id) ? a.id : b.id)
    if (url.includes('/capabilities')) return json({ features: { session_chat_streaming: true }, endpoints: { session_chat_stream: { method: 'POST', path: '/api/sessions/{session_id}/chat/stream' } } })
    if (url.includes('/v1/models')) return json({ data: [] })
    if (url.includes('/model/options')) return json({ providers: [] })
    if (url.includes('/messages')) return json([{ role: 'assistant', content: 'Native chat history' }])
    if (init?.method === 'POST') throw new Error('Unexpected write')
    // Deliberately has a cwd equal to Project A: it must remain ungrouped.
    return json({ sessions: [{ id: 's1', title: 'Ungrouped', cwd: a.primary_path }], total: 1 })
  })
  vi.stubGlobal('fetch', fetch)
  return fetch
}
describe('native Projects on the pinned backend', () => {
  it('lists A and B, keeps a same-path chat ungrouped, and blocks Project sending', async () => {
    history.replaceState({}, '', '/chathermes?profile=alpha')
    const fetch = setup(); const wrapper = mount(App); await flushPromises()
    expect(wrapper.get('[aria-label="Projects"]').text()).toContain('Project A')
    expect(wrapper.get('[aria-label="Projects"]').text()).toContain('Project B')
    expect(wrapper.get('[aria-label="Sessions"]').text()).toContain('Ungrouped')
    await wrapper.get('[aria-label="Project list"] button').trigger('click'); await flushPromises()
    expect(location.search).toContain('project=p_a')
    expect(wrapper.get('[aria-label="Selected Project"]').text()).toContain('/workspace/a')
    expect(wrapper.get('[aria-label="Selected Project"] button[disabled]').text()).toBe('New chat')
    expect(wrapper.get('textarea').attributes('disabled')).toBeUndefined()
    expect(wrapper.text()).toContain('Project chats are unavailable')
    await wrapper.get('textarea').setValue('Do not create a generic chat')
    expect(wrapper.find('button[aria-label="Send message"]').attributes('disabled')).toBeDefined()
    expect(fetch.mock.calls.some(([, init]) => init?.method === 'POST')).toBe(false)
    await wrapper.get('.sidebar > button').trigger('click'); await flushPromises()
    expect(location.search).not.toContain('project=')
    await wrapper.get('.session-select').trigger('click'); await flushPromises()
    expect(wrapper.text()).toContain('Native chat history')
    wrapper.unmount()
  })
  it('restores Project selection across refresh and browser navigation, including an empty Project', async () => {
    history.replaceState({}, '', '/chathermes?project=p_b&profile=alpha')
    setup(); let wrapper = mount(App); await flushPromises()
    expect(wrapper.get('[aria-label="Selected Project"]').text()).toContain('Project B')
    expect(wrapper.text()).toContain('This Project has no primary path')
    wrapper.unmount(); wrapper = mount(App); await flushPromises()
    expect(wrapper.get('[aria-label="Selected Project"]').text()).toContain('Project B')
    history.pushState({}, '', '/chathermes?project=p_a'); dispatchEvent(new PopStateEvent('popstate')); await flushPromises()
    expect(wrapper.get('[aria-label="Selected Project"]').text()).toContain('Project A')
    wrapper.unmount()
  })
  it('surfaces deleted Projects and unavailable directories without creating a chat', async () => {
    history.replaceState({}, '', '/chathermes?project=p_a')
    setup(async () => json({}, 404)); let wrapper = mount(App); await flushPromises()
    expect(wrapper.text()).toContain('Project no longer exists'); wrapper.unmount()
    setup(async () => json({ project: { ...a, workspace_available: false } })); wrapper = mount(App); await flushPromises()
    expect(wrapper.text()).toContain('Project directory is unavailable'); wrapper.unmount()
  })
  it('rejects mismatched metadata and clears selection on profile changes', async () => {
    setup(async () => json({ project: b })); history.replaceState({}, '', '/chathermes?project=p_a')
    const wrapper = mount(App); await flushPromises()
    expect(wrapper.text()).toContain('Could not load this Project')
    await wrapper.get('#profile-field').setValue(''); await flushPromises()
    expect(wrapper.find('[aria-label="Selected Project"]').exists()).toBe(false)
    wrapper.unmount()
  })
  it('shows a Project-list failure while keeping Other chats accessible', async () => {
    setup(); const original = globalThis.fetch
    vi.stubGlobal('fetch', (url: string, init?: RequestInit) => /\/projects(?:\?|$)/.test(url) ? Promise.resolve(json({}, 503)) : original(url, init))
    history.replaceState({}, '', '/chathermes')
    const wrapper = mount(App); await flushPromises()
    expect(wrapper.get('[aria-label="Projects"]').text()).toContain('Could not load Projects')
    expect(wrapper.get('[aria-label="Sessions"]').text()).toContain('Ungrouped')
    wrapper.unmount()
  })
  it('ignores late Project metadata after navigation cancels the request', async () => {
    let finish!: (response: Response) => void
    setup(() => new Promise(resolve => { finish = resolve }))
    history.replaceState({}, '', '/chathermes')
    const wrapper = mount(App); await flushPromises()
    await wrapper.get('[aria-label="Project list"] button').trigger('click'); await flushPromises()
    await wrapper.get('.sidebar > button').trigger('click'); await flushPromises()
    finish(json({ project: a })); await flushPromises()
    expect(wrapper.find('[aria-label="Selected Project"]').exists()).toBe(false)
    expect(wrapper.get('[aria-label="Sessions"]').text()).toContain('Ungrouped')
    expect(location.search).not.toContain('project=')
    wrapper.unmount()
  })
  it('validates authenticated Project API paths', async () => {
    const fetch = setup()
    await api.projects('alpha'); await api.project('alpha', 'p_a')
    expect(fetch.mock.calls[0]?.[0]).toBe('/api/plugins/chathermes/projects?profile=alpha')
    await expect(api.project('alpha', '../x')).rejects.toThrow('Invalid Hermes API path')
  })
})
