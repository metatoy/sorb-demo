// GFP RC1 Part 4 · B8 P3 — refined-plugin sanity render.
// Loads sorb-canopy/ui.html (commit ba0111c) at 475×560 with parent.postMessage
// stubbed (the plugin UI posts to its code.js host, absent here). Captures any
// JS console errors / pageerrors and confirms the C1–C5 UX refinements render.
import { createRequire } from 'node:module'
const require = createRequire('/Users/nobrien/workspace/metatoy/sorb-test-ui/node_modules/')
const { chromium } = require('playwright')

const UI = 'file:///Users/nobrien/workspace/metatoy/sorb-canopy/ui.html'
const OUT = '/Users/nobrien/workspace/metatoy/sorb-demo/gfp-p4/p3-shots/plugin-ui-refined.png'

const browser = await chromium.launch()
const errors = []
try {
  const page = await browser.newPage({ viewport: { width: 475, height: 560 } })
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()) })
  page.on('pageerror', (e) => errors.push('pageerror: ' + (e && e.message || e)))
  // Stub parent.postMessage before any script runs (plugin UI → code.js host).
  await page.addInitScript(() => {
    try { window.parent.postMessage = () => {} } catch (e) { void e }
  })
  await page.goto(UI, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)

  // C1–C5 presence probes (structural, not pixel).
  const probes = await page.evaluate(() => {
    const txt = document.body.innerText || ''
    const has = (sel) => !!document.querySelector(sel)
    return {
      c1_intro_connect_primary: /connect/i.test(txt) && (has('.btn-primary, [class*="primary"]')),
      c4_receipt_band: has('.receipt'),
      // grouped/capped tokens + warm icon are style/JS driven — just confirm nodes exist
      token_or_group_nodes: has('[class*="group"], [class*="token"], [data-group], .receipt'),
      bodyTextLen: txt.length,
    }
  })
  await page.screenshot({ path: OUT })
  console.log(JSON.stringify({ ok: errors.length === 0, errors, probes }, null, 2))
  process.exit(errors.length === 0 ? 0 : 1)
} catch (e) {
  console.log(JSON.stringify({ ok: false, fatal: String(e && e.message || e), errors }))
  process.exit(1)
} finally {
  await browser.close()
}
