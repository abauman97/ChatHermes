import { createAppServer } from './hermes-proxy.ts'
import { loadProfiles } from './profiles.ts'
const port = Number(process.env.CHATHERMES_PORT || 8787)
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid port')
createAppServer(loadProfiles()).listen(port, '127.0.0.1', () => { process.stdout.write(`ChatHermes listening on http://127.0.0.1:${port}\n`) })
