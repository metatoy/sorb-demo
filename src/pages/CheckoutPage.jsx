import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Heading, Text, Button } from '@metatoy/bootstrap-styled'
import { DISPLAY_STACK } from '../sorbBsTheme'

// P1 placeholder — P4 builds the forms-heavy checkout (billing/shipping/payment
// + validation, --bs-form-* bound). All var(--bs-*).
export const CheckoutPage = () => (
  <Container data-testid="page-checkout" style={{ padding: '3rem 0' }}>
    <Heading as="h1" size={2} style={{ fontFamily: DISPLAY_STACK }}>
      Checkout
    </Heading>
    <Text style={{ display: 'block', maxWidth: 560, margin: '1rem 0' }}>
      Your cart is ready. Billing, shipping, and payment land here in P4.
    </Text>
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
      <Button variant="primary" size="lg">
        Place order
      </Button>
      <Button as={Link} to="/" variant="outline-primary" size="lg">
        Keep shopping
      </Button>
    </div>
    <p style={{ color: 'var(--bs-secondary-color)', marginTop: '2rem' }}>
      Checkout placeholder (P1 chassis) — P4 builds the full validated form.
    </p>
  </Container>
)
