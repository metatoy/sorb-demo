import React from 'react'
import { Card } from '../src/components/Card'
import { Button } from '../src/components/Button'

// Token-wired surface (semantic tier: --color-bg-surface / --color-border-subtle
// / --color-text-*). Demonstrates a composed surface recoloring under a preview.

export default {
  title: 'Components/Card',
  component: Card,
}

export const Basic = {
  args: {
    title: 'Surface card',
    children: 'Themed by semantic tokens — background, border, and text are all CSS custom properties.',
  },
}

export const WithActions = {
  render: () => (
    <Card title="Confirm change">
      <p style={{ margin: '0 0 16px', color: 'var(--color-text-secondary)' }}>
        Composed from token-wired primitives.
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="primary">Save</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </Card>
  ),
}
