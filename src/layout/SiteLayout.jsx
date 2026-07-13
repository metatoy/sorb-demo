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
    }}
  >
    <Navbar />
    <div style={{ flex: 1 }}>
      <Outlet />
    </div>
    <Footer />
  </div>
)
