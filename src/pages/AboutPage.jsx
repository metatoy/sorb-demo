import straightLegRawSelvedge from '../assets/photos/straight-leg-raw-selvedge.jpg'
import React from 'react'
import { Link } from 'react-router-dom'
import {
  Container,
  Row,
  Col,
  Display,
  Heading,
  Text,
  Lead,
  Button,
  Image,
  Ratio,
} from '@metatoy/bootstrap-styled'
import { products, PHOTO_SOURCES } from '../data/catalog'
import { DISPLAY_STACK } from '../sorbBsTheme'

// ── Jane's Jeans — About page ────────────────────────────────────────────────
//
// The store story + a Photography Credits section that attributes the bundled
// photography (src/assets/photos, downloaded from Unsplash) per the Unsplash License (https://unsplash.com/license — attribution
// is not required, but the license asks that photographers be credited when
// possible). Every custom surface reads var(--bs-*), so one bs-* preview push
// re-skins this page with the rest of the site.

const ABOUT_IMAGE =
  straightLegRawSelvedge

// Every bundled photo actually rendered on the site, derived from the catalog
// (product images + detail-gallery shots) so the credits never drift from the
// imagery. Deduped, first-seen label wins.
const CREDIT_MAP = new Map()
for (const p of products) {
  if (p.image) CREDIT_MAP.set(p.image, p.name)
  for (const url of p.gallery || []) {
    if (!CREDIT_MAP.has(url)) CREDIT_MAP.set(url, 'Denim detail')
  }
}
const PHOTO_CREDITS = [...CREDIT_MAP.entries()].map(([url, label]) => ({ url, label }))

const sectionEyebrow = {
  display: 'block',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontSize: '0.78rem',
  fontWeight: 600,
  color: 'var(--bs-primary)',
  marginBottom: '0.5rem',
}

const creditLink = {
  color: 'var(--bs-primary)',
  textDecoration: 'none',
  fontWeight: 600,
}

export const AboutPage = () => (
  <div data-testid="page-about">
    {/* ── Intro ─────────────────────────────────────────────────────────── */}
    <section
      style={{
        background: 'var(--bs-tertiary-bg)',
        borderBottom: '1px solid var(--bs-border-color)',
      }}
      id="about"
    >
      <Container style={{ paddingTop: '4.5rem', paddingBottom: '4.5rem' }}>
        <Row g={5} style={{ alignItems: 'center' }}>
          <Col md={6}>
            <span style={sectionEyebrow}>About Jane&apos;s Jeans</span>
            <Display
              size={3}
              style={{
                fontFamily: DISPLAY_STACK,
                letterSpacing: '-0.02em',
                color: 'var(--bs-heading-color, var(--bs-body-color))',
                marginBottom: '1rem',
              }}
            >
              Built to be worn for years.
            </Display>
            <Lead style={{ maxWidth: 480, color: 'var(--bs-secondary-color)' }}>
              We make honest blue jeans — real denim, real fits, and nothing you
              have to baby. One obsession, four cuts, and a standard we do not bend.
            </Lead>
          </Col>
          <Col md={6}>
            <Ratio
              ratio="4x3"
              style={{
                borderRadius: 'var(--bs-border-radius-lg, 0.75rem)',
                overflow: 'hidden',
                border: '1px solid var(--bs-border-color)',
                boxShadow: '0 1.5rem 3rem rgba(var(--bs-primary-rgb), 0.14)',
              }}
            >
              <Image
                src={ABOUT_IMAGE}
                alt="A close-up of well-worn blue jeans"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Ratio>
          </Col>
        </Row>
      </Container>
    </section>

    {/* ── Story ─────────────────────────────────────────────────────────── */}
    <section style={{ background: 'var(--bs-body-bg)' }}>
      <Container style={{ paddingTop: '4rem', paddingBottom: '2.5rem' }}>
        <Row>
          <Col md={8} lg={7}>
            <Heading
              as="h2"
              size={3}
              style={{
                fontFamily: DISPLAY_STACK,
                color: 'var(--bs-heading-color, var(--bs-body-color))',
                marginBottom: '1rem',
              }}
            >
              Our story
            </Heading>
            <Text style={{ display: 'block', marginBottom: '1rem', color: 'var(--bs-body-color)' }}>
              Jane&apos;s Jeans started with a simple frustration: denim that looked
              the part but fell apart. So we went the other way — heavyweight cotton
              woven on old-school shuttle looms, cut into fits that flatter real
              bodies, and finished in washes that only get better with age.
            </Text>
            <Text style={{ display: 'block', marginBottom: '1rem', color: 'var(--bs-body-color)' }}>
              Every pair is made in small runs by makers who are paid a living wage,
              using low-impact indigo and recycled water in every wash. We would
              rather sell you one pair you keep for a decade than four you replace
              in a year.
            </Text>
            <Text muted style={{ display: 'block', fontSize: '0.92rem' }}>
              Jane&apos;s Jeans is a fictional demo store for{' '}
              <a
                href="https://metatoy.com/sorb"
                style={creditLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Sorb
              </a>
              , the design-token bridge — every colour on this page is driven by a
              CSS custom property, so the whole store re-skins from a single token push.
            </Text>
          </Col>
        </Row>
      </Container>
    </section>

    {/* ── Photography credits (Unsplash License) ────────────────────────── */}
    <section
      style={{
        background: 'var(--bs-tertiary-bg)',
        borderTop: '1px solid var(--bs-border-color)',
      }}
    >
      <Container style={{ paddingTop: '3.5rem', paddingBottom: '4rem' }}>
        <div style={{ marginBottom: '2rem', maxWidth: 640 }}>
          <span style={sectionEyebrow}>Photography</span>
          <Heading
            as="h2"
            size={4}
            style={{
              fontFamily: DISPLAY_STACK,
              color: 'var(--bs-heading-color, var(--bs-body-color))',
              marginBottom: '0.5rem',
            }}
          >
            Image credits
          </Heading>
          <Text muted style={{ display: 'block' }}>
            The photography on this demo is bundled with the site and comes from{' '}
            <a
              href="https://unsplash.com"
              style={creditLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash
            </a>{' '}
            and its contributing photographers, used under the{' '}
            <a
              href="https://unsplash.com/license"
              style={creditLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash License
            </a>
            . Attribution is not required, but we credit each source below. Follow
            a link to view the original photograph and its photographer on Unsplash.
          </Text>
        </div>

        <Row g={4}>
          {PHOTO_CREDITS.map(({ url, label }, i) => (
            <Col key={url} md={3} sm={6}>
              <a
                href={PHOTO_SOURCES.get(url) || url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <Ratio
                  ratio="1x1"
                  style={{
                    borderRadius: 'var(--bs-border-radius, 0.5rem)',
                    overflow: 'hidden',
                    border: '1px solid var(--bs-border-color)',
                    marginBottom: '0.6rem',
                  }}
                >
                  <Image
                    src={url}
                    alt={`${label} — photograph on Unsplash`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Ratio>
                <Text
                  style={{
                    display: 'block',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: 'var(--bs-body-color)',
                  }}
                >
                  {label}
                </Text>
                <Text muted style={{ display: 'block', fontSize: '0.82rem' }}>
                  Photo {i + 1} · View on Unsplash →
                </Text>
              </a>
            </Col>
          ))}
        </Row>

        <div style={{ marginTop: '2.5rem' }}>
          <Button as={Link} to="/" variant="outline-primary">
            Back to shop
          </Button>
        </div>
      </Container>
    </section>
  </div>
)
