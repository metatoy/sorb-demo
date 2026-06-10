import React from 'react'

// A token-wired button. Every visual is a Sorb CSS custom property
// (component tier: --button-<variant>-<role>-default + --button-radius), so a
// Sorb *preview* swaps the var and this recolors live — the demo's money moment.
// No hardcoded hex anywhere; the running app is themed entirely through tokens.

const VARIANTS = ['primary', 'danger', 'success', 'outline']

/**
 * @param {{ variant?: 'primary'|'danger'|'success'|'outline', disabled?: boolean, children: React.ReactNode }} props
 */
export const Button = ({ variant = 'primary', disabled = false, children, ...rest }) => {
  const state = disabled ? 'disabled' : 'default'
  const style = {
    // bound tokens — fill→bg, text→text, stroke→border, radius→radius
    background: `var(--button-${variant}-bg-${state})`,
    color: `var(--button-${variant}-text-${state})`,
    border: `1px solid var(--button-${variant}-border-${state})`,
    borderRadius: 'var(--button-radius)',
    padding: '8px 16px',
    font: 'inherit',
    fontWeight: 600,
    lineHeight: 1.2,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background 120ms ease, border-color 120ms ease',
  }
  return (
    <button type="button" disabled={disabled} style={style} {...rest}>
      {children}
    </button>
  )
}

Button.variants = VARIANTS
