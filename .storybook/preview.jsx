import React from 'react'
import { SorbProvider } from '@sorb/leaf'
import { sorbConfig } from '../src/sorbConfig'

// Same committed token CSS the running app loads, so stories are themed
// identically (a Sorb preview swaps these vars live in both contexts).
import '../src/tokens/generated/variables.css'

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
