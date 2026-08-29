import React from 'react'
import { BootstrapStyledProvider, Button } from '@metatoy/bootstrap-styled'
import { sorbBsTheme } from '../src/sorbBsTheme'
import { DISPLAY_STACK } from '../src/sorbBsTheme'

// Site navbar capture (brand + links + denim Cart button). Built as a plain
// bound row rather than the responsive BsNavbar so the capture is a clean,
// composable frame; the denim Cart button binds to bs.primary.
export default {
  title: 'JanesJeans/Nav',
  decorators: [
    (Story) => (
      <BootstrapStyledProvider theme={sorbBsTheme}>
        <Story />
      </BootstrapStyledProvider>
    ),
  ],
}

export const SiteNavbar = {
  render: () => (
    <div
      style={{
        width: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 32px',
        background: 'var(--bs-body-bg)',
        borderBottom: '1px solid var(--bs-border-color)',
      }}
    >
      <div style={{ fontFamily: DISPLAY_STACK, fontSize: '20px', fontWeight: 600, color: 'var(--bs-body-color)' }}>
        Jane's Jeans
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <span style={{ color: 'var(--bs-body-color)' }}>Shop</span>
        <span style={{ color: 'var(--bs-body-color)' }}>Journal</span>
        <span style={{ color: 'var(--bs-body-color)' }}>About</span>
        <span style={{ color: 'var(--bs-body-color)' }}>Components</span>
        <Button variant="primary">Cart</Button>
      </div>
    </div>
  ),
}
