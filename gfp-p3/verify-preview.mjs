// P3 · live-preview re-skin verifier (Playwright)
//
// Loads the running sorb-demo consumer app three ways and proves a Sorb bridge
// preview re-skins it live:
//   1. committed  — /                    (no ?preview) → baseline computed style
//   2. preview    — /?preview=<id>        → the overridden token re-skins live
//   3. revert     — /                     → back to the committed value
//
// Asserts the primary Button's computed backgroundColor actually changes to the
// pushed override and reverts, and screenshots each state. Emits a JSON result
// on the last stdout line so the shell orchestrator can gate on it.
//
// Playwright is resolved from the sorb-test-ui harness install (createRequire),
// so this script needs no node_modules of its own.

import { createRequire } from 'node:module'
import { mkdirSync } from 'node:fs'

const require = createRequire('/Users/nobrien/workspace/metatoy/sorb-test-ui/node_modules/')
const { chromium } = require('playwright')

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...v] = a.replace(/^--/, '').split('=')
    return [k, v.join('=')]
  }),
)

const url = (args.url || 'http://localhost:5178').replace(/\/$/, '')
const previewId = args['preview-id']
const outDir = args.out || '/Users/nobrien/workspace/metatoy/spec/sorb/gfp/p3/shots'
const expected = (args.expected || 'rgb(255, 0, 0)').trim()
const selector = 'button[data-variant="primary"]:not([disabled])'

mkdirSync(outDir, { recursive: true })

const fail = (msg, extra = {}) => {
  console.log('\n' + JSON.stringify({ ok: false, error: msg, ...extra }))
  process.exit(1)
}

const bgOf = (page) =>
  page.$eval(selector, (el) => getComputedStyle(el).backgroundColor)

const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 1100, height: 900 } })

  // ── 1. committed baseline (no preview) ──
  await page.goto(`${url}/`, { waitUntil: 'networkidle' })
  await page.waitForSelector(selector, { timeout: 15000 })
  const committed = await bgOf(page)
  await page.screenshot({ path: `${outDir}/1-committed.png`, fullPage: false })

  // ── 2. preview active — wait until the poll applies the override ──
  await page.goto(`${url}/?preview=${previewId}`, { waitUntil: 'networkidle' })
  await page.waitForSelector(selector, { timeout: 15000 })
  try {
    await page.waitForFunction(
      ({ sel, was }) => {
        const el = document.querySelector(sel)
        return el && getComputedStyle(el).backgroundColor !== was
      },
      { sel: selector, was: committed },
      { timeout: 15000 },
    )
  } catch (e) {
    const now = await bgOf(page)
    fail('preview did not re-skin the button within 15s', { committed, previewValue: now })
  }
  const previewValue = await bgOf(page)
  await page.screenshot({ path: `${outDir}/2-preview.png`, fullPage: false })

  // ── 3. revert (no preview again) ──
  await page.goto(`${url}/`, { waitUntil: 'networkidle' })
  await page.waitForSelector(selector, { timeout: 15000 })
  const reverted = await bgOf(page)
  await page.screenshot({ path: `${outDir}/3-reverted.png`, fullPage: false })

  // ── assertions ──
  const changed = previewValue !== committed
  const isExpected = previewValue === expected
  const revertsOk = reverted === committed
  const ok = changed && isExpected && revertsOk

  console.log('\n' + JSON.stringify(
    { ok, committed, previewValue, reverted, expected, changed, isExpected, revertsOk,
      shots: { committed: `${outDir}/1-committed.png`, preview: `${outDir}/2-preview.png`, reverted: `${outDir}/3-reverted.png` } },
  ))
  process.exit(ok ? 0 : 1)
} catch (e) {
  fail(String((e && e.message) || e))
} finally {
  await browser.close()
}
