// Persist only the run pointer. Transcript, attachments and credentials stay out
// of browser storage; Hermes history and event replay rebuild the conversation.
const memory = new Map<string, string>()
const key = (profile: string, session: string) => 'chathermes.run.v1:' + JSON.stringify([profile || 'default', session])
export function activeRunFor(profile: string, session: string): string {
  const name = key(profile, session)
  try { return localStorage.getItem(name) || '' } catch { return memory.get(name) || '' }
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
  try { localStorage.removeItem(name) } catch { /* Storage may be unavailable. */ }
}
