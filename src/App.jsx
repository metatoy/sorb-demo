import React from 'react'
import { useIsPreview, verifyResolved } from '@sorb/leaf'
import { sorbConfig } from './sorbConfig'
import { Button } from './components/Button'
import { Card } from './components/Card'

// The tokens the primary Button binds — what "verify the running app" checks.
const BOUND_TOKENS = [
  'button-primary-bg-default',
  'button-primary-text-default',
  'button-primary-border-default',
  'button-radius',
  'color-action-primary',
]

// The themed reference UI the demo narrates (spec/soft-launch-beta-feedback.md §2).
// Everything here renders from Sorb CSS custom properties, so proposing a token
// in the Figma plugin and previewing it recolors THIS running app live — step 5,
// the money moment. No hardcoded colors; the page background + text are tokens too.

export const App = () => {
  const isPreview = useIsPreview()
  const [verify, setVerify] = React.useState(null)

  const runVerify = async () => {
    setVerify({ pending: true })
    // Asserts the RUNNING app resolves to the committed token values (W2).
    // Reuse the same bridge origin + bearer key the provider previews against
    // (key is undefined for local dev → no Authorization header sent).
    const result = await verifyResolved(BOUND_TOKENS, {
      origin: sorbConfig.preview.origin,
      key: sorbConfig.preview.key,
    })
    setVerify(result)
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-surface)',
        color: 'var(--color-text-primary)',
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        padding: '40px',
        boxSizing: 'border-box',
      }}
    >
      <header style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>Sorb demo — themed by tokens</h1>
        <p style={{ margin: '6px 0 0', color: 'var(--color-text-secondary)', fontSize: 14 }}>
          Every control below renders from a CSS custom property. Propose a token in the Sorb
          plugin and watch it recolor here, live.{' '}
          {isPreview ? <strong style={{ color: 'var(--color-action-primary)' }}>(preview active)</strong> : null}
        </p>
      </header>

      <Card title="Buttons (component-tier tokens)">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {Button.variants.map((v) => (
            <Button key={v} variant={v} data-variant={v}>
              {v[0].toUpperCase() + v.slice(1)}
            </Button>
          ))}
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </Card>

      <div style={{ marginTop: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
        <Button variant="outline" onClick={runVerify} data-testid="verify-btn">
          Verify in running app
        </Button>
        {verify ? (
          <span data-testid="verify-result" style={{ fontSize: 14 }}>
            {verify.pending
              ? 'Checking…'
              : verify.ok
                ? `✅ Verified — the running app resolves to all ${verify.matched} bound tokens.`
                : verify.reason
                  ? `⚠️ ${verify.reason}${verify.error ? ` (${verify.error})` : ''}`
                  : `❌ ${verify.mismatches?.length || 0} mismatch(es) — e.g. ${verify.mismatches?.[0]?.cssVar} is ${verify.mismatches?.[0]?.got}, expected ${verify.mismatches?.[0]?.expected} (a preview is active / not committed).`}
          </span>
        ) : null}
      </div>
    </main>
  )
}
