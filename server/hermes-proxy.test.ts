import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createServer, request, type Server } from 'node:http'
import { createAppServer } from './hermes-proxy.ts'
import { loadProfiles } from './profiles.ts'
const servers: Server[] = []
async function listen(server: Server): Promise<number> { servers.push(server); await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve)); const address = server.address(); if (!address || typeof address === 'string') throw Error('no address'); return address.port }
afterEach(async () => { await Promise.all(servers.splice(0).map(server => new Promise<void>(resolve => server.close(() => resolve())))) })
let base: string, hits: { profile: string; authorization: string; path: string; body: string }[]
beforeEach(async () => {
  hits = []
  async function fake(profile: string) { return listen(createServer(async (req, res) => { let body = ''; for await (const chunk of req) body += chunk; hits.push({ profile, authorization: req.headers.authorization || '', path: req.url || '', body }); if (req.url?.endsWith('/chat/stream')) { res.writeHead(200, { 'content-type': 'text/event-stream' }); res.write('event: assistant.delta\ndata: {"text":"hello"}\n\n'); res.end('event: run.completed\ndata: {}\n\n') } else if (req.url?.includes('error')) { res.writeHead(429); res.end('{"error":"busy"}') } else { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(req.method === 'POST' && req.url === '/api/sessions' ? { id: `${profile}-new` } : { sessions: [{ id: `${profile}-one` }] })) } })) }
  const a = await fake('a'), b = await fake('b')
  const profiles = loadProfiles(JSON.stringify([{ id: 'a', label: 'Alpha', url: `http://127.0.0.1:${a}/`, key: 'key-a' }, { id: 'b', label: 'Beta', url: `http://127.0.0.1:${b}/`, key: 'key-b' }]))
  base = `http://127.0.0.1:${await listen(createAppServer(profiles))}`
})
describe('profile proxy', () => {
  it('exposes public metadata and routes with isolated bearer keys', async () => {
    const profiles = await (await fetch(`${base}/api/profiles`)).json()
    expect(profiles).toEqual([{ id: 'a', label: 'Alpha' }, { id: 'b', label: 'Beta' }])
    for (const profile of ['a', 'b']) {
      const result = await fetch(`${base}/api/profiles/${profile}/api/sessions?limit=2`, { headers: { authorization: 'Bearer browser-secret', cookie: 'private=1' } })
      expect((await result.json()).sessions[0].id).toBe(`${profile}-one`)
    }
    const history = await fetch(`${base}/api/profiles/a/api/sessions/a-one/messages?limit=500&offset=0&order=oldest&inline_images=false`)
    expect(history.status).toBe(200)
    expect(hits.at(-1)?.path).toBe('/api/sessions/a-one/messages?limit=500&offset=0&order=oldest&inline_images=false')
    expect(hits.map(hit => hit.authorization)).toEqual(['Bearer key-a', 'Bearer key-b', 'Bearer key-a'])
  })
  it('forwards create, patch and SSE without buffering frames', async () => {
    const create = await fetch(`${base}/api/profiles/a/api/sessions`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' })
    expect((await create.json()).id).toBe('a-new')
    await fetch(`${base}/api/profiles/b/api/sessions/b-one`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: '{"title":"New"}' })
    const stream = await fetch(`${base}/api/profiles/a/api/sessions/a-one/chat/stream`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"input":"test"}' })
    expect(stream.headers.get('content-type')).toContain('text/event-stream')
    expect(await stream.text()).toContain('event: run.completed')
    expect(hits.map(hit => hit.profile)).toEqual(['a', 'b', 'a'])
  })
  it('fails closed on unknown profiles and unsafe paths', async () => {
    for (const path of ['/api/profiles/missing/api/sessions', '/api/profiles/a/api/jobs', '/api/profiles/a/api/sessions/%2e%2e', '/api/profiles/a/api/sessions?url=evil', '//example.com/api/profiles/a/api/sessions']) {
      expect((await fetch(base + path)).status).toBeGreaterThanOrEqual(400)
    }
    expect(hits).toHaveLength(0)
  })
  it('rejects foreign hosts and cross-origin writes before forwarding', async () => {
    const endpoint = `${base}/api/profiles/a/api/sessions`
    const foreignHost = await new Promise<number>((resolve, reject) => {
      const req = request(endpoint, { headers: { host: 'attacker.example' } }, res => { res.resume(); res.on('end', () => resolve(res.statusCode || 0)) })
      req.on('error', reject); req.end()
    })
    expect(foreignHost).toBe(403)
    for (const headers of [
      { origin: 'https://attacker.example' },
      { origin: 'null' },
      { origin: base.replace('127.0.0.1', 'localhost') },
      { 'sec-fetch-site': 'cross-site' },
      { 'sec-fetch-site': 'same-site' },
    ]) {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: '{}' })
      expect(response.status).toBe(403)
    }
    expect(hits).toHaveLength(0)
    const sameOrigin = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json', origin: base, 'sec-fetch-site': 'same-origin' }, body: '{}' })
    expect(sameOrigin.status).toBe(200)
    expect(hits).toHaveLength(1)
  })
})

describe('profile configuration', () => {
  it('rejects duplicate keys, remote URLs and invalid IDs', () => {
    expect(() => loadProfiles(JSON.stringify([{ id: 'a', label: 'A', url: 'http://127.0.0.1:8642/', key: 'same' }, { id: 'b', label: 'B', url: 'http://127.0.0.1:8643/', key: 'same' }]))).toThrow()
    expect(() => loadProfiles(JSON.stringify([{ id: 'a', label: 'A', url: 'https://example.com/', key: 'key' }]))).toThrow()
    expect(() => loadProfiles(JSON.stringify([{ id: '../a', label: 'A', url: 'http://127.0.0.1:8642/', key: 'key' }]))).toThrow()
  })
})

describe('upstream errors', () => {
  it('preserves upstream rate limits and does not turn API misses into HTML', async () => {
    const response = await fetch(`${base}/api/profiles/a/api/sessions/error`)
    expect(response.status).toBe(429)
    expect(await response.json()).toEqual({ error: 'busy' })
    expect((await fetch(`${base}/api`, { headers: { accept: 'text/html' } })).status).toBe(404)
  })
  it('rejects oversized and non-JSON writes before reaching Hermes', async () => {
    expect((await fetch(`${base}/api/profiles/a/api/sessions`, { method: 'POST', headers: { 'content-type': 'text/plain' }, body: 'hello' })).status).toBe(415)
    expect((await fetch(`${base}/api/profiles/a/api/sessions`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: 'x'.repeat(70_000) })).status).toBe(413)
    expect(hits).toHaveLength(0)
  })
})
