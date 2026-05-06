import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    exclude: ['tests/e2e/**']
  },
  resolve: {
    alias: { '@': new URL('./src', import.meta.url).pathname }
  }
});
