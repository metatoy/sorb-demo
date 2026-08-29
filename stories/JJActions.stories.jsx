import React from 'react'
import { BootstrapStyledProvider, Button } from '@metatoy/bootstrap-styled'
import { sorbBsTheme } from '../src/sorbBsTheme'

// Jane's Jeans denim component captures (FLS golden v4 — janes-jeans-figma-build).
// Rendered in the SAME provider stack as the running app: preview.jsx supplies
// SorbProvider + variables.css; this decorator adds BootstrapStyledProvider with
// the denim sorbBsTheme so every component emits the real --bs-* denim surface
// → sorb-seed capture binds fills/strokes to the denim bs.* tokens, not raw hex.
export default {
  title: 'JanesJeans/Actions',
  decorators: [
    (Story) => (
      <BootstrapStyledProvider theme={sorbBsTheme}>
        <Story />
      </BootstrapStyledProvider>
    ),
  ],
}

export const ButtonPrimary = { render: () => <Button variant="primary">Shop jeans</Button> }
export const ButtonPrimaryLg = { render: () => <Button variant="primary" size="lg">Add to cart · $98</Button> }
export const ButtonOutline = { render: () => <Button variant="outline-primary">Browse all</Button> }
export const ButtonOutlineSm = { render: () => <Button variant="outline-primary" size="sm">View jeans</Button> }
export const SizeChip = { render: () => <Button variant="outline-primary" size="sm">32</Button> }
