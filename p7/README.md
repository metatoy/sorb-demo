# P7 — Live re-skin proof (Sorb × @metatoy/bootstrap-styled)

**GFP RC1 Part 1 P7.** Proves that a real, unmodified `@metatoy/bootstrap-styled`
component re-skins **live** when a token override is pushed through the Sorb
preview pipeline — locally, with no Figma and no deploy.

## The mechanism (no leaf change, no adapter)

- `BootstrapStyledProvider` emits its `--bs-*` custom properties on `:root` via a
  styled-components global stylesheet, e.g. `:root { --bs-primary: #0d6efd; --bs-body-bg: #fff; … }`.
  Components read them: the Button uses `--bs-btn-bg: var(--bs-primary)`.
- `@sorb/leaf`'s preview apply path (`applyTokens`) writes each pushed token as an
  **inline** custom property on `document.documentElement`:
  `root.style.setProperty('--bs-primary', '#6f42c1')`.
- An inline `:root` write beats the stylesheet `:root` rule by specificity, so
  overriding `--bs-primary` / `--bs-body-bg` recolors the bootstrap-styled
  components at runtime. **The only requirement is that the pushed token keys are
  literally `bs-primary`, `bs-body-bg`, … — which is exactly `p7/preview-tokens.json`.**

bootstrap-styled stays 100% Sorb-agnostic; leaf is unchanged.

## What renders where

`src/BootstrapStyledDemo.jsx` mounts `<BootstrapStyledProvider>` wrapping real
bootstrap-styled `Button` (primary / secondary / outline-primary), `Alert`, and a
`Card` (with a nested `Button`). It's rendered as a new section at the bottom of
`src/App.jsx`, alongside — not replacing — the existing local `Button`/`Card`.
The existing `SorbProvider` / `PreviewBanner` wiring in `main.jsx` is untouched.

## The override token set — `p7/preview-tokens.json`

```json
{
  "bs-primary": "#6f42c1",
  "bs-primary-contrast": "#ffffff",
  "bs-body-bg": "#f5f0ff",
  "bs-border-color": "#d3c4f0"
}
```

## How the proof was run (local, no Figma, no deploy)

```sh
# 1. Start the juice bridge (bin from @sorb/juice)
node_modules/.bin/sorb dev --port 7777

# 2. Push the bs-* token set → returns { id, url }
curl -s -X POST http://127.0.0.1:7777/preview \
  -H 'Content-Type: application/json' -d @p7/preview-tokens.json
# → {"id":"_6nw-Q94","url":"?preview=_6nw-Q94"}

# 3. Start the demo dev server, load with and without ?preview=<id>
node_modules/.bin/vite   # → http://localhost:5200/
```

## Verified result (computed styles, Chrome)

| Element (`data-testid`)            | No preview        | `?preview=_6nw-Q94`        |
| ---------------------------------- | ----------------- | -------------------------- |
| `bs-btn-primary` background        | `rgb(13,110,253)` = `#0d6efd` | `rgb(111,66,193)` = **`#6f42c1`** |
| `bs-demo` section background       | `rgb(255,255,255)` (white)    | `rgb(245,240,255)` = **`#f5f0ff`** |
| inline `--bs-primary` on `<html>`  | *(none)*          | `#6f42c1`                  |
| inline `--bs-body-bg` on `<html>`  | *(none)*          | `#f5f0ff`                  |
| PreviewBanner active               | no                | yes                        |

Reverting (reload without `?preview`) returns the Button to `#0d6efd`, the section
to white, and drops the inline overrides — confirming the effect is the preview,
not a persistent edit.

## Screenshots

- `before-no-preview.png` — bootstrap-styled section, default blue primary.
- `after-preview-reskin.png` — same section under `?preview`, purple primary + lavender bg.

## Notes / findings

- Cascade verification: **YES** — the inline `:root` override re-skins the real
  component. `BootstrapStyledProvider` puts the color vars on `:root` (not a scoped
  wrapper), so leaf's inline `documentElement` write wins by specificity.
- The primary `Alert`'s subtle border/background use bootstrap's `*-subtle` palette
  (fixed values, not derived from `--bs-primary`), so it does not fully retint from
  `bs-primary` alone; the Button, its `--bs-btn-bg`, and `--bs-body-bg` retint fully.
  Retinting the subtle layer would just mean adding those `bs-*-subtle` keys to the
  override set — no code change.
