import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Port pinned to 3000 to match the backend's CORS allowlist
  // (see DEPAY_BACKEND src/app.ts's `allowedOrigins`), which
  // includes http://localhost:3000 but not Vite's 5173 default.
  server: {
    port: 3000,
  },
})
