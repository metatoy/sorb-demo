import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Heading, Text } from '@metatoy/bootstrap-styled'
import { SorbMark } from './SorbMark'
import { DISPLAY_STACK } from '../sorbBsTheme'

// Shared footer (§E). Light `--bs-tertiary-bg` surface, link columns on the grid,
// wordmark + tagline, © row. Every color reads `var(--bs-*)` so it re-skins.
const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'Blue Jeans', to: '/product/classic-straight-blue-jeans' },
      { label: 'New Arrivals', to: '/' },
      { label: 'All Products', to: '/components' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Journal', to: '/#journal' },
      { label: 'Stockists', to: '/' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Shipping', to: '/checkout' },
      { label: 'Returns', to: '/' },
      { label: 'Contact', to: '/' },
    ],
  },
  {
    title: 'Follow',
    links: [
      { label: 'Instagram', to: '/' },
      { label: 'Newsletter', to: '/' },
    ],
  },
]

const colLink = {
  display: 'block',
  color: 'var(--bs-secondary-color)',
  textDecoration: 'none',
  padding: '0.2rem 0',
  fontSize: '0.9rem',
}

export const Footer = () => (
  <footer
    style={{
      background: 'var(--bs-tertiary-bg)',
      borderTop: '1px solid var(--bs-border-color)',
      marginTop: 'auto',
      paddingTop: '3rem',
      paddingBottom: '2rem',
    }}
  >
    <Container>
      <Row g={4}>
        <Col md={4}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: DISPLAY_STACK,
              fontSize: '1.25rem',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: 'var(--bs-heading-color, var(--bs-body-color))',
              marginBottom: '0.5rem',
            }}
          >
            <SorbMark size={26} />
            Jane&apos;s Jeans
          </div>
          <Text muted style={{ display: 'block', maxWidth: 260, fontSize: '0.9rem' }}>
            Denim, done right — built to be worn for years.
          </Text>
        </Col>

        {COLUMNS.map((c) => (
          <Col key={c.title} md={2} sm={6}>
            <Heading
              as="h3"
              size={6}
              style={{
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--bs-heading-color, var(--bs-body-color))',
                marginBottom: '0.75rem',
              }}
            >
              {c.title}
            </Heading>
            {c.links.map((l, i) => (
              <Link key={i} to={l.to} style={colLink}>
                {l.label}
              </Link>
            ))}
          </Col>
        ))}
      </Row>

      <div
        style={{
          borderTop: '1px solid var(--bs-border-color)',
          marginTop: '2.5rem',
          paddingTop: '1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem 1.5rem',
          justifyContent: 'space-between',
        }}
      >
        <Text muted style={{ fontSize: '0.85rem' }}>
          © 2026 Jane&apos;s Jeans
        </Text>
        <Text muted style={{ fontSize: '0.85rem' }}>
          Demo site for Sorb — token-driven theming.
        </Text>
      </div>
    </Container>
  </footer>
)
