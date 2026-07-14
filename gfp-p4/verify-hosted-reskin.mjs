// GFP RC1 Part 4 · B3 — hosted "Try the live demo" re-skin gate assertion.
//
// Loads the DEPLOYED Jane's Jeans demo with the hosted preview id (the one the
// plugin's "Try the live demo" button opens: DEMO_APP + ?preview=DEMO_PREVIEW_ID)
// and PROVES the store actually re-skins — not just that the banner lights.
// This is the guard against the B1 regression (a preview whose token vocabulary
// doesn't intersect the app's --bs-* namespace lights the banner with zero visual
// effect). Run it in the Part-4 P3 lock gate before the founder-demo dry-run.
//
//   node gfp-p4/verify-hosted-reskin.mjs
//   node gfp-p4/verify-hosted-reskin.mjs --id <previewId> --app https://demo.sorbcloud.com
//
// PASS = --bs-primary moves OFF the denim baseline (#2f5c9e) on every checked
// route AND the banner is present. Exit 0 on PASS, 1 on FAIL (CI-friendly).

import { createRequire } from 'node:module'
const require = createRequire('/Users/nobrien/workspace/metatoy/sorb-test-ui/node_modules/')
const { chromium } = require('playwright')

const args = Object.fromEntries(
  process.argv.slice(2).reduce((a, v, i, arr) => {
    if (v.startsWith('--')) a.push([v.slice(2), arr[i + 1]])
    return a
  }, [])
)
const APP = args.app || 'https://demo.sorbcloud.com'
const PREVIEW_ID = args.id || 'uUMw0sOr' // DEMO_PREVIEW_ID (sorb-canopy/ui.html) — bs-* preview
const DENIM = '#2f5c9e' // committed baseline --bs-primary
const ROUTES = ['/', '/product/classic-straight-blue-jeans', '/checkout', '/components']

const norm = (c) => (c || '').trim().toLowerCase()
const b = await chromium.launch()
const rows = []
for (const route of ROUTES) {
  const p = await b.newPage()
  const url = `${APP}${route}${route.includes('?') ? '&' : '?'}preview=${PREVIEW_ID}`
  await p.goto(url, { waitUntil: 'networkidle' })
  // give the SDK a beat to fetch + applyTokens
  await p.waitForTimeout(1200)
  const primary = norm(
    await p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--bs-primary'))
  )
  const banner = await p.evaluate(() =>
    !!document.body.textContent && /preview active/i.test(document.body.textContent)
  )
  const changed = primary && primary !== norm(DENIM)
  rows.push({ route, primary, banner, changed, pass: changed && banner })
  await p.close()
}
await b.close()

const pass = rows.every((r) => r.pass)
console.log(`hosted re-skin gate — app=${APP} preview=${PREVIEW_ID}`)
for (const r of rows) {
  console.log(
    `  ${r.pass ? 'PASS' : 'FAIL'}  ${r.route}  --bs-primary=${r.primary || '(unset)'}  banner=${r.banner}  moved-off-denim=${r.changed}`
  )
}
console.log(pass ? 'GATE: PASS ✅ (hosted preview re-skins the store)' : 'GATE: FAIL ❌')
process.exit(pass ? 0 : 1)
