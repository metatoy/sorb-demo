// Jane's Jeans — the store's product data (GFP RC1 Part 3 · §C.3).
//
// A small blue-jeans catalog: name / slug / price / specs / related. The hero is
// the Classic Straight Blue Jeans ($98). P2–P5 build the pages from this; image
// URLs are real free-stock jeans photography (Unsplash/Pexels direct CDN),
// wired in per-page during P2–P5. P1 renders no imagery yet.

/**
 * @typedef {Object} Product
 * @property {string} slug
 * @property {string} name
 * @property {number} price          USD
 * @property {string} wash
 * @property {string} fit
 * @property {string} rise
 * @property {string} fabric
 * @property {string} care           care instructions
 * @property {string} country        country of origin
 * @property {string[]} sizes
 * @property {string[]} badges
 * @property {string} blurb
 * @property {string} [image]        real stock-photo CDN URL (primary; used P2–P5)
 * @property {string[]} [gallery]    real stock-photo CDN URLs (detail-page angles)
 * @property {string[]} related      slugs
 */

// Shared blue-jeans detail/angle shots (Unsplash direct CDN, curl-verified 200
// image/jpeg 2026-07-13) — reused across product galleries for the thumbnail row.
const DETAIL_SHOTS = [
  'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1529391409740-59f2cea08bc6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=1200&q=80',
]

/** @type {Product[]} */
export const products = [
  {
    slug: 'classic-straight-blue-jeans',
    name: 'Classic Straight Blue Jeans',
    price: 98,
    wash: 'Mid Blue',
    fit: 'Straight',
    rise: 'Mid Rise',
    fabric: '98% cotton, 2% elastane denim (12.5 oz)',
    care: 'Machine wash cold, inside out. Line dry. Warm iron if needed.',
    country: 'Ethically made in Portugal',
    sizes: ['26', '28', '30', '32', '34', '36'],
    badges: ['Bestseller'],
    blurb:
      'The one we build everything around. A true straight leg in an honest mid-blue wash, with just enough stretch to move.',
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=80',
      DETAIL_SHOTS[0],
      DETAIL_SHOTS[1],
      DETAIL_SHOTS[2],
    ],
    related: ['slim-fit-indigo-jeans', 'high-rise-vintage-wash-jeans', 'relaxed-tapered-jeans'],
  },
  {
    slug: 'slim-fit-indigo-jeans',
    name: 'Slim Fit Indigo Jeans',
    price: 108,
    wash: 'Deep Indigo',
    fit: 'Slim',
    rise: 'Mid Rise',
    fabric: '99% cotton, 1% elastane denim (11 oz)',
    care: 'Machine wash cold, inside out. Line dry to keep the raw indigo deep.',
    country: 'Ethically made in Japan',
    sizes: ['28', '30', '32', '34', '36'],
    badges: ['New'],
    blurb:
      'A cleaner, closer cut in a rich raw-indigo dye that fades beautifully with wear.',
    image:
      'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=1200&q=80',
      DETAIL_SHOTS[1],
      DETAIL_SHOTS[2],
      DETAIL_SHOTS[3],
    ],
    related: ['classic-straight-blue-jeans', 'relaxed-tapered-jeans', 'high-rise-vintage-wash-jeans'],
  },
  {
    slug: 'high-rise-vintage-wash-jeans',
    name: 'High-Rise Vintage Wash Jeans',
    price: 118,
    wash: 'Vintage Light',
    fit: 'Straight',
    rise: 'High Rise',
    fabric: '100% cotton rigid denim (13 oz)',
    care: 'Wash sparingly, cold, inside out. Hang dry. Expect an honest fade.',
    country: 'Ethically made in the USA',
    sizes: ['24', '26', '28', '30', '32', '34'],
    badges: ['New', 'Limited'],
    blurb:
      'A high waist and a sun-faded vintage wash in rigid, all-cotton denim that breaks in like a favourite.',
    image:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80',
      DETAIL_SHOTS[2],
      DETAIL_SHOTS[3],
      DETAIL_SHOTS[0],
    ],
    related: ['classic-straight-blue-jeans', 'slim-fit-indigo-jeans', 'relaxed-tapered-jeans'],
  },
  {
    slug: 'relaxed-tapered-jeans',
    name: 'Relaxed Tapered Jeans',
    price: 112,
    wash: 'Stone Blue',
    fit: 'Relaxed Tapered',
    rise: 'Mid Rise',
    fabric: '98% cotton, 2% elastane denim (12 oz)',
    care: 'Machine wash cold, inside out. Tumble dry low. Warm iron if needed.',
    country: 'Ethically made in Portugal',
    sizes: ['28', '30', '32', '34', '36', '38'],
    badges: ['New wash'],
    blurb:
      'Roomy through the thigh, tapered to the ankle — an easy stone-blue wash for everyday wear.',
    image:
      'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?auto=format&fit=crop&w=1200&q=80',
      DETAIL_SHOTS[3],
      DETAIL_SHOTS[0],
      DETAIL_SHOTS[1],
    ],
    related: ['classic-straight-blue-jeans', 'slim-fit-indigo-jeans', 'high-rise-vintage-wash-jeans'],
  },
]

export const HERO_SLUG = 'classic-straight-blue-jeans'

/** Look up a product by slug (falls back to the hero). */
export const getProduct = (slug) =>
  products.find((p) => p.slug === slug) || products.find((p) => p.slug === HERO_SLUG)

export const heroProduct = getProduct(HERO_SLUG)
