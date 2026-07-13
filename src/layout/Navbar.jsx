import React from 'react'
import { Link } from 'react-router-dom'
import {
  Navbar as BsNavbar,
  NavbarBrand,
  NavbarToggler,
  NavbarCollapse,
  NavbarNav,
  NavItem,
  NavLink,
  Button,
} from '@metatoy/bootstrap-styled'
import { SorbMark } from './SorbMark'
import { DISPLAY_STACK } from '../sorbBsTheme'

// Shared navbar (§E). Sticky top, white bg + 1px bottom rule — every color reads
// `var(--bs-*)`, so a `bs-*` preview push re-skins the chrome with the components.
const NAV_LINKS = [
  { label: 'Shop', to: '/' },
  { label: 'Journal', to: '/#journal' },
  { label: 'About', to: '/#about' },
  { label: 'Components', to: '/components' },
]

export const Navbar = () => (
  <BsNavbar
    expand="md"
    style={{
      position: 'sticky',
      top: 0,
      zIndex: 1020,
      background: 'var(--bs-body-bg)',
      borderBottom: '1px solid var(--bs-border-color)',
      padding: '0.65rem 0',
    }}
  >
    <div
      style={{
        width: '100%',
        maxWidth: 1140,
        margin: '0 auto',
        padding: '0 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <NavbarBrand
        as={Link}
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontFamily: DISPLAY_STACK,
          fontSize: '1.35rem',
          fontWeight: 700,
          letterSpacing: '-0.01em',
          color: 'var(--bs-heading-color, var(--bs-body-color))',
          textDecoration: 'none',
        }}
      >
        <SorbMark size={28} />
        Jane&apos;s Jeans
      </NavbarBrand>

      <NavbarToggler aria-label="Toggle navigation" style={{ marginLeft: 'auto' }} />

      <NavbarCollapse>
        <NavbarNav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            marginLeft: 'auto',
            listStyle: 'none',
            paddingLeft: 0,
            marginBottom: 0,
          }}
        >
          {NAV_LINKS.map((l) => (
            <NavItem key={l.label} style={{ listStyle: 'none' }}>
              <NavLink
                as={Link}
                to={l.to}
                style={{ color: 'var(--bs-body-color)', padding: '0.5rem 0.85rem' }}
              >
                {l.label}
              </NavLink>
            </NavItem>
          ))}
          <NavItem style={{ listStyle: 'none', marginLeft: '0.5rem' }}>
            <Button as={Link} to="/checkout" variant="primary" data-testid="nav-cart">
              Cart
            </Button>
          </NavItem>
        </NavbarNav>
      </NavbarCollapse>
    </div>
  </BsNavbar>
)
