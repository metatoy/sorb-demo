# Sorb example

Reference app for Sorb, the design-token bridge for your running app — every
control renders from a CSS custom property. Not a workspace member — it depends on
[`@sorb/leaf`](https://www.npmjs.com/package/@sorb/leaf)
and [`@sorb/juice`](https://www.npmjs.com/package/@sorb/juice)
straight from npm, exactly as a real consumer would.

## Files

| File | Purpose |
|---|---|
| `main.jsx` | Wraps the app in `SorbProvider` + `PreviewBanner` |
| `.storybook/preview.jsx` | Applies the same provider to every story |
| `sorb.config.json` | Config read by the `sorb` CLI |
| `sd.config.js` | Style Dictionary config (3-tier DTCG → all outputs) |
| `sd/sorb-format.js` | Custom SD parser + formats (resolved map, theme, aliases, versions) |
| `tokens/{primitive,semantic,component}.json` | The DTCG token sets (source of truth, committed) |
| `tokens/aliases.json` | Legacy CSS-var name → new DTCG id (migration only) |

## Token build pipeline

The DTCG sets are the source of truth; **Style Dictionary builds everything
else** from them:

```bash
npm run tokens         # style-dictionary build → all outputs below
```

| Output (generated, gitignored) | Consumer |
|---|---|
| `src/tokens/generated/variables.css` | the app (imported globally) |
| `src/tokens/generated/aliases.css` | the app, during migration — `--primaryAction: var(--color-action-primary)` |
| `src/tokens/generated/theme.js` | styled-components theme (`var(--…, fallback)`) |
| `src/tokens/generated/tailwind-theme.css` | Tailwind v4 `@theme inline` of `var(--token)` refs (see below) |
| `src/tokens/generated/tailwind-sorb-preset.cjs` | Tailwind v3 preset (`theme.extend` of `var(--token)` refs) |
| `.sorb/resolved.json` | bridge `/tokens/resolved`, capture annotator, plugin Sync Variables |
| `.sorb/versions.json` | per-set `$version` (drift detection) |

### Tailwind v4

`tailwind-theme.css` lets a Tailwind v4 app theme off Sorb tokens **and keep live
preview**. It emits one `@theme inline` entry per resolved token, each value a
`var(--token)` reference into `variables.css` — so Tailwind utilities
(`bg-action-primary`, `rounded-button`, `border-border-default`, …) resolve
through the exact CSS vars the bridge swaps at runtime. Import order in your entry
CSS:

```css
@import "tailwindcss";
@import "./tokens/generated/variables.css";       /* sorb tokens — bridge swaps these live */
@import "./tokens/generated/tailwind-theme.css";  /* maps them into the Tailwind theme */
```

Because `@theme inline` makes utilities reference `var(--token)` directly (rather
than baking the value in), a `POST /preview` recolors Tailwind-classed elements
with **no Tailwind-specific bridge code**. Mapping: color tokens → `--color-*`
(`bg-`/`text-`/`border-`), `radius.*`+`button.radius` → `--radius-*` (`rounded-*`),
`space.*` → `--spacing-*`, `font.size.*` → `--text-*`, `font.weight.*` →
`--font-weight-*`.

**Tailwind v3** apps use the generated **preset** instead — same `var(--token)`
refs, grouped into v3 `theme.extend` categories, so the same utilities
(`bg-action-primary`, `rounded-button`, …) and the same live preview work:

```js
// tailwind.config.js
module.exports = { presets: [require('./src/tokens/generated/tailwind-sorb-preset.cjs')] }
```

Import `variables.css` globally either way so the vars resolve.

`sorb dev` runs this build on startup and re-runs it whenever a
`tokenSources` file changes — so the resolved map the plugin/seed consume is
always fresh. In **CI**, run `npm run tokens` (or `npm run build`) **before**
anything that consumes `dist/`, `.sorb/`, or the generated CSS/theme; commit
only the `tokens/*.json` sources, never the generated outputs.

## Run it

```bash
npm install            # pulls @sorb/leaf + @sorb/juice + style-dictionary
npm run tokens         # build tokens (also runs automatically under `sorb dev`)
npm run sorb        # starts the local token bridge (sorb dev)
```

> These files are an integration reference, not a full runnable app — they
> assume your own `App` and `index.html` exist. See the
> [root README](../README.md) for the end-to-end workflow.
