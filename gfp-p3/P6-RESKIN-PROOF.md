# GFP RC1 Part 3 · P6 — cross-page re-skin proof (Jane's Jeans)

**Verdict: the one-token cross-page re-skin PASSED.** A single `--bs-primary` push on the
running app re-skins all four routes at once, in coordination, with zero code change and no
reload — while the semantic palette holds.

> GFP Part 3 demo store: 4 routes, 100% token-bound, live-re-skin proven.

## The mechanism
One inline CSS custom property on the live document root — exactly the `@sorb/leaf` preview path:

```js
document.documentElement.style.setProperty('--bs-primary', '#c2582f')
```

The committed Jane's Jeans brand *is* the `--bs-*` set (`sorbBsTheme` → `BootstrapStyledProvider`
emits `--bs-*` on the stylesheet `:root`). An inline `:root` write beats the stylesheet `:root`
rule by specificity, so every bootstrap-styled component **and** every custom shell surface
(navbar, footer, hero, section chrome, eyebrows, price emphasis) moves together. No change to
`@metatoy/bootstrap-styled`, no adapter in `@sorb/leaf`, no per-page edit.

**Persistence proof:** the token was pushed **once** on `/`, then the other three routes were
reached via **in-app SPA navigation** (clicking real `<Link>`s — product card → nav Cart → nav
Components), never a reload. The inline override survived every route change
(resolved `--bs-primary` read back as `#c2582f` on all four pages).

## Token(s) pushed
| Token | Before (denim) | After (re-skin) |
|---|---|---|
| `--bs-primary` | `#2f5c9e` (denim indigo) | `#c2582f` (terracotta) |
| `--bs-primary-rgb` | `47,92,158` | `194,88,47` |
| `--bs-link-hover-color` | `#244a80` | `#9e4726` |
| *bonus* `--bs-body-bg` | `#ffffff` | `#fdf3ec` (warm paper) |
| *bonus* `--bs-tertiary-bg` | `#f2f5fa` | `#f7e6dc` |
| *bonus* `--bs-border-color` | `#dde3ec` | `#e6cdbf` |

The bonus `--bs-body-bg`/`--bs-tertiary-bg`/`--bs-border-color` push (also live, no reload) proves
the bridge is not just the accent — a second, independent token re-skins every surface's paper
while the accent holds.

## Per-route: what moved / what held

**1 · Landing `/`** — moved: brand mark, Cart button, "New season denim" badge, both hero CTAs
(Shop jeans / Browse all outline), the four value-prop icons + their tinted chips, "THE
COLLECTION" eyebrow, all product prices, product-card badges (Bestseller/New/New wash), "View
jeans" outline buttons. Held: body copy, headings, lifestyle photography.

**2 · Product detail `/product/classic-straight-blue-jeans`** — moved: breadcrumb links, "JANE'S
JEANS" eyebrow, `$98` price, Bestseller badge + rating star, **all six waist-size selector
borders**, **selected thumbnail border**, Add-to-cart, Wishlist outline + heart, reassurance
check, spec-table row tint, active Description tab underline, related-card prices/badges/buttons.
Held: heading/spec text, product photography.

**3 · Checkout `/checkout`** — moved: brand + Cart, eyebrow, order-count badge, **Apply** button,
**Total ($345.12)**, "same as billing" checkbox, **selected Standard delivery** (radio + highlight
border + tint), delivery prices, Save-card switch, **Place order** button. Held: form field
chrome, labels, help text.

**4 · Kitchen sink `/components`** (the completeness + semantic test) — moved: side-nav active
item, primary buttons, primary badge, primary alert, primary spinner, primary progress bar,
list-group active row, active pagination page, the breadcrumb navbar band, links, `bg-primary`
utility chip. **Held (semantic — did NOT move):** `success` (green), `danger` (red), `warning`
(yellow), `info` (cyan) across buttons / badges / alerts / spinners / progress bars / utility
chips, **and the form valid-green / invalid-red accents**. This is the money frame: accent moves
site-wide, semantics stay put.

## Hardcoded-hex audit
No hardcoded-hex bugs. Every hex in the page/shell source is a `var(--bs-*, <fallback>)` fallback
(e.g. `SorbMark` fill `var(--bs-primary, #2f5c9e)`, checkout invalid `var(--bs-form-invalid-color,
#dc3545)`) — the live custom property always wins, so those fallbacks never freeze a surface. No
raw `rgb()`/hex color literals outside `var()` in any route. Nothing to fix.

## Responsive fix (found + fixed during P6)
A **horizontal-scroll bug** was found at 390px on `/`, `/product`, `/checkout` (kitchen sink was
already clean). Root cause: top-level `Container`s used the `padding: 'X 0'` shorthand, which
**zeroes the Container's horizontal gutter padding**, so child `Row`s' negative gutter margins
(`g={4}`/`g={5}` → up to -24px) poked ~16px past the viewport. Fixes:
- `LandingPage`, `ProductDetailPage`, `CheckoutPage`, `NotFound`: replaced `padding:'X 0'`
  shorthands with explicit `paddingTop`/`paddingBottom` so the Container keeps its horizontal padding.
- `SiteLayout`: added `overflowX:'hidden'` on the shell root as a universal guard against
  Bootstrap gutter overflow (columns render identically; no design change).

After the fix, **all four routes report `scrollWidth === clientWidth` (overflow 0) at 390px.**

## Build
`npm run build` clean. Bundle: **`index.js` 496.21 kB (147.79 kB gzip)**, `index.css` 3.86 kB
(0.74 kB gzip), `index.html` 0.41 kB. 74 modules.

## Artifacts (`gfp-p3/p6-shots/`)
- Denim baseline: `denim-home.png` · `denim-product.png` · `denim-checkout.png` · `denim-components.png`
- Terracotta re-skin: `reskin-home.png` · `reskin-product.png` · `reskin-checkout.png` · `reskin-components.png`
- Bonus second token: `reskin-bonus-bodybg-home.png`
- Side-by-side contact sheet: `contact-sheet.html`

*Capture: Playwright headless (sorb-test-ui harness), Chromium @ 1280×900 (deviceScaleFactor 2);
responsive check @ 390×844. Not deployed — deploy to demo.sorbcloud.com is founder-gated.*
