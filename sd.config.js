import { readFileSync } from 'node:fs'
import StyleDictionary from 'style-dictionary'
import {
  SORB_RESOLVED,
  SORB_THEME_NESTED,
  SORB_ALIASES,
  SORB_VERSIONS,
  SORB_SET_META,
  SORB_TAILWIND,
  SORB_TAILWIND_V3,
  SORB_TOKENSET,
  sorbResolved,
  sorbThemeNested,
  sorbAliases,
  sorbVersions,
  sorbSetMeta,
  sorbTailwind,
  sorbTailwindV3,
  sorbTokenSet,
} from './sd/sorb-format.js'

// Register Sorb's custom parser + formats before building.
StyleDictionary.registerParser(sorbSetMeta) // lifts per-set $version pre-merge
StyleDictionary.registerFormat({ name: SORB_RESOLVED, format: sorbResolved })
StyleDictionary.registerFormat({ name: SORB_THEME_NESTED, format: sorbThemeNested })
StyleDictionary.registerFormat({ name: SORB_ALIASES, format: sorbAliases })
StyleDictionary.registerFormat({ name: SORB_VERSIONS, format: sorbVersions })
StyleDictionary.registerFormat({ name: SORB_TAILWIND, format: sorbTailwind })
StyleDictionary.registerFormat({ name: SORB_TAILWIND_V3, format: sorbTailwindV3 })
StyleDictionary.registerFormat({ name: SORB_TOKENSET, format: sorbTokenSet })

// Legacy CSS-var name → new DTCG id. Read here (NOT a token source) and handed
// to the aliases format. Delete the file + the `aliases` platform post-migration.
const aliases = JSON.parse(readFileSync(new URL('./tokens/aliases.json', import.meta.url)))

/** @type {import('style-dictionary').Config} */
export default {
  // Three DTCG tiers merge into one tree; refs resolve across all three.
  source: ['tokens/primitive.json', 'tokens/semantic.json', 'tokens/component.json'],
  parsers: [SORB_SET_META],
  platforms: {
    // CSS custom properties the app reads — --color-action-primary, etc.
    css: {
      transformGroup: 'css',
      buildPath: 'src/tokens/generated/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: { outputReferences: true },
        },
      ],
    },

    // styled-components theme (generated): theme.color.action.primary →
    // var(--color-action-primary, <fallback>). Replaces the hand-kept theme.js.
    js: {
      transformGroup: 'css', // kebab names so the var() matches the css platform
      buildPath: 'src/tokens/generated/',
      files: [
        { destination: 'theme.js', format: SORB_THEME_NESTED },
        // Flat TokenSet for @sorb/leaf's SorbProvider (the committed token set).
        { destination: 'tokens.js', format: SORB_TOKENSET },
      ],
    },

    // The Sorb resolved bindable map — { id, cssVar, value, tier, type }.
    sorb: {
      transformGroup: 'css', // reuse css names so cssVar matches the css platform
      buildPath: '.sorb/',
      files: [
        { destination: 'resolved.json', format: SORB_RESOLVED },
        { destination: 'versions.json', format: SORB_VERSIONS },
      ],
    },

    // Legacy back-compat alias layer (migration window only). Imported by the
    // app alongside variables.css so old `--primaryAction` keeps resolving.
    aliases: {
      transformGroup: 'css',
      buildPath: 'src/tokens/generated/',
      files: [{ destination: 'aliases.css', format: SORB_ALIASES, options: { aliases } }],
    },

    // Tailwind v4 theme: `@theme inline { … }` of var(--token) refs from the
    // same resolved tree, so Tailwind utilities (bg-*/rounded-*/…) resolve
    // through the runtime-swappable Sorb vars — live preview, zero TW-specific code.
    tailwind: {
      transformGroup: 'css', // kebab names so the var() refs match the css platform
      buildPath: 'src/tokens/generated/',
      files: [{ destination: 'tailwind-theme.css', format: SORB_TAILWIND }],
    },

    // Tailwind v3 preset (CommonJS): theme.extend of the same var(--token) refs,
    // grouped into v3 theme categories. Consumer: presets:[require('…cjs')].
    tailwindV3: {
      transformGroup: 'css',
      buildPath: 'src/tokens/generated/',
      files: [{ destination: 'tailwind-sorb-preset.cjs', format: SORB_TAILWIND_V3 }],
    },
  },
}
