# PinForge — Design Spec

**Status:** Approved (brainstorming complete, 2026-05-16)
**Owner:** Daniel Harrison
**Location:** `Excel-Templates/packages/pinforge/` (engine) + `Excel-Templates/tools/pinforge-api/` (HTTP)
**Companion workflow:** `Tools/N8n-Builder/workflows/gemini-pin-image.json` (new)

---

## 1. Problem

Daniel manages multiple businesses (Excel-Templates monorepo holds 8 STR sub-products plus the Excel-Templates brand itself) and needs to produce Pinterest pins at volume — branded, SEO-optimized, programmatically generated, ready to post. Today: pins are either pre-built at site-build time (strguests.tools) or made manually. No central tool. No bulk pipeline. No API.

## 2. Goal

A one-stop Pinterest pin creator that:

1. Generates Pinterest-ready static pin images (1000×1500 PNG, 2:3) with brand-consistent design.
2. Generates Pinterest-ready SEO copy (title, description, alt text, hashtags) per pin.
3. Calls a new dedicated n8n image-generation workflow for photographic backgrounds.
4. Exposes a REST API for one-off and bulk generation (JSON, CSV upload, Google Sheet URL).
5. Emits image + metadata sidecar in a format a future publisher (Phase C, not in scope) can consume to post directly to Pinterest.

**Out of scope:** posting to Pinterest, video pins, carousel pins, multi-language. Schema reserves slots so adding these later is non-breaking.

## 3. Locked decisions (from brainstorming)

| # | Decision | Rationale |
|---|---|---|
| 1 | **Phase A (engine) + Phase B (API) only — no posting** | Output is Pinterest-ready; posting deferred to future Phase C |
| 2 | **Multi-brand from day one**, seeded with `excel-templates` + `strguests` | Cost of N brands vs. 1 is mostly upfront in JSON schema |
| 3 | **Lives in `Excel-Templates/` monorepo** as `packages/pinforge/` (lib) + `tools/pinforge-api/` (HTTP) | Fits existing pnpm monorepo pattern; reuses `brand/`, `design-system/` |
| 4 | **New n8n workflow `gemini-pin-image.json`** | Pin-specific prompts (vertical 2:3, top-third focal point); blog workflow stays untouched |
| 5 | **SEO copy modes:** A first (topic+keyword → AI), then A.5 adds B (URL scrape feeds AI as context, not paste-through) | Ship the cheaper case; URL mode is an additive feature |
| 6 | **6 starter templates × 3 background modes** (solid / gradient / image), 3 image readability treatments (bottom-gradient, white-banner, duotone) | Covers ~80% of high-CTR Pinterest patterns without template explosion |
| 7 | **All 3 bulk input formats** (JSON POST, CSV upload, published Google Sheet CSV URL) | Daniel picks per situation; Sheet ingest uses publish-to-web CSV → no Google OAuth needed |
| 8 | **Single static API key** in `.env`, `X-API-Key` header, constant-time compare | Matches rest of stack; rotate any time; future-extensible to per-brand keys |
| 9 | **Approach 1 — Minimal Monolith** (Satori + sharp render, OpenAI gpt-4o-mini for SEO, in-process p-queue, no Redis) | Ships in days; zero new infra; all decisions reversible behind interfaces |
| 10 | **Reserve `format` + `videoSourcePath` fields** in `pin.json` schema for future video/carousel without breaking changes | Design for extension, don't build extension; HyperFrames remains the video engine |

## 4. Architecture

### 4.1 Data flow (single pin)

```
generatePin(input)
  → 1. validate (Zod)
  → 2. load brand kit
  → 3. resolve template (apply brand defaults if templateId omitted)
  → 4. Promise.all([ SEO copy (OpenAI), background image (n8n OR skip) ])
       └─ image fallback chain: n8n → Unsplash → brand solid bg (never fails)
  → 5. template.render({brand, copy, background}) → JSX
  → 6. Satori(jsx) → SVG buffer
  → 7. sharp(svgBuffer).png() → 1000×1500 PNG buffer
  → 8. atomic write: pin.png + pin.json (write *.tmp, rename)
  → 9. return { pinPng, metadata, paths }
```

### 4.2 Folder structure

```
Excel-Templates/
├── packages/
│   └── pinforge/                    ← Phase A — library + CLI
│       ├── src/
│       │   ├── index.ts             ← public API: generatePin(input)
│       │   ├── orchestrator.ts      ← wires SEO + image + render
│       │   ├── brand/
│       │   │   ├── kit-loader.ts    ← reads brand-kit.json
│       │   │   └── schema.ts        ← Zod validation
│       │   ├── templates/
│       │   │   ├── registry.ts
│       │   │   ├── big-hook.tsx     ← JSX → Satori
│       │   │   ├── listicle.tsx
│       │   │   ├── before-after.tsx
│       │   │   ├── quote.tsx
│       │   │   ├── how-to.tsx
│       │   │   └── big-stat.tsx
│       │   ├── seo/
│       │   │   ├── client.ts        ← OpenAI wrapper, JSON mode
│       │   │   └── prompts.ts
│       │   ├── image/
│       │   │   ├── n8n-bridge.ts    ← POST gemini-pin-image
│       │   │   ├── unsplash.ts      ← fallback
│       │   │   └── treatments.ts    ← gradient/banner/duotone overlay
│       │   ├── render/
│       │   │   ├── satori.ts        ← JSX → SVG
│       │   │   └── compose.ts       ← sharp: SVG + bg → PNG
│       │   ├── queue/
│       │   │   └── batch.ts         ← p-queue, concurrency=3
│       │   └── output/
│       │       └── writer.ts        ← atomic write pin.png + pin.json
│       ├── brands/                  ← brand-kit JSON files
│       │   ├── strguests.json
│       │   └── excel-templates.json
│       ├── cli.ts                   ← `pinforge generate`, `pinforge bulk`
│       ├── tests/
│       └── package.json
│
├── tools/
│   └── pinforge-api/                ← Phase B — HTTP wrapper
│       ├── src/
│       │   ├── server.ts            ← Fastify, X-API-Key middleware
│       │   ├── routes/
│       │   │   ├── pins.ts
│       │   │   ├── pins-bulk.ts
│       │   │   ├── pins-csv.ts
│       │   │   └── pins-sheet.ts
│       │   ├── jobs.ts              ← in-mem job registry
│       │   └── auth.ts
│       └── package.json
│
├── brand/                           ← EXISTING (reused, not modified)
└── design-system/                   ← EXISTING (reused)

Tools/N8n-Builder/workflows/
└── gemini-pin-image.json            ← NEW — sibling of gemini-blog-image-seo
```

### 4.3 Public contract

```ts
function generatePin(input: PinInput): Promise<{
  pinPng: Buffer;
  metadata: PinMetadata;
  paths: { png: string; json: string };
}>;
```

## 5. Schemas

### 5.1 Brand kit (`packages/pinforge/brands/{brandId}.json`)

```jsonc
{
  "brandId": "strguests",
  "displayName": "STRGuests Tools",
  "domain": "strguests.tools",
  "voice": "Direct, helpful, no-nonsense. Short sentences. Speaks to STR hosts.",
  "colors": {
    "primary": "#0f766e",
    "primaryDark": "#134e4a",
    "accent": "#5eead4",
    "text": "#ffffff",
    "textOnLight": "#1c1917"
  },
  "fonts": {
    "headline": { "family": "Inter",   "weight": 800, "file": "fonts/Inter-ExtraBold.ttf" },
    "body":     { "family": "Inter",   "weight": 500, "file": "fonts/Inter-Medium.ttf" },
    "accent":   { "family": "Georgia", "weight": 400, "file": "fonts/Georgia.ttf" }
  },
  "logo": {
    "wordmark": "assets/strguests-wordmark.png",
    "footerText": "STRGUESTS.TOOLS"
  },
  "defaults": {
    "templateId": "big-hook",
    "backgroundType": "image",
    "imageTreatment": "duotone",
    "boardHint": "STR Host Tips"
  },
  "seo": {
    "keywords": ["short-term rental", "airbnb host", "vrbo", "vacation rental"],
    "disallowedTerms": ["cheap", "easy money"],
    "ctaSuffix": "→ Free templates at strguests.tools"
  },
  "allowedDomains": ["strguests.tools"]
}
```

### 5.2 Template contract (every template exports this shape)

```ts
export interface PinTemplate {
  id: string;
  displayName: string;
  supports: BackgroundType[];
  dimensions: { width: 1000; height: 1500 };
  render(input: TemplateInput): JSX.Element;
}

export interface TemplateInput {
  brand: BrandKit;
  copy: {
    headline: string;
    description?: string;
    items?: string[];
    stat?: string;
    cta?: string;
  };
  background: {
    type: "solid" | "gradient" | "image";
    imageBuffer?: Buffer;
    treatment?: "bottom-gradient" | "white-banner" | "duotone";
  };
}

export type BackgroundType = "solid" | "gradient" | "image";
```

### 5.3 PinInput (request body)

```ts
interface PinInput {
  brandId: string;                                     // required
  topic: string;                                       // required, 3-200 chars
  primaryKeyword: string;                              // required, 2-60 chars
  destinationUrl: string;                              // required, must match brand.allowedDomains
  templateId?: string;                                 // defaults to brand.defaults.templateId
  backgroundType?: "solid" | "gradient" | "image";    // defaults to brand.defaults.backgroundType
  imageTreatment?: "bottom-gradient" | "white-banner" | "duotone";
  inputMode?: "topic" | "url";                         // default "topic"; "url" = Phase A.5
  sourceUrl?: string;                                  // required when inputMode === "url"
  boardHint?: string;
  notes?: string;
}
```

### 5.4 pin.json (output sidecar)

```jsonc
{
  "schema": "pinforge.v1",
  "format": "static",                                  // RESERVED: "static" | "video" | "carousel" (only "static" implemented)
  "videoSourcePath": null,                             // RESERVED: future HyperFrames integration hook
  "generatedAt": "2026-05-16T21:30:00Z",
  "brandId": "strguests",
  "templateId": "big-hook",
  "title": "7 House Rules That Stop Bad Airbnb Reviews",
  "description": "Tired of guests breaking the rules? These 7 house-rule templates...",
  "altText": "Coastal vacation rental at sunset with bold yellow headline overlay",
  "hashtags": ["#airbnbhost", "#vacationrental", "#strtips", "#shorttermrental"],
  "boardHint": "STR Host Tips",
  "destinationUrl": "https://strguests.tools/house-rules-generator",
  "imagePath": "pins/2026-05-16/strguests/7-house-rules-stop-bad-reviews-a3f9.png",
  "fallbackUsed": false,
  "sourceInputs": {
    "topic": "house rules for STR",
    "primaryKeyword": "airbnb house rules",
    "inputMode": "topic"
  }
}
```

## 6. SEO copy generation

Single OpenAI call, JSON mode, brand voice in system prompt.

```ts
async function generateSeoCopy(input): Promise<SeoCopy> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: buildSystemPrompt(brand) },
      { role: "user",   content: buildUserPrompt(input) }
    ]
  });
  return SeoCopySchema.parse(JSON.parse(response.choices[0].message.content));
}

interface SeoCopy {
  headline: string;          // ≤60 chars — fits pin overlay
  pinTitle: string;          // ≤100 chars — Pinterest title field max
  description: string;       // 150-500 chars — Pinterest description, keyword-rich, ends with CTA
  altText: string;           // ≤500 chars — Pinterest alt
  hashtags: string[];        // 3-6, lowercase, no spaces
  items?: string[];          // only when template is listicle/how-to
  stat?: string;             // only when template is big-stat
}
```

**LLM choice:** OpenAI gpt-4o-mini. Key exists in `Excel-Templates/.env`. ~$0.0003/pin. Pluggable behind `LlmAdapter` interface — swap to Claude/Gemini later without touching orchestrator.

## 7. n8n image bridge

```ts
async function fetchPinBackground(input): Promise<Buffer> {
  const prompt = buildPinImagePrompt(input);
  // "Vertical 2:3 composition, top-third focal point, leave bottom 60% for text overlay, [topic], [brand visual style]..."

  const response = await fetch(`${N8N_BASE_URL}/webhook/pin-image`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-API-Key": N8N_PIN_KEY },
    body: JSON.stringify({
      prompt,
      aspectRatio: "2:3",
      style: brand.imageStyle ?? "photographic"
    }),
    signal: AbortSignal.timeout(60_000)
  });

  if (!response.ok) throw new N8nImageError(`n8n returned ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}
```

**Fallback chain (pin never fails to render):**

1. n8n call → if 5xx/timeout: log, retry once with 2s backoff
2. Retry fails → Unsplash search (`primaryKeyword + brand.imageKeywords`)
3. Unsplash fails → brand's default solid background, set `metadata.fallbackUsed: true`

## 8. Bulk pipeline

```ts
import PQueue from "p-queue";
const queue = new PQueue({
  concurrency: 3,        // parallel pins
  intervalCap: 10,       // max 10 starts per minute
  interval: 60_000
});

async function generateBatch(inputs: PinInput[]): Promise<BatchResult> {
  const jobId = createJobId();
  const results = await Promise.allSettled(
    inputs.map(input => queue.add(() => generatePin(input)))
  );
  return { jobId, succeeded: results.filter(r => r.status === "fulfilled"), failed: ... };
}
```

Tunable via env (`PINFORGE_QUEUE_CONCURRENCY`, `PINFORGE_QUEUE_INTERVAL_CAP`).

## 9. API surface (Phase B)

Fastify, `X-API-Key` header required (constant-time compare).

| Method | Path | Body | Returns |
|---|---|---|---|
| `POST` | `/v1/pins` | `PinInput` JSON | `202 {jobId, pollUrl}` or `200 {pin, paths}` with `?sync=1` |
| `GET`  | `/v1/pins/:slug` | — | `{pin, paths}` or `404` |
| `GET`  | `/v1/pins/:slug/image` | — | `image/png` |
| `POST` | `/v1/pins/bulk` | `{items: PinInput[]}` (≤500) | `202 {jobId, count, pollUrl}` |
| `POST` | `/v1/pins/csv` | multipart `file` | `202 {jobId, count, pollUrl, parseErrors?}` |
| `POST` | `/v1/pins/sheet` | `{sheetUrl, range?}` | `202 {jobId, count, pollUrl}` |
| `GET`  | `/v1/jobs/:jobId` | — | `{status, progress, results?}` |
| `GET`  | `/v1/jobs/:jobId/results.csv` | — | `text/csv` |
| `GET`  | `/v1/brands` | — | `[{brandId, displayName, defaults}]` |
| `GET`  | `/v1/templates` | — | `[{id, displayName, supports}]` |
| `GET`  | `/healthz` | — | `{ok, version}` (no auth) |

**Safety:**
- Body size: 5 MB (CSV), 256 KB (JSON)
- Bulk: max 500 items per request
- Rate limit: 60 req/min per key
- All slugs and brandIds regex-validated (`^[a-z0-9-]+$`) → prevents path traversal
- `destinationUrl` host must be in `brand.allowedDomains[]` → prevents pin spam

**CSV format (`/v1/pins/csv`):**

```csv
brandId,topic,primaryKeyword,destinationUrl,templateId,backgroundType,boardHint
strguests,7 house rules for STR,airbnb house rules,https://strguests.tools/house-rules,big-hook,image,STR Host Tips
strguests,Welcome book essentials,vacation rental welcome book,https://strguests.tools/welcome-book,listicle,gradient,
```

Empty cells = brand defaults. Extra columns ignored. Per-row parse errors reported in job results.

**Sheet ingest:** uses published-to-web CSV URL (`File → Share → Publish to web → CSV`). No Google OAuth in v1.

**Job registry:** in-memory `Map<jobId, JobState>`. Server restart loses pending jobs (acceptable for v1). Phase B.5 hook: swap for SQLite-backed `JobStore` interface.

## 10. Output

```
packages/pinforge/dist/pins/
├── 2026-05-16/
│   ├── strguests/
│   │   ├── 7-house-rules-stop-bad-reviews-a3f9.png      (1000×1500, ~180 KB)
│   │   ├── 7-house-rules-stop-bad-reviews-a3f9.json
│   │   └── _index.csv                                   (auto-updated)
│   └── excel-templates/...
└── 2026-05-17/...

packages/pinforge/dist/jobs/
└── job_01HZX7XXXXX.json
```

- Atomic writes (`*.tmp` → rename)
- Idempotent: same `(date, brandId, slug)` overwrites in place
- `_index.csv` per `{date}/` for easy spreadsheet review
- `dist/pins/` and `dist/jobs/` are gitignored

**Slug:** `${slugify(topic)}-${shortHash(brandId + topic + templateId + date)}`. Same inputs same day → same slug.

## 11. Error model

```ts
abstract class PinforgeError extends Error {
  abstract code: string;
  abstract retryable: boolean;
  context: Record<string, unknown>;
}

class ValidationError    extends PinforgeError { code = "VALIDATION";       retryable = false; }
class BrandNotFoundError extends PinforgeError { code = "BRAND_NOT_FOUND";  retryable = false; }
class SeoLlmError        extends PinforgeError { code = "SEO_LLM_FAILED";   retryable = true; }
class N8nImageError      extends PinforgeError { code = "N8N_IMAGE_FAILED"; retryable = true; }
class RenderError        extends PinforgeError { code = "RENDER_FAILED";    retryable = false; }
class OutputWriteError   extends PinforgeError { code = "OUTPUT_WRITE";     retryable = true; }
```

**Retry policy:** retryable errors → 1 retry, 2s backoff. Bulk continues on individual failures.

**API error shape:**
```json
{ "error": { "code": "BRAND_NOT_FOUND", "message": "No brand kit for 'dermmap'", "context": { "brandId": "dermmap", "availableBrands": ["strguests", "excel-templates"] } } }
```

## 12. Testing strategy

| Layer | What | Tool | Location |
|---|---|---|---|
| Unit | Zod schemas, slug gen, SEO prompt builders, template registry, fallback logic | Vitest | `packages/pinforge/tests/unit/` |
| Snapshot | Each template → deterministic SVG for fixture input | Vitest `toMatchSnapshot` | `packages/pinforge/tests/snapshots/` |
| Visual regression | Each template → pixel-identical PNG vs golden | Vitest + `pixelmatch` | `packages/pinforge/tests/visual/` |
| Integration | End-to-end `generatePin()` with **mocked** OpenAI + n8n | Vitest + MSW | `packages/pinforge/tests/integration/` |
| API | Each endpoint: auth, validation, async flow, CSV parse, rate limit | Vitest + Fastify inject | `tools/pinforge-api/tests/` |
| Live smoke | 1 real OpenAI + 1 real n8n call per CI run | Vitest, `.live` marker, `LIVE=1` env | `packages/pinforge/tests/live/` |

**Coverage targets:** 85% line, 80% branch on `packages/pinforge/src/`.

## 13. Observability

- **Logs:** Pino, structured JSON, one line per pin (`pinId, brandId, templateId, durationMs, llmTokens, n8nUsed, fallbackUsed`)
- **Metrics:** append-only `dist/pins/_metrics.jsonl` for local aggregation
- **No external telemetry in v1** (no Datadog / Sentry)

## 14. Phasing & estimates

```
Phase A — Engine                            (~4-5 days, deliverable: CLI + library)
  A1  Monorepo scaffolding + Zod schemas + brand kit loader
  A2  Template registry + 6 templates (all 3 background modes declared in `supports`; only solid/gradient render paths wired until A4)
  A3  SEO module (OpenAI, JSON mode, brand-voiced prompts)
  A4  n8n bridge + Unsplash fallback + image treatments (unlocks `backgroundType: "image"` rendering)
  A5  Render + compose + atomic writer + slug/idempotency
  A6  CLI (`pnpm pinforge generate`, `pnpm pinforge bulk file.csv`)
  A7  Unit + snapshot + integration tests
  A8  Seed brand kits: strguests, excel-templates
  A9  New n8n workflow: gemini-pin-image.json

Phase B — REST API                          (~2-3 days, deliverable: HTTP service)
  B1  Fastify + X-API-Key middleware + rate limit
  B2  /v1/pins (sync + async) + /v1/jobs/:id polling
  B3  /v1/pins/bulk + in-memory job registry
  B4  /v1/pins/csv + per-row parse errors
  B5  /v1/pins/sheet (published CSV URL)
  B6  /v1/brands, /v1/templates, /healthz
  B7  API tests + OpenAPI auto-spec + README

Phase A.5 — Mode B (URL input)              (~1-2 days)
  M1  Cheerio scraper (title/h1/meta/body sample)
  M2  Scraped-context SEO prompt variant (grounding, not paste)
  M3  inputMode="url" wired through orchestrator + API + CSV

Total to "one-stop creator + API": ~8-10 working days
```

## 15. Future (NOT in this spec)

- **Phase C:** Pinterest posting (OAuth, board mgmt, scheduler)
- **Phase D:** Video pins via HyperFrames integration (`format: "video"`, `videoSourcePath` already reserved)
- **Phase E:** Carousel pins (`format: "carousel"`, schema extension)
- Per-brand API keys, SQLite-backed job store, S3 output adapter, multi-language, A/B variant trees, webhook callbacks — all flagged but deferred

## 16. Non-goals (explicit)

- No Pinterest API integration of any kind
- No video rendering (use HyperFrames separately)
- No carousel rendering
- No external telemetry
- No user accounts or multi-tenancy beyond single static API key
- No CDN / object storage in v1
- No scheduling / publishing fields in `pin.json`

## 17. Open questions deferred to Phase A planning

- Exact Satori font-loading strategy (preload all brand fonts vs. lazy per-render)
- Whether `_index.csv` should be per-brand or per-date (current spec: per-date)
- Whether to bundle a `.env.example` listing all `PINFORGE_*` vars before A1 or after A6
- Pinterest title vs headline split: the design has both `headline` (≤60ch for pin overlay) and `pinTitle` (≤100ch for metadata) — confirm overlap with LLM in A3
