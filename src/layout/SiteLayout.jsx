import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

// The shared shell: Navbar + the routed page (<Outlet/>) + Footer. Used as the
// layout-route element so every route renders inside the same chrome (§C.1/§C.2).
// The page fills the space between navbar and footer (sticky footer via flex).
export const SiteLayout = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bs-body-bg)',
      color: 'var(--bs-body-color)',
      // Guard against the Bootstrap gutter-overflow: top-level Rows use large
      // gutters (g={4}/g={5} → negative -24px margins) that exceed the
      // Container's horizontal padding, poking a few px past the viewport at
      // narrow widths. Clip it here so no route ever scrolls horizontally; the
      // columns themselves render identically. (P6 responsive fix.)
      overflowX: 'hidden',
    }}
  >
    <Navbar />
    <div style={{ flex: 1 }}>
      <Outlet />
    </div>
    <Footer />
  </div>
)
