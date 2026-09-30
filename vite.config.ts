import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'ChatHermes',
        short_name: 'ChatHermes',
        description: 'A lightweight session client for Hermes Agent.',
        theme_color: '#162b26',
        background_color: '#f6f3e9',
        display: 'standalone',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        // Never cache authenticated session data or chat responses.
        navigateFallbackDenylist: [/^\/api\//, /^\/v1\//],
        runtimeCaching: [],
        globIgnores: ['**/api/**', '**/v1/**'],
      },
    }),
  ],
})
