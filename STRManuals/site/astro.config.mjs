import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://strmanuals.com',
  output: 'static',
  // Aligns canonical (built by lib/seo.ts) with @astrojs/sitemap default
  // trailing-slash output. Same convention as the sister sites.
  trailingSlash: 'always',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    mdx(),
    sitemap({
      // Drop /404 and HMAC-gated download URLs from the sitemap.
      filter: (page) => !page.includes('/404') && !page.includes('/downloads/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
