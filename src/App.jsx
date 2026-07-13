import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SiteLayout } from './layout/SiteLayout'
import { LandingPage } from './pages/LandingPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { KitchenSinkPage } from './pages/KitchenSinkPage'
import { NotFound } from './pages/NotFound'
import { HERO_SLUG } from './data/catalog'

// The routed Jane's Jeans store (GFP RC1 Part 3 · §C.1). Every route renders
// inside the shared <SiteLayout> (Navbar + <Outlet/> + Footer). App is mounted
// inside the provider stack in main.jsx (SorbProvider → BootstrapStyledProvider),
// so every surface renders from --bs-* custom properties — one bs-* preview push
// re-skins the whole shell live.
export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<LandingPage />} />
        {/* /product with no slug → the hero jeans */}
        <Route path="product" element={<Navigate to={`/product/${HERO_SLUG}`} replace />} />
        <Route path="product/:slug" element={<ProductDetailPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="components" element={<KitchenSinkPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
