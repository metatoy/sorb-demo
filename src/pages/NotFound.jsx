import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Heading, Text, Button } from '@metatoy/bootstrap-styled'
import { DISPLAY_STACK } from '../sorbBsTheme'

// Catch-all — reuses the shared shell. All var(--bs-*).
export const NotFound = () => (
  <Container data-testid="page-notfound" style={{ padding: '5rem 0', textAlign: 'center' }}>
    <Heading as="h1" size={1} style={{ fontFamily: DISPLAY_STACK }}>
      404
    </Heading>
    <Text style={{ display: 'block', margin: '1rem 0', color: 'var(--bs-secondary-color)' }}>
      That page slipped a seam. Let's get you back to the jeans.
    </Text>
    <Button as={Link} to="/" variant="primary" size="lg">
      Back to shop
    </Button>
  </Container>
)
