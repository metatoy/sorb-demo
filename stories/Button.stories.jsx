import React from 'react'
import { Button } from '../src/components/Button'

// Token-wired Button stories. The SorbProvider in .storybook/preview.jsx wraps
// every story, so the @sorb/storybook "Bound Tokens" panel shows each story's
// component-tier bindings (--button-<variant>-*), and a live preview recolors
// these exactly as it does the running app.

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: { control: 'select', options: Button.variants },
    disabled: { control: 'boolean' },
  },
}

export const Primary = { args: { variant: 'primary', children: 'Primary' } }
export const Danger = { args: { variant: 'danger', children: 'Danger' } }
export const Success = { args: { variant: 'success', children: 'Success' } }
export const Outline = { args: { variant: 'outline', children: 'Outline' } }
export const Disabled = { args: { variant: 'primary', disabled: true, children: 'Disabled' } }

export const AllVariants = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {Button.variants.map((v) => (
        <Button key={v} variant={v}>
          {v}
        </Button>
      ))}
    </div>
  ),
}
