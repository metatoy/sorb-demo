import { createRequire } from 'node:module'
const require = createRequire('/Users/nobrien/workspace/metatoy/sorb-test-ui/node_modules/')
const { chromium } = require('playwright')
const browser = await chromium.launch()
const failed = []
try {
  const page = await browser.newPage({ viewport: { width: 475, height: 560 } })
  page.on('requestfailed', (r) => failed.push(r.url() + ' :: ' + (r.failure() && r.failure().errorText)))
  page.on('response', (r) => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url()) })
  await page.addInitScript(() => { try { window.parent.postMessage = () => {} } catch (e) { void e } })
  await page.goto('file:///Users/nobrien/workspace/metatoy/sorb-canopy/ui.html', { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  console.log(JSON.stringify({ failed }, null, 2))
} finally { await browser.close() }
