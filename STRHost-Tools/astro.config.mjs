import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://strhost.tools',
  output: 'static',
  // 'always' aligns with canonical() in src/lib/seo.ts and the live
  // sitemap's trailing-slash URLs — eliminates dual-URL canonical drift.
  trailingSlash: 'always',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    mdx(),
    sitemap({
      // Explicitly include the RSS endpoint. @astrojs/sitemap discovers
      // .astro pages but not custom API routes like feed.xml.ts, so it
      // must be listed here or Google won't see it from the sitemap.
      customPages: [
        'https://strhost.tools/feed.xml',
      ],
      // Drop noindex routes (e.g., 404) from the sitemap.
      filter: (page) => !page.includes('/404'),
    })
  ],
  build: {
    assets: '_assets',
    inlineStylesheets: 'auto'
  },
  vite: {
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
    }
  }
});
