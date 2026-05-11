import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://thestrledger.com',
  output: 'static',
  // Aligns with canonical() in src/lib/seo.ts and the live sitemap's
  // trailing-slash URLs — eliminates dual-URL canonical drift.
  trailingSlash: 'always',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
    sitemap({
      customPages: [
        'https://thestrledger.com/feed.xml',
      ],
      filter: (page) => !page.includes('/404'),
    }),
  ],
  build: {
    assets: '_assets',
    inlineStylesheets: 'auto',
  },
  vite: {
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
  },
});
