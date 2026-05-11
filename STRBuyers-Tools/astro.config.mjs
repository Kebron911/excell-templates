import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://strbuyers.tools',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    mdx(),
    sitemap({
      // Sitemap auto-discovers /blog and /blog/[slug] from src/pages/.
      // The 6 still-unbuilt slugs in docs/BLOG-ROADMAP.md won't render
      // (no MDX yet) so they correctly do not appear in the sitemap.
      filter: (page) => !page.includes('/404'),
    })
  ],
  build: {
    assets: '_assets',
    inlineStylesheets: 'auto'
  },
  vite: {
    resolve: {
      // Use fileURLToPath for cross-platform path alias resolution.
      // The .pathname shortcut breaks on Windows (leading-slash drift).
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
    }
  }
});
