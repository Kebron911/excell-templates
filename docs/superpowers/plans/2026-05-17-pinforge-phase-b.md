# PinForge Phase B Implementation Plan — REST API

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a Fastify HTTP service that wraps `@str/pinforge`'s `generatePin()` + `generateBatch()` with a stable REST API: single-pin generation (sync + async), bulk via JSON / CSV upload / published Google Sheet URL, job polling, brand + template introspection, `X-API-Key` auth, rate limit, body-size guards, OpenAPI auto-spec.

**Architecture:** New package `tools/pinforge-api/` (pnpm workspace, depends on `@str/pinforge` via `workspace:*`). Fastify v5 + `@fastify/rate-limit` + `@fastify/multipart`. In-process job registry (Map). All real work is delegated to `generatePin`/`generateBatch` — the API is a thin transport layer.

**Tech Stack:** TypeScript 5.5, Node ≥22, pnpm ≥9, Fastify 5, @fastify/rate-limit, @fastify/multipart, @fastify/swagger (+ swagger-ui), @str/pinforge (workspace), Zod (validation), undici (already in pinforge), vitest, light/supertest-style via Fastify.inject.

**Spec:** `docs/superpowers/specs/2026-05-16-pinforge-design.md` (sections 9, 11)
**Phase A plan it depends on:** `docs/superpowers/plans/2026-05-16-pinforge-phase-a.md`

---

## File Structure

```
tools/pinforge-api/
├── package.json
├── tsconfig.json
├── tsconfig.typecheck.json
├── vitest.config.ts
├── README.md
├── src/
│   ├── index.ts                    ← exports buildServer() for tests
│   ├── main.ts                     ← entry: read env, start server, listen
│   ├── server.ts                   ← buildServer(): registers all plugins + routes
│   ├── env.ts                      ← API-specific env (PINFORGE_API_KEY, PORT, HOST)
│   ├── auth.ts                     ← X-API-Key hook (constant-time compare)
│   ├── rate-limit.ts               ← Fastify rate-limit config
│   ├── errors.ts                   ← PinforgeError → HTTP mapper
│   ├── jobs.ts                     ← in-memory JobStore + helpers
│   ├── slug.ts                     ← canonical fetch from disk by slug
│   ├── routes/
│   │   ├── pins.ts                 ← POST /v1/pins (sync+async), GET /v1/pins/:slug, GET image
│   │   ├── pins-bulk.ts            ← POST /v1/pins/bulk (JSON array)
│   │   ├── pins-csv.ts             ← POST /v1/pins/csv (multipart)
│   │   ├── pins-sheet.ts           ← POST /v1/pins/sheet
│   │   ├── jobs.ts                 ← GET /v1/jobs/:id, GET /v1/jobs/:id/results.csv
│   │   ├── catalog.ts              ← GET /v1/brands, GET /v1/templates
│   │   └── health.ts               ← GET /healthz
│   └── schemas.ts                  ← Zod schemas for body/params + JSON-schema for OpenAPI
├── tests/
│   ├── helpers/
│   │   ├── build.ts                ← buildTestServer(), env stubs
│   │   ├── mock-pinforge.ts        ← stub @str/pinforge for unit-level route tests
│   │   └── temp-output.ts          ← per-test temp dir
│   ├── unit/
│   │   ├── auth.test.ts
│   │   ├── rate-limit.test.ts
│   │   ├── jobs.test.ts
│   │   └── errors.test.ts
│   ├── integration/
│   │   ├── pins-single.test.ts     ← POST /v1/pins sync + async + ?sync=1
│   │   ├── pins-bulk-json.test.ts
│   │   ├── pins-bulk-csv.test.ts
│   │   ├── pins-bulk-sheet.test.ts
│   │   ├── jobs-polling.test.ts
│   │   ├── jobs-csv-results.test.ts
│   │   ├── catalog.test.ts
│   │   └── health.test.ts
│   └── e2e/
│       └── full-roundtrip.test.ts  ← spin server, hit each endpoint with real pinforge (MSW-mocked OpenAI/n8n)
└── dist/
```

**Root file changes:**
- `pnpm-workspace.yaml` — `packages: tools/pinforge-api` line ADDED (currently the workspace globs in `pnpm-workspace.yaml` list `tools/empire-console` explicitly, not `tools/*`)
- `.env.example` (root) — append `PINFORGE_API_KEY`, `PINFORGE_API_PORT`, `PINFORGE_API_HOST`
- `.gitignore` — nothing new (dist already gitignored)

---

## Sub-phase Map

| Sub-phase | Tasks | Deliverable |
|---|---|---|
| **B1** Scaffolding & auth | 1-8 | Server boots, /healthz responds, auth middleware blocks/permits |
| **B2** Single-pin endpoints | 9-13 | POST /v1/pins works sync + async; GET /v1/pins/:slug + image |
| **B3** Bulk JSON + jobs | 14-18 | POST /v1/pins/bulk + GET /v1/jobs/:id polling + CSV results download |
| **B4** CSV multipart upload | 19-21 | POST /v1/pins/csv accepts file uploads |
| **B5** Google Sheet URL ingest | 22-24 | POST /v1/pins/sheet pulls CSV from published URL |
| **B6** Catalog endpoints + OpenAPI | 25-28 | /v1/brands, /v1/templates, OpenAPI spec auto-gen + swagger-ui |
| **B7** Full E2E + README | 29-30 | One test exercises every endpoint; README documents `pnpm pinforge-api start` |

Sub-phase boundaries are commit-clean.

---

## Conventions

- TDD throughout. Failing test → minimal impl → passing test → commit.
- One concept per commit. `git add` listed files explicitly.
- Run from monorepo root: `pnpm -F @str/pinforge-api <script>`.
- Tests: `pnpm -F @str/pinforge-api test`. Typecheck: `pnpm -F @str/pinforge-api typecheck`.
- Commit style: `feat(pinforge-api):`, `test(pinforge-api):`, `chore(pinforge-api):`.

---

## Sub-phase B1 — Scaffolding & auth

### Task 1: Package skeleton

**Files:**
- Create: `tools/pinforge-api/package.json`
- Create: `tools/pinforge-api/tsconfig.json`
- Create: `tools/pinforge-api/tsconfig.typecheck.json`
- Create: `tools/pinforge-api/vitest.config.ts`
- Create: `tools/pinforge-api/src/index.ts` (placeholder)
- Create: `tools/pinforge-api/README.md` (stub)
- Modify: `pnpm-workspace.yaml` (add `tools/pinforge-api`)

- [ ] **Step 1: Write `tools/pinforge-api/package.json`**

```json
{
  "name": "@str/pinforge-api",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "bin": { "pinforge-api": "./dist/main.js" },
  "exports": { ".": { "types": "./dist/index.d.ts", "default": "./dist/index.js" } },
  "files": ["dist", "src"],
  "scripts": {
    "build": "tsc",
    "start": "node ./dist/main.js",
    "dev": "tsc --watch",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --project tsconfig.typecheck.json",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@fastify/multipart": "^9.0.1",
    "@fastify/rate-limit": "^10.1.1",
    "@fastify/swagger": "^9.2.0",
    "@fastify/swagger-ui": "^5.1.0",
    "@str/pinforge": "workspace:*",
    "fastify": "^5.1.0",
    "fastify-type-provider-zod": "^4.0.2",
    "pino": "^9.5.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^22.5.0",
    "msw": "^2.4.0",
    "typescript": "^5.5.3",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: tsconfig.json** (matches @str/pinforge's setup minus JSX)

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: tsconfig.typecheck.json**

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": { "noEmit": true, "rootDir": "." },
  "include": ["src/**/*", "tests/**/*"]
}
```

- [ ] **Step 4: vitest.config.ts**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    exclude: ["node_modules", "dist"],
    coverage: { provider: "v8", reporter: ["text", "html"], thresholds: { lines: 80, branches: 75, functions: 75, statements: 80 } }
  }
});
```

- [ ] **Step 5: src/index.ts placeholder**

```ts
export const VERSION = "0.1.0";
```

- [ ] **Step 6: README.md stub**

```md
# @str/pinforge-api

REST API wrapping `@str/pinforge`. See `docs/superpowers/specs/2026-05-16-pinforge-design.md` section 9.

## Quickstart

```bash
pnpm -F @str/pinforge-api build
PINFORGE_API_KEY=secret-key pnpm -F @str/pinforge-api start
curl http://localhost:8787/healthz
```
```

- [ ] **Step 7: Update `pnpm-workspace.yaml`**

Add a line under the existing `packages:` block — same indentation as `tools/empire-console`:

```yaml
  - 'tools/pinforge-api'
```

- [ ] **Step 8: Install + verify**

Run: `pnpm install --ignore-scripts && pnpm -F @str/pinforge-api build`
Expected: clean install, `dist/index.js` exists.

- [ ] **Step 9: Commit**

```bash
git add tools/pinforge-api/ pnpm-workspace.yaml pnpm-lock.yaml
git commit -m "feat(pinforge-api): scaffold package skeleton"
```

---

### Task 2: API env validation

**Files:**
- Create: `tools/pinforge-api/src/env.ts`
- Create: `tools/pinforge-api/tests/unit/env.test.ts`
- Modify: `.env.example` (Excel-Templates root)

- [ ] **Step 1: Write failing test**

```ts
// tests/unit/env.test.ts
import { afterEach, describe, expect, it } from "vitest";
import { loadApiEnv } from "../../src/env.js";

const ORIG = { ...process.env };
afterEach(() => { process.env = { ...ORIG }; });

describe("loadApiEnv", () => {
  it("returns parsed config when required vars set", () => {
    process.env.PINFORGE_API_KEY = "test-key-32-chars-min-aaaaaaaaaa";
    process.env.OPENAI_API_KEY = "sk-test";
    const cfg = loadApiEnv();
    expect(cfg.apiKey).toBe("test-key-32-chars-min-aaaaaaaaaa");
    expect(cfg.port).toBe(8787);
    expect(cfg.host).toBe("127.0.0.1");
  });

  it("throws when PINFORGE_API_KEY is missing", () => {
    delete process.env.PINFORGE_API_KEY;
    process.env.OPENAI_API_KEY = "sk-test";
    expect(() => loadApiEnv()).toThrow(/PINFORGE_API_KEY/);
  });

  it("rejects API key shorter than 32 chars", () => {
    process.env.PINFORGE_API_KEY = "tooshort";
    process.env.OPENAI_API_KEY = "sk-test";
    expect(() => loadApiEnv()).toThrow(/32/);
  });

  it("respects PINFORGE_API_PORT override", () => {
    process.env.PINFORGE_API_KEY = "test-key-32-chars-min-aaaaaaaaaa";
    process.env.OPENAI_API_KEY = "sk-test";
    process.env.PINFORGE_API_PORT = "9000";
    expect(loadApiEnv().port).toBe(9000);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

Run: `pnpm -F @str/pinforge-api test env`

- [ ] **Step 3: Implement `src/env.ts`**

```ts
import { z } from "zod";
import { loadEnv as loadPinforgeEnv, type PinforgeEnv } from "@str/pinforge";

const ApiEnvSchema = z.object({
  PINFORGE_API_KEY: z.string().min(32, "PINFORGE_API_KEY must be at least 32 characters"),
  PINFORGE_API_PORT: z.coerce.number().int().positive().default(8787),
  PINFORGE_API_HOST: z.string().default("127.0.0.1"),
  PINFORGE_API_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(60),
  PINFORGE_API_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  PINFORGE_API_BODY_LIMIT_JSON: z.coerce.number().int().positive().default(256 * 1024),
  PINFORGE_API_BODY_LIMIT_CSV: z.coerce.number().int().positive().default(5 * 1024 * 1024),
  PINFORGE_API_BULK_MAX: z.coerce.number().int().positive().default(500),
  PINFORGE_API_SYNC_TIMEOUT_MS: z.coerce.number().int().positive().default(90_000)
});

export interface ApiEnv {
  apiKey: string;
  port: number;
  host: string;
  rateLimitMax: number;
  rateLimitWindowMs: number;
  bodyLimitJson: number;
  bodyLimitCsv: number;
  bulkMax: number;
  syncTimeoutMs: number;
  pinforge: PinforgeEnv;
}

export function loadApiEnv(source: NodeJS.ProcessEnv = process.env): ApiEnv {
  const parsed = ApiEnvSchema.safeParse(source);
  if (!parsed.success) {
    const msg = parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Invalid API env: ${msg}`);
  }
  const e = parsed.data;
  return {
    apiKey: e.PINFORGE_API_KEY,
    port: e.PINFORGE_API_PORT,
    host: e.PINFORGE_API_HOST,
    rateLimitMax: e.PINFORGE_API_RATE_LIMIT_MAX,
    rateLimitWindowMs: e.PINFORGE_API_RATE_LIMIT_WINDOW_MS,
    bodyLimitJson: e.PINFORGE_API_BODY_LIMIT_JSON,
    bodyLimitCsv: e.PINFORGE_API_BODY_LIMIT_CSV,
    bulkMax: e.PINFORGE_API_BULK_MAX,
    syncTimeoutMs: e.PINFORGE_API_SYNC_TIMEOUT_MS,
    pinforge: loadPinforgeEnv(source)
  };
}
```

- [ ] **Step 4: Run — expect 4 PASS**

- [ ] **Step 5: Append to root `.env.example`**

```bash
# --- PinForge API ---
PINFORGE_API_KEY=replace-with-32-char-secret
PINFORGE_API_PORT=8787
PINFORGE_API_HOST=127.0.0.1
PINFORGE_API_RATE_LIMIT_MAX=60
PINFORGE_API_RATE_LIMIT_WINDOW_MS=60000
PINFORGE_API_BODY_LIMIT_JSON=262144
PINFORGE_API_BODY_LIMIT_CSV=5242880
PINFORGE_API_BULK_MAX=500
PINFORGE_API_SYNC_TIMEOUT_MS=90000
```

- [ ] **Step 6: Commit**

```bash
git add tools/pinforge-api/src/env.ts tools/pinforge-api/tests/unit/env.test.ts .env.example
git commit -m "feat(pinforge-api): env validation"
```

---

### Task 3: Auth middleware (X-API-Key, constant-time)

**Files:**
- Create: `tools/pinforge-api/src/auth.ts`
- Create: `tools/pinforge-api/tests/unit/auth.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/unit/auth.test.ts
import Fastify from "fastify";
import { describe, expect, it } from "vitest";
import { registerAuth } from "../../src/auth.js";

const KEY = "test-key-32-chars-min-aaaaaaaaaa";

function buildApp() {
  const app = Fastify({ logger: false });
  registerAuth(app, { apiKey: KEY, skipPaths: ["/healthz"] });
  app.get("/healthz", async () => ({ ok: true }));
  app.get("/protected", async () => ({ data: "secret" }));
  return app;
}

describe("registerAuth", () => {
  it("permits /healthz without key", async () => {
    const app = buildApp();
    const res = await app.inject({ method: "GET", url: "/healthz" });
    expect(res.statusCode).toBe(200);
  });

  it("rejects protected route without X-API-Key", async () => {
    const app = buildApp();
    const res = await app.inject({ method: "GET", url: "/protected" });
    expect(res.statusCode).toBe(401);
    expect(res.json().error.code).toBe("UNAUTHORIZED");
  });

  it("rejects wrong key", async () => {
    const app = buildApp();
    const res = await app.inject({ method: "GET", url: "/protected", headers: { "x-api-key": "wrong" } });
    expect(res.statusCode).toBe(401);
  });

  it("permits correct key", async () => {
    const app = buildApp();
    const res = await app.inject({ method: "GET", url: "/protected", headers: { "x-api-key": KEY } });
    expect(res.statusCode).toBe(200);
    expect(res.json().data).toBe("secret");
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement `src/auth.ts`**

```ts
import type { FastifyInstance } from "fastify";
import { timingSafeEqual } from "node:crypto";

export interface AuthOptions {
  apiKey: string;
  skipPaths?: string[];
}

export function registerAuth(app: FastifyInstance, opts: AuthOptions): void {
  const skip = new Set(opts.skipPaths ?? []);
  const expected = Buffer.from(opts.apiKey, "utf8");

  app.addHook("onRequest", async (req, reply) => {
    if (skip.has(req.url) || skip.has(req.url.split("?")[0]!)) return;

    const raw = req.headers["x-api-key"];
    const provided = Array.isArray(raw) ? raw[0] : raw;
    if (!provided || typeof provided !== "string") {
      reply.code(401).send({ error: { code: "UNAUTHORIZED", message: "missing X-API-Key" } });
      return;
    }
    const providedBuf = Buffer.from(provided, "utf8");
    if (providedBuf.length !== expected.length || !timingSafeEqual(providedBuf, expected)) {
      reply.code(401).send({ error: { code: "UNAUTHORIZED", message: "invalid X-API-Key" } });
      return;
    }
  });
}
```

- [ ] **Step 4: Run — expect 4 PASS**

- [ ] **Step 5: Commit**

```bash
git add tools/pinforge-api/src/auth.ts tools/pinforge-api/tests/unit/auth.test.ts
git commit -m "feat(pinforge-api): X-API-Key auth with constant-time compare"
```

---

### Task 4: Error mapper

**Files:**
- Create: `tools/pinforge-api/src/errors.ts`
- Create: `tools/pinforge-api/tests/unit/errors.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/unit/errors.test.ts
import { describe, expect, it } from "vitest";
import { BrandNotFoundError, N8nImageError, RenderError, ValidationError } from "@str/pinforge";
import { mapErrorToHttp } from "../../src/errors.js";

describe("mapErrorToHttp", () => {
  it("maps ValidationError → 400", () => {
    const r = mapErrorToHttp(new ValidationError("bad input"));
    expect(r.status).toBe(400);
    expect(r.body.error.code).toBe("VALIDATION");
  });
  it("maps BrandNotFoundError → 404", () => {
    const r = mapErrorToHttp(new BrandNotFoundError("x", ["y"]));
    expect(r.status).toBe(404);
    expect(r.body.error.code).toBe("BRAND_NOT_FOUND");
    expect(r.body.error.context.availableBrands).toEqual(["y"]);
  });
  it("maps N8nImageError → 502", () => {
    const r = mapErrorToHttp(new N8nImageError("timeout"));
    expect(r.status).toBe(502);
  });
  it("maps RenderError → 500", () => {
    const r = mapErrorToHttp(new RenderError("satori"));
    expect(r.status).toBe(500);
  });
  it("maps unknown Error → 500 with generic body", () => {
    const r = mapErrorToHttp(new Error("plain"));
    expect(r.status).toBe(500);
    expect(r.body.error.code).toBe("INTERNAL");
    expect(r.body.error.message).not.toContain("plain"); // no leak
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement `src/errors.ts`**

```ts
import { PinforgeError } from "@str/pinforge";

const CODE_TO_STATUS: Record<string, number> = {
  VALIDATION: 400,
  BRAND_NOT_FOUND: 404,
  TEMPLATE_NOT_FOUND: 404,
  SEO_LLM_FAILED: 502,
  N8N_IMAGE_FAILED: 502,
  UNSPLASH_FAILED: 502,
  RENDER_FAILED: 500,
  OUTPUT_WRITE: 500
};

export interface HttpErrorBody {
  error: { code: string; message: string; context: Record<string, unknown> };
}

export interface HttpError {
  status: number;
  body: HttpErrorBody;
}

export function mapErrorToHttp(err: unknown): HttpError {
  if (err instanceof PinforgeError) {
    return {
      status: CODE_TO_STATUS[err.code] ?? 500,
      body: { error: { code: err.code, message: err.message, context: err.context } }
    };
  }
  return {
    status: 500,
    body: { error: { code: "INTERNAL", message: "Internal server error", context: {} } }
  };
}
```

- [ ] **Step 4: Run — expect 5 PASS**

- [ ] **Step 5: Commit**

```bash
git add tools/pinforge-api/src/errors.ts tools/pinforge-api/tests/unit/errors.test.ts
git commit -m "feat(pinforge-api): PinforgeError → HTTP mapper"
```

---

### Task 5: Rate limit config

**Files:**
- Create: `tools/pinforge-api/src/rate-limit.ts`
- Create: `tools/pinforge-api/tests/unit/rate-limit.test.ts`

- [ ] **Step 1: Write test**

```ts
// tests/unit/rate-limit.test.ts
import Fastify from "fastify";
import { describe, expect, it } from "vitest";
import { registerRateLimit } from "../../src/rate-limit.js";

async function buildApp() {
  const app = Fastify({ logger: false });
  await registerRateLimit(app, { max: 3, windowMs: 60_000 });
  app.get("/x", async () => ({ ok: true }));
  return app;
}

describe("registerRateLimit", () => {
  it("permits up to max requests, then 429", async () => {
    const app = await buildApp();
    for (let i = 0; i < 3; i++) {
      const r = await app.inject({ method: "GET", url: "/x" });
      expect(r.statusCode).toBe(200);
    }
    const blocked = await app.inject({ method: "GET", url: "/x" });
    expect(blocked.statusCode).toBe(429);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement `src/rate-limit.ts`**

```ts
import rateLimit from "@fastify/rate-limit";
import type { FastifyInstance } from "fastify";

export interface RateLimitOptions {
  max: number;
  windowMs: number;
}

export async function registerRateLimit(app: FastifyInstance, opts: RateLimitOptions): Promise<void> {
  await app.register(rateLimit, {
    max: opts.max,
    timeWindow: opts.windowMs,
    keyGenerator: (req) => {
      const key = req.headers["x-api-key"];
      return typeof key === "string" ? key : (req.ip ?? "anonymous");
    }
  });
}
```

- [ ] **Step 4: Run — expect 1 PASS**

- [ ] **Step 5: Commit**

```bash
git add tools/pinforge-api/src/rate-limit.ts tools/pinforge-api/tests/unit/rate-limit.test.ts
git commit -m "feat(pinforge-api): per-API-key rate limit"
```

---

### Task 6: buildServer + healthz

**Files:**
- Create: `tools/pinforge-api/src/server.ts`
- Create: `tools/pinforge-api/src/routes/health.ts`
- Create: `tools/pinforge-api/tests/helpers/build.ts`
- Create: `tools/pinforge-api/tests/integration/health.test.ts`

- [ ] **Step 1: Write helper `tests/helpers/build.ts`**

```ts
import type { ApiEnv } from "../../src/env.js";
import { buildServer } from "../../src/server.js";

const DEFAULT_API_KEY = "test-key-32-chars-min-aaaaaaaaaa";

export function makeApiEnv(overrides: Partial<ApiEnv> = {}): ApiEnv {
  return {
    apiKey: DEFAULT_API_KEY,
    port: 8787,
    host: "127.0.0.1",
    rateLimitMax: 100,
    rateLimitWindowMs: 60_000,
    bodyLimitJson: 256 * 1024,
    bodyLimitCsv: 5 * 1024 * 1024,
    bulkMax: 500,
    syncTimeoutMs: 90_000,
    pinforge: {
      openaiApiKey: "sk-test",
      openaiModel: "gpt-4o-mini",
      n8nBaseUrl: undefined,
      n8nPinKey: undefined,
      unsplashAccessKey: undefined,
      outputDir: "./dist/pins",
      jobsDir: "./dist/jobs",
      queueConcurrency: 2,
      queueIntervalCap: 10,
      queueIntervalMs: 60_000,
      n8nTimeoutMs: 60_000
    },
    ...overrides
  };
}

export const TEST_API_KEY = DEFAULT_API_KEY;
export { buildServer };
```

- [ ] **Step 2: Write test `tests/integration/health.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { buildServer, makeApiEnv } from "../helpers/build.js";

describe("GET /healthz", () => {
  it("returns ok with version, no auth required", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const res = await app.inject({ method: "GET", url: "/healthz" });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.ok).toBe(true);
    expect(body.version).toBeTypeOf("string");
    await app.close();
  });
});
```

- [ ] **Step 3: Run — expect FAIL**

- [ ] **Step 4: Implement `src/routes/health.ts`**

```ts
import type { FastifyInstance } from "fastify";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const PKG = JSON.parse(
  readFileSync(resolve(fileURLToPath(import.meta.url), "..", "..", "..", "package.json"), "utf8")
);

export function registerHealthRoutes(app: FastifyInstance): void {
  app.get("/healthz", async () => ({ ok: true, version: PKG.version }));
}
```

- [ ] **Step 5: Implement `src/server.ts`**

```ts
import Fastify, { type FastifyInstance } from "fastify";
import type { ApiEnv } from "./env.js";
import { registerAuth } from "./auth.js";
import { registerRateLimit } from "./rate-limit.js";
import { registerHealthRoutes } from "./routes/health.js";

export interface BuildServerInput {
  env: ApiEnv;
  brandsDir: string;
  outputDir: string;
}

export async function buildServer(input: BuildServerInput): Promise<FastifyInstance> {
  const app = Fastify({
    logger: { level: process.env.LOG_LEVEL ?? "info", name: "pinforge-api" },
    bodyLimit: input.env.bodyLimitJson,
    trustProxy: false
  });

  await registerRateLimit(app, { max: input.env.rateLimitMax, windowMs: input.env.rateLimitWindowMs });
  registerAuth(app, { apiKey: input.env.apiKey, skipPaths: ["/healthz"] });
  registerHealthRoutes(app);

  return app;
}
```

- [ ] **Step 6: Run — expect 1 PASS**

- [ ] **Step 7: Commit**

```bash
git add tools/pinforge-api/src/server.ts tools/pinforge-api/src/routes/health.ts tools/pinforge-api/tests/helpers/build.ts tools/pinforge-api/tests/integration/health.test.ts
git commit -m "feat(pinforge-api): buildServer + /healthz"
```

---

### Task 7: main entry point

**Files:**
- Create: `tools/pinforge-api/src/main.ts`
- Modify: `tools/pinforge-api/src/index.ts` (export buildServer)

- [ ] **Step 1: Write `src/main.ts`**

```ts
#!/usr/bin/env node
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadApiEnv } from "./env.js";
import { buildServer } from "./server.js";

// Resolve @str/pinforge brands directory at startup (lives in the installed package's brands/)
const PINFORGE_BRANDS_DIR = resolve(
  fileURLToPath(import.meta.resolve("@str/pinforge/package.json")),
  "..", "brands"
);

async function start(): Promise<void> {
  const env = loadApiEnv();
  const outputDir = resolve(process.cwd(), env.pinforge.outputDir);

  const app = await buildServer({ env, brandsDir: PINFORGE_BRANDS_DIR, outputDir });

  try {
    await app.listen({ host: env.host, port: env.port });
    app.log.info({ host: env.host, port: env.port }, "pinforge-api listening");
  } catch (err) {
    app.log.error({ err }, "failed to start");
    process.exit(1);
  }
}

start();
```

- [ ] **Step 2: Replace `src/index.ts`**

```ts
export const VERSION = "0.1.0";
export { buildServer, type BuildServerInput } from "./server.js";
export { loadApiEnv, type ApiEnv } from "./env.js";
export { mapErrorToHttp, type HttpError, type HttpErrorBody } from "./errors.js";
```

- [ ] **Step 3: Build**

Run: `pnpm -F @str/pinforge-api build`
Expected: clean. `dist/main.js` exists.

- [ ] **Step 4: Smoke (no real listen — just verify entry compiles)**

Run: `node -e "import('@str/pinforge-api').then(m => console.log(m.VERSION))"` from repo root.
Expected: `0.1.0`.

- [ ] **Step 5: Commit**

```bash
git add tools/pinforge-api/src/main.ts tools/pinforge-api/src/index.ts
git commit -m "feat(pinforge-api): main entry point"
```

---

### Task 8: Mock pinforge helper (for route tests)

**Files:**
- Create: `tools/pinforge-api/tests/helpers/mock-pinforge.ts`

- [ ] **Step 1: Write `tests/helpers/mock-pinforge.ts`**

```ts
import { vi } from "vitest";
import type { PinResult, PinMetadata } from "@str/pinforge";

export function makeFakePin(overrides: Partial<PinMetadata> = {}): PinResult {
  const meta: PinMetadata = {
    schema: "pinforge.v1",
    format: "static",
    videoSourcePath: null,
    generatedAt: "2026-05-17T00:00:00.000Z",
    brandId: "strguests",
    templateId: "big-hook",
    title: "Mocked title",
    description: "M".repeat(160),
    altText: "Mocked alt text long enough to pass",
    hashtags: ["#a", "#b", "#c"],
    boardHint: "STR Host Tips",
    destinationUrl: "https://strguests.tools/x",
    imagePath: "pins/2026-05-17/strguests/mocked-1234.png",
    fallbackUsed: false,
    backgroundSource: "n8n",
    sourceInputs: { topic: "mocked", primaryKeyword: "mock", inputMode: "topic" },
    ...overrides
  };
  return {
    pinPng: Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    metadata: meta,
    paths: { png: "/tmp/mocked.png", json: "/tmp/mocked.json" }
  };
}

export function stubGeneratePin(impl: (...args: unknown[]) => Promise<PinResult> | PinResult) {
  return vi.fn(impl);
}
```

- [ ] **Step 2: Commit**

```bash
git add tools/pinforge-api/tests/helpers/mock-pinforge.ts
git commit -m "test(pinforge-api): mock pinforge helper for route tests"
```

---

*B1 complete. Server boots, /healthz responds, auth + rate-limit are enforceable. Next: B2 single-pin endpoints.*

---

## Sub-phase B2 — Single-pin endpoints

### Task 9: POST /v1/pins schema + route stub

**Files:**
- Create: `tools/pinforge-api/src/schemas.ts`
- Create: `tools/pinforge-api/src/routes/pins.ts`
- Modify: `tools/pinforge-api/src/server.ts` (register pins routes)
- Create: `tools/pinforge-api/tests/integration/pins-single.test.ts`

- [ ] **Step 1: Write test (single-pin async first)**

```ts
// tests/integration/pins-single.test.ts
import { describe, expect, it, vi } from "vitest";
import { buildServer, makeApiEnv, TEST_API_KEY } from "../helpers/build.js";
import { makeFakePin } from "../helpers/mock-pinforge.js";

vi.mock("@str/pinforge", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@str/pinforge")>();
  return { ...actual, generatePin: vi.fn(async () => makeFakePin()) };
});

describe("POST /v1/pins", () => {
  it("returns 401 without auth", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const res = await app.inject({ method: "POST", url: "/v1/pins", payload: { brandId: "strguests", topic: "t", primaryKeyword: "k", destinationUrl: "https://x.com/" } });
    expect(res.statusCode).toBe(401);
    await app.close();
  });

  it("returns 202 with jobId + pollUrl for async (default)", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const res = await app.inject({
      method: "POST", url: "/v1/pins",
      headers: { "x-api-key": TEST_API_KEY, "content-type": "application/json" },
      payload: { brandId: "strguests", topic: "topic", primaryKeyword: "kw", destinationUrl: "https://strguests.tools/x" }
    });
    expect(res.statusCode).toBe(202);
    expect(res.json().jobId).toMatch(/^job_/);
    expect(res.json().pollUrl).toContain("/v1/jobs/job_");
    await app.close();
  });

  it("returns 200 with pin + paths for ?sync=1", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const res = await app.inject({
      method: "POST", url: "/v1/pins?sync=1",
      headers: { "x-api-key": TEST_API_KEY, "content-type": "application/json" },
      payload: { brandId: "strguests", topic: "topic", primaryKeyword: "kw", destinationUrl: "https://strguests.tools/x" }
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().pin.brandId).toBe("strguests");
    expect(res.json().paths.png).toBeTypeOf("string");
    await app.close();
  });

  it("returns 400 on malformed body", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const res = await app.inject({
      method: "POST", url: "/v1/pins",
      headers: { "x-api-key": TEST_API_KEY, "content-type": "application/json" },
      payload: { brandId: "strguests" } // missing required fields
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().error.code).toBe("VALIDATION");
    await app.close();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement `src/schemas.ts`**

```ts
import { PinInputSchema } from "@str/pinforge";
export const PostPinBodySchema = PinInputSchema;
export type PostPinBody = ReturnType<typeof PinInputSchema.parse>;

export const PostPinSyncQuerySchema = (await import("zod")).z.object({
  sync: (await import("zod")).z.enum(["1", "true"]).optional()
});
```

(Or — simpler, avoid the dynamic await:)

```ts
import { z } from "zod";
import { PinInputSchema } from "@str/pinforge";

export const PostPinBodySchema = PinInputSchema;
export type PostPinBody = ReturnType<typeof PinInputSchema.parse>;

export const PostPinSyncQuerySchema = z.object({
  sync: z.enum(["1", "true"]).optional()
});
```

Use the second form.

- [ ] **Step 4: Implement `src/routes/pins.ts`**

```ts
import type { FastifyInstance } from "fastify";
import { generatePin } from "@str/pinforge";
import { mapErrorToHttp } from "../errors.js";
import { PostPinBodySchema, PostPinSyncQuerySchema } from "../schemas.js";
import { createJobId, registerJob, completeJob, failJob, getJob } from "../jobs.js";
import type { ApiEnv } from "../env.js";

export interface PinsRoutesDeps {
  env: ApiEnv;
  brandsDir: string;
  outputDir: string;
}

export function registerPinsRoutes(app: FastifyInstance, deps: PinsRoutesDeps): void {
  app.post("/v1/pins", async (req, reply) => {
    // Validate body
    const parsedBody = PostPinBodySchema.safeParse(req.body);
    if (!parsedBody.success) {
      const msg = parsedBody.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join("; ");
      reply.code(400).send({ error: { code: "VALIDATION", message: msg, context: { issues: parsedBody.error.issues } } });
      return;
    }
    const input = parsedBody.data;

    const query = PostPinSyncQuerySchema.parse(req.query ?? {});
    const sync = query.sync === "1" || query.sync === "true";

    if (sync) {
      try {
        const result = await Promise.race([
          generatePin(input, { env: deps.env.pinforge, brandsDir: deps.brandsDir, outputDir: deps.outputDir }),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error("sync timeout")), deps.env.syncTimeoutMs))
        ]);
        reply.code(200).send({ pin: result.metadata, paths: result.paths });
        return;
      } catch (err) {
        const httpErr = mapErrorToHttp(err);
        reply.code(httpErr.status).send(httpErr.body);
        return;
      }
    }

    // Async path: register job, fire-and-forget, return 202
    const jobId = createJobId();
    registerJob(jobId, { total: 1 });
    // Don't await — let it run in background
    generatePin(input, { env: deps.env.pinforge, brandsDir: deps.brandsDir, outputDir: deps.outputDir })
      .then(result => completeJob(jobId, [{ ok: true, pin: result.metadata, paths: result.paths }]))
      .catch(err => failJob(jobId, err));

    reply.code(202).send({
      jobId,
      pollUrl: `/v1/jobs/${jobId}`,
      estimatedSeconds: 8
    });
  });

  app.get("/v1/pins/:slug", async (req, reply) => {
    reply.code(501).send({ error: { code: "NOT_IMPLEMENTED", message: "GET /v1/pins/:slug — Task 11", context: {} } });
  });

  app.get("/v1/pins/:slug/image", async (req, reply) => {
    reply.code(501).send({ error: { code: "NOT_IMPLEMENTED", message: "GET /v1/pins/:slug/image — Task 12", context: {} } });
  });
}
```

- [ ] **Step 5: Implement `src/jobs.ts` (in-memory registry — minimal for this task)**

```ts
import { randomBytes } from "node:crypto";

export type JobStatus = "pending" | "running" | "done" | "failed";

export interface JobResultEntry {
  ok: boolean;
  pin?: unknown;
  paths?: unknown;
  error?: { code: string; message: string; context: Record<string, unknown> };
}

export interface JobState {
  jobId: string;
  status: JobStatus;
  createdAt: string;
  completedAt?: string;
  progress: { done: number; total: number; failed: number };
  results?: JobResultEntry[];
  fatalError?: { code: string; message: string };
}

const JOBS = new Map<string, JobState>();

export function createJobId(): string {
  return `job_${Date.now().toString(36)}_${randomBytes(4).toString("hex")}`;
}

export function registerJob(jobId: string, init: { total: number }): JobState {
  const job: JobState = {
    jobId,
    status: "running",
    createdAt: new Date().toISOString(),
    progress: { done: 0, total: init.total, failed: 0 }
  };
  JOBS.set(jobId, job);
  return job;
}

export function completeJob(jobId: string, results: JobResultEntry[]): void {
  const job = JOBS.get(jobId);
  if (!job) return;
  job.status = "done";
  job.completedAt = new Date().toISOString();
  job.results = results;
  job.progress.done = results.filter(r => r.ok).length;
  job.progress.failed = results.filter(r => !r.ok).length;
  job.progress.total = results.length;
}

export function failJob(jobId: string, err: unknown): void {
  const job = JOBS.get(jobId);
  if (!job) return;
  job.status = "failed";
  job.completedAt = new Date().toISOString();
  const msg = err instanceof Error ? err.message : String(err);
  job.fatalError = { code: "JOB_FAILED", message: msg };
  job.progress.failed = job.progress.total;
}

export function getJob(jobId: string): JobState | undefined {
  return JOBS.get(jobId);
}

/** Test helper. NOT exported from index.ts. */
export function _resetJobs(): void {
  JOBS.clear();
}
```

- [ ] **Step 6: Wire `pins` routes into `src/server.ts`**

In `buildServer`, after `registerHealthRoutes(app)`:

```ts
import { registerPinsRoutes } from "./routes/pins.js";
// ...
registerPinsRoutes(app, { env: input.env, brandsDir: input.brandsDir, outputDir: input.outputDir });
```

- [ ] **Step 7: Run — expect 4 PASS**

- [ ] **Step 8: Commit**

```bash
git add tools/pinforge-api/src/schemas.ts tools/pinforge-api/src/routes/pins.ts tools/pinforge-api/src/jobs.ts tools/pinforge-api/src/server.ts tools/pinforge-api/tests/integration/pins-single.test.ts
git commit -m "feat(pinforge-api): POST /v1/pins (sync + async)"
```

---

### Task 10: Job polling endpoint + tests

**Files:**
- Create: `tools/pinforge-api/src/routes/jobs.ts`
- Create: `tools/pinforge-api/tests/integration/jobs-polling.test.ts`
- Create: `tools/pinforge-api/tests/unit/jobs.test.ts`
- Modify: `tools/pinforge-api/src/server.ts` (register jobs routes)

- [ ] **Step 1: Unit tests for jobs module**

```ts
// tests/unit/jobs.test.ts
import { describe, expect, it, beforeEach } from "vitest";
import { _resetJobs, completeJob, createJobId, failJob, getJob, registerJob } from "../../src/jobs.js";

beforeEach(() => _resetJobs());

describe("jobs registry", () => {
  it("createJobId produces job_ prefixed unique ids", () => {
    const a = createJobId(); const b = createJobId();
    expect(a).toMatch(/^job_/);
    expect(a).not.toBe(b);
  });
  it("registerJob sets status running", () => {
    const job = registerJob("job_x", { total: 5 });
    expect(job.status).toBe("running");
    expect(job.progress.total).toBe(5);
  });
  it("completeJob updates status + counts", () => {
    registerJob("job_x", { total: 3 });
    completeJob("job_x", [{ ok: true }, { ok: true }, { ok: false, error: { code: "X", message: "x", context: {} } }]);
    const j = getJob("job_x")!;
    expect(j.status).toBe("done");
    expect(j.progress.done).toBe(2);
    expect(j.progress.failed).toBe(1);
  });
  it("failJob captures fatalError", () => {
    registerJob("job_x", { total: 1 });
    failJob("job_x", new Error("crashed"));
    expect(getJob("job_x")!.status).toBe("failed");
    expect(getJob("job_x")!.fatalError?.message).toBe("crashed");
  });
});
```

- [ ] **Step 2: Integration test**

```ts
// tests/integration/jobs-polling.test.ts
import { describe, expect, it, vi } from "vitest";
import { buildServer, makeApiEnv, TEST_API_KEY } from "../helpers/build.js";
import { makeFakePin } from "../helpers/mock-pinforge.js";

vi.mock("@str/pinforge", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@str/pinforge")>();
  return { ...actual, generatePin: vi.fn(async () => makeFakePin()) };
});

describe("GET /v1/jobs/:id", () => {
  it("returns 404 for unknown job", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const res = await app.inject({ method: "GET", url: "/v1/jobs/job_nonexistent", headers: { "x-api-key": TEST_API_KEY } });
    expect(res.statusCode).toBe(404);
    await app.close();
  });

  it("returns running then done as job progresses", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const created = await app.inject({
      method: "POST", url: "/v1/pins",
      headers: { "x-api-key": TEST_API_KEY, "content-type": "application/json" },
      payload: { brandId: "strguests", topic: "t", primaryKeyword: "k", destinationUrl: "https://strguests.tools/x" }
    });
    const jobId = created.json().jobId;

    // Wait a tick for the fire-and-forget to complete the mocked generatePin
    await new Promise(r => setTimeout(r, 30));

    const poll = await app.inject({ method: "GET", url: `/v1/jobs/${jobId}`, headers: { "x-api-key": TEST_API_KEY } });
    expect(poll.statusCode).toBe(200);
    expect(poll.json().status).toBe("done");
    expect(poll.json().progress.done).toBe(1);
    await app.close();
  });
});
```

- [ ] **Step 3: Run — expect FAIL**

- [ ] **Step 4: Implement `src/routes/jobs.ts`**

```ts
import type { FastifyInstance } from "fastify";
import { getJob } from "../jobs.js";

export function registerJobsRoutes(app: FastifyInstance): void {
  app.get("/v1/jobs/:jobId", async (req, reply) => {
    const jobId = (req.params as { jobId: string }).jobId;
    const job = getJob(jobId);
    if (!job) {
      reply.code(404).send({ error: { code: "JOB_NOT_FOUND", message: `No job '${jobId}'`, context: { jobId } } });
      return;
    }
    reply.code(200).send(job);
  });
}
```

- [ ] **Step 5: Register in server.ts**

```ts
import { registerJobsRoutes } from "./routes/jobs.js";
// after registerPinsRoutes:
registerJobsRoutes(app);
```

- [ ] **Step 6: Run — expect 4+2 PASS (unit + integration)**

- [ ] **Step 7: Commit**

```bash
git add tools/pinforge-api/src/routes/jobs.ts tools/pinforge-api/src/server.ts tools/pinforge-api/tests/integration/jobs-polling.test.ts tools/pinforge-api/tests/unit/jobs.test.ts
git commit -m "feat(pinforge-api): GET /v1/jobs/:id polling"
```

---

### Task 11: GET /v1/pins/:slug (metadata fetch by slug from disk)

**Files:**
- Create: `tools/pinforge-api/src/slug.ts`
- Modify: `tools/pinforge-api/src/routes/pins.ts` (replace 501 stub with real impl)
- Add tests to `tests/integration/pins-single.test.ts`

- [ ] **Step 1: Implement `src/slug.ts`**

```ts
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const SAFE_SLUG = /^[a-z0-9-]+$/;
const SAFE_BRAND = /^[a-z0-9-]+$/;

export interface FetchPinInput {
  outputDir: string;
  slug: string;
}

export interface FetchedPin {
  metadata: unknown;
  pngPath: string;
  jsonPath: string;
  date: string;
  brandId: string;
}

export async function fetchPinBySlug(input: FetchPinInput): Promise<FetchedPin | null> {
  if (!SAFE_SLUG.test(input.slug)) return null;

  // Walk dist/pins/<date>/<brandId>/<slug>.json — search latest date first
  let dates: string[] = [];
  try { dates = (await readdir(input.outputDir)).filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort().reverse(); }
  catch { return null; }

  for (const date of dates) {
    let brands: string[] = [];
    try { brands = (await readdir(join(input.outputDir, date))).filter(b => SAFE_BRAND.test(b)); }
    catch { continue; }
    for (const brand of brands) {
      const jsonPath = join(input.outputDir, date, brand, `${input.slug}.json`);
      const pngPath = join(input.outputDir, date, brand, `${input.slug}.png`);
      try {
        const raw = await readFile(jsonPath, "utf8");
        return { metadata: JSON.parse(raw), pngPath, jsonPath, date, brandId: brand };
      } catch { /* not in this brand dir, continue */ }
    }
  }
  return null;
}
```

- [ ] **Step 2: Replace stub in `src/routes/pins.ts`**

```ts
// at top, add:
import { fetchPinBySlug } from "../slug.js";

// replace the /v1/pins/:slug handler:
app.get("/v1/pins/:slug", async (req, reply) => {
  const slug = (req.params as { slug: string }).slug;
  const fetched = await fetchPinBySlug({ outputDir: deps.outputDir, slug });
  if (!fetched) {
    reply.code(404).send({ error: { code: "PIN_NOT_FOUND", message: `No pin with slug '${slug}'`, context: { slug } } });
    return;
  }
  reply.code(200).send({ pin: fetched.metadata, paths: { png: fetched.pngPath, json: fetched.jsonPath } });
});
```

- [ ] **Step 3: Add tests**

Append to `tests/integration/pins-single.test.ts`:

```ts
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";

describe("GET /v1/pins/:slug", () => {
  it("returns pin by slug found on disk", async () => {
    const dir = await mkdtemp(`${tmpdir()}/pinforge-api-`);
    try {
      await mkdir(`${dir}/2026-05-17/strguests`, { recursive: true });
      await writeFile(`${dir}/2026-05-17/strguests/test-pin-abcd.json`, JSON.stringify({ brandId: "strguests", title: "Hi" }));
      await writeFile(`${dir}/2026-05-17/strguests/test-pin-abcd.png`, Buffer.from([137,80,78,71]));

      const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: dir });
      const res = await app.inject({ method: "GET", url: "/v1/pins/test-pin-abcd", headers: { "x-api-key": TEST_API_KEY } });
      expect(res.statusCode).toBe(200);
      expect(res.json().pin.brandId).toBe("strguests");
      await app.close();
    } finally { await rm(dir, { recursive: true, force: true }); }
  });

  it("returns 404 for missing slug", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const res = await app.inject({ method: "GET", url: "/v1/pins/nonexistent", headers: { "x-api-key": TEST_API_KEY } });
    expect(res.statusCode).toBe(404);
    await app.close();
  });

  it("returns 404 for unsafe slug", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const res = await app.inject({ method: "GET", url: "/v1/pins/..%2Fevil", headers: { "x-api-key": TEST_API_KEY } });
    expect(res.statusCode).toBe(404);
    await app.close();
  });
});
```

- [ ] **Step 4: Run — expect 3 new tests PASS**

- [ ] **Step 5: Commit**

```bash
git add tools/pinforge-api/src/slug.ts tools/pinforge-api/src/routes/pins.ts tools/pinforge-api/tests/integration/pins-single.test.ts
git commit -m "feat(pinforge-api): GET /v1/pins/:slug by-slug lookup"
```

---

### Task 12: GET /v1/pins/:slug/image (PNG stream)

**Files:**
- Modify: `tools/pinforge-api/src/routes/pins.ts` (replace second 501 stub)
- Add test

- [ ] **Step 1: Add test to `pins-single.test.ts`**

```ts
import { createReadStream } from "node:fs";

describe("GET /v1/pins/:slug/image", () => {
  it("streams the PNG when found", async () => {
    const dir = await mkdtemp(`${tmpdir()}/pinforge-api-`);
    try {
      await mkdir(`${dir}/2026-05-17/strguests`, { recursive: true });
      await writeFile(`${dir}/2026-05-17/strguests/img-abcd.json`, JSON.stringify({ brandId: "strguests" }));
      const pngBytes = Buffer.from([137,80,78,71,13,10,26,10,0,0,0,13]);
      await writeFile(`${dir}/2026-05-17/strguests/img-abcd.png`, pngBytes);

      const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: dir });
      const res = await app.inject({ method: "GET", url: "/v1/pins/img-abcd/image", headers: { "x-api-key": TEST_API_KEY } });
      expect(res.statusCode).toBe(200);
      expect(res.headers["content-type"]).toBe("image/png");
      expect(res.rawPayload.equals(pngBytes)).toBe(true);
      await app.close();
    } finally { await rm(dir, { recursive: true, force: true }); }
  });
});
```

- [ ] **Step 2: Implement in `src/routes/pins.ts`**

Replace the /image handler:

```ts
import { createReadStream } from "node:fs";

app.get("/v1/pins/:slug/image", async (req, reply) => {
  const slug = (req.params as { slug: string }).slug;
  const fetched = await fetchPinBySlug({ outputDir: deps.outputDir, slug });
  if (!fetched) {
    reply.code(404).send({ error: { code: "PIN_NOT_FOUND", message: `No pin with slug '${slug}'`, context: { slug } } });
    return;
  }
  reply.header("content-type", "image/png");
  reply.header("cache-control", "public, max-age=31536000, immutable");
  return reply.send(createReadStream(fetched.pngPath));
});
```

- [ ] **Step 3: Run — expect 1 new test PASS**

- [ ] **Step 4: Commit**

```bash
git add tools/pinforge-api/src/routes/pins.ts tools/pinforge-api/tests/integration/pins-single.test.ts
git commit -m "feat(pinforge-api): GET /v1/pins/:slug/image PNG stream"
```

---

### Task 13: Wire single-pin module exports

**Files:**
- Modify: `tools/pinforge-api/src/index.ts`

Append:
```ts
export { fetchPinBySlug, type FetchPinInput, type FetchedPin } from "./slug.js";
export { type JobState, type JobStatus, type JobResultEntry } from "./jobs.js";
```

Build + typecheck clean. Commit:
```bash
git add tools/pinforge-api/src/index.ts
git commit -m "feat(pinforge-api): export slug + jobs types from public API"
```

---

*B2 complete. POST + GET single-pin endpoints work end-to-end with mocked pinforge. Next: B3 bulk JSON.*

---

## Sub-phase B3 — Bulk JSON + jobs CSV download

### Task 14: POST /v1/pins/bulk (JSON array)

**Files:**
- Create: `tools/pinforge-api/src/routes/pins-bulk.ts`
- Create: `tools/pinforge-api/tests/integration/pins-bulk-json.test.ts`
- Modify: `src/server.ts`

- [ ] **Step 1: Write test**

```ts
import { describe, expect, it, vi } from "vitest";
import { buildServer, makeApiEnv, TEST_API_KEY } from "../helpers/build.js";
import { makeFakePin } from "../helpers/mock-pinforge.js";

vi.mock("@str/pinforge", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@str/pinforge")>();
  return {
    ...actual,
    generateBatch: vi.fn(async (inputs: unknown[]) => ({
      jobId: "job_mocked",
      succeeded: inputs.map(input => ({ input, result: makeFakePin() })),
      failed: []
    }))
  };
});

describe("POST /v1/pins/bulk (JSON)", () => {
  it("accepts ≤500 items and returns 202", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const items = Array.from({ length: 3 }, (_, i) => ({
      brandId: "strguests",
      topic: `topic ${i}`,
      primaryKeyword: `kw${i}`,
      destinationUrl: `https://strguests.tools/${i}`
    }));
    const res = await app.inject({
      method: "POST", url: "/v1/pins/bulk",
      headers: { "x-api-key": TEST_API_KEY, "content-type": "application/json" },
      payload: { items }
    });
    expect(res.statusCode).toBe(202);
    expect(res.json().jobId).toMatch(/^job_/);
    expect(res.json().count).toBe(3);
    expect(res.json().pollUrl).toContain("/v1/jobs/job_");
    await app.close();
  });

  it("rejects > bulkMax (500)", async () => {
    const app = await buildServer({ env: makeApiEnv({ bulkMax: 2 }), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const items = Array.from({ length: 3 }, () => ({ brandId: "x", topic: "t", primaryKeyword: "k", destinationUrl: "https://x.com/" }));
    const res = await app.inject({
      method: "POST", url: "/v1/pins/bulk",
      headers: { "x-api-key": TEST_API_KEY, "content-type": "application/json" },
      payload: { items }
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().error.code).toBe("VALIDATION");
    await app.close();
  });

  it("rejects empty array", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const res = await app.inject({
      method: "POST", url: "/v1/pins/bulk",
      headers: { "x-api-key": TEST_API_KEY, "content-type": "application/json" },
      payload: { items: [] }
    });
    expect(res.statusCode).toBe(400);
    await app.close();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement `src/routes/pins-bulk.ts`**

```ts
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { generateBatch, PinInputSchema } from "@str/pinforge";
import { createJobId, registerJob, completeJob, failJob } from "../jobs.js";
import type { ApiEnv } from "../env.js";

const BulkBodySchema = (max: number) => z.object({
  items: z.array(PinInputSchema).min(1, "items must contain at least 1 row").max(max, `items cannot exceed ${max}`)
});

export interface BulkRoutesDeps {
  env: ApiEnv;
  brandsDir: string;
  outputDir: string;
}

export function registerBulkJsonRoute(app: FastifyInstance, deps: BulkRoutesDeps): void {
  const schema = BulkBodySchema(deps.env.bulkMax);

  app.post("/v1/pins/bulk", async (req, reply) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join("; ");
      reply.code(400).send({ error: { code: "VALIDATION", message: msg, context: { issues: parsed.error.issues } } });
      return;
    }
    const items = parsed.data.items;

    const jobId = createJobId();
    registerJob(jobId, { total: items.length });

    generateBatch(items, { env: deps.env.pinforge, brandsDir: deps.brandsDir, outputDir: deps.outputDir })
      .then(result => completeJob(jobId, [
        ...result.succeeded.map(s => ({ ok: true as const, pin: s.result.metadata, paths: s.result.paths })),
        ...result.failed.map(f => ({ ok: false as const, error: f.error }))
      ]))
      .catch(err => failJob(jobId, err));

    reply.code(202).send({
      jobId,
      count: items.length,
      pollUrl: `/v1/jobs/${jobId}`
    });
  });
}
```

- [ ] **Step 4: Register in `server.ts`**

```ts
import { registerBulkJsonRoute } from "./routes/pins-bulk.js";
registerBulkJsonRoute(app, { env: input.env, brandsDir: input.brandsDir, outputDir: input.outputDir });
```

- [ ] **Step 5: Run — expect 3 PASS**

- [ ] **Step 6: Commit**

```bash
git add tools/pinforge-api/src/routes/pins-bulk.ts tools/pinforge-api/src/server.ts tools/pinforge-api/tests/integration/pins-bulk-json.test.ts
git commit -m "feat(pinforge-api): POST /v1/pins/bulk JSON"
```

---

### Task 15: GET /v1/jobs/:id/results.csv

**Files:**
- Modify: `tools/pinforge-api/src/routes/jobs.ts`
- Create: `tools/pinforge-api/tests/integration/jobs-csv-results.test.ts`

- [ ] **Step 1: Write test**

```ts
import { describe, expect, it, vi } from "vitest";
import { buildServer, makeApiEnv, TEST_API_KEY } from "../helpers/build.js";
import { makeFakePin } from "../helpers/mock-pinforge.js";

vi.mock("@str/pinforge", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@str/pinforge")>();
  return {
    ...actual,
    generateBatch: vi.fn(async () => ({
      jobId: "job_mocked",
      succeeded: [{ input: {}, result: makeFakePin({ title: "Pin A" }) }, { input: {}, result: makeFakePin({ title: "Pin B" }) }],
      failed: [{ input: {}, error: { code: "BRAND_NOT_FOUND", message: "no x", context: {} } }]
    }))
  };
});

describe("GET /v1/jobs/:id/results.csv", () => {
  it("returns CSV with one row per result", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const created = await app.inject({
      method: "POST", url: "/v1/pins/bulk",
      headers: { "x-api-key": TEST_API_KEY, "content-type": "application/json" },
      payload: { items: [
        { brandId: "x", topic: "topic-a", primaryKeyword: "kw", destinationUrl: "https://x.com/a" },
        { brandId: "x", topic: "topic-b", primaryKeyword: "kw", destinationUrl: "https://x.com/b" },
        { brandId: "x", topic: "topic-c", primaryKeyword: "kw", destinationUrl: "https://x.com/c" }
      ] }
    });
    const jobId = created.json().jobId;

    await new Promise(r => setTimeout(r, 30));

    const csv = await app.inject({ method: "GET", url: `/v1/jobs/${jobId}/results.csv`, headers: { "x-api-key": TEST_API_KEY } });
    expect(csv.statusCode).toBe(200);
    expect(csv.headers["content-type"]).toContain("text/csv");
    const body = csv.body;
    expect(body).toContain("status,brandId,templateId,title,pngPath,error");
    expect(body).toContain("ok,strguests,big-hook");
    expect(body).toContain("failed,,,,,\"BRAND_NOT_FOUND: no x\"");
    await app.close();
  });

  it("returns 404 for unknown job", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const res = await app.inject({ method: "GET", url: "/v1/jobs/job_nope/results.csv", headers: { "x-api-key": TEST_API_KEY } });
    expect(res.statusCode).toBe(404);
    await app.close();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Append to `src/routes/jobs.ts`**

```ts
const escape = (s: string) => `"${s.replace(/"/g, '""')}"`;

function jobToCsv(job: import("../jobs.js").JobState): string {
  const header = "status,brandId,templateId,title,pngPath,error\n";
  if (!job.results) return header;
  const rows = job.results.map(r => {
    if (r.ok && r.pin) {
      const pin = r.pin as { brandId: string; templateId: string; title: string };
      const paths = r.paths as { png: string };
      return ["ok", pin.brandId, pin.templateId, escape(pin.title), escape(paths.png), ""].join(",");
    }
    const err = r.error!;
    return ["failed", "", "", "", "", escape(`${err.code}: ${err.message}`)].join(",");
  });
  return header + rows.join("\n") + "\n";
}

// Append to registerJobsRoutes:
app.get("/v1/jobs/:jobId/results.csv", async (req, reply) => {
  const jobId = (req.params as { jobId: string }).jobId;
  const job = getJob(jobId);
  if (!job) { reply.code(404).send({ error: { code: "JOB_NOT_FOUND", message: `No job '${jobId}'`, context: { jobId } } }); return; }
  reply.header("content-type", "text/csv; charset=utf-8");
  reply.header("content-disposition", `attachment; filename="${jobId}-results.csv"`);
  reply.send(jobToCsv(job));
});
```

- [ ] **Step 4: Run — expect 2 PASS**

- [ ] **Step 5: Commit**

```bash
git add tools/pinforge-api/src/routes/jobs.ts tools/pinforge-api/tests/integration/jobs-csv-results.test.ts
git commit -m "feat(pinforge-api): GET /v1/jobs/:id/results.csv"
```

---

### Tasks 16-18 — Test polish + edge cases for B3

- [ ] **Task 16:** Add per-item validation error reporting test for bulk — verify that one bad row doesn't fail the whole batch (already covered by `pinforge` integration, but verify it propagates through the HTTP layer).

```bash
# Add a test where bulk has 2 valid + 1 invalid item, expect 202, job completes with 2 ok + 1 failed in results
```

Implementation: no code change needed — already works. Just add the test. Commit:
```bash
git add tools/pinforge-api/tests/integration/pins-bulk-json.test.ts
git commit -m "test(pinforge-api): bulk continues on per-item validation failure"
```

- [ ] **Task 17:** Add `body too large` test (set `bodyLimitJson` low, POST oversized body, expect 413). Commit:
```bash
git commit -m "test(pinforge-api): bulk JSON body size limit enforced"
```

- [ ] **Task 18:** Add concurrent-job test — fire 3 bulk jobs in parallel, verify jobIds are unique and each completes independently.

Commit:
```bash
git commit -m "test(pinforge-api): concurrent bulk jobs don't collide"
```

---

*B3 complete. Bulk JSON + job polling + CSV download all working. Next: B4 CSV upload.*

---

## Sub-phase B4 — CSV upload

### Task 19: Register @fastify/multipart

**Files:**
- Modify: `tools/pinforge-api/src/server.ts`

- [ ] **Step 1: Register the plugin in `buildServer`** (after rate limit, before auth — multipart needs to parse body before auth reads headers? Actually order doesn't matter much; place after auth):

```ts
import multipart from "@fastify/multipart";

await app.register(multipart, {
  limits: {
    fileSize: input.env.bodyLimitCsv,
    files: 1
  }
});
```

- [ ] **Step 2: Build + run existing tests — verify no regression**

Run: `pnpm -F @str/pinforge-api test`
Expected: all prior tests still pass.

- [ ] **Step 3: Commit**

```bash
git add tools/pinforge-api/src/server.ts
git commit -m "feat(pinforge-api): register @fastify/multipart"
```

---

### Task 20: POST /v1/pins/csv

**Files:**
- Create: `tools/pinforge-api/src/routes/pins-csv.ts`
- Create: `tools/pinforge-api/tests/integration/pins-bulk-csv.test.ts`

- [ ] **Step 1: Write test**

```ts
import { describe, expect, it, vi } from "vitest";
import { buildServer, makeApiEnv, TEST_API_KEY } from "../helpers/build.js";
import { makeFakePin } from "../helpers/mock-pinforge.js";
import FormData from "form-data";

vi.mock("@str/pinforge", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@str/pinforge")>();
  return {
    ...actual,
    generateBatch: vi.fn(async (inputs: unknown[]) => ({
      jobId: "job_csv",
      succeeded: inputs.map(i => ({ input: i, result: makeFakePin() })),
      failed: []
    }))
  };
});

const CSV = `brandId,topic,primaryKeyword,destinationUrl
strguests,topic-a,kw1,https://strguests.tools/a
strguests,topic-b,kw2,https://strguests.tools/b
`;

describe("POST /v1/pins/csv", () => {
  it("accepts multipart CSV upload and returns 202", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const form = new FormData();
    form.append("file", Buffer.from(CSV), { filename: "pins.csv", contentType: "text/csv" });

    const res = await app.inject({
      method: "POST", url: "/v1/pins/csv",
      headers: { ...form.getHeaders(), "x-api-key": TEST_API_KEY },
      payload: form.getBuffer()
    });
    expect(res.statusCode).toBe(202);
    expect(res.json().jobId).toMatch(/^job_/);
    expect(res.json().count).toBe(2);
    await app.close();
  });

  it("reports parse errors in response", async () => {
    const bad = `brandId,topic,primaryKeyword,destinationUrl\nstrguests,t,k,not-a-url\nstrguests,topic,kw,https://strguests.tools/x`;
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const form = new FormData();
    form.append("file", Buffer.from(bad), { filename: "pins.csv", contentType: "text/csv" });

    const res = await app.inject({
      method: "POST", url: "/v1/pins/csv",
      headers: { ...form.getHeaders(), "x-api-key": TEST_API_KEY },
      payload: form.getBuffer()
    });
    expect(res.statusCode).toBe(202);
    expect(res.json().count).toBe(1);
    expect(res.json().parseErrors).toHaveLength(1);
    expect(res.json().parseErrors[0].line).toBe(2);
    await app.close();
  });
});
```

Note: requires `form-data` devDep. Add it in this task:
```bash
pnpm -F @str/pinforge-api add -D form-data
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement `src/routes/pins-csv.ts`**

```ts
import type { FastifyInstance } from "fastify";
import { generateBatch, parsePinInputCsv } from "@str/pinforge";
import { createJobId, registerJob, completeJob, failJob } from "../jobs.js";
import type { ApiEnv } from "../env.js";

export interface CsvRoutesDeps {
  env: ApiEnv;
  brandsDir: string;
  outputDir: string;
}

export function registerCsvRoute(app: FastifyInstance, deps: CsvRoutesDeps): void {
  app.post("/v1/pins/csv", async (req, reply) => {
    const file = await req.file();
    if (!file) {
      reply.code(400).send({ error: { code: "VALIDATION", message: "missing file part", context: {} } });
      return;
    }
    const text = (await file.toBuffer()).toString("utf8");
    const parsed = parsePinInputCsv(text);

    if (parsed.rows.length === 0) {
      reply.code(400).send({ error: { code: "VALIDATION", message: "no valid rows in CSV", context: { parseErrors: parsed.errors } } });
      return;
    }
    if (parsed.rows.length > deps.env.bulkMax) {
      reply.code(400).send({ error: { code: "VALIDATION", message: `CSV exceeds bulkMax (${deps.env.bulkMax})`, context: { count: parsed.rows.length } } });
      return;
    }

    const jobId = createJobId();
    registerJob(jobId, { total: parsed.rows.length });

    generateBatch(parsed.rows, { env: deps.env.pinforge, brandsDir: deps.brandsDir, outputDir: deps.outputDir })
      .then(result => completeJob(jobId, [
        ...result.succeeded.map(s => ({ ok: true as const, pin: s.result.metadata, paths: s.result.paths })),
        ...result.failed.map(f => ({ ok: false as const, error: f.error }))
      ]))
      .catch(err => failJob(jobId, err));

    reply.code(202).send({
      jobId,
      count: parsed.rows.length,
      parseErrors: parsed.errors.length > 0 ? parsed.errors : undefined,
      pollUrl: `/v1/jobs/${jobId}`
    });
  });
}
```

- [ ] **Step 4: Register in `server.ts`**

```ts
import { registerCsvRoute } from "./routes/pins-csv.js";
registerCsvRoute(app, { env: input.env, brandsDir: input.brandsDir, outputDir: input.outputDir });
```

- [ ] **Step 5: Run — expect 2 PASS**

- [ ] **Step 6: Commit**

```bash
git add tools/pinforge-api/src/routes/pins-csv.ts tools/pinforge-api/src/server.ts tools/pinforge-api/tests/integration/pins-bulk-csv.test.ts tools/pinforge-api/package.json pnpm-lock.yaml
git commit -m "feat(pinforge-api): POST /v1/pins/csv multipart upload"
```

---

### Task 21: CSV file-size enforcement test

- [ ] **Step 1: Add test** — POST CSV larger than `bodyLimitCsv` (use `makeApiEnv({ bodyLimitCsv: 100 })`), expect 413 or similar.

- [ ] **Step 2: Verify multipart plugin enforces it via its `limits.fileSize` option.**

- [ ] **Step 3: Commit**

```bash
git add tools/pinforge-api/tests/integration/pins-bulk-csv.test.ts
git commit -m "test(pinforge-api): CSV upload size limit enforced"
```

---

*B4 complete. CSV multipart upload works with per-row error reporting + size enforcement. Next: B5 Google Sheet ingest.*

---

## Sub-phase B5 — Google Sheet URL ingest

### Task 22: Sheet URL fetcher

**Files:**
- Create: `tools/pinforge-api/src/sheet-fetcher.ts`
- Create: `tools/pinforge-api/tests/unit/sheet-fetcher.test.ts`

- [ ] **Step 1: Write test (uses MSW or fetch mock)**

```ts
import { describe, expect, it, vi } from "vitest";
import { fetchPublishedSheetCsv } from "../../src/sheet-fetcher.js";

const ORIG_FETCH = global.fetch;

describe("fetchPublishedSheetCsv", () => {
  it("returns CSV body when URL responds 200 with text/csv", async () => {
    global.fetch = vi.fn(async () => new Response("a,b\n1,2\n", { status: 200, headers: { "content-type": "text/csv" } })) as any;
    const text = await fetchPublishedSheetCsv("https://docs.google.com/spreadsheets/d/xxx/pub?gid=0&single=true&output=csv");
    expect(text).toContain("a,b");
    global.fetch = ORIG_FETCH;
  });

  it("throws on 404", async () => {
    global.fetch = vi.fn(async () => new Response("not found", { status: 404 })) as any;
    await expect(fetchPublishedSheetCsv("https://docs.google.com/x")).rejects.toThrow(/404/);
    global.fetch = ORIG_FETCH;
  });

  it("rejects non-docs.google.com hosts", async () => {
    await expect(fetchPublishedSheetCsv("https://evil.com/sheet.csv")).rejects.toThrow(/host/);
  });

  it("rejects non-https URLs", async () => {
    await expect(fetchPublishedSheetCsv("http://docs.google.com/x")).rejects.toThrow(/https/);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement `src/sheet-fetcher.ts`**

```ts
export interface FetchSheetOptions {
  timeoutMs?: number;
}

export async function fetchPublishedSheetCsv(sheetUrl: string, opts: FetchSheetOptions = {}): Promise<string> {
  const url = new URL(sheetUrl);
  if (url.protocol !== "https:") throw new Error("sheet URL must be https");
  if (!url.hostname.endsWith("docs.google.com")) throw new Error("sheet URL host must be docs.google.com");

  const res = await fetch(sheetUrl, {
    signal: AbortSignal.timeout(opts.timeoutMs ?? 15_000),
    redirect: "follow"
  });
  if (!res.ok) throw new Error(`sheet fetch returned ${res.status}`);
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("csv") && !ct.includes("text/plain")) {
    // Google's publish-to-web CSV sometimes returns application/octet-stream — let it through but warn
    // For now, accept anything text-like
  }
  return await res.text();
}
```

- [ ] **Step 4: Run — expect 4 PASS**

- [ ] **Step 5: Commit**

```bash
git add tools/pinforge-api/src/sheet-fetcher.ts tools/pinforge-api/tests/unit/sheet-fetcher.test.ts
git commit -m "feat(pinforge-api): Google Sheet (publish-to-web CSV) fetcher with host allowlist"
```

---

### Task 23: POST /v1/pins/sheet

**Files:**
- Create: `tools/pinforge-api/src/routes/pins-sheet.ts`
- Create: `tools/pinforge-api/tests/integration/pins-bulk-sheet.test.ts`

- [ ] **Step 1: Write test**

```ts
import { describe, expect, it, vi } from "vitest";
import { buildServer, makeApiEnv, TEST_API_KEY } from "../helpers/build.js";
import { makeFakePin } from "../helpers/mock-pinforge.js";

const CSV = `brandId,topic,primaryKeyword,destinationUrl
strguests,topic-a,kw1,https://strguests.tools/a
`;

vi.mock("@str/pinforge", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@str/pinforge")>();
  return {
    ...actual,
    generateBatch: vi.fn(async () => ({
      jobId: "job_sheet",
      succeeded: [{ input: {}, result: makeFakePin() }],
      failed: []
    }))
  };
});

const ORIG_FETCH = global.fetch;

describe("POST /v1/pins/sheet", () => {
  it("fetches CSV from sheet URL and enqueues job", async () => {
    global.fetch = vi.fn(async () => new Response(CSV, { status: 200, headers: { "content-type": "text/csv" } })) as any;
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const res = await app.inject({
      method: "POST", url: "/v1/pins/sheet",
      headers: { "x-api-key": TEST_API_KEY, "content-type": "application/json" },
      payload: { sheetUrl: "https://docs.google.com/spreadsheets/d/xxx/pub?output=csv" }
    });
    expect(res.statusCode).toBe(202);
    expect(res.json().count).toBe(1);
    global.fetch = ORIG_FETCH;
    await app.close();
  });

  it("rejects non-Google host", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const res = await app.inject({
      method: "POST", url: "/v1/pins/sheet",
      headers: { "x-api-key": TEST_API_KEY, "content-type": "application/json" },
      payload: { sheetUrl: "https://evil.com/sheet.csv" }
    });
    expect(res.statusCode).toBe(400);
    await app.close();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement `src/routes/pins-sheet.ts`**

```ts
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { generateBatch, parsePinInputCsv } from "@str/pinforge";
import { createJobId, registerJob, completeJob, failJob } from "../jobs.js";
import { fetchPublishedSheetCsv } from "../sheet-fetcher.js";
import type { ApiEnv } from "../env.js";

const BodySchema = z.object({
  sheetUrl: z.string().url()
});

export interface SheetRoutesDeps {
  env: ApiEnv;
  brandsDir: string;
  outputDir: string;
}

export function registerSheetRoute(app: FastifyInstance, deps: SheetRoutesDeps): void {
  app.post("/v1/pins/sheet", async (req, reply) => {
    const parsed = BodySchema.safeParse(req.body);
    if (!parsed.success) {
      reply.code(400).send({ error: { code: "VALIDATION", message: "sheetUrl required", context: { issues: parsed.error.issues } } });
      return;
    }

    let csvText: string;
    try { csvText = await fetchPublishedSheetCsv(parsed.data.sheetUrl); }
    catch (e) {
      reply.code(400).send({ error: { code: "SHEET_FETCH_FAILED", message: e instanceof Error ? e.message : String(e), context: { sheetUrl: parsed.data.sheetUrl } } });
      return;
    }

    const parsedCsv = parsePinInputCsv(csvText);
    if (parsedCsv.rows.length === 0) {
      reply.code(400).send({ error: { code: "VALIDATION", message: "no valid rows in sheet", context: { parseErrors: parsedCsv.errors } } });
      return;
    }
    if (parsedCsv.rows.length > deps.env.bulkMax) {
      reply.code(400).send({ error: { code: "VALIDATION", message: `sheet exceeds bulkMax (${deps.env.bulkMax})`, context: { count: parsedCsv.rows.length } } });
      return;
    }

    const jobId = createJobId();
    registerJob(jobId, { total: parsedCsv.rows.length });
    generateBatch(parsedCsv.rows, { env: deps.env.pinforge, brandsDir: deps.brandsDir, outputDir: deps.outputDir })
      .then(result => completeJob(jobId, [
        ...result.succeeded.map(s => ({ ok: true as const, pin: s.result.metadata, paths: s.result.paths })),
        ...result.failed.map(f => ({ ok: false as const, error: f.error }))
      ]))
      .catch(err => failJob(jobId, err));

    reply.code(202).send({
      jobId,
      count: parsedCsv.rows.length,
      parseErrors: parsedCsv.errors.length > 0 ? parsedCsv.errors : undefined,
      pollUrl: `/v1/jobs/${jobId}`
    });
  });
}
```

- [ ] **Step 4: Register in `server.ts`**

```ts
import { registerSheetRoute } from "./routes/pins-sheet.js";
registerSheetRoute(app, { env: input.env, brandsDir: input.brandsDir, outputDir: input.outputDir });
```

- [ ] **Step 5: Run — expect 2 PASS**

- [ ] **Step 6: Commit**

```bash
git add tools/pinforge-api/src/routes/pins-sheet.ts tools/pinforge-api/src/server.ts tools/pinforge-api/tests/integration/pins-bulk-sheet.test.ts
git commit -m "feat(pinforge-api): POST /v1/pins/sheet ingests published Google Sheet CSV"
```

---

### Task 24: Document the Google Sheet publish-to-web flow

Append to `tools/pinforge-api/README.md`:

```md
## Google Sheet ingest

PinForge API accepts a publicly-published Google Sheet CSV URL. In Google Sheets:

1. **File → Share → Publish to web**
2. Pick **Comma-separated values (.csv)**
3. Publish, copy the URL — it'll look like `https://docs.google.com/spreadsheets/d/.../pub?output=csv`

Then POST:

\`\`\`bash
curl -X POST http://localhost:8787/v1/pins/sheet \\
  -H "X-API-Key: $PINFORGE_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"sheetUrl":"https://docs.google.com/spreadsheets/d/abc/pub?output=csv"}'
\`\`\`

Returns the same `{jobId, count, pollUrl}` shape as `/v1/pins/bulk` and `/v1/pins/csv`.

The host is enforced to `docs.google.com` — no other hosts accepted. HTTPS only.
```

Commit:
```bash
git add tools/pinforge-api/README.md
git commit -m "docs(pinforge-api): Google Sheet ingest flow"
```

---

*B5 complete. All 3 bulk methods (JSON, CSV upload, Sheet URL) wired. Next: B6 catalog + OpenAPI.*

---

## Sub-phase B6 — Catalog endpoints + OpenAPI

### Task 25: GET /v1/brands + /v1/templates

**Files:**
- Create: `tools/pinforge-api/src/routes/catalog.ts`
- Create: `tools/pinforge-api/tests/integration/catalog.test.ts`

- [ ] **Step 1: Write test**

```ts
import { describe, expect, it } from "vitest";
import { buildServer, makeApiEnv, TEST_API_KEY } from "../helpers/build.js";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

// Use real @str/pinforge brands dir so listBrandIds finds strguests + excel-templates
const BRANDS_DIR = resolve(fileURLToPath(import.meta.url), "..", "..", "..", "..", "..", "packages", "pinforge", "brands");

describe("GET /v1/brands", () => {
  it("returns sorted list of brand kits", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: BRANDS_DIR, outputDir: "./dist/pins" });
    const res = await app.inject({ method: "GET", url: "/v1/brands", headers: { "x-api-key": TEST_API_KEY } });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toEqual(expect.arrayContaining([
      expect.objectContaining({ brandId: "strguests" }),
      expect.objectContaining({ brandId: "excel-templates" })
    ]));
    await app.close();
  });
});

describe("GET /v1/templates", () => {
  it("returns 6 template ids", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: BRANDS_DIR, outputDir: "./dist/pins" });
    const res = await app.inject({ method: "GET", url: "/v1/templates", headers: { "x-api-key": TEST_API_KEY } });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveLength(6);
    expect(body.map((t: { id: string }) => t.id)).toContain("big-hook");
    await app.close();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement `src/routes/catalog.ts`**

```ts
import type { FastifyInstance } from "fastify";
import { listBrandIds, loadBrandKit, listTemplates } from "@str/pinforge";
import "@str/pinforge/dist/templates/index.js"; // side-effect: register templates

export interface CatalogRoutesDeps {
  brandsDir: string;
}

export function registerCatalogRoutes(app: FastifyInstance, deps: CatalogRoutesDeps): void {
  app.get("/v1/brands", async () => {
    const ids = await listBrandIds(deps.brandsDir);
    return await Promise.all(ids.map(async (id) => {
      const kit = await loadBrandKit(id, deps.brandsDir);
      return {
        brandId: kit.brandId,
        displayName: kit.displayName,
        domain: kit.domain,
        defaults: kit.defaults
      };
    }));
  });

  app.get("/v1/templates", async () => {
    return listTemplates().map(t => ({
      id: t.id,
      displayName: t.displayName,
      supports: t.supports,
      dimensions: t.dimensions
    }));
  });
}
```

- [ ] **Step 4: Register in `server.ts`**

```ts
import { registerCatalogRoutes } from "./routes/catalog.js";
registerCatalogRoutes(app, { brandsDir: input.brandsDir });
```

- [ ] **Step 5: Run — expect 2 PASS**

- [ ] **Step 6: Commit**

```bash
git add tools/pinforge-api/src/routes/catalog.ts tools/pinforge-api/src/server.ts tools/pinforge-api/tests/integration/catalog.test.ts
git commit -m "feat(pinforge-api): GET /v1/brands + /v1/templates"
```

---

### Task 26: Register @fastify/swagger + swagger-ui

**Files:**
- Modify: `tools/pinforge-api/src/server.ts`

- [ ] **Step 1: Add to `buildServer` (before route registration)**

```ts
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

await app.register(swagger, {
  openapi: {
    info: {
      title: "PinForge API",
      version: "0.1.0",
      description: "Pinterest pin generator — REST wrapper for @str/pinforge."
    },
    components: {
      securitySchemes: {
        apiKey: { type: "apiKey", in: "header", name: "X-API-Key" }
      }
    },
    security: [{ apiKey: [] }]
  }
});
await app.register(swaggerUi, {
  routePrefix: "/docs",
  uiConfig: { docExpansion: "list", deepLinking: false }
});
```

- [ ] **Step 2: Update auth `skipPaths` to include `/docs` and `/docs/*` and `/openapi.json`**

```ts
registerAuth(app, { apiKey: input.env.apiKey, skipPaths: ["/healthz", "/docs", "/docs/static/", "/docs/json"] });
```

(Adjust path patterns based on `@fastify/swagger-ui` actual mount.)

- [ ] **Step 3: Smoke test — `pnpm -F @str/pinforge-api test catalog` should still pass (no regression)**

- [ ] **Step 4: Manual verify**

Run `pnpm -F @str/pinforge-api build && PINFORGE_API_KEY=test-key-32-chars-min-aaaaaaaaaa OPENAI_API_KEY=sk-test pnpm -F @str/pinforge-api start &` in one terminal, then `curl http://localhost:8787/docs/json` in another. Should return the OpenAPI spec.

Then kill the server.

- [ ] **Step 5: Commit**

```bash
git add tools/pinforge-api/src/server.ts
git commit -m "feat(pinforge-api): @fastify/swagger OpenAPI auto-spec + /docs UI"
```

---

### Task 27: Annotate routes with OpenAPI schemas

**Files:**
- Modify: each `src/routes/*.ts` — add `schema:` option to route registrations

- [ ] **Step 1: For each `app.post`/`app.get`, add a `{ schema: { ... } }` second arg that documents:**
  - tag (e.g., "pins", "jobs", "catalog")
  - summary
  - request body / params / query schema (JSON Schema converted from Zod via `fastify-type-provider-zod` or hand-written)
  - response schema

Example for `/v1/pins`:
```ts
app.post("/v1/pins", {
  schema: {
    tags: ["pins"],
    summary: "Generate a single pin",
    body: { type: "object", required: ["brandId","topic","primaryKeyword","destinationUrl"], properties: { /* full schema */ } },
    response: {
      200: { type: "object", properties: { pin: { type: "object" }, paths: { type: "object" } } },
      202: { type: "object", properties: { jobId: { type: "string" }, pollUrl: { type: "string" } } },
      400: { type: "object" }
    }
  }
}, async (req, reply) => { /* ... */ });
```

Apply this pattern to ALL routes (single pin, bulk JSON, bulk CSV, bulk sheet, jobs polling, jobs CSV, catalog, health).

- [ ] **Step 2: Verify the OpenAPI spec covers all endpoints**

```bash
pnpm -F @str/pinforge-api build
PINFORGE_API_KEY=test-key-32-chars-min-aaaaaaaaaa OPENAI_API_KEY=sk-test node ./tools/pinforge-api/dist/main.js &
SLEEP_PID=$!; sleep 2
curl -s http://localhost:8787/docs/json | jq '.paths | keys'
kill $SLEEP_PID 2>/dev/null
```

Expected output:
```
[
  "/healthz",
  "/v1/brands",
  "/v1/jobs/{jobId}",
  "/v1/jobs/{jobId}/results.csv",
  "/v1/pins",
  "/v1/pins/bulk",
  "/v1/pins/csv",
  "/v1/pins/sheet",
  "/v1/pins/{slug}",
  "/v1/pins/{slug}/image",
  "/v1/templates"
]
```

- [ ] **Step 3: Commit**

```bash
git add tools/pinforge-api/src/routes/
git commit -m "docs(pinforge-api): annotate all routes for OpenAPI"
```

---

### Task 28: Wire all module exports

**Files:**
- Modify: `tools/pinforge-api/src/index.ts`

Append:
```ts
export { fetchPublishedSheetCsv } from "./sheet-fetcher.js";
export { registerAuth, type AuthOptions } from "./auth.js";
export { registerRateLimit, type RateLimitOptions } from "./rate-limit.js";
```

Build + typecheck clean.

Commit:
```bash
git add tools/pinforge-api/src/index.ts
git commit -m "feat(pinforge-api): export auth + rate-limit + sheet-fetcher"
```

---

*B6 complete. Catalog endpoints + OpenAPI spec + /docs UI all live. Next: B7 full E2E + README.*

---

## Sub-phase B7 — Full E2E + README polish

### Task 29: Full roundtrip E2E test

**Files:**
- Create: `tools/pinforge-api/tests/e2e/full-roundtrip.test.ts`

- [ ] **Step 1: Write test that exercises every endpoint with real `@str/pinforge` (MSW mocking OpenAI/n8n)**

```ts
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { buildServer, makeApiEnv, TEST_API_KEY } from "../helpers/build.js";

const BRANDS_DIR = resolve(fileURLToPath(import.meta.url), "..", "..", "..", "..", "..", "packages", "pinforge", "brands");

// Note: this test uses the REAL @str/pinforge (no mock) — it relies on @str/pinforge's own MSW handlers being in scope.
// The pinforge package's vitest setup auto-mocks OpenAI + n8n.

let dir: string;
beforeEach(async () => { dir = await mkdtemp(join(tmpdir(), "pinforge-api-e2e-")); });
afterEach(async () => { await rm(dir, { recursive: true, force: true }); });

describe("E2E roundtrip", () => {
  it("creates a single pin and fetches it back by slug", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: BRANDS_DIR, outputDir: dir });
    const created = await app.inject({
      method: "POST", url: "/v1/pins?sync=1",
      headers: { "x-api-key": TEST_API_KEY, "content-type": "application/json" },
      payload: { brandId: "strguests", topic: "e2e roundtrip test", primaryKeyword: "test keyword", destinationUrl: "https://strguests.tools/x", backgroundType: "solid" }
    });
    expect(created.statusCode).toBe(200);
    const slug = (created.json().pin.imagePath as string).split(/[\\/]/).pop()!.replace(/\.png$/, "");
    expect(slug).toBeTypeOf("string");

    const fetched = await app.inject({ method: "GET", url: `/v1/pins/${slug}`, headers: { "x-api-key": TEST_API_KEY } });
    expect(fetched.statusCode).toBe(200);
    expect(fetched.json().pin.brandId).toBe("strguests");

    const image = await app.inject({ method: "GET", url: `/v1/pins/${slug}/image`, headers: { "x-api-key": TEST_API_KEY } });
    expect(image.statusCode).toBe(200);
    expect(image.headers["content-type"]).toBe("image/png");
    expect(image.rawPayload.length).toBeGreaterThan(0);

    await app.close();
  }, 30_000);

  it("lists brands and templates", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: BRANDS_DIR, outputDir: dir });
    const brands = await app.inject({ method: "GET", url: "/v1/brands", headers: { "x-api-key": TEST_API_KEY } });
    expect(brands.statusCode).toBe(200);
    expect(brands.json().length).toBeGreaterThanOrEqual(2);

    const templates = await app.inject({ method: "GET", url: "/v1/templates", headers: { "x-api-key": TEST_API_KEY } });
    expect(templates.statusCode).toBe(200);
    expect(templates.json()).toHaveLength(6);
    await app.close();
  });
});
```

Note: the E2E test runs real pinforge → needs the pinforge MSW server to be active in this package's test environment. The simplest path: add the pinforge MSW setup file to this package's `vitest.config.ts setupFiles` array.

Update `vitest.config.ts`:
```ts
setupFiles: [
  // Re-use pinforge's MSW server to mock OpenAI + n8n during E2E runs
  "../../packages/pinforge/tests/helpers/msw-server.ts"
]
```

- [ ] **Step 2: Run — expect 2 PASS**

- [ ] **Step 3: Commit**

```bash
git add tools/pinforge-api/tests/e2e/full-roundtrip.test.ts tools/pinforge-api/vitest.config.ts
git commit -m "test(pinforge-api): E2E roundtrip — create, fetch, image, catalog"
```

---

### Task 30: README, top-level scripts, version bump

**Files:**
- Modify: `tools/pinforge-api/README.md`
- Modify: Excel-Templates root `package.json` — add convenience scripts

- [ ] **Step 1: Expand README**

Replace stub with a real README covering:
- Quickstart (start the server, hit /healthz)
- Auth (X-API-Key)
- All 11 endpoints with curl examples
- Rate limit + body size config via env
- Link to /docs for interactive OpenAPI
- Production notes (set `PINFORGE_API_HOST=0.0.0.0` to bind public, etc.)
- Pointer to BACKLOG.md for known follow-ups

- [ ] **Step 2: Add root scripts** (insert into root `package.json` scripts block):

```json
"pinforge-api": "pnpm -F @str/pinforge-api",
"pinforge-api:start": "pnpm -F @str/pinforge-api start",
"pinforge-api:test": "pnpm -F @str/pinforge-api test"
```

- [ ] **Step 3: Verify**

```bash
pnpm pinforge-api:test
```
Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add tools/pinforge-api/README.md package.json
git commit -m "docs(pinforge-api): README + root convenience scripts"
```

---

## Phase B complete

You now have:

- ✅ `@str/pinforge-api` package at `tools/pinforge-api/`
- ✅ Fastify server with X-API-Key auth, per-key rate limit, multipart upload
- ✅ 11 endpoints documented via OpenAPI at `/docs`
- ✅ Bulk via JSON / CSV upload / published Google Sheet URL — all return `{jobId, count, pollUrl}`
- ✅ `/v1/jobs/:id` polling + `/v1/jobs/:id/results.csv` download
- ✅ Single-pin sync (?sync=1) + async paths
- ✅ Catalog: `/v1/brands`, `/v1/templates`, `/healthz`
- ✅ E2E roundtrip test using real `@str/pinforge` (MSW-mocked OpenAI/n8n)
- ✅ Path-safety, body limits, bulk limits all enforced
- ✅ ~30 commits, ~25-40 new tests (in addition to pinforge's 89)

## Open follow-ups (intentional, not blockers)

- **In-memory job registry** — survives only until process restart. Phase B.5: swap for SQLite-backed `JobStore` interface.
- **No request-level CORS** — appropriate for backend-to-backend usage; add CORS plugin if you ever expose a browser UI.
- **No webhook callbacks on job completion** — polling only. Easy to add via a `?callbackUrl=` POST option on bulk endpoints.
- **No metrics endpoint** — `/healthz` is just liveness. Add `/metrics` (Prometheus format) when you have a monitoring stack.
- **`fastify-type-provider-zod` integration** is partial — body validation is hand-rolled via `safeParse` in each route. Refactor to use the type provider for cleaner code + automatic OpenAPI schemas. Defer until a second round of route additions.
