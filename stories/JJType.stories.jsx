import React from 'react'
import { BootstrapStyledProvider, Display, Heading, Lead, Text } from '@metatoy/bootstrap-styled'
import { sorbBsTheme } from '../src/sorbBsTheme'
import { DISPLAY_STACK } from '../src/sorbBsTheme'

// Typography specimens for the Component Set page. Sizes map to the new
// font.size.* scale (G1); the display family is DISPLAY_STACK.
export default {
  title: 'JanesJeans/Type',
  decorators: [
    (Story) => (
      <BootstrapStyledProvider theme={sorbBsTheme}>
        <Story />
      </BootstrapStyledProvider>
    ),
  ],
}

export const DisplayHeading = {
  render: () => (
    <div style={{ fontFamily: DISPLAY_STACK, fontSize: '30px', fontWeight: 600, color: 'var(--bs-body-color)' }}>
      Denim, done right.
    </div>
  ),
}

export const SectionHeading = {
  render: () => (
    <div style={{ fontFamily: DISPLAY_STACK, fontSize: '24px', fontWeight: 600, color: 'var(--bs-body-color)' }}>
      Every pair, one obsession
    </div>
  ),
}

export const LeadText = {
  render: () => (
    <div style={{ fontSize: '20px', color: 'var(--bs-secondary-color)', maxWidth: 460 }}>
      Honest blue jeans built to be worn for years — real denim, real fits.
    </div>
  ),
}

export const Eyebrow = {
  render: () => (
    <div style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--bs-primary)', fontWeight: 600 }}>
      The collection
    </div>
  ),
}

export const BodyText = {
  render: () => (
    <div style={{ fontSize: '15px', color: 'var(--bs-body-color)', maxWidth: 460 }}>
      A true straight leg in an honest mid-blue wash, with just enough stretch to move.
    </div>
  ),
}
