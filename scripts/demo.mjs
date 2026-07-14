// GFP RC1 Part 4 · B5 — one-command local demo launcher for sorb-demo.
//
// `npm run demo` boots the whole local designer money-moment with a SINGLE
// command — no more standing up three server legs by hand (friction #1 in the
// part-4a gate report). It:
//
//   1. builds tokens (Style Dictionary) so .sorb/resolved.json + token CSS exist
//   2. starts the `sorb dev` juice bridge AND the vite app concurrently, with
//      clearly-prefixed [bridge]/[app] logs
//   3. WAITS until both are actually ready (polls the bridge /health and the
//      vite URL — never a blind sleep) then prints a banner with the URLs and a
//      copy-paste curl that pushes a live preview
//   4. cleans up on Ctrl-C (SIGINT/SIGTERM) — kills both children, no orphans
//
// Dependency-free: Node built-ins + the repo's own bins (sorb, vite). JS only.

import { spawn, spawnSync } from 'node:child_process'
import { connect } from 'node:net'
import { get } from 'node:http'
import { existsSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// Bridge port comes from sorb.config.json (single source of truth); the vite app
// uses the conventional dev port. Both bind to 127.0.0.1/localhost.
const config = JSON.parse(readFileSync(resolve(ROOT, 'sorb.config.json'), 'utf8'))
const BRIDGE_PORT = config.port ?? 7777
const APP_PORT = 5173
const BRIDGE_ORIGIN = `http://localhost:${BRIDGE_PORT}`
const APP_URL = `http://localhost:${APP_PORT}`
const READY_TIMEOUT_MS = 60000

// Keep PATH sane regardless of how npm invokes us (part-4a PATH-fix).
const env = {
  ...process.env,
  PATH: `/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/opt/homebrew/bin:${process.env.PATH || ''}`,
}

const c = {
  bridge: (s) => `\x1b[36m[bridge]\x1b[0m ${s}`, // cyan
  app: (s) => `\x1b[35m[app]\x1b[0m ${s}`, // magenta
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
}

// ── helpers ──────────────────────────────────────────────────────────

// Is something already listening on <host>:<port>?
const portInUse = (port, host = '127.0.0.1') =>
  new Promise((res) => {
    const sock = connect({ host, port })
    const done = (inUse) => {
      sock.destroy()
      res(inUse)
    }
    sock.setTimeout(800)
    sock.once('connect', () => done(true))
    sock.once('timeout', () => done(false))
    sock.once('error', () => done(false))
  })

// GET <url> → resolves the HTTP status code (0 if the connection failed).
const httpStatus = (url) =>
  new Promise((res) => {
    const req = get(url, (r) => {
      r.resume() // drain
      res(r.statusCode || 0)
    })
    req.setTimeout(1500, () => req.destroy())
    req.once('error', () => res(0))
  })

// Poll <url> until it returns a 2xx/3xx/4xx (i.e. the server answered), or time out.
const waitForHttp = async (url, label, timeoutMs) => {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    if (dead) return false
    const code = await httpStatus(url)
    if (code >= 200 && code < 500) return true
    await sleep(300)
  }
  return false
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Pipe a child's stdout/stderr line-by-line through a prefixer.
const pipePrefixed = (child, prefix) => {
  for (const stream of [child.stdout, child.stderr]) {
    let buf = ''
    stream.setEncoding('utf8')
    stream.on('data', (chunk) => {
      buf += chunk
      const lines = buf.split('\n')
      buf = lines.pop() // keep the partial last line
      for (const line of lines) if (line.trim()) console.log(prefix(line))
    })
  }
}

// ── lifecycle ────────────────────────────────────────────────────────

let dead = false
const children = []

const shutdown = (signal) => {
  if (dead) return
  dead = true
  console.log('\n' + c.dim(`── shutting down (${signal}) — stopping bridge + app ──`))
  for (const child of children) {
    if (child && child.exitCode === null) {
      try {
        child.kill('SIGINT') // sorb dev cleans up store/db on SIGINT
      } catch (e) {
        void e
      }
    }
  }
  // Belt-and-suspenders: after a grace period, force-kill anything still up.
  setTimeout(() => {
    for (const child of children) {
      if (child && child.exitCode === null) {
        try {
          child.kill('SIGKILL')
        } catch (e) {
          void e
        }
      }
    }
    process.exit(0)
  }, 2500).unref()
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

const fail = (msg) => {
  console.error('\n' + c.red('✗ ' + msg) + '\n')
  shutdown('error')
  process.exitCode = 1
}

// ── run ──────────────────────────────────────────────────────────────

const main = async () => {
  console.log(c.bold('\nSorb demo launcher') + c.dim('  (one command → tokens + bridge + app)\n'))

  // 1 · preflight — refuse to trample a port that's already taken.
  for (const [port, host, name] of [
    [BRIDGE_PORT, '127.0.0.1', 'bridge (sorb dev)'],
    [APP_PORT, 'localhost', 'vite app'],
  ]) {
    if (await portInUse(port, host)) {
      return fail(
        `port ${port} is already in use (needed for the ${name}). ` +
          `Stop whatever is listening there and re-run \`npm run demo\`.`,
      )
    }
  }

  // 2 · build tokens (Style Dictionary) → .sorb/resolved.json + token CSS.
  console.log(c.dim('→ building tokens (npm run tokens)…'))
  const tokens = spawnSync('npm', ['run', 'tokens'], { cwd: ROOT, env, stdio: 'inherit' })
  if (tokens.status !== 0) return fail('`npm run tokens` failed — cannot start the demo.')
  for (const artifact of ['.sorb/resolved.json', 'src/tokens/generated/variables.css']) {
    if (!existsSync(resolve(ROOT, artifact))) {
      return fail(`expected token artifact missing after build: ${artifact}`)
    }
  }
  console.log(c.green('✓ tokens built') + c.dim('  (.sorb/resolved.json + token CSS)\n'))

  // 3 · start the bridge + app concurrently, prefixing their logs.
  const bridge = spawn(resolve(ROOT, 'node_modules/.bin/sorb'), ['dev'], { cwd: ROOT, env })
  const app = spawn(
    resolve(ROOT, 'node_modules/.bin/vite'),
    ['--port', String(APP_PORT), '--strictPort'],
    { cwd: ROOT, env },
  )
  children.push(bridge, app)

  pipePrefixed(bridge, c.bridge)
  pipePrefixed(app, c.app)

  // If either leg dies before we're ready, bail loudly.
  for (const [child, name] of [
    [bridge, 'bridge'],
    [app, 'app'],
  ]) {
    child.once('exit', (code) => {
      if (!dead) fail(`the ${name} process exited early (code ${code}). See its logs above.`)
    })
  }

  // 4 · wait until BOTH actually answer — poll, never sleep-and-hope.
  console.log(c.dim('→ waiting for the bridge and app to come up…'))
  // Bridge binds explicitly to 127.0.0.1; vite binds to `localhost` (may be IPv6
  // ::1) — poll each at the host it actually listens on.
  const [bridgeReady, appReady] = await Promise.all([
    waitForHttp(`http://127.0.0.1:${BRIDGE_PORT}/health`, 'bridge', READY_TIMEOUT_MS),
    waitForHttp(`${APP_URL}/`, 'app', READY_TIMEOUT_MS),
  ])
  if (dead) return
  if (!bridgeReady) return fail(`bridge did not answer /health within ${READY_TIMEOUT_MS / 1000}s.`)
  if (!appReady) return fail(`app did not answer within ${READY_TIMEOUT_MS / 1000}s.`)

  // 5 · the banner.
  const W = 52
  const bar = '─'.repeat(W)
  // pad a plain (ANSI-free) string to the interior width, then wrap in borders.
  const row = (text) => c.green('│ ') + text.padEnd(W - 1) + c.green('│')
  const pushCurl =
    `curl -X POST ${BRIDGE_ORIGIN}/preview -H 'content-type: text/plain' ` +
    `--data '{"bs-primary":"#e8552d","bs-primary-rgb":"232,85,45"}'`
  console.log('')
  console.log(c.green('┌' + bar + '┐'))
  console.log(row('Sorb demo is live 🌱'))
  console.log(c.green('├' + bar + '┤'))
  console.log(row(`App     ${APP_URL}`))
  console.log(row(`Bridge  ${BRIDGE_ORIGIN}`))
  console.log(c.green('└' + bar + '┘'))
  console.log('')
  console.log(c.bold('  Push a live preview:'))
  console.log('    ' + c.dim(pushCurl))
  console.log('')
  console.log('  The POST returns ' + c.dim('{"id":"<id>","url":"?preview=<id>"}') + ' — then open')
  console.log('    ' + c.dim(`${APP_URL}/?preview=<id>`) + '  and watch the app re-skin live.')
  console.log('')
  console.log(c.dim('  Press Ctrl-C to stop the bridge and the app.\n'))
}

main().catch((e) => fail(String((e && e.message) || e)))
