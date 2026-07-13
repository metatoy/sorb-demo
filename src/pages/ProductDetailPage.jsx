import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { Container, Heading, Text, Lead, Button, Badge } from '@metatoy/bootstrap-styled'
import { getProduct } from '../data/catalog'
import { DISPLAY_STACK } from '../sorbBsTheme'

// P1 placeholder — resolves the :slug product (defaults to the hero). P3 builds
// the real detail page (gallery · specs · tabs · related). All var(--bs-*).
export const ProductDetailPage = () => {
  const { slug } = useParams()
  const product = getProduct(slug)

  return (
    <Container data-testid="page-product" style={{ padding: '3rem 0' }}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {product.badges.map((b) => (
          <Badge key={b} variant="primary">
            {b}
          </Badge>
        ))}
      </div>
      <Heading as="h1" size={2} style={{ fontFamily: DISPLAY_STACK }}>
        {product.name}
      </Heading>
      <Lead style={{ color: 'var(--bs-primary)', marginTop: '0.5rem' }}>
        ${product.price}
      </Lead>
      <Text style={{ display: 'block', maxWidth: 560, margin: '1rem 0' }}>{product.blurb}</Text>
      <Text muted style={{ display: 'block', marginBottom: '1.5rem' }}>
        {product.fit} · {product.rise} · {product.wash} · {product.fabric}
      </Text>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Button as={Link} to="/checkout" variant="primary" size="lg">
          Add to cart
        </Button>
        <Button as={Link} to="/" variant="outline-primary" size="lg">
          Back to shop
        </Button>
      </div>
      <p style={{ color: 'var(--bs-secondary-color)', marginTop: '2rem' }}>
        Product detail placeholder (P1 chassis) — P3 builds the full page.
      </p>
    </Container>
  )
}
