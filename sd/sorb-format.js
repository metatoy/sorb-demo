// Back-compat re-export shim (component-compat-roadmap P0, part 2).
//
// The Sorb Style Dictionary formats used to live copy-locally in this file.
// They've been promoted to `@sorb/seed` (`src/emit/sorbFormat.js`) so target
// adapters can import them instead of copy-pasting — this file now just
// re-exports from there. `sd.config.js` imports directly from `@sorb/seed`;
// this shim exists only so any other consumer that still imports
// `./sd/sorb-format.js` keeps working unchanged.
export {
  tierOfFile,
  SORB_RESOLVED,
  SORB_THEME_NESTED,
  SORB_ALIASES,
  SORB_VERSIONS,
  SORB_SET_META,
  SORB_TAILWIND,
  SORB_TAILWIND_V3,
  SORB_TOKENSET,
  sorbSetMeta,
  sorbVersions,
  sorbTokenSet,
  sorbResolved,
  sorbAliases,
  sorbThemeNested,
  tailwindThemeEntry,
  sorbTailwind,
  tailwindV3Slot,
  sorbTailwindV3,
} from '@sorb/seed'
