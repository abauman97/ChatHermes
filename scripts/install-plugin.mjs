import { cp, mkdir } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { homedir } from 'node:os'

const targetRoot = resolve(process.argv[2] || join(process.env.HERMES_HOME || join(homedir(), '.hermes'), 'plugins'))
const target = join(targetRoot, 'chathermes')
await mkdir(targetRoot, { recursive: true })
await cp('plugin/chathermes', target, { recursive: true, force: true })
console.log(`Installed ChatHermes plugin at ${target}`)
console.log('This copy-only installer does not install Python dependencies. Before restarting, run:')
const quotedTarget = "'" + target.replaceAll("'", "'\\''") + "'"
console.log(`uv pip install --python /absolute/path/to/hermes/.venv/bin/python ${quotedTarget}`)
console.log('Add "chathermes" to plugins.enabled in config.yaml, then restart the dashboard.')
