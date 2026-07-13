import { createTheme } from '@metatoy/bootstrap-styled'

// ── The Jane's Jeans brand, expressed as a bootstrap-styled theme (GFP RC1 Part 3 · §D.2/§E)
//
// `BootstrapStyledProvider theme={sorbBsTheme}` emits these values as `--bs-*`
// custom properties on `:root` (via the library's GlobalStyles/ThemeVars
// createGlobalStyle). Every bootstrap-styled component — AND every custom shell
// surface (Navbar/Footer/pages) — renders from those `--bs-*` vars.
//
// The re-skin bridge (@sorb/leaf) writes a pushed token (e.g. `bs-primary`) as an
// INLINE `--bs-primary` on document.documentElement. An inline write beats the
// `:root` stylesheet rule by specificity, so a single `bs-*` preview push
// re-skins the whole site live — no change to bootstrap-styled, no adapter in
// leaf. So the committed baseline below is Jane's-Jeans-branded (denim indigo,
// not Bootstrap blue), using the exact `--bs-*` names leaf overrides.
//
// createTheme() deep-merges these overrides onto the Bootstrap defaults and
// returns a full Theme, so there is a SINGLE `:root` block driven by this object
// — our values win over the library defaults by construction (§D.4 guard).

// ── Jane's Jeans denim palette ────────────────────────────────────────────────
const DENIM_INDIGO = '#2f5c9e' // primary / links
const DENIM_HOVER = '#244a80' // link + primary hover
const INK = '#22252a' // body text
const HEADING_INK = '#14161a' // headings
const WHITE = '#ffffff' // body bg
const FADED_DENIM = '#f2f5fa' // section / tertiary surfaces (faded-denim tint)
const SEAM_GREY = '#dde3ec' // borders
const MUTED_SLATE = '#667085' // muted / secondary text

// rgb triplet for `--bs-primary-rgb` (used by alpha-mixed surfaces).
const DENIM_INDIGO_RGB = '47,92,158'

export const sorbBsTheme = createTheme({
  colors: {
    primary: DENIM_INDIGO,
    secondary: MUTED_SLATE,
  },
  colorRgb: {
    primary: DENIM_INDIGO_RGB,
  },
  body: {
    bg: WHITE,
    color: INK,
  },
  secondary: {
    color: MUTED_SLATE, // --bs-secondary-color (muted body text)
  },
  tertiary: {
    bg: FADED_DENIM, // --bs-tertiary-bg (section surfaces)
  },
  border: {
    color: SEAM_GREY,
  },
  link: {
    color: DENIM_INDIGO,
    hoverColor: DENIM_HOVER,
  },
  radius: {
    sm: '0.375rem',
    base: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  focusRing: {
    // Keep the focus ring on-brand (denim, not Bootstrap blue).
    color: `rgba(${DENIM_INDIGO_RGB}, 0.35)`,
  },
  font: {
    // Clean humanist system sans for body — casual/denim feel, off the
    // Bootstrap/Inter default (§E; no AI-slop fonts).
    sansSerif:
      "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
    headings: {
      color: HEADING_INK,
    },
  },
})

// Exposed for any surface that wants the raw denim values (kept in sync with the
// theme above). Prefer reading `var(--bs-*)` in components; use these only where
// a JS value is unavoidable.
export const sorbPalette = {
  denimIndigo: DENIM_INDIGO,
  denimHover: DENIM_HOVER,
  ink: INK,
  headingInk: HEADING_INK,
  white: WHITE,
  fadedDenim: FADED_DENIM,
  seamGrey: SEAM_GREY,
  mutedSlate: MUTED_SLATE,
}

// The characterful display stack for the "Jane's Jeans" wordmark + section
// headings (§E) — casual, not the orchard serif; not a color, so not part of the
// re-skin surface. System-available, avoids AI-slop web fonts.
export const DISPLAY_STACK =
  "'Trebuchet MS', 'Avenir Next', Futura, system-ui, sans-serif"
