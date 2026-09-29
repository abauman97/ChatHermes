export interface Profile { id: string; label: string; upstream: URL; key: string }
const idPattern = /^[a-zA-Z0-9_-]{1,64}$/
export function loadProfiles(raw = process.env.CHATHERMES_PROFILES_JSON): Profile[] {
  if (!raw) return []
  let parsed: unknown
  try { parsed = JSON.parse(raw) } catch { throw new Error('Invalid profile configuration') }
  if (!Array.isArray(parsed)) throw new Error('Invalid profile configuration')
  const ids = new Set<string>()
  const keys = new Set<string>()
  return parsed.map((item: unknown) => {
    if (!item || typeof item !== 'object') throw new Error('Invalid profile configuration')
    const row = item as Record<string, unknown>
    if (typeof row.id !== 'string' || !idPattern.test(row.id) || ids.has(row.id) || typeof row.label !== 'string' || !row.label.trim() || typeof row.key !== 'string' || !row.key.trim() || typeof row.url !== 'string') throw new Error('Invalid profile configuration')
    let upstream: URL
    try { upstream = new URL(row.url) } catch { throw new Error('Invalid profile URL') }
    if (upstream.protocol !== 'http:' || !['127.0.0.1', 'localhost', '[::1]'].includes(upstream.hostname) || upstream.username || upstream.password || upstream.search || upstream.hash || !(/^\/$|^\/p\/[a-zA-Z0-9_-]{1,64}\/$/.test(upstream.pathname))) throw new Error('Profile URL must be a loopback Hermes root or profile prefix')
    if (keys.has(row.key)) throw new Error('Profile bearer keys must be distinct')
    keys.add(row.key)
    ids.add(row.id)
    return { id: row.id, label: row.label, key: row.key, upstream }
  })
}
export function publicProfiles(profiles: Profile[]) { return profiles.map(({ id, label }) => ({ id, label })) }
