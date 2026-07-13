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
  Badge,
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardFooter,
  Image,
  Ratio,
  BsIconStar,
  BsIconChevronLeft,
  BsIconCheck,
  BsIconGear,
} from '@metatoy/bootstrap-styled'
import { products, heroProduct } from '../data/catalog'
import { DISPLAY_STACK } from '../sorbBsTheme'

// ── Jane's Jeans landing page (GFP RC1 Part 3 · §F.1 / board 02) ──────────────
//
// Hero (lifestyle photo of a person in blue jeans + display heading + CTA pair) ·
// value grid (Icon + Typography) · product highlights (Card grid → /product/:slug).
// Every custom surface reads var(--bs-*) — never a raw hex — so one bs-* preview
// push re-skins the whole page with the rest of the site. Imagery = real
// free-stock jeans photography (Unsplash direct CDN); curl-verified 200 image/*.

// Lifestyle hero: a person wearing a blue denim jacket + blue jeans (Unsplash).
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1598978192227-08faca0eff3a?auto=format&fit=crop&w=1600&q=80'

const VALUE_PROPS = [
  {
    Icon: BsIconStar,
    title: 'Premium denim',
    body: 'Heavyweight cotton woven on old-school shuttle looms — built to break in, not break down.',
  },
  {
    Icon: BsIconChevronLeft,
    title: 'Free 30-day returns',
    body: 'Try them on at home. If the fit is not right, send them back on us — no questions asked.',
  },
  {
    Icon: BsIconCheck,
    title: 'Fits everyone',
    body: 'Six honest fits across a full size run, from 24 to 38, in rises for every body.',
  },
  {
    Icon: BsIconGear,
    title: 'Sustainably made',
    body: 'Low-impact indigo, recycled water in every wash, and a factory that pays a living wage.',
  },
]

const sectionEyebrow = {
  display: 'block',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontSize: '0.78rem',
  fontWeight: 600,
  color: 'var(--bs-primary)',
  marginBottom: '0.5rem',
}

export const LandingPage = () => (
  <div data-testid="page-landing">
    {/* ── Hero ─────────────────────────────────────────────────────────── */}
    <section
      style={{
        background: 'var(--bs-tertiary-bg)',
        borderBottom: '1px solid var(--bs-border-color)',
      }}
    >
      <Container style={{ padding: '4.5rem 0' }}>
        <Row g={5} style={{ alignItems: 'center' }}>
          <Col md={6}>
            <Badge variant="primary" style={{ marginBottom: '1rem' }}>
              New season denim
            </Badge>
            <Display
              size={2}
              style={{
                fontFamily: DISPLAY_STACK,
                letterSpacing: '-0.02em',
                color: 'var(--bs-heading-color, var(--bs-body-color))',
                marginBottom: '1rem',
              }}
            >
              Denim, done right.
            </Display>
            <Lead style={{ maxWidth: 480, color: 'var(--bs-secondary-color)' }}>
              Honest blue jeans built to be worn for years — real denim, real fits,
              made to move with you. Meet the {heroProduct.name}.
            </Lead>
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                marginTop: '1.75rem',
                flexWrap: 'wrap',
              }}
            >
              <Button
                as={Link}
                to={`/product/${heroProduct.slug}`}
                variant="primary"
                size="lg"
                data-testid="hero-shop"
              >
                Shop jeans
              </Button>
              <Button as={Link} to="/components" variant="outline-primary" size="lg">
                Browse all
              </Button>
            </div>
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
                src={HERO_IMAGE}
                alt="A person wearing a blue denim jacket and blue jeans"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Ratio>
          </Col>
        </Row>
      </Container>
    </section>

    {/* ── Value / feature grid ─────────────────────────────────────────── */}
    <section style={{ background: 'var(--bs-body-bg)' }}>
      <Container style={{ padding: '4rem 0' }}>
        <Row g={4}>
          {VALUE_PROPS.map(({ Icon, title, body }) => (
            <Col key={title} md={3} sm={6}>
              <div
                aria-hidden="true"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '3rem',
                  height: '3rem',
                  borderRadius: 'var(--bs-border-radius, 0.5rem)',
                  background: 'rgba(var(--bs-primary-rgb), 0.1)',
                  color: 'var(--bs-primary)',
                  marginBottom: '0.9rem',
                }}
              >
                <Icon size={22} />
              </div>
              <Heading
                as="h3"
                size={5}
                style={{
                  fontFamily: DISPLAY_STACK,
                  color: 'var(--bs-heading-color, var(--bs-body-color))',
                  marginBottom: '0.4rem',
                }}
              >
                {title}
              </Heading>
              <Text muted style={{ display: 'block', fontSize: '0.94rem' }}>
                {body}
              </Text>
            </Col>
          ))}
        </Row>
      </Container>
    </section>

    {/* ── Product highlights ───────────────────────────────────────────── */}
    <section
      style={{
        background: 'var(--bs-tertiary-bg)',
        borderTop: '1px solid var(--bs-border-color)',
      }}
    >
      <Container style={{ padding: '4rem 0' }}>
        <div style={{ marginBottom: '2rem', maxWidth: 620 }}>
          <span style={sectionEyebrow}>The collection</span>
          <Heading
            as="h2"
            size={3}
            style={{
              fontFamily: DISPLAY_STACK,
              color: 'var(--bs-heading-color, var(--bs-body-color))',
              marginBottom: '0.5rem',
            }}
          >
            Every pair, one obsession
          </Heading>
          <Text muted style={{ display: 'block' }}>
            Four cuts, one standard. Pick your fit — each links straight to the detail page.
          </Text>
        </div>

        <Row g={4}>
          {products.map((p) => (
            <Col key={p.slug} md={3} sm={6}>
              <Card
                style={{
                  height: '100%',
                  overflow: 'hidden',
                  background: 'var(--bs-body-bg)',
                  borderColor: 'var(--bs-border-color)',
                }}
              >
                <div style={{ position: 'relative' }}>
                  <Ratio ratio="1x1">
                    <Image
                      src={p.image}
                      alt={p.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Ratio>
                  {p.badges[0] && (
                    <Badge
                      variant="primary"
                      style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}
                    >
                      {p.badges[0]}
                    </Badge>
                  )}
                </div>
                <CardBody style={{ display: 'flex', flexDirection: 'column' }}>
                  <CardTitle
                    style={{
                      fontFamily: DISPLAY_STACK,
                      fontSize: '1.05rem',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {p.name}
                  </CardTitle>
                  <Text
                    style={{
                      display: 'block',
                      fontWeight: 600,
                      color: 'var(--bs-primary)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    ${p.price}
                  </Text>
                  <CardText style={{ color: 'var(--bs-secondary-color)', fontSize: '0.9rem' }}>
                    {p.wash} · {p.fit}
                  </CardText>
                </CardBody>
                <CardFooter
                  style={{
                    background: 'transparent',
                    borderTop: '1px solid var(--bs-border-color)',
                  }}
                >
                  <Button
                    as={Link}
                    to={`/product/${p.slug}`}
                    variant="outline-primary"
                    size="sm"
                    style={{ width: '100%' }}
                    data-testid={`card-${p.slug}`}
                  >
                    View jeans
                  </Button>
                </CardFooter>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  </div>
)
