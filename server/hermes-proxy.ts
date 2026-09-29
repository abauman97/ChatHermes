import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { resolve, extname, sep } from 'node:path'
import { Readable } from 'node:stream'
import type { Profile } from './profiles.ts'
import { publicProfiles } from './profiles.ts'

const maxBody = 64 * 1024
const id = '[a-zA-Z0-9_-]{1,128}'
const routes: [RegExp, string[]][] = [
  [/^\/api\/sessions$/, ['GET', 'POST']],
  [new RegExp(`^/api/sessions/${id}$`), ['GET', 'PATCH']],
  [new RegExp(`^/api/sessions/${id}/messages$`), ['GET']],
  [new RegExp(`^/api/sessions/${id}/chat/stream$`), ['POST']],
  [/^\/v1\/capabilities$/, ['GET']],
  [new RegExp(`^/v1/runs/${id}$`), ['GET']],
  [new RegExp(`^/v1/runs/${id}/stop$`), ['POST']],
]
function reply(res: ServerResponse, code: number, message: string) {
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' })
  res.end(JSON.stringify({ error: message }))
}
async function body(req: IncomingMessage): Promise<Buffer> {
  const chunks: Buffer[] = []; let size = 0
  for await (const chunk of req) { size += chunk.length; if (size > maxBody) throw new Error('Request body too large'); chunks.push(chunk) }
  return Buffer.concat(chunks)
}
const types: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.json': 'application/json', '.ico': 'image/x-icon' }
export function createAppServer(profiles: Profile[], dist = resolve('dist')) {
  const server = createServer(async (req, res) => {
    res.setHeader('x-content-type-options', 'nosniff')
    res.setHeader('referrer-policy', 'no-referrer')
    res.setHeader('content-security-policy', "default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'")
    const address = server.address()
    const port = address && typeof address !== 'string' ? address.port : 0
    const host = req.headers.host
    const allowedHosts = [`127.0.0.1:${port}`, `localhost:${port}`, `[::1]:${port}`]
    if (!host || !allowedHosts.includes(host)) return reply(res, 403, 'Invalid host')
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method || '')) {
      const origin = req.headers.origin
      if (origin && origin !== `http://${host}`) return reply(res, 403, 'Invalid origin')
      const site = req.headers['sec-fetch-site']
      if (site && site !== 'same-origin' && site !== 'none') return reply(res, 403, 'Cross-site request denied')
    }
    const raw = req.url || ''
    if (!raw.startsWith('/') || raw.startsWith('//') || /%2f|%5c|%2e|\\|\.\./i.test(raw)) return reply(res, 400, 'Invalid path')
    let url: URL
    try { url = new URL(raw, 'http://localhost') } catch { return reply(res, 400, 'Invalid path') }
    if (url.pathname === '/api/profiles' && req.method === 'GET') {
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }); return res.end(JSON.stringify(publicProfiles(profiles)))
    }
    if (url.pathname === '/api' || url.pathname === '/v1' || url.pathname.startsWith('/api/') || url.pathname.startsWith('/v1/')) {
      const match = /^\/api\/profiles\/([a-zA-Z0-9_-]{1,64})(\/.*)$/.exec(url.pathname)
      if (!match) return reply(res, 404, 'Not found')
      const profile = profiles.find(p => p.id === match[1]); if (!profile) return reply(res, 404, 'Unknown profile')
      const path = match[2]
      const route = routes.find(([pattern]) => pattern.test(path))
      if (!route || !route[1].includes(req.method || '')) return reply(res, 404, 'Not found')
      if (path === '/api/sessions') {
        if (req.method === 'GET' && [...url.searchParams.keys()].some(k => !['limit', 'offset', 'source', 'include_children'].includes(k))) return reply(res, 400, 'Invalid query')
        if (req.method === 'POST' && url.search) return reply(res, 400, 'Invalid query')
      } else if (path.endsWith('/messages')) {
        if ([...url.searchParams.keys()].some(k => !['inline_images', 'limit', 'offset', 'order'].includes(k))) return reply(res, 400, 'Invalid query')
      } else if (url.search) return reply(res, 400, 'Invalid query')
      try {
        if (Number(req.headers['content-length'] || 0) > maxBody) return reply(res, 413, 'Request body too large')
        const payload = ['POST', 'PATCH'].includes(req.method || '') ? await body(req) : undefined
        if (payload && payload.length && req.headers['content-type']?.split(';')[0] !== 'application/json') return reply(res, 415, 'JSON required')
        if (path.endsWith('/stop') && payload?.length) return reply(res, 400, 'Unexpected body')
        if (payload?.length) {
          let value: unknown
          try { value = JSON.parse(payload.toString('utf8')) } catch { return reply(res, 400, 'Invalid JSON') }
          if (!value || typeof value !== 'object' || Array.isArray(value)) return reply(res, 400, 'Invalid body')
          const fields = value as Record<string, unknown>
          if (path === '/api/sessions' && Object.keys(fields).some(key => key !== 'title')) return reply(res, 400, 'Invalid session fields')
          if (req.method === 'PATCH' && (typeof fields.title !== 'string' || !fields.title.trim() || fields.title.length > 160 || Object.keys(fields).some(key => key !== 'title'))) return reply(res, 400, 'Invalid title')
          if (path.endsWith('/chat/stream') && (typeof fields.input !== 'string' || !fields.input.trim() || fields.input.length > 32_000 || Object.keys(fields).some(key => key !== 'input'))) return reply(res, 400, 'Invalid prompt')
        }
        const upstream = new URL(path.slice(1) + url.search, profile.upstream)
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), path.endsWith('/chat/stream') ? 30 * 60_000 : 30_000)
        req.on('close', () => { if (!req.complete) controller.abort() })
        res.on('close', () => controller.abort())
        try {
          const response = await fetch(upstream, { method: req.method, headers: { authorization: `Bearer ${profile.key}`, accept: path.endsWith('/chat/stream') ? 'text/event-stream' : 'application/json', ...(payload?.length ? { 'content-type': 'application/json' } : {}) }, body: payload?.length ? payload : undefined, signal: controller.signal, redirect: 'manual' })
          if (response.status >= 300 && response.status < 400) return reply(res, 502, 'Unexpected upstream redirect')
          const contentType = path.endsWith('/chat/stream') && response.ok ? 'text/event-stream; charset=utf-8' : 'application/json; charset=utf-8'
          res.writeHead(response.status, { 'content-type': contentType, 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' })
          if (response.body) await new Promise<void>((done, fail) => { const stream = Readable.fromWeb(response.body as never); stream.on('error', fail); res.on('close', done); stream.pipe(res).on('finish', done).on('error', fail) })
          else res.end()
        } finally { clearTimeout(timer) }
      } catch (error) {
        if (!res.headersSent) reply(res, error instanceof Error && error.message === 'Request body too large' ? 413 : 502, 'Upstream unavailable')
        else res.destroy()
      }
      return
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') return reply(res, 404, 'Not found')
    if (!existsSync(dist)) return reply(res, 503, 'Build not available')
    const path = url.pathname === '/' ? '/index.html' : url.pathname
    const file = resolve(dist, '.' + path)
    const safe = file === dist || file.startsWith(dist + sep)
    const asset = safe && existsSync(file) && statSync(file).isFile()
    const document = !extname(path) && (req.headers.accept || '').includes('text/html')
    const target = asset ? file : document ? resolve(dist, 'index.html') : ''
    if (!target || !existsSync(target)) return reply(res, 404, 'Not found')
    res.writeHead(200, { 'content-type': types[extname(target)] || 'application/octet-stream', 'cache-control': target.endsWith('index.html') || target.endsWith('sw.js') ? 'no-cache' : 'public, max-age=31536000, immutable' })
    if (req.method === 'HEAD') res.end(); else createReadStream(target).pipe(res)
  })
  server.requestTimeout = 30_000
  server.headersTimeout = 10_000
  return server
}
