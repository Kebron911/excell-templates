import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    exclude: ["node_modules", "dist"],
    setupFiles: ["../../packages/pinforge/tests/helpers/msw-server.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      thresholds: { lines: 80, branches: 75, functions: 75, statements: 80 }
    }
  }
});
