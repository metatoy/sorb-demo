import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Heading, Lead, Button, Badge } from '@metatoy/bootstrap-styled'
import { heroProduct } from '../data/catalog'
import { DISPLAY_STACK } from '../sorbBsTheme'

// P1 placeholder — routing + shell verification. P2 builds the real landing
// (hero · feature grid · product highlights). Everything reads var(--bs-*).
export const LandingPage = () => (
  <div data-testid="page-landing">
    <section
      style={{
        background: 'var(--bs-tertiary-bg)',
        borderBottom: '1px solid var(--bs-border-color)',
        padding: '5rem 0',
      }}
    >
      <Container>
        <Badge variant="primary" style={{ marginBottom: '1rem' }}>
          {heroProduct.badges[0] || 'New'}
        </Badge>
        <Heading as="h1" size={1} style={{ fontFamily: DISPLAY_STACK, maxWidth: 640 }}>
          Denim, done right.
        </Heading>
        <Lead style={{ maxWidth: 560, marginTop: '1rem', color: 'var(--bs-secondary-color)' }}>
          Honest blue jeans built to be worn for years. Meet the{' '}
          {heroProduct.name} — ${heroProduct.price}.
        </Lead>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
          <Button as={Link} to={`/product/${heroProduct.slug}`} variant="primary" size="lg">
            Shop the jeans
          </Button>
          <Button as={Link} to="/components" variant="outline-primary" size="lg">
            Browse components
          </Button>
        </div>
      </Container>
    </section>

    <Container style={{ padding: '3rem 0' }}>
      <p style={{ color: 'var(--bs-secondary-color)' }}>
        Landing page placeholder (P1 chassis) — P2 builds the full landing.
      </p>
    </Container>
  </div>
)
