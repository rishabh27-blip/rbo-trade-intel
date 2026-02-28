import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/trade-engine/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'RBO Trade Intelligence',
        short_name: 'RBO Trade',
        description: 'Rice Bran Crude Oil Price Range Estimator & Trade Intelligence Platform',
        theme_color: '#050A0E',
        background_color: '#050A0E',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/trade-engine/',
        scope: '/trade-engine/',
        categories: ['finance', 'business', 'productivity'],
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        cleanupOutdatedCaches: true,
        sourcemap: false
      }
    })
  ]
})
