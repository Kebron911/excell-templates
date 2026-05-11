import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// 2026-05-11: Switched from hybrid (Node adapter) to pure static.
// Path B chosen: Stripe payment links + n8n fulfillment instead of own
// /api/checkout, /api/stripe-webhook, /api/download. The original API
// routes are preserved at src/_disabled-api/ for future restoration.

export default defineConfig({
  site: 'https://strmanuals.com',
  output: 'static',
  // Aligns canonical (built by lib/seo.ts) with @astrojs/sitemap default
  // trailing-slash output. Same convention as the sister sites.
  trailingSlash: 'always',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
