import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import { readdirSync } from 'node:fs';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://strhost.tools';
const postSlugs = readdirSync(fileURLToPath(new URL('./src/content/posts', import.meta.url)))
  .filter((f) => f.endsWith('.mdx'))
  .map((f) => f.replace(/\.mdx$/, ''));
const blogCustomPages = [
  `${SITE}/blog/`,
  `${SITE}/feed.xml`,
  ...postSlugs.map((s) => `${SITE}/blog/${s}/`),
];

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    mdx(),
    sitemap({ customPages: blogCustomPages })
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
