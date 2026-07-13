import React from 'react'
import { Container, Heading, Text, Button, Badge, Alert } from '@metatoy/bootstrap-styled'
import { DISPLAY_STACK } from '../sorbBsTheme'

// P1 placeholder — P5 builds the full component index (every bootstrap-styled
// component, the max re-skin surface). A small sampler here proves the theme +
// re-skin wiring. All var(--bs-*).
export const KitchenSinkPage = () => (
  <Container data-testid="page-components" style={{ padding: '3rem 0' }}>
    <Heading as="h1" size={2} style={{ fontFamily: DISPLAY_STACK }}>
      Components
    </Heading>
    <Text style={{ display: 'block', maxWidth: 560, margin: '1rem 0' }}>
      Every bootstrap-styled component lands here in P5. A small sampler for now:
    </Text>

    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline-primary">Outline</Button>
      <Badge variant="primary">Badge</Badge>
    </div>

    <Alert variant="primary" data-testid="ks-alert">
      This alert re-skins with the theme too — a primary-variant bootstrap-styled component.
    </Alert>

    <p style={{ color: 'var(--bs-secondary-color)', marginTop: '2rem' }}>
      Components placeholder (P1 chassis) — P5 builds the full kitchen sink.
    </p>
  </Container>
)
