import { cp, mkdir } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { homedir } from 'node:os'
import { parseArgs } from 'node:util'
import { spawnSync } from 'node:child_process'

const { values, positionals } = parseArgs({ options: { python: { type: 'string' } }, allowPositionals: true })
if (positionals.length > 1 || values.python === '') throw new Error('Usage: npm run install:plugin -- [plugins-directory] [--python dashboard-python]')
// Never guess from PATH: a shell Python may differ from the dashboard runtime.
const python = values.python ? resolve(values.python) : undefined
const imports = 'from pywebpush import webpush; from py_vapid import Vapid'
if (python && spawnSync(python, ['-c', 'import sys'], { stdio: 'ignore' }).status !== 0) {
  throw new Error('Cannot execute --python; provide the Python executable that starts the dashboard.')
}
const targetRoot = resolve(positionals[0] || join(process.env.HERMES_HOME || join(homedir(), '.hermes'), 'plugins'))
const target = join(targetRoot, 'chathermes')
await mkdir(targetRoot, { recursive: true })
await cp(new URL('../plugin/chathermes/', import.meta.url), target, { recursive: true, force: true })
console.log(`Copied ChatHermes plugin to ${target}`)
if (python) {
  const useUv = spawnSync('uv', ['--version'], { stdio: 'ignore' }).status === 0
  const result = useUv
    ? spawnSync('uv', ['pip', 'install', '--python', python, target], { stdio: 'inherit' })
    : spawnSync(python, ['-m', 'pip', 'install', target], { stdio: 'inherit' })
  if (result.status !== 0) throw new Error('Python dependency installation failed; plugin files were copied. Fix the runtime and retry before restarting the dashboard.')
  // Check delivery as well as VAPID in the selected runtime; do not create state.
  if (spawnSync(python, ['-c', imports], { stdio: 'ignore' }).status !== 0) {
    throw new Error('Push dependency verification failed in the selected dashboard runtime.')
  }
  console.log(`Verified push dependencies in ${python}`)
} else {
  console.log('This copy-only installer does not install Python dependencies. Before restarting, run:')
  const quotedTarget = "'" + target.replaceAll("'", "'\\''") + "'"
  console.log(`uv pip install --python /absolute/path/to/hermes/.venv/bin/python ${quotedTarget}`)
  console.log('Or rerun this installer with --python /absolute/path/to/dashboard/python.')
}
console.log('Add "chathermes" to plugins.enabled in config.yaml, then restart the dashboard.')
