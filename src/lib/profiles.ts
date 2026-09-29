import type { Profile } from '../types/hermes'

const storageKey = 'chathermes.profiles.v1'
const idPattern = /^[A-Za-z0-9_-]+$/

export function normalizeBaseUrl(input: string): string {
  const raw = input.trim()
  if (!raw || /[\\\s]/.test(raw)) throw new Error('Enter a valid Hermes base URL.')
  const rawPath = raw.match(/^https?:\/\/[^/?#]+(\/[^?#]*)?/i)?.[1] || '/'
  if (rawPath !== '/' && !/^\/p\/[A-Za-z0-9_-]+\/?$/.test(rawPath)) throw new Error('Use the Hermes root or a /p/<profile>/ base path.')
  let url: URL
  try { url = new URL(raw) } catch { throw new Error('Enter a valid Hermes base URL.') }
  if (url.username || url.password || url.search || url.hash) throw new Error('URL credentials, query strings, and fragments are not allowed.')
  const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname.toLowerCase())
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && loopback)) throw new Error('Use HTTPS for remote endpoints. HTTP is allowed only on localhost.')
  if (!['/', ''].includes(url.pathname) && !/^\/p\/[A-Za-z0-9_-]+\/?$/.test(url.pathname)) throw new Error('Use the Hermes root or a /p/<profile>/ base path.')
  return `${url.origin}${url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`}`
}

function validProfile(value: unknown): value is Profile {
  if (!value || typeof value !== 'object') return false
  const p = value as Record<string, unknown>
  if (typeof p.id !== 'string' || !idPattern.test(p.id) || typeof p.label !== 'string' || !p.label.trim() || typeof p.key !== 'string' || !p.key.trim() || /[\r\n]/.test(p.key) || typeof p.baseUrl !== 'string') return false
  try { return normalizeBaseUrl(p.baseUrl) === p.baseUrl } catch { return false }
}

export function loadProfiles(): Profile[] {
  const raw = localStorage.getItem(storageKey)
  if (!raw) return []
  let parsed: unknown
  try { parsed = JSON.parse(raw) } catch { throw new Error('Saved profiles are invalid. Clear this site’s storage to reset them.') }
  if (!Array.isArray(parsed) || !parsed.every(validProfile) || new Set(parsed.map(p => p.id)).size !== parsed.length) throw new Error('Saved profiles are invalid. Clear this site’s storage to reset them.')
  return parsed
}
export function saveProfiles(profiles: Profile[]): void { localStorage.setItem(storageKey, JSON.stringify(profiles)) }
export function createProfile(label: string, baseUrl: string, key: string): Profile {
  if (!label.trim()) throw new Error('Enter a profile label.')
  if (!key.trim() || /[\r\n]/.test(key)) throw new Error('Enter a valid API key.')
  return { id: crypto.randomUUID().replace(/-/g, ''), label: label.trim(), baseUrl: normalizeBaseUrl(baseUrl), key: key.trim() }
}
export function updateProfile(profile: Profile, label: string, baseUrl: string, key: string): Profile {
  if (!label.trim()) throw new Error('Enter a profile label.')
  if (/[\r\n]/.test(key)) throw new Error('Enter a valid API key.')
  const normalizedUrl = normalizeBaseUrl(baseUrl)
  if (!key.trim() && normalizedUrl !== profile.baseUrl) throw new Error('Enter a new API key when changing the Hermes base URL.')
  return { ...profile, label: label.trim(), baseUrl: normalizedUrl, key: key.trim() || profile.key }
}
export function getProfile(id: string): Profile {
  const profile = loadProfiles().find(p => p.id === id)
  if (!profile) throw new Error('Profile is no longer configured.')
  return profile
}
