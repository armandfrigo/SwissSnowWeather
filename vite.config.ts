import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // use relative paths when building for GitHub Pages or other static hosts
  base: process.env.NODE_ENV === 'production' ? './' : '/',
  plugins: [react()],
})
