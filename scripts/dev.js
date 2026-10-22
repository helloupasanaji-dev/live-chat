import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const viteCli = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js')
const processes = [
  spawn(process.execPath, [path.join(root, 'server.js')], { cwd: root, stdio: 'inherit' }),
  spawn(process.execPath, [viteCli], { cwd: root, stdio: 'inherit' }),
]

let stopping = false
function stop() {
  if (stopping) return
  stopping = true
  for (const child of processes) if (!child.killed) child.kill()
}
for (const child of processes) child.on('exit', code => { if (code && code !== 0) process.exitCode = code; stop() })
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
