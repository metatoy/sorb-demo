import React from 'react'
import { SorbProvider } from '@metatoy/sorb-leaf'
import { sorbConfig } from '../sorb.config'

// The same SorbProvider that wraps the real app also wraps every
// Storybook story. Token behaviour is identical in both contexts.

/** @type {import('@storybook/react').Preview} */
const preview = {
  decorators: [
    (Story) => (
      <SorbProvider config={sorbConfig}>
        <Story />
      </SorbProvider>
    ),
  ],
}

export default preview
