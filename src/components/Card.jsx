import React from 'react'

// A token-wired surface card (semantic tier: --color-bg-surface,
// --color-border-subtle, --color-text-*, --radius-control). Like Button, it is
// themed entirely through Sorb CSS custom properties so it recolors under a
// live preview with no component code change.

/**
 * @param {{ title?: string, children: React.ReactNode }} props
 */
export const Card = ({ title, children }) => {
  const style = {
    background: 'var(--color-bg-surface)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 'var(--radius-control)',
    padding: '20px',
    color: 'var(--color-text-primary)',
    maxWidth: 420,
  }
  return (
    <section style={style}>
      {title && (
        <h2 style={{ margin: '0 0 12px', fontSize: 16, color: 'var(--color-text-primary)' }}>{title}</h2>
      )}
      {children}
    </section>
  )
}
