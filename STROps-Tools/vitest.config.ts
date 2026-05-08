import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@lib': resolve(__dirname, 'src/lib'),
      '@data': resolve(__dirname, 'src/data'),
      '@components': resolve(__dirname, 'src/components'),
    },
  },
  test: { environment: 'node', include: ['tests/**/*.test.ts'] },
});
