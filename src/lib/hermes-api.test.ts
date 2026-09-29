// @vitest-environment jsdom
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { api, ApiError, messageText } from './hermes-api'
import { createProfile, loadProfiles, normalizeBaseUrl, saveProfiles, updateProfile } from './profiles'
const profiles = [{ id: 'alpha', label: 'Alpha', baseUrl: 'https://example.test/p/alpha/', key: 'alpha-secret' }, { id: 'beta', label: 'Beta', baseUrl: 'http://localhost:8643/', key: 'beta-secret' }]
beforeEach(() => { localStorage.clear(); saveProfiles(profiles) })
afterEach(() => { vi.unstubAllGlobals(); localStorage.clear() })
describe('direct Hermes client', () => {
  it('pins per-profile bearer credentials, URLs and fetch security options', async () => {
    const fake = vi.fn(async (_input: string, _init?: RequestInit) => new Response(JSON.stringify({ object: 'list', data: [{ id: 'fake' }], limit: 30, offset: 30, has_more: false })))
    vi.stubGlobal('fetch', fake)
    expect(await api.sessions('alpha', 30)).toMatchObject({ sessions: [{ id: 'fake' }], offset: 30 })
    await api.sessions('beta')
    expect(fake.mock.calls[0]?.[0]).toBe('https://example.test/p/alpha/api/sessions?limit=30&offset=30')
    expect(fake.mock.calls[1]?.[0]).toBe('http://localhost:8643/api/sessions?limit=30&offset=0')
    expect(fake.mock.calls[0]?.[1]).toMatchObject({ redirect: 'manual', cache: 'no-store', credentials: 'omit', headers: { authorization: 'Bearer alpha-secret' } })
    expect(fake.mock.calls[1]?.[1]).toMatchObject({ headers: { authorization: 'Bearer beta-secret' } })
    expect(JSON.stringify(fake.mock.calls.map(call => call[0]))).not.toContain('secret')
  })
  it('uses direct routes for create, history, rename and fetch-based SSE', async () => {
    const fake = vi.fn(async (input: string, init?: RequestInit) => {
      if (input.includes('/chat/stream')) return new Response('event: run.completed\ndata: {"run_id":"run-1"}\n\n', { headers: { 'content-type': 'text/event-stream' } })
      const value = input.includes('/messages') ? { data: [{ role: 'assistant', content: 'hello' }], pagination: { returned: 1, limit: 500 } }
        : { object: 'hermes.session', session: { id: 'one', title: init?.method === 'PATCH' ? 'Renamed' : 'Original' } }
      return new Response(JSON.stringify(value))
    })
    vi.stubGlobal('fetch', fake)
    expect((await api.create('alpha')).id).toBe('one')
    expect((await api.rename('alpha', 'one', 'Renamed')).title).toBe('Renamed')
    expect(await api.messages('alpha', 'one')).toHaveLength(1)
    const frames = []
    for await (const frame of api.stream('alpha', 'one', 'Hello')) frames.push(frame)
    expect(frames[0]?.event).toBe('run.completed')
    expect(fake.mock.calls.at(-1)?.[1]).toMatchObject({ method: 'POST', headers: { authorization: 'Bearer alpha-secret', accept: 'text/event-stream' }, redirect: 'manual' })
  })
  it('rejects redirects and HTTP failures without following them', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 302, headers: { location: 'https://evil.test/' } })))
    await expect(api.sessions('alpha')).rejects.toThrow('redirected')
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 401 })))
    await expect(api.sessions('alpha')).rejects.toMatchObject({ status: 401 } satisfies Partial<ApiError>)
  })
  it('rejects unsafe URLs and keeps a key when editing without replacement', () => {
    for (const value of ['http://remote.test/', 'https://user:pass@remote.test/', 'https://remote.test/api/', 'https://remote.test/p/../', 'https://remote.test/?key=x', 'https://remote.test/#key', 'https://remote.test/p/%61/']) expect(() => normalizeBaseUrl(value)).toThrow()
    expect(normalizeBaseUrl('http://127.0.0.1:8642')).toBe('http://127.0.0.1:8642/')
    const edited = updateProfile(profiles[0]!, 'Edited', 'https://example.test/p/alpha/', '')
    expect(edited.key).toBe('alpha-secret')
    expect(createProfile('New', 'https://remote.test/', 'new-secret')).toMatchObject({ label: 'New', key: 'new-secret' })
    expect(updateProfile(profiles[0]!, 'Edited', 'https://EXAMPLE.test/p/alpha', '').key).toBe('alpha-secret')
    for (const url of ['https://other.test/p/alpha/', 'https://example.test/p/beta/', 'https://example.test/']) {
      expect(() => updateProfile(profiles[0]!, 'Edited', url, '')).toThrow('new API key')
      expect(updateProfile(profiles[0]!, 'Edited', url, 'replacement').key).toBe('replacement')
    }
  })
  it('persists isolated connections across reload and refuses removed profiles', async () => {
    expect(loadProfiles()).toEqual(profiles)
    saveProfiles([profiles[1]!])
    const fake = vi.fn(async () => new Response('{}'))
    vi.stubGlobal('fetch', fake)
    await expect(api.sessions('alpha')).rejects.toThrow('no longer configured')
    expect(fake).not.toHaveBeenCalled()
    expect(loadProfiles()).toEqual([profiles[1]])
  })
  it('extracts text without interpreting HTML', () => { expect(messageText([{ type: 'text', text: '<script>fake</script>' }])).toBe('<script>fake</script>') })
})
