# PinForge Phase A.5 Implementation Plan — URL Input Mode

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `inputMode: "url"` to `generatePin()` so the user can pass `{brandId, sourceUrl, destinationUrl}` instead of `{brandId, topic, primaryKeyword, destinationUrl}`. PinForge scrapes the URL, extracts title/h1/meta/body sample, and feeds the scraped content to the SEO LLM **as grounding context** (not paste-through) — so the AI rewrites the pin copy in the brand voice rather than copying the source.

**Architecture:** Add `src/scrape/` module (cheerio-based scraper) + new prompt builder `buildUrlGroundedUserPrompt()`. Orchestrator detects `inputMode === "url"`, runs scrape first, then passes scraped fields as extra context to the existing `SeoCopyGenerator`. CSV parser + API surface already accept `inputMode` + `sourceUrl` fields (Phase A schema reserved them) — no schema changes needed.

**Tech Stack:** All Phase A stack, plus `cheerio` (HTML parsing) and `undici` (fetch with timeout — already in pinforge).

**Spec:** `docs/superpowers/specs/2026-05-16-pinforge-design.md` (section 14 Phase A.5)
**Plans this depends on:** `2026-05-16-pinforge-phase-a.md` (engine must be live)
**Plans this enables:** `2026-05-17-pinforge-phase-b.md` URL mode just works via the existing `/v1/pins` endpoint — no API changes needed.

---

## File Structure

```
packages/pinforge/
├── src/
│   ├── scrape/                                ← NEW
│   │   ├── types.ts                           ← ScrapedContent interface
│   │   ├── fetcher.ts                         ← fetch HTML with timeout + size cap
│   │   ├── extractor.ts                       ← cheerio: extract title/h1/meta/body sample
│   │   ├── normalize.ts                       ← clean whitespace, strip nav/footer noise
│   │   └── index.ts                           ← scrapeUrl(url, opts) public entry
│   ├── seo/
│   │   └── prompts.ts                         ← MODIFY: add buildUrlGroundedUserPrompt
│   ├── orchestrator/
│   │   └── generate.ts                        ← MODIFY: branch on inputMode
│   └── index.ts                               ← export scrape module
├── tests/
│   ├── fixtures/
│   │   └── blog-post-fixture.html             ← canned HTML for scrape tests
│   ├── unit/
│   │   ├── scrape-extractor.test.ts
│   │   ├── scrape-normalize.test.ts
│   │   ├── scrape-fetcher.test.ts             ← uses MSW
│   │   └── seo-prompts-url.test.ts
│   └── integration/
│       └── generate-pin-url-mode.test.ts      ← E2E generatePin with inputMode=url
```

No CSV / API changes — they already accept `inputMode` + `sourceUrl` per Phase A schema.

---

## Sub-phase Map

| Sub-phase | Tasks | Deliverable |
|---|---|---|
| **M1** Scrape module | 1-5 | Cheerio extractor + fetcher returns `ScrapedContent` |
| **M2** URL-grounded prompt | 6-7 | New prompt builder includes scraped fields as context |
| **M3** Orchestrator branching | 8-10 | `generatePin` with `inputMode=url` scrapes first, then generates |
| **M4** Wiring + docs | 11-12 | Public exports + README section |

Total: 12 tasks, ~1-2 days of implementation.

---

## Conventions

Same as Phase A: TDD, atomic commits, `pnpm -F @str/pinforge` for scripts. Commit style: `feat(pinforge):` etc.

---

## Sub-phase M1 — Scrape module

### Task 1: Scraped content types

**Files:**
- Create: `packages/pinforge/src/scrape/types.ts`

- [ ] **Step 1: Write `src/scrape/types.ts`**

```ts
export interface ScrapedContent {
  /** Original URL the content was fetched from. */
  sourceUrl: string;
  /** Cleaned <title> contents, or empty string. */
  title: string;
  /** First <h1> text, or empty string. */
  h1: string;
  /** <meta name="description"> contents, or empty string. */
  metaDescription: string;
  /** OpenGraph <meta property="og:title">, or empty string. */
  ogTitle: string;
  /** OpenGraph <meta property="og:description">, or empty string. */
  ogDescription: string;
  /** First ≤500 chars of body text (after stripping nav/header/footer/script). */
  bodySample: string;
  /** Detected primary language from <html lang>, defaults to "en". */
  lang: string;
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm -F @str/pinforge typecheck` — clean.

- [ ] **Step 3: Commit**

```bash
git add packages/pinforge/src/scrape/types.ts
git commit -m "feat(pinforge): ScrapedContent type"
```

---

### Task 2: Test fixture

**Files:**
- Create: `packages/pinforge/tests/fixtures/blog-post-fixture.html`

- [ ] **Step 1: Write fixture**

```html
<!doctype html>
<html lang="en">
<head>
  <title>7 House Rules That Stop Bad Reviews | STRGuests</title>
  <meta name="description" content="Tired of guests breaking rules? These 7 templates fix it.">
  <meta property="og:title" content="7 House Rules That Stop Bad Reviews">
  <meta property="og:description" content="Stop bad reviews with these 7 simple house rules.">
</head>
<body>
  <header>
    <nav><a href="/">Home</a> | <a href="/blog">Blog</a></nav>
  </header>
  <main>
    <article>
      <h1>7 House Rules That Stop Bad Reviews</h1>
      <p>Every STR host runs into the same set of guest behaviors that lead to one-star reviews. The fix isn't more rules — it's better-worded rules. Here are seven we've tested across 1,200+ stays.</p>
      <p>Rule one is about noise. Rule two covers smoking. Rule three handles extra guests. Rule four is about parties.</p>
    </article>
  </main>
  <footer>
    <p>&copy; 2026 STRGuests Tools. <a href="/privacy">Privacy</a> | <a href="/terms">Terms</a></p>
  </footer>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add packages/pinforge/tests/fixtures/blog-post-fixture.html
git commit -m "test(pinforge): blog post HTML fixture for scrape tests"
```

---

### Task 3: HTML extractor (cheerio)

**Files:**
- Create: `packages/pinforge/src/scrape/extractor.ts`
- Create: `packages/pinforge/tests/unit/scrape-extractor.test.ts`

- [ ] **Step 1: Install cheerio**

```bash
pnpm -F @str/pinforge add cheerio@^1.0.0
```

- [ ] **Step 2: Write failing test**

```ts
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { extractContent } from "../../src/scrape/extractor.js";

const HTML = readFileSync(fileURLToPath(new URL("../fixtures/blog-post-fixture.html", import.meta.url)), "utf8");

describe("extractContent", () => {
  it("extracts title, h1, meta, og, body sample", () => {
    const r = extractContent(HTML, "https://strguests.tools/house-rules");
    expect(r.sourceUrl).toBe("https://strguests.tools/house-rules");
    expect(r.title).toBe("7 House Rules That Stop Bad Reviews | STRGuests");
    expect(r.h1).toBe("7 House Rules That Stop Bad Reviews");
    expect(r.metaDescription).toContain("Tired of guests");
    expect(r.ogTitle).toBe("7 House Rules That Stop Bad Reviews");
    expect(r.ogDescription).toContain("Stop bad reviews");
    expect(r.bodySample).toContain("Every STR host");
    expect(r.bodySample).not.toContain("Home"); // nav stripped
    expect(r.bodySample).not.toContain("Privacy"); // footer stripped
    expect(r.lang).toBe("en");
  });

  it("returns empty strings for missing fields", () => {
    const r = extractContent("<html><body><p>just text</p></body></html>", "https://x.com/");
    expect(r.title).toBe("");
    expect(r.h1).toBe("");
    expect(r.metaDescription).toBe("");
    expect(r.bodySample).toBe("just text");
  });

  it("defaults lang to 'en' when not specified", () => {
    const r = extractContent("<html></html>", "https://x.com/");
    expect(r.lang).toBe("en");
  });

  it("caps bodySample at 500 chars", () => {
    const long = "<html><body><p>" + "a".repeat(1000) + "</p></body></html>";
    const r = extractContent(long, "https://x.com/");
    expect(r.bodySample.length).toBeLessThanOrEqual(500);
  });
});
```

- [ ] **Step 3: Run — expect FAIL**

- [ ] **Step 4: Implement `src/scrape/extractor.ts`**

```ts
import * as cheerio from "cheerio";
import type { ScrapedContent } from "./types.js";

const BODY_SAMPLE_MAX = 500;

export function extractContent(html: string, sourceUrl: string): ScrapedContent {
  const $ = cheerio.load(html);

  // Strip nav, header, footer, script, style — they pollute body sample
  $("nav, header, footer, script, style, noscript, aside, form, button").remove();

  const title = ($("title").first().text() ?? "").trim();
  const h1 = ($("h1").first().text() ?? "").trim();
  const metaDescription = $('meta[name="description"]').attr("content")?.trim() ?? "";
  const ogTitle = $('meta[property="og:title"]').attr("content")?.trim() ?? "";
  const ogDescription = $('meta[property="og:description"]').attr("content")?.trim() ?? "";

  // Body sample: prefer <article> if present, fall back to <main>, then body
  let bodyText = "";
  const article = $("article").first().text();
  if (article.trim().length > 50) bodyText = article;
  else {
    const main = $("main").first().text();
    bodyText = main.trim().length > 50 ? main : $("body").text();
  }

  // Collapse whitespace
  const bodySample = bodyText.replace(/\s+/g, " ").trim().slice(0, BODY_SAMPLE_MAX);

  const lang = ($("html").attr("lang") ?? "en").trim() || "en";

  return { sourceUrl, title, h1, metaDescription, ogTitle, ogDescription, bodySample, lang };
}
```

- [ ] **Step 5: Run — expect 4 PASS**

- [ ] **Step 6: Commit**

```bash
git add packages/pinforge/src/scrape/extractor.ts packages/pinforge/tests/unit/scrape-extractor.test.ts packages/pinforge/package.json pnpm-lock.yaml
git commit -m "feat(pinforge): cheerio-based HTML content extractor"
```

---

### Task 4: HTTP fetcher

**Files:**
- Create: `packages/pinforge/src/scrape/fetcher.ts`
- Create: `packages/pinforge/tests/unit/scrape-fetcher.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { fetchHtml } from "../../src/scrape/fetcher.js";
import { server } from "../helpers/msw-server.js";

describe("fetchHtml", () => {
  it("returns HTML body on 200", async () => {
    server.use(http.get("https://blog.example.com/post", () => HttpResponse.html("<html><body>hi</body></html>")));
    const html = await fetchHtml("https://blog.example.com/post", { timeoutMs: 5000, maxBytes: 100_000 });
    expect(html).toContain("<body>hi</body>");
  });

  it("throws on 404", async () => {
    server.use(http.get("https://x.com/missing", () => new HttpResponse(null, { status: 404 })));
    await expect(fetchHtml("https://x.com/missing", { timeoutMs: 5000, maxBytes: 100_000 })).rejects.toThrow(/404/);
  });

  it("throws on non-html content-type", async () => {
    server.use(http.get("https://x.com/json", () => HttpResponse.json({ a: 1 })));
    await expect(fetchHtml("https://x.com/json", { timeoutMs: 5000, maxBytes: 100_000 })).rejects.toThrow(/content-type/);
  });

  it("throws on body exceeding maxBytes", async () => {
    server.use(http.get("https://x.com/big", () => HttpResponse.html("x".repeat(2000))));
    await expect(fetchHtml("https://x.com/big", { timeoutMs: 5000, maxBytes: 100 })).rejects.toThrow(/size/);
  });

  it("throws on non-http(s) URL", async () => {
    await expect(fetchHtml("javascript:alert(1)", { timeoutMs: 5000, maxBytes: 100_000 })).rejects.toThrow(/http/);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement `src/scrape/fetcher.ts`**

```ts
import { ValidationError } from "../errors.js";

export interface FetchHtmlOptions {
  timeoutMs: number;
  maxBytes: number;
  userAgent?: string;
}

export async function fetchHtml(url: string, opts: FetchHtmlOptions): Promise<string> {
  const u = new URL(url);
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new ValidationError(`sourceUrl must be http(s): ${url}`, { protocol: u.protocol });
  }

  const res = await fetch(url, {
    method: "GET",
    headers: { "user-agent": opts.userAgent ?? "PinForge/0.1 (+https://github.com/Kebron911)" },
    signal: AbortSignal.timeout(opts.timeoutMs),
    redirect: "follow"
  });

  if (!res.ok) {
    throw new Error(`fetch returned ${res.status} for ${url}`);
  }

  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("text/html") && !ct.includes("application/xhtml+xml")) {
    throw new Error(`unexpected content-type '${ct}' for ${url}`);
  }

  // Size cap: read up to maxBytes then throw if more available
  const contentLength = res.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > opts.maxBytes) {
    throw new Error(`response size ${contentLength} exceeds maxBytes ${opts.maxBytes}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > opts.maxBytes) {
    throw new Error(`response size ${buf.length} exceeds maxBytes ${opts.maxBytes}`);
  }
  return buf.toString("utf8");
}
```

- [ ] **Step 4: Run — expect 5 PASS**

- [ ] **Step 5: Commit**

```bash
git add packages/pinforge/src/scrape/fetcher.ts packages/pinforge/tests/unit/scrape-fetcher.test.ts
git commit -m "feat(pinforge): HTTP fetcher for URL scraping with size + content-type guards"
```

---

### Task 5: scrape/index.ts public entry

**Files:**
- Create: `packages/pinforge/src/scrape/index.ts`

- [ ] **Step 1: Write `src/scrape/index.ts`**

```ts
import { extractContent } from "./extractor.js";
import { fetchHtml, type FetchHtmlOptions } from "./fetcher.js";
import type { ScrapedContent } from "./types.js";

export interface ScrapeOptions {
  timeoutMs?: number;
  maxBytes?: number;
}

export async function scrapeUrl(sourceUrl: string, opts: ScrapeOptions = {}): Promise<ScrapedContent> {
  const html = await fetchHtml(sourceUrl, {
    timeoutMs: opts.timeoutMs ?? 15_000,
    maxBytes: opts.maxBytes ?? 2 * 1024 * 1024 // 2 MB cap
  });
  return extractContent(html, sourceUrl);
}

export type { ScrapedContent } from "./types.js";
export { extractContent } from "./extractor.js";
export { fetchHtml, type FetchHtmlOptions } from "./fetcher.js";
```

- [ ] **Step 2: Build + typecheck clean**

Run: `pnpm -F @str/pinforge build && pnpm -F @str/pinforge typecheck`

- [ ] **Step 3: Commit**

```bash
git add packages/pinforge/src/scrape/index.ts
git commit -m "feat(pinforge): scrape module public entry"
```

---

*M1 complete. Cheerio-based scrape pipeline works end-to-end (mocked). Next: M2 prompt builder.*

---

## Sub-phase M2 — URL-grounded prompt

### Task 6: New prompt builder

**Files:**
- Modify: `packages/pinforge/src/seo/prompts.ts`
- Create: `packages/pinforge/tests/unit/seo-prompts-url.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { BrandKitSchema } from "../../src/brand/schema.js";
import { buildUrlGroundedUserPrompt } from "../../src/seo/prompts.js";

async function loadBrand() {
  const raw = await readFile(new URL("../fixtures/strguests-fixture.json", import.meta.url), "utf8");
  return BrandKitSchema.parse(JSON.parse(raw));
}

const SCRAPED = {
  sourceUrl: "https://strguests.tools/house-rules",
  title: "7 House Rules That Stop Bad Reviews",
  h1: "7 House Rules That Stop Bad Reviews",
  metaDescription: "Tired of guests breaking rules?",
  ogTitle: "7 House Rules That Stop Bad Reviews",
  ogDescription: "Stop bad reviews with these 7 simple house rules.",
  bodySample: "Every STR host runs into the same set of guest behaviors that lead to one-star reviews. The fix isn't more rules — it's better-worded rules.",
  lang: "en"
};

describe("buildUrlGroundedUserPrompt", () => {
  it("includes all scraped fields as context", async () => {
    const brand = await loadBrand();
    const p = buildUrlGroundedUserPrompt({ brand, scraped: SCRAPED, templateId: "big-hook" });
    expect(p).toContain("strguests.tools/house-rules");
    expect(p).toContain("7 House Rules That Stop Bad Reviews");
    expect(p).toContain("Every STR host");
  });

  it("instructs LLM to REWRITE, not copy verbatim", async () => {
    const brand = await loadBrand();
    const p = buildUrlGroundedUserPrompt({ brand, scraped: SCRAPED, templateId: "big-hook" });
    expect(p.toLowerCase()).toMatch(/rewrite|paraphrase|don't copy|do not copy/);
  });

  it("includes template-specific instructions (listicle wants items)", async () => {
    const brand = await loadBrand();
    const p = buildUrlGroundedUserPrompt({ brand, scraped: SCRAPED, templateId: "listicle" });
    expect(p.toLowerCase()).toContain("items");
  });

  it("includes brand voice + cta from brand", async () => {
    const brand = await loadBrand();
    const p = buildUrlGroundedUserPrompt({ brand, scraped: SCRAPED, templateId: "big-hook" });
    // Voice + CTA come from the SYSTEM prompt — this user prompt just refers to them, doesn't repeat them.
    // But it should include the sourceUrl so the LLM knows where the content came from.
    expect(p).toContain(SCRAPED.sourceUrl);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Append to `src/seo/prompts.ts`**

```ts
import type { ScrapedContent } from "../scrape/types.js";

export interface UrlGroundedUserPromptInput {
  brand: BrandKit;
  scraped: ScrapedContent;
  templateId: string;
}

export function buildUrlGroundedUserPrompt(input: UrlGroundedUserPromptInput): string {
  const { brand, scraped, templateId } = input;
  const extras: string[] = [];
  if (templateId === "listicle") extras.push("Include `items`: 5-7 short list items that match the headline. You can infer them from the source content.");
  if (templateId === "how-to") extras.push("Include `items`: 3-5 step-by-step actions for the how-to.");
  if (templateId === "big-stat") extras.push("Include `stat`: extract one compelling percentage or number from the source, or invent a plausible one.");
  if (templateId === "before-after") extras.push("The headline should describe the transformation; `description` can hint at before/after.");

  return `Write Pinterest SEO copy for ${brand.displayName} (${brand.domain}) — REWRITE the source content below into pin-optimized copy in the brand voice.

DO NOT copy phrases verbatim from the source. Paraphrase. The pin must stand alone.

TEMPLATE: ${templateId}
${extras.length ? "\nTEMPLATE-SPECIFIC:\n- " + extras.join("\n- ") : ""}

--- SOURCE CONTENT (from ${scraped.sourceUrl}) ---
TITLE: ${scraped.title || "(none)"}
H1: ${scraped.h1 || "(none)"}
META DESCRIPTION: ${scraped.metaDescription || "(none)"}
OG TITLE: ${scraped.ogTitle || "(none)"}
OG DESCRIPTION: ${scraped.ogDescription || "(none)"}
BODY EXCERPT: ${scraped.bodySample}
LANGUAGE: ${scraped.lang}
--- END SOURCE ---

Respond with JSON matching the schema in the system prompt. The destinationUrl in the eventual pin metadata will point to the user's chosen URL, NOT necessarily the source URL above.`;
}
```

- [ ] **Step 4: Run — expect 4 PASS**

- [ ] **Step 5: Commit**

```bash
git add packages/pinforge/src/seo/prompts.ts packages/pinforge/tests/unit/seo-prompts-url.test.ts
git commit -m "feat(pinforge): URL-grounded SEO prompt builder"
```

---

### Task 7: Wire scrape module + prompt builder into public exports

**Files:**
- Modify: `packages/pinforge/src/index.ts`

Append:
```ts
export { scrapeUrl, extractContent, fetchHtml, type ScrapedContent, type ScrapeOptions, type FetchHtmlOptions } from "./scrape/index.js";
export { buildUrlGroundedUserPrompt, type UrlGroundedUserPromptInput } from "./seo/prompts.js";
```

Build + typecheck clean. Commit:
```bash
git add packages/pinforge/src/index.ts
git commit -m "feat(pinforge): export scrape module + URL-grounded prompt"
```

---

*M2 complete. Next: M3 wire it through the orchestrator.*

---

## Sub-phase M3 — Orchestrator branching

### Task 8: Orchestrator branches on inputMode

**Files:**
- Modify: `packages/pinforge/src/orchestrator/generate.ts`

- [ ] **Step 1: Edit `src/orchestrator/generate.ts`**

Locate the section where `userPrompt` is built:

```ts
const userPrompt = buildUserPrompt({ brand, topic: input.topic, primaryKeyword: input.primaryKeyword, templateId });
```

Replace with:

```ts
import { scrapeUrl } from "../scrape/index.js";
import { buildUrlGroundedUserPrompt } from "../seo/prompts.js";

// ... inside generatePin, after templateId is resolved:

let userPrompt: string;
if (input.inputMode === "url") {
  if (!input.sourceUrl) {
    throw new ValidationError("sourceUrl is required when inputMode is 'url'", { inputMode: input.inputMode });
  }
  const scraped = await scrapeUrl(input.sourceUrl);
  userPrompt = buildUrlGroundedUserPrompt({ brand, scraped, templateId });
} else {
  userPrompt = buildUserPrompt({ brand, topic: input.topic, primaryKeyword: input.primaryKeyword, templateId });
}
```

Also: when `inputMode === "url"`, the `input.topic` and `input.primaryKeyword` are still required for `metadata.sourceInputs`. The schema already requires them. They serve as the user's hint for slug generation and metadata — even in URL mode, the user provides a topic + keyword for organizational purposes.

(Alternative considered: make `topic` + `primaryKeyword` optional when `inputMode === "url"`. Rejected — keeps the data model consistent and the slug deterministic. The user can copy the scraped title into the topic field if they want.)

- [ ] **Step 2: Build + typecheck**

Run: `pnpm -F @str/pinforge build && pnpm -F @str/pinforge typecheck`
Expected: clean. All existing 89 tests pass.

- [ ] **Step 3: Commit**

```bash
git add packages/pinforge/src/orchestrator/generate.ts
git commit -m "feat(pinforge): orchestrator branches on inputMode for URL scraping"
```

---

### Task 9: E2E test for URL mode

**Files:**
- Create: `packages/pinforge/tests/integration/generate-pin-url-mode.test.ts`

- [ ] **Step 1: Write test**

```ts
import { http, HttpResponse } from "msw";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { loadEnv } from "../../src/env.js";
import { generatePin } from "../../src/orchestrator/generate.js";
import { server } from "../helpers/msw-server.js";
import { makeTempDir } from "../helpers/temp-output.js";

const BRANDS_DIR = new URL("../../brands/", import.meta.url).pathname;
const FIXTURE_HTML = readFileSync(fileURLToPath(new URL("../fixtures/blog-post-fixture.html", import.meta.url)), "utf8");

let dir: string;
let cleanup: () => Promise<void>;
beforeEach(async () => {
  ({ dir, cleanup } = await makeTempDir());
  process.env.OPENAI_API_KEY = "sk-test";
});
afterEach(async () => { await cleanup(); });

describe("generatePin with inputMode=url", () => {
  it("scrapes URL and generates pin from grounded prompt", async () => {
    server.use(
      http.get("https://strguests.tools/house-rules", () => HttpResponse.html(FIXTURE_HTML))
    );

    const env = loadEnv();
    const result = await generatePin(
      {
        brandId: "strguests",
        topic: "house rules from blog",
        primaryKeyword: "airbnb house rules",
        destinationUrl: "https://strguests.tools/house-rules-generator",
        inputMode: "url",
        sourceUrl: "https://strguests.tools/house-rules",
        backgroundType: "solid"
      },
      { env, brandsDir: BRANDS_DIR, outputDir: dir }
    );
    expect(result.metadata.brandId).toBe("strguests");
    expect(result.metadata.sourceInputs.inputMode).toBe("url");
    expect(result.metadata.sourceInputs.sourceUrl).toBe("https://strguests.tools/house-rules");
    // pin should NOT be a verbatim copy — but with mocked OpenAI returning a canned response, we just verify the pipeline ran
    expect(result.metadata.description.length).toBeGreaterThanOrEqual(150);
  });

  it("throws ValidationError when inputMode=url but sourceUrl missing", async () => {
    const env = loadEnv();
    await expect(generatePin(
      {
        brandId: "strguests",
        topic: "x",
        primaryKeyword: "k",
        destinationUrl: "https://strguests.tools/x",
        inputMode: "url"
        // sourceUrl missing
      },
      { env, brandsDir: BRANDS_DIR, outputDir: dir }
    )).rejects.toThrow(/sourceUrl/);
  });

  it("propagates scrape failures with proper error", async () => {
    server.use(
      http.get("https://broken.example.com/post", () => new HttpResponse(null, { status: 500 }))
    );
    const env = loadEnv();
    await expect(generatePin(
      {
        brandId: "strguests",
        topic: "x",
        primaryKeyword: "k",
        destinationUrl: "https://strguests.tools/x",
        inputMode: "url",
        sourceUrl: "https://broken.example.com/post"
      },
      { env, brandsDir: BRANDS_DIR, outputDir: dir }
    )).rejects.toThrow(/500|fetch/);
  });
});
```

- [ ] **Step 2: Run — expect 3 PASS**

- [ ] **Step 3: Commit**

```bash
git add packages/pinforge/tests/integration/generate-pin-url-mode.test.ts
git commit -m "test(pinforge): E2E generatePin with inputMode=url"
```

---

### Task 10: Verify CSV + CLI work with URL mode (no code change expected)

The CSV parser and CLI already accept `inputMode` and `sourceUrl` from Phase A schema. This task verifies they work end-to-end.

**Files:** (test-only)
- Modify: `packages/pinforge/tests/unit/csv-parse.test.ts` — add one URL-mode row test

- [ ] **Step 1: Add to `csv-parse.test.ts`**

```ts
it("parses URL-mode rows", () => {
  const csv = `brandId,topic,primaryKeyword,destinationUrl,inputMode,sourceUrl
strguests,my-topic,kw,https://strguests.tools/dest,url,https://strguests.tools/source`;
  const result = parsePinInputCsv(csv);
  expect(result.rows).toHaveLength(1);
  expect(result.errors).toHaveLength(0);
  expect(result.rows[0]!.inputMode).toBe("url");
  expect(result.rows[0]!.sourceUrl).toBe("https://strguests.tools/source");
});

it("rejects URL-mode row missing sourceUrl", () => {
  const csv = `brandId,topic,primaryKeyword,destinationUrl,inputMode
strguests,my-topic,kw,https://strguests.tools/dest,url`;
  const result = parsePinInputCsv(csv);
  expect(result.rows).toHaveLength(0);
  expect(result.errors).toHaveLength(1);
});
```

- [ ] **Step 2: Run — expect 2 new PASS (total 6)**

- [ ] **Step 3: Add CLI flag for `--source-url` and `--input-mode`**

Modify `packages/pinforge/src/cli.ts` — extend the `generate` command:

```ts
program.command("generate")
  .description("Generate a single pin")
  .requiredOption("--brand <id>", "brandId")
  .requiredOption("--topic <text>", "pin topic")
  .requiredOption("--keyword <text>", "primary SEO keyword")
  .requiredOption("--url <url>", "destination URL")
  .option("--template <id>", "templateId (default: brand default)")
  .option("--bg <type>", "backgroundType: solid|gradient|image")
  .option("--treatment <type>", "imageTreatment: bottom-gradient|white-banner|duotone")
  .option("--input-mode <mode>", "inputMode: topic|url (default: topic)")
  .option("--source-url <url>", "source URL to scrape when --input-mode=url")
  .action(async (opts) => {
    const env = loadEnv();
    const result = await generatePin({
      brandId: opts.brand,
      topic: opts.topic,
      primaryKeyword: opts.keyword,
      destinationUrl: opts.url,
      templateId: opts.template,
      backgroundType: opts.bg,
      imageTreatment: opts.treatment,
      inputMode: opts.inputMode,
      sourceUrl: opts.sourceUrl
    }, { env, brandsDir: BRANDS_DIR, outputDir: resolve(process.cwd(), env.outputDir) });
    process.stdout.write(`✓ ${result.paths.png}\n  ${result.paths.json}\n`);
  });
```

- [ ] **Step 4: Rebuild + smoke test**

```bash
pnpm -F @str/pinforge build
node packages/pinforge/dist/cli.js generate --help
```

Expected: `--input-mode` and `--source-url` flags appear in the help output.

- [ ] **Step 5: Commit**

```bash
git add packages/pinforge/tests/unit/csv-parse.test.ts packages/pinforge/src/cli.ts
git commit -m "feat(pinforge): CLI --input-mode and --source-url flags for URL mode"
```

---

*M3 complete. URL mode works end-to-end through orchestrator, CSV, and CLI.*

---

## Sub-phase M4 — Wiring + docs

### Task 11: Update README

**Files:**
- Modify: `packages/pinforge/README.md`

- [ ] **Step 1: Append URL mode section**

```md
## URL input mode

Instead of `--topic + --keyword`, pass a URL and PinForge will scrape it and generate pin copy grounded in the source content:

```bash
pnpm pinforge:cli generate \
  --brand strguests \
  --topic "house rules" \
  --keyword "airbnb house rules" \
  --url https://strguests.tools/house-rules-generator \
  --input-mode url \
  --source-url https://strguests.tools/blog/7-house-rules-that-stop-bad-reviews \
  --bg image
```

`--topic` and `--keyword` are still required — they're used for slug + organizational metadata, not for the SEO copy. The actual pin content comes from the AI rewriting the scraped page.

In CSV, add `inputMode,sourceUrl` columns:

```csv
brandId,topic,primaryKeyword,destinationUrl,inputMode,sourceUrl
strguests,house rules,airbnb rules,https://strguests.tools/x,url,https://strguests.tools/blog/post
```

### What gets scraped

- `<title>`, `<h1>`, `<meta name="description">`, OpenGraph tags
- Body excerpt (≤500 chars, prefers `<article>` then `<main>`)
- Nav/header/footer/script/style are stripped

### Safety

- Sources are fetched HTTP GET with 15s timeout, 2MB cap
- Only `http(s)://` URLs accepted
- The AI is instructed to **rewrite** (not paste-through) the source content
- The pin's `destinationUrl` field can be different from `sourceUrl` (e.g., scrape a blog post, but link the pin to your product page)
```

- [ ] **Step 2: Commit**

```bash
git add packages/pinforge/README.md
git commit -m "docs(pinforge): URL input mode usage"
```

---

### Task 12: Update plan + spec back-references

**Files:**
- Modify: `docs/superpowers/specs/2026-05-16-pinforge-design.md` (mark Phase A.5 as implemented)
- Modify: `BACKLOG.md` (note URL mode is live)

- [ ] **Step 1: Update spec section 14 phasing**

In `docs/superpowers/specs/2026-05-16-pinforge-design.md`, find the phasing section:

```
Phase A.5 — Mode B (URL input)              (~1-2 days)
```

Add a status line after it:

```
  ✅ COMPLETED 2026-MM-DD — see docs/superpowers/plans/2026-05-17-pinforge-phase-a5.md
```

- [ ] **Step 2: Update BACKLOG.md**

In the PinForge section of `BACKLOG.md`, add at the bottom:

```md
**PinForge Phase A.5 (URL input mode) shipped 2026-MM-DD.** Pass `--input-mode url --source-url <blog-url>` to scrape + ground pin copy in source content. See `packages/pinforge/README.md` for usage.
```

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/specs/2026-05-16-pinforge-design.md BACKLOG.md
git commit -m "docs(pinforge): mark Phase A.5 URL mode as shipped"
```

---

## Phase A.5 complete

You now have:

- ✅ `scrapeUrl(url)` returns `ScrapedContent` (cheerio-based, size-capped, timeout-guarded)
- ✅ `buildUrlGroundedUserPrompt()` produces a "REWRITE — do not copy" prompt seeded with scraped fields
- ✅ Orchestrator branches on `inputMode === "url"` and uses the grounded prompt
- ✅ CSV + CLI both accept `--input-mode url --source-url <url>` (and `inputMode,sourceUrl` CSV columns)
- ✅ ~12 commits, ~17 new tests
- ✅ The existing API (`POST /v1/pins`, `/v1/pins/bulk`, etc.) just works with URL mode — no Phase B changes needed

## Open follow-ups

- **No JS-rendered SPA support** — cheerio only sees server-rendered HTML. If your source URL is a React/Vue SPA that injects content client-side, the scrape will get an empty shell. Phase A.5.1 could add a Playwright/Puppeteer-based fetcher behind a feature flag.
- **No paywall detection** — if `fetchHtml` lands on a soft paywall page that returns 200 with the paywall, the AI will see paywall text as the source. Add a heuristic check (e.g., "subscribe", "paywall" in body sample) and warn.
- **No language verification** — the brand voice is single-language; if the scraped content is in a different language, the AI might mix or fail. Add a sanity check that `scraped.lang` matches the brand's expected language.
- **No content-type detection beyond text/html** — PDFs, podcasts, YouTube transcripts not supported. Could add a multi-format adapter pattern in the future.
