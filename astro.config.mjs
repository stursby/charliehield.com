// @ts-check
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import cloudflare from '@astrojs/cloudflare'

// https://astro.build/config
export default defineConfig({
  output: 'static', // Static pages by default, SSR per-page with prerender=false (Astro 5+)
  adapter: cloudflare(),
  integrations: [tailwind()]
})
