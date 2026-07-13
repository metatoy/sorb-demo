import React from 'react'
import {
  BootstrapStyledProvider,
  Button,
  Badge,
  Alert,
  Card,
  CardBody,
  CardTitle,
  CardText,
} from '@metatoy/bootstrap-styled'

// Showcase of the published @metatoy/bootstrap-styled@1.0.0 — real, unmodified
// library components. They self-style via styled-components; BootstrapStyledProvider
// supplies the --bs-* token surface. (bootstrap-styled stays Sorb-agnostic; this is
// just the demo Storybook rendering the published package.)

export default {
  title: 'Bootstrap-Styled/Showcase',
  decorators: [
    (Story) => (
      <BootstrapStyledProvider>
        <div style={{ padding: 24 }}>
          <Story />
        </div>
      </BootstrapStyledProvider>
    ),
  ],
}

export const Buttons = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="success">Success</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="outline-primary">Outline</Button>
      <Button variant="primary" size="sm">Small</Button>
      <Button variant="primary" size="lg">Large</Button>
    </div>
  ),
}

export const Badges = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="primary" pill>Pill</Badge>
    </div>
  ),
}

export const Alerts = {
  render: () => (
    <div style={{ display: 'grid', gap: 8, maxWidth: 480 }}>
      <Alert variant="success">A real bootstrap-styled success alert.</Alert>
      <Alert variant="warning">A warning alert.</Alert>
      <Alert variant="danger">A danger alert.</Alert>
    </div>
  ),
}

export const Cards = {
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <Card>
        <CardBody>
          <CardTitle>Card title</CardTitle>
          <CardText>A real @metatoy/bootstrap-styled Card — rendered from the published v1.0.0.</CardText>
          <Button variant="primary">Action</Button>
        </CardBody>
      </Card>
    </div>
  ),
}
