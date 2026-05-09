import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://strops.tools',
  output: 'static',
  integrations: [tailwind({ applyBaseStyles: false }), mdx(), sitemap(), react()],
  vite: { ssr: { noExternal: ['pdf-lib', 'ics'] } },
});
