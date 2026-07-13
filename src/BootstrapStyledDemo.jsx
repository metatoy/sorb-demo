import React from 'react'
import {
  BootstrapStyledProvider,
  Button,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Alert,
} from '@metatoy/bootstrap-styled'

// P7 — the "live re-skin" Sorb integration proof.
//
// This section mounts REAL, unmodified @metatoy/bootstrap-styled components
// (Button / Card / Alert). BootstrapStyledProvider emits its `--bs-*` custom
// properties on `:root` via a styled-components global stylesheet, e.g.
//   :root { --bs-primary: #0d6efd; --bs-body-bg: #fff; ... }
// and the components read them (Button: `--bs-btn-bg: var(--bs-primary)`).
//
// The Sorb leaf preview path (`@sorb/leaf` applyTokens) writes each pushed token
// as an INLINE custom property on document.documentElement:
//   document.documentElement.style.setProperty('--bs-primary', '#6f42c1')
// An inline `:root` write beats the stylesheet `:root` rule by specificity, so
// pushing a `bs-*`-keyed token set through the Sorb bridge re-skins these
// bootstrap-styled components LIVE — with NO change to bootstrap-styled and NO
// adapter in leaf. bootstrap-styled stays fully Sorb-agnostic.
//
// See p7/preview-tokens.json for the override set used in the proof, and
// p7/README.md for how it was pushed through `sorb dev` + POST /preview.

export const BootstrapStyledDemo = () => (
  <BootstrapStyledProvider>
    <section
      data-testid="bs-demo"
      style={{
        marginTop: 40,
        padding: 24,
        borderRadius: 12,
        // Reads bootstrap-styled's own token so the panel background itself
        // re-skins when --bs-body-bg is overridden through the bridge.
        background: 'var(--bs-body-bg)',
        border: '1px solid var(--bs-border-color)',
      }}
    >
      <h2 style={{ margin: '0 0 4px', fontSize: 18 }}>
        Live re-skin proof — real @metatoy/bootstrap-styled components
      </h2>
      <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--bs-body-color)' }}>
        These are unmodified bootstrap-styled components. Pushing a{' '}
        <code>bs-*</code>-keyed token set through the Sorb preview bridge recolors
        them here, live — no bootstrap-styled or leaf change.
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
        <Button variant="primary" data-testid="bs-btn-primary">
          Primary
        </Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline-primary" data-testid="bs-btn-outline-primary">
          Outline
        </Button>
      </div>

      <Alert variant="primary" data-testid="bs-alert-primary" style={{ marginBottom: 20 }}>
        This alert is a primary-variant bootstrap-styled component — it re-skins too.
      </Alert>

      <Card data-testid="bs-card" style={{ maxWidth: 360 }}>
        <CardBody>
          <CardTitle>Card title</CardTitle>
          <CardText>
            A real bootstrap-styled Card. Its border, background, and the button
            below all resolve from <code>--bs-*</code> tokens.
          </CardText>
          <Button variant="primary" data-testid="bs-card-btn">
            Card action
          </Button>
        </CardBody>
      </Card>
    </section>
  </BootstrapStyledProvider>
)
