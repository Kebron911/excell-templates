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
      // /blog/* slugs were pre-listed in the sitemap before the blog
      // directory existed. Filter them out until src/pages/blog/* ships,
      // so crawlers don't discover 404s.
      filter: (page) => !page.includes('/blog'),
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
