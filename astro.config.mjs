// @ts-check
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import cloudflare from '@astrojs/cloudflare'

// https://astro.build/config
export default defineConfig({
  output: 'hybrid', // Hybrid mode: static by default, SSR enabled per-page with prerender=false
  adapter: cloudflare(),
  integrations: [tailwind()]
})
