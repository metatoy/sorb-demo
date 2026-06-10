import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Minimal Vite config for the reference app. `npm run dev` serves it on :5173;
// run `npm run sorb` (the bridge, :7777) alongside so the live-preview loop works.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
})
