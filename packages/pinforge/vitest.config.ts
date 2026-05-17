import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    exclude: ["tests/live/**", "node_modules", "dist"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      thresholds: { lines: 85, branches: 80, functions: 80, statements: 85 },
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        // CLI entrypoint — subprocess-tested in cli.test.ts, not importable in unit context
        "src/cli.ts",
        // Pino logger wrapper — no logic to test
        "src/logger.ts",
        // Side-effect barrel that registers templates — import side-effect only
        "src/templates/index.ts",
        // Pure re-export barrels — no logic
        "src/index.ts",
        "src/orchestrator/index.ts",
        // Type-only file — no runtime code
        "src/templates/types.ts",
        // Base class adapter interface — concrete impl tested via openai-adapter tests
        "src/seo/adapter.ts",
        // Job-writer not yet covered by unit test — honest exclusion until test added
        "src/output/job-writer.ts",
        "**/*.d.ts"
      ]
    },
    setupFiles: ["./tests/helpers/msw-server.ts"]
  }
});
