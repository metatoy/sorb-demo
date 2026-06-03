# CLAUDE.md — sorb-demo

Part of the **Sorb** polyrepo under the **Metatoy** org (local base
`workspace/metatoy/`). Siblings: `sorb-core`, `sorb-seed`, `sorb-leaf`,
`sorb-juice`, `sorb-canopy`, `sorb-cloud`.

## What this is

`sorb-demo` — the reference consumer app showing how to wire the Sorb packages:
DTCG token sets (`tokens/*.json`) → Style Dictionary (`sd.config.js` +
`sd/sorb-format.js`) → `.sorb/resolved.json` → the `sorb-juice` bridge → the
`sorb-leaf` provider. Config lives in **`sorb.config.json`** (namespace
`sorb-demo`).

## Hard rules

- **JavaScript only — never TypeScript.**
- **Not published** (`private: true`). Cross-repo local dev: `npm link
  @metatoy/sorb-leaf` and `@metatoy/sorb-juice` against the sibling repos until
  they're published (polyrepo — there's no workspace to hoist them).
- **Don't commit generated outputs:** `.sorb/` and `src/tokens/generated/` are
  built by `npm run tokens` (Style Dictionary) and gitignored.
- CSS custom property names (`--color-*`, `--bs-*`) are **token** names, not brand
  names — they are unaffected by the Fig→Sorb rename.
- **Commit/push only when asked.** If on the default branch, branch first.
