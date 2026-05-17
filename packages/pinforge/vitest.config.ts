import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    exclude: ["tests/live/**", "node_modules", "dist"],
    coverage: { provider: "v8", reporter: ["text", "html"], lines: 85, branches: 80 },
    setupFiles: ["./tests/helpers/msw-server.ts"]
  }
});
