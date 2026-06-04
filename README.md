# Sorb example

Reference wiring for consuming the published Sorb packages in a React
app. Not a workspace member — it depends on
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
| `.sorb/resolved.json` | bridge `/tokens/resolved`, capture annotator, plugin Sync Variables |
| `.sorb/versions.json` | per-set `$version` (drift detection) |

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
