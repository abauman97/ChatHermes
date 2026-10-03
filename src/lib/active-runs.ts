// Persist only the run pointer. Transcript, attachments and credentials stay out
// of browser storage; Hermes history and event replay rebuild the conversation.
const memory = new Map<string, string>()
const key = (profile: string, session: string) => 'chathermes.run.v1:' + JSON.stringify([profile || 'default', session])

export function activeRunFor(profile: string, session: string): string {
  const name = key(profile, session)
  try { return localStorage.getItem(name) || '' } catch { return memory.get(name) || '' }
}

export function idempotencyKeyFor(profile: string, session: string): string {
  const name = key(profile, session), storage = 'chathermes.run-idempotency.v1:' + JSON.stringify([profile || 'default', session])
  try { return localStorage.getItem(storage) || memory.get('idem:' + name) || '' } catch { return memory.get('idem:' + name) || '' }
}

export function rememberIdempotencyKey(profile: string, session: string, value: string) {
  const name = key(profile, session), storage = 'chathermes.run-idempotency.v1:' + JSON.stringify([profile || 'default', session])
  memory.set('idem:' + name, value)
  try { localStorage.setItem(storage, value) } catch { /* Best effort persistence. */ }
}

export function rememberRun(profile: string, session: string, run: string) {
  const name = key(profile, session)
  memory.set(name, run)
  try { localStorage.setItem(name, run) } catch { /* This mount can still reconnect. */ }
}

export function forgetRun(profile: string, session: string, run: string) {
  const name = key(profile, session)
  if (activeRunFor(profile, session) !== run) return
  memory.delete(name)
  memory.delete('idem:' + name)
  try { localStorage.removeItem(name) } catch { /* Best effort cleanup. */ }
  try { localStorage.removeItem('chathermes.run-idempotency.v1:' + JSON.stringify([profile || 'default', session])) } catch { /* Best effort cleanup. */ }
}

// Replay cursors belong to the live transcript. A fresh viewer replays from -1.
