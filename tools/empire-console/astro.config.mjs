import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
const SITE = process.env.PUBLIC_CONSOLE_BASE_URL || 'http://localhost:4327';

export default defineConfig({
  site: SITE,
  integrations: [tailwind({ applyBaseStyles: false })],
  server: { port: 4327, host: true },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
