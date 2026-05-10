import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import { remarkWordCount } from './src/lib/remark-word-count.mjs';

export default defineConfig({
  site: 'https://strops.tools',
  output: 'static',
  markdown: {
    remarkPlugins: [remarkWordCount],
  },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx({ remarkPlugins: [remarkWordCount] }),
    sitemap(),
    react(),
  ],
  vite: { ssr: { noExternal: ['pdf-lib', 'ics'] } },
});
