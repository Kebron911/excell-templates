import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    exclude: ['tests/e2e/**']
  },
  resolve: {
    // fileURLToPath, NOT .pathname — Windows-safe.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  }
});
