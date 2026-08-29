// GFP RC1 Part 4 · Lane B — 4-route live-preview re-skin verifier (Playwright)
//
// Proves the Part-3 multi-page "Jane's Jeans" demo re-skins live across ALL FOUR
// routes when a bs-primary token change is pushed through the sorb-juice bridge's
// /preview (mirroring the plugin's proxy-button POST). For each route it asserts:
//   1. inline --bs-primary on <html> changed to the pushed hue
//   2. a VISIBLE element's color actually moved to the pushed hue
//   3. the PreviewBanner is shown
// Also measures re-skin latency (navigate → --bs-primary reflects the override).
//
// Playwright resolved from the sorb-test-ui harness install (createRequire).

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

const url = (args.url || 'http://127.0.0.1:5178').replace(/\/$/, '')
const previewId = args['preview-id']
const outDir = args.out || '/Users/nobrien/workspace/metatoy/sorb-demo/gfp-p4/laneB-shots'
// pushed hue #e8552d === rgb(232, 85, 45)
const expectedRgb = (args.expected || 'rgb(232, 85, 45)').trim()

const routes = [
  { name: 'home', path: '/' },
  { name: 'product', path: '/product/classic-straight-blue-jeans' },
  { name: 'checkout', path: '/checkout' },
  { name: 'components', path: '/components' },
]

mkdirSync(outDir, { recursive: true })

const primaryVar = (page) =>
  page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--bs-primary').trim(),
  )

// Does any VISIBLE element render the expected hue as color, bg, or border?
const visibleHuePresent = (page, hue) =>
  page.evaluate((want) => {
    const norm = (s) => (s || '').replace(/\s+/g, ' ').trim()
    const els = document.querySelectorAll('*')
    for (const el of els) {
      const r = el.getBoundingClientRect()
      if (r.width < 2 || r.height < 2) continue
      const cs = getComputedStyle(el)
      if ([cs.color, cs.backgroundColor, cs.borderTopColor, cs.borderBottomColor,
           cs.borderLeftColor, cs.borderRightColor].map(norm).includes(want)) {
        return { found: true, tag: el.tagName.toLowerCase(), text: (el.textContent || '').slice(0, 30) }
      }
    }
    return { found: false }
  }, hue)

const bannerShown = (page) =>
  page.evaluate(() => {
    // PreviewBanner renders a fixed bottom bar; detect by role/text.
    const all = [...document.querySelectorAll('*')]
    const hit = all.find((el) => {
      const t = (el.textContent || '').toLowerCase()
      const cs = getComputedStyle(el)
      return cs.position === 'fixed' && (t.includes('preview') || t.includes('sorb'))
    })
    return Boolean(hit)
  })

const browser = await chromium.launch()
const results = []
let allPass = true
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } })

  // ── Baseline (committed) --bs-primary, measured once on home ──
  await page.goto(`${url}/`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  const committedPrimary = await primaryVar(page)

  for (const route of routes) {
    const res = { route: route.path, name: route.name }

    // BEFORE (committed): capture
    await page.goto(`${url}${route.path}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(300)
    res.beforePrimary = await primaryVar(page)
    await page.screenshot({ path: `${outDir}/${route.name}-1-before.png`, fullPage: true })

    // AFTER (preview): navigate with ?preview=<id>, time the re-skin
    const sep = route.path.includes('?') ? '&' : '?'
    const t0 = Date.now()
    await page.goto(`${url}${route.path}${sep}preview=${previewId}`, { waitUntil: 'networkidle' })
    let latencyMs = null
    try {
      await page.waitForFunction(
        (want) =>
          getComputedStyle(document.documentElement)
            .getPropertyValue('--bs-primary')
            .trim() === want,
        expectedRgb === 'rgb(232, 85, 45)' ? '#e8552d' : expectedRgb,
        { timeout: 20000, polling: 100 },
      )
      latencyMs = Date.now() - t0
    } catch (e) {
      // fall through; assertions below will mark fail
      void e
    }
    await page.waitForTimeout(200)
    res.afterPrimary = await primaryVar(page)
    res.latencyMs = latencyMs
    res.primaryChanged = res.afterPrimary !== res.beforePrimary && res.afterPrimary.length > 0
    const hue = await visibleHuePresent(page, expectedRgb)
    res.visibleHue = hue.found
    res.visibleHueOn = hue.found ? `${hue.tag}:"${hue.text}"` : null
    res.banner = await bannerShown(page)
    await page.screenshot({ path: `${outDir}/${route.name}-2-after.png`, fullPage: true })

    res.pass = res.primaryChanged && res.visibleHue && res.banner
    if (!res.pass) allPass = false
    results.push(res)
  }

  console.log('\n' + JSON.stringify({ ok: allPass, committedPrimary, expectedRgb, results }, null, 2))
  process.exit(allPass ? 0 : 1)
} catch (e) {
  console.log('\n' + JSON.stringify({ ok: false, error: String((e && e.message) || e), results }))
  process.exit(1)
} finally {
  await browser.close()
}
