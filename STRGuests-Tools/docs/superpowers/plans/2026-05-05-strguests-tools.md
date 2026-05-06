# strguests.tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship strguests.tools — 7 generators (4 PDF + 3 AI) + ~100 message-template scenario pages + chrome + monetization + SEO + Hostinger dual-target deploy (static + Express) — production-ready.

**Architecture:** Astro 4.x static site for tools 1–4 + content. Node.js Express app on Hostinger Apps for AI tools 5–7. PDF tools use `pdf-lib` client-side. AI tools call `/api/generate-{listing|review|message}` which wraps OpenAI GPT-4o-mini with rate limiting (5/hr/IP unverified, 50/day/email verified). Pinterest pin generation via Satori produces 1000×1500 PNGs. URL state encodes inputs for shareable/indexable results. Programmatic template pages from JSON.

**Tech Stack:** Astro 4.x, TypeScript, Tailwind, pdf-lib (client), Express + MySQL (server), openai SDK, Satori (Pinterest pins + OG), Vitest, Playwright, pnpm. Deploy via FTP-action (static) + SSH/rsync (Express) to Hostinger Business.

**Cluster context:** strguests.tools is one of four sibling sites in the STR cluster. Brand tokens, layout primitives, and most monetization primitives are **shared** with strhost.tools — this plan references strhost.tools tasks rather than duplicating verbatim file content. Strguests-novel work (PDF generators, AI server, Pinterest, rate limiting) is detailed in full.

---

## Task 1: Bootstrap dual-target repo

**Files:** `package.json`, `tsconfig.json`, `astro.config.mjs`, `tailwind.config.ts`, `vitest.config.ts`, `playwright.config.ts`, `server/tsconfig.json`, `.gitignore`, `.npmrc`, `README.md`

This task mirrors **strhost.tools Task 1** (lines 13–233 in [strhost plan](../../../STRHost-Tools/docs/superpowers/plans/2026-05-05-strhost-tools.md)) with two deltas: pnpm workspace shape supports `server/` subpath, and additional dependencies for AI + PDF.

- [ ] **Step 1: Create `package.json`** — same as strhost Task 1 Step 1, with these added dependencies:
   ```json
   "dependencies": {
     "openai": "^4.52.0",
     "pdf-lib": "^1.17.1",
     "express": "^4.19.2",
     "mysql2": "^3.10.0",
     "express-rate-limit": "^7.4.0",
     "zod": "^3.23.8",
     "satori": "^0.10.13",
     "@resvg/resvg-js": "^2.6.2"
   },
   "devDependencies": {
     "@types/express": "^4.17.21",
     "tsx": "^4.16.0"
   },
   "scripts": {
     "server:dev": "tsx watch server/index.ts",
     "server:build": "tsc -p server/tsconfig.json",
     "server:start": "node server/dist/index.js"
   }
   ```

- [ ] **Step 2: `tsconfig.json`** — same as strhost; add `"server"` to `exclude` so the static build doesn't pull server code.

- [ ] **Step 3: `server/tsconfig.json`** (new):
   ```json
   {
     "compilerOptions": {
       "target": "ES2022",
       "module": "ES2022",
       "moduleResolution": "bundler",
       "outDir": "./dist",
       "rootDir": ".",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "resolveJsonModule": true,
       "types": ["node"]
     },
     "include": ["**/*.ts"],
     "exclude": ["dist", "node_modules"]
   }
   ```

- [ ] **Step 4: `astro.config.mjs`** — same as strhost; site URL `https://strguests.tools`.

- [ ] **Step 5: `tailwind.config.ts`** — same as strhost (extension fleshed out in Task 2).

- [ ] **Step 6: `vitest.config.ts`** — same as strhost; add `server/**/*.test.ts` to `include`.

- [ ] **Step 7: `playwright.config.ts`** — same as strhost.

- [ ] **Step 8: `.gitignore`** — same as strhost; add `server/dist`, `.env.local`.

- [ ] **Step 9: `.npmrc`** — same as strhost.

- [ ] **Step 10: `README.md`** — strguests-specific; document the dual-target dev story:
   ```bash
   pnpm dev          # Astro static site on :4321
   pnpm server:dev   # Express API on :3001
   ```

- [ ] **Step 11: Install + commit**
   ```bash
   pnpm install
   git add package.json pnpm-lock.yaml tsconfig.json server/tsconfig.json astro.config.mjs tailwind.config.ts vitest.config.ts playwright.config.ts .gitignore .npmrc README.md
   git commit -m "chore: bootstrap astro+express dual-target project"
   ```

---

## Task 2: Brand tokens with hospitality-warm accent

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Modify: `tailwind.config.ts`

Mirrors **strhost.tools Task 2** with one accent shift.

- [ ] **Step 1: Port tokens** — copy from `Excel-Templates/design-system/colors_and_type.css` into `src/styles/tokens.css`. Override `--accent-*` palette to hospitality-warm. Suggested HEX (refine in Task 2 review):
   - `--accent-50: #FBF5F0`
   - `--accent-100: #F5E6DA`
   - `--accent-500: #C97D5C` (soft terracotta)
   - `--accent-700: #8E5238`
   - `--accent-900: #4A2A1D`

   Body neutrals stay aligned with cluster (Inter primary, Cormorant Garamond accent — gets more screen time on this site than siblings, JetBrains Mono limited to wifi codes / door codes).

- [ ] **Step 2: `global.css`** — same as strhost: imports `tokens.css`, `@tailwind base/components/utilities`, base typography rules, `tabular-nums` for `.font-mono`.

- [ ] **Step 3: `tailwind.config.ts`** — extend `theme.colors.accent` from CSS custom properties; `theme.fontFamily.{sans, serif, mono}` from Inter / Cormorant / JetBrains Mono.

- [ ] **Step 4: Visual check** — render a placeholder page with each accent shade as a swatch. Confirm warmth reads as "hospitality" not "kitsch."

- [ ] **Step 5: Commit** — `feat: brand tokens with hospitality-warm accent`

---

## Task 3: Print stylesheet

**Files:** Create `src/styles/print.css`

Mirrors **strhost.tools Task 3** verbatim (lines 378–408 of [strhost plan](../../../STRHost-Tools/docs/superpowers/plans/2026-05-05-strhost-tools.md)). PDF preview pages benefit from clean print, since users may want to print their generated outputs from the browser as a fallback to PDF download.

Commit: `feat: print stylesheet`

---

## Task 4: Layout primitives

**Files:** `src/components/chrome/{Header,Footer,Sidebar,FunnelBand,ClusterFunnelBlock,Layout}.astro`

Mirrors **strhost.tools Task 7** (lines 725–917 of strhost plan). Strguests-specific deltas:

- Wordmark: "strguests.tools" in Inter Tight Semibold
- Sidebar lists the other six generators (placeholder until generator routes exist in Phases 2–3)
- ClusterFunnelBlock: `currentCluster="guest-xp"` — hides self-link, shows links to strhost / strbuyers / strops with one-line value props per sibling

- [ ] **Step 1: Layout.astro** — wraps Header + slot + Footer + FunnelBand. Accepts `description`, `ogImage`, `canonical` props.
- [ ] **Step 2: Header.astro** — wordmark, nav (links to all 7 generators + `/templates`, `/about`, `/contact`).
- [ ] **Step 3: Footer.astro** — nav, social, legal, "Powered by The STR Ledger" co-brand, last-updated date.
- [ ] **Step 4: Sidebar.astro** — 6 related-generator cards.
- [ ] **Step 5: FunnelBand.astro** — thin co-branded "Built by The STR Ledger →".
- [ ] **Step 6: ClusterFunnelBlock.astro** — three sibling site cards with one-line value props.
- [ ] **Step 7: Throwaway test route** at `src/pages/index.astro` rendering all six. Confirm in browser.
- [ ] **Step 8: Commit** — `feat: layout primitives`

---

## Task 5: Monetization primitives

**Files (under `src/components/`):**
- `ads/AdSlot.astro`
- `funnel/EmailCaptureCard.astro`
- `funnel/STRLedgerCTA.astro`
- **`generator/PdfDownloadButton.astro`** (NEW)
- **`generator/PinterestPinButton.astro`** (NEW)
- **`generator/AiRateLimitNotice.astro`** (NEW)

AdSlot, EmailCaptureCard, STRLedgerCTA mirror **strhost.tools Task 8** (lines 918–1017 of strhost plan).

### PdfDownloadButton

Triggers PDF generation + soft email gate modal. Modal close button still downloads. Per spec: "the PDF generator IS the lead magnet."

```astro
---
// src/components/generator/PdfDownloadButton.astro
interface Props {
  tool: string;          // e.g., "house-rules"
  label?: string;        // default "Download PDF"
  magnet?: string;       // ESP magnet ID for opportunistic email capture
}
const { tool, label = "Download PDF", magnet } = Astro.props;
---
<button
  data-pdf-download
  data-tool={tool}
  data-magnet={magnet ?? ""}
  class="rounded-md bg-accent-500 px-4 py-2 font-medium text-white hover:bg-accent-700"
>
  {label}
</button>

<dialog data-pdf-modal class="rounded-lg p-6 backdrop:bg-black/40">
  <form method="dialog" data-pdf-form class="space-y-3">
    <h3 class="font-serif text-lg">Get the next one in your inbox?</h3>
    <p class="text-sm text-neutral-600">Optional. Your PDF downloads either way.</p>
    <input type="email" name="email" placeholder="you@example.com" class="w-full rounded border px-3 py-2" />
    <div class="flex justify-end gap-2">
      <button value="skip" class="text-sm text-neutral-600">Skip and download</button>
      <button value="submit" class="rounded bg-accent-500 px-3 py-1.5 text-sm text-white">Send + download</button>
    </div>
  </form>
</dialog>

<script>
  // Wire up button → dialog → download. Actual PDF generation handled by tool's
  // generator island (subscribes to a CustomEvent). Email POST to ESP webhook.
  // (Implementation detail: keep generic so any generator wires its own buffer.)
</script>
```

### PinterestPinButton

Triggers per-output 1000×1500 PNG generation via Satori. Opens Pinterest share intent.

```astro
---
// src/components/generator/PinterestPinButton.astro
interface Props {
  tool: string;
  template?: string;     // pin design template id
}
const { tool, template = "default" } = Astro.props;
---
<button
  data-pin-button
  data-tool={tool}
  data-template={template}
  class="rounded-md border border-accent-500 px-4 py-2 text-sm text-accent-700 hover:bg-accent-50"
>
  Make a Pinterest pin
</button>
```

Wires to a tool-island CustomEvent that supplies the output payload (rules list, welcome book metadata, etc.). The pin generator (Task 29) consumes that payload and produces the PNG.

### AiRateLimitNotice

Shows current rate-limit state on AI generator pages. CTAs to verify email if exhausted.

```astro
---
// src/components/generator/AiRateLimitNotice.astro
interface Props { tool: "listing" | "review" | "message"; }
const { tool } = Astro.props;
---
<div data-rate-limit-notice data-tool={tool}
     class="rounded-md bg-accent-50 px-4 py-3 text-sm text-accent-900">
  <span data-rl-status>Loading rate limit status…</span>
  <button data-rl-verify-btn hidden class="ml-2 underline">Verify email for 50/day</button>
</div>

<script>
  // Fetch /api/rate-limit-status on mount (returns remaining for IP / email cookie),
  // populate text, show/hide verify button.
</script>
```

- [ ] **Step 1–6:** Implement the six components above
- [ ] **Step 7:** Render all six on the throwaway test route; confirm visual + accessibility (focus rings, semantic dialog)
- [ ] **Step 8:** Commit — `feat: monetization + generator primitives`

---

## Task 6: URL-state library (TDD)

**Files:** `src/lib/url-state.ts`, `tests/url-state.test.ts`

Mirrors **strhost.tools Task 5** (lines 497–620 of strhost plan) verbatim. Tests first.

Commit: `feat: url-state library with debounced replaceState`

---

## Task 7: Format library (TDD)

**Files:** `src/lib/format.ts`, `tests/format.test.ts`

Mirrors **strhost.tools Task 4** (lines 409–496 of strhost plan). Strguests adds `formatPhone()` (used in welcome book builder + check-in instructions).

```ts
// Addition to format.ts
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  if (digits.length === 11 && digits[0] === '1') return `+1 (${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7)}`;
  return raw;
}
```

Commit: `feat: format library with currency/percent/phone helpers`

---

## Task 8: SEO library

**Files:** `src/lib/seo.ts`

Mirrors **strhost.tools Task 6** (lines 621–724 of strhost plan). Strguests adds `buildArticle(scenario)` for `/templates/[scenario]` pages.

Commit: `feat: seo library — Schema.org JSON-LD builders incl Article`

---

## Task 9: PDF library base

**Files:** `src/lib/pdf/base.ts`, `src/lib/pdf/types.ts`, `tests/pdf/base.test.ts`

Mirrors **strops.tools Task 9** in concept but tuned for guest-facing collateral (warmer palette, more whitespace, hospitable feel).

```ts
// src/lib/pdf/types.ts
export interface PdfMeta {
  title: string;
  subtitle?: string;
  toolSlug: string;
  brandFooter?: boolean;     // default true
  generatedAt?: Date;        // default now
}
```

```ts
// src/lib/pdf/base.ts
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import type { PdfMeta } from './types';

const ACCENT = rgb(0.788, 0.490, 0.361); // matches --accent-500

export async function createBaseDoc(meta: PdfMeta): Promise<PDFDocument> {
  const doc = await PDFDocument.create();
  doc.setTitle(meta.title);
  doc.setAuthor('strguests.tools');
  doc.setProducer('strguests.tools');
  doc.setCreator('The STR Ledger');
  return doc;
}

export async function drawHeader(doc: PDFDocument, page: any, meta: PdfMeta) {
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  page.drawText(meta.title, { x: 50, y: page.getHeight() - 60, size: 18, font, color: rgb(0.1, 0.1, 0.1) });
  if (meta.subtitle) {
    const sub = await doc.embedFont(StandardFonts.Helvetica);
    page.drawText(meta.subtitle, { x: 50, y: page.getHeight() - 80, size: 11, font: sub, color: rgb(0.4, 0.4, 0.4) });
  }
  // accent rule
  page.drawLine({ start: { x: 50, y: page.getHeight() - 90 }, end: { x: page.getWidth() - 50, y: page.getHeight() - 90 }, thickness: 1, color: ACCENT });
}

export async function drawFooter(doc: PDFDocument, page: any, meta: PdfMeta) {
  if (meta.brandFooter === false) return;
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const ts = (meta.generatedAt ?? new Date()).toISOString().slice(0, 10);
  page.drawText(`Generated ${ts} • strguests.tools`, { x: 50, y: 30, size: 9, font, color: rgb(0.5, 0.5, 0.5) });
}
```

```ts
// tests/pdf/base.test.ts
import { describe, it, expect } from 'vitest';
import { createBaseDoc, drawHeader, drawFooter } from '@/lib/pdf/base';

describe('pdf base', () => {
  it('produces a valid PDF buffer with header + footer', async () => {
    const doc = await createBaseDoc({ title: 'Test', toolSlug: 'test' });
    const page = doc.addPage();
    await drawHeader(doc, page, { title: 'Test', subtitle: 'Sub', toolSlug: 'test' });
    await drawFooter(doc, page, { title: 'Test', toolSlug: 'test' });
    const bytes = await doc.save();
    expect(bytes[0]).toBe(0x25); // %
    expect(bytes[1]).toBe(0x50); // P
    expect(bytes[2]).toBe(0x44); // D
    expect(bytes[3]).toBe(0x46); // F
  });
});
```

Commit: `feat: pdf library base — branded header/footer template`

---

## Task 10: Express server skeleton + MySQL pool + schema migration

**Files:**
- `server/index.ts`
- `server/lib/db.ts`
- `server/db/schema.sql`
- `server/db/migrate.ts`
- `tests/server/db.test.ts`

```ts
// server/index.ts
import express from 'express';
import { json } from 'express';
import { rateLimitStatus } from './routes/rate-limit-status';
// (more routes added in Phase 3)

const app = express();
app.use(json({ limit: '20kb' }));

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));
app.get('/api/rate-limit-status', rateLimitStatus);
// app.post('/api/generate-listing', ...) — Task 19

const port = process.env.PORT ?? 3001;
app.listen(port, () => console.log(`strguests api on :${port}`));
```

```ts
// server/lib/db.ts
import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 5,
});

export async function query<T = unknown>(sql: string, params: unknown[] = []) {
  const [rows] = await pool.execute(sql, params);
  return rows as T;
}
```

```sql
-- server/db/schema.sql
CREATE TABLE IF NOT EXISTS rate_limits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  scope VARCHAR(20) NOT NULL,           -- 'ip' or 'email'
  identifier VARCHAR(255) NOT NULL,     -- ip hash or email
  tool VARCHAR(40) NOT NULL,
  used_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_lookup (scope, identifier, used_at)
);

CREATE TABLE IF NOT EXISTS email_verifications (
  email VARCHAR(255) PRIMARY KEY,
  verified_at DATETIME,
  token VARCHAR(64) NOT NULL,
  token_expires_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS generation_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  tool VARCHAR(40) NOT NULL,
  ip_hash CHAR(64) NOT NULL,
  email VARCHAR(255),
  tokens_used INT NOT NULL,
  status ENUM('ok','rate_limited','error') NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created (created_at)
);
```

```ts
// server/db/migrate.ts
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { pool } from '../lib/db';

const here = dirname(fileURLToPath(import.meta.url));
const sql = await readFile(resolve(here, 'schema.sql'), 'utf-8');
const statements = sql.split(/;\s*$/m).map(s => s.trim()).filter(Boolean);
for (const stmt of statements) await pool.execute(stmt);
console.log(`Applied ${statements.length} statements.`);
process.exit(0);
```

- [ ] **Step 1:** Implement files above
- [ ] **Step 2:** Add `db:migrate` script to `package.json`: `"db:migrate": "tsx server/db/migrate.ts"`
- [ ] **Step 3:** Add `.env.example` with `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`, `OPENAI_API_KEY`, `EMAIL_VERIFY_SECRET`
- [ ] **Step 4:** Run `pnpm server:dev` locally with a local MySQL or stub. `curl http://localhost:3001/api/health` returns `{"status":"ok"}`
- [ ] **Step 5:** Vitest unit test confirms `query()` correctly parameterizes (no SQL-injection sloppy paths)
- [ ] **Step 6:** Commit — `feat: express server skeleton + mysql schema`

---

## Task 11: House rules generator

**Files:**
- `src/components/generators/HouseRulesGenerator.tsx`
- `src/lib/pdf/house-rules.ts`
- `src/pages/house-rules-generator.astro`
- `src/content/tools/house-rules.mdx` (intro + how-it-works + FAQ)
- `tests/pdf/house-rules.test.ts`

The TSX island is the form + live preview. The PDF library function takes form values and produces the PDF. The Astro page wires layout + content + island.

```tsx
// src/components/generators/HouseRulesGenerator.tsx
import { useState, useMemo } from 'react';
import { buildHouseRulesPdf, type HouseRulesInput } from '@/lib/pdf/house-rules';

const DEFAULT_RULES = [
  { id: 'no-smoking', label: 'No smoking anywhere on property', enabled: true },
  { id: 'no-parties', label: 'No parties or events', enabled: true },
  { id: 'quiet-hours', label: 'Quiet hours: 10pm — 8am', enabled: true },
  { id: 'pets', label: 'Pets allowed (please clean up after them)', enabled: false },
  { id: 'max-occupancy', label: 'Max occupancy as listed; no extra guests', enabled: true },
  // …~20 more presets in `data/house-rules-presets.json`
];

export default function HouseRulesGenerator() {
  const [propertyName, setPropertyName] = useState('Your Property');
  const [hostName, setHostName] = useState('');
  const [rules, setRules] = useState(DEFAULT_RULES);
  const [custom, setCustom] = useState('');

  const input: HouseRulesInput = useMemo(() => ({
    propertyName,
    hostName,
    rules: rules.filter(r => r.enabled).map(r => r.label).concat(custom.split('\n').filter(Boolean)),
  }), [propertyName, hostName, rules, custom]);

  // Preview pane: render rules as styled HTML mirroring PDF layout
  // Download button: serialize input → buildHouseRulesPdf(input) → trigger download

  return (/* form on left, preview on right */);
}
```

```ts
// src/lib/pdf/house-rules.ts
import { createBaseDoc, drawHeader, drawFooter } from './base';

export interface HouseRulesInput {
  propertyName: string;
  hostName?: string;
  rules: string[];
}

export async function buildHouseRulesPdf(input: HouseRulesInput): Promise<Uint8Array> {
  const doc = await createBaseDoc({ title: 'House Rules', subtitle: input.propertyName, toolSlug: 'house-rules' });
  const page = doc.addPage();
  await drawHeader(doc, page, { title: 'House Rules', subtitle: input.propertyName, toolSlug: 'house-rules' });
  // Render rules list with checkbox glyphs, hospitality-warm accent
  let y = page.getHeight() - 130;
  for (const rule of input.rules) {
    page.drawText(`☐ ${rule}`, { x: 50, y, size: 12 });
    y -= 22;
  }
  if (input.hostName) page.drawText(`— ${input.hostName}`, { x: 50, y: y - 30, size: 10 });
  await drawFooter(doc, page, { title: 'House Rules', toolSlug: 'house-rules' });
  return doc.save();
}
```

- [ ] **Step 1:** Vitest unit test for `buildHouseRulesPdf({ propertyName: 'Test', rules: ['No smoking'] })` — checks PDF magic bytes + page count + that "No smoking" text exists in extracted text (use `pdfjs-dist` for extraction in tests if needed)
- [ ] **Step 2:** Implement TSX generator with form-on-left, preview-on-right
- [ ] **Step 3:** Wire `<PdfDownloadButton tool="house-rules" magnet="str-guest-comms-playbook" />` to receive a CustomEvent from the generator that supplies the buffer
- [ ] **Step 4:** Wire `<PinterestPinButton tool="house-rules" />` to receive output payload
- [ ] **Step 5:** Astro page: layout + content (intro + how-it-works + FAQ MDX) + island hydrated `client:load` + AdSlot positions per R2
- [ ] **Step 6:** Commit — `feat: house-rules-generator — PDF generator`

---

## Task 12: Welcome book builder

**Files:**
- `src/components/generators/WelcomeBookBuilder.tsx`
- `src/lib/pdf/welcome-book.ts`
- `src/pages/welcome-book-builder.astro`
- `src/content/tools/welcome-book.mdx`
- `tests/pdf/welcome-book.test.ts`

Multi-page PDF (~6–10 pages by default): cover, wifi + access codes, neighborhood guide, house tips, emergency contacts. Form is sectioned (each section can be enabled/disabled). Preview pane renders one page at a time with prev/next.

Implementation pattern is identical to Task 11 but with multi-page PDF assembly. Touch Stay affiliate match referenced in AffiliateCard slot.

- [ ] **Step 1:** Vitest tests — multi-page PDF assembly
- [ ] **Step 2:** TSX generator with section toggles + per-section forms
- [ ] **Step 3:** PDF builder with one helper per section
- [ ] **Step 4:** Astro page wiring
- [ ] **Step 5:** Commit — `feat: welcome-book-builder — multi-page PDF generator`

---

## Task 13: Wifi sign generator

**Files:**
- `src/components/generators/WifiSignGenerator.tsx`
- `src/lib/pdf/wifi-sign.ts`
- `src/pages/wifi-sign-generator.astro`
- `src/content/tools/wifi-sign.mdx`
- `tests/pdf/wifi-sign.test.ts`

Single-page PDF, design-heavy. Three template variants (minimal, hospitable, fun). Generates a QR code for the wifi credentials inline in the PDF using a tiny client-side QR lib (e.g., `qrcode` package — add to deps).

Add to `package.json`:
```json
"qrcode": "^1.5.3"
```

- [ ] **Step 1:** Vitest tests — PDF buffer + QR data URL embedding works
- [ ] **Step 2:** TSX generator: 3 template radio buttons + SSID + password + optional house name
- [ ] **Step 3:** PDF builder: per-template layout (text + embedded PNG QR)
- [ ] **Step 4:** Pinterest pin wiring — wifi sign is a Pinterest goldmine per spec
- [ ] **Step 5:** Astro page wiring
- [ ] **Step 6:** Commit — `feat: wifi-sign-generator — multi-template PDF + QR`

---

## Task 14: Check-in instructions PDF

**Files:**
- `src/components/generators/CheckinInstructionsGenerator.tsx`
- `src/lib/pdf/checkin.ts`
- `src/pages/checkin-instructions.astro`
- `src/content/tools/checkin-instructions.mdx`
- `tests/pdf/checkin.test.ts`

Multi-page (~3–5) PDF: arrival map, parking, door code, wifi, first-night essentials, emergency contacts. Image upload support (door photo, parking map photo) — uses `pdf-lib`'s `embedJpg` / `embedPng`.

- [ ] **Step 1:** Vitest tests — multi-page + image embedding
- [ ] **Step 2:** TSX generator with image-upload fields
- [ ] **Step 3:** PDF builder
- [ ] **Step 4:** Astro page wiring
- [ ] **Step 5:** Commit — `feat: checkin-instructions-generator — PDF with image embed`

---

## Task 15: Soft email-gate modal pattern

**Files:**
- `src/lib/email-gate.ts`
- `tests/email-gate.test.ts`

Shared module that PdfDownloadButton uses to:
1. Show modal on click
2. POST email to ESP webhook (configured via env var) if user submits
3. Trigger download regardless of submit/skip choice
4. Set a session-level dismissal cookie so user doesn't see modal repeatedly within a session

```ts
// src/lib/email-gate.ts
export interface EmailGateOptions {
  magnet: string;
  toolSlug: string;
  onDownload: () => void;
}

export async function showEmailGate(opts: EmailGateOptions) {
  if (sessionStorage.getItem('email-gate-dismissed')) {
    opts.onDownload();
    return;
  }
  // Open dialog, await user choice, optionally POST email, then onDownload()
}

export async function postEmail(email: string, magnet: string, toolSlug: string) {
  const url = import.meta.env.PUBLIC_ESP_WEBHOOK;
  if (!url) return; // stub if ESP not yet configured
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, magnet, source: 'strguests.tools', toolSlug, ts: Date.now() }),
  });
}
```

- [ ] **Step 1:** Vitest tests for dismissal logic + post payload shape
- [ ] **Step 2:** Wire into all four PDF generators (Tasks 11–14)
- [ ] **Step 3:** Commit — `feat: email-gate module — soft modal with download fallback`

---

## Task 16: OpenAI client wrapper (TDD)

**Files:**
- `server/lib/openai.ts`
- `server/lib/openai.test.ts`

```ts
// server/lib/openai.ts
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface GenerateInput {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;       // default 800
  temperature?: number;     // default 0.7
}

export interface GenerateOutput {
  text: string;
  tokensUsed: number;
  modelVersion: string;
}

export async function generate(input: GenerateInput): Promise<GenerateOutput> {
  const res = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: input.systemPrompt },
      { role: 'user', content: input.userPrompt },
    ],
    max_tokens: input.maxTokens ?? 800,
    temperature: input.temperature ?? 0.7,
  });
  return {
    text: res.choices[0]?.message?.content ?? '',
    tokensUsed: res.usage?.total_tokens ?? 0,
    modelVersion: res.model,
  };
}
```

- [ ] **Step 1:** TDD — write tests with a mocked OpenAI client (use vitest's `vi.mock`) covering: success, OpenAI 5xx retry (with simple backoff), 429 surfaced to caller, missing API key raises clearly
- [ ] **Step 2:** Implement to pass tests; add 1–2 retries with exponential backoff for 5xx only
- [ ] **Step 3:** Commit — `feat: openai client wrapper with retry`

---

## Task 17: Email verification flow (token-based)

**Files:**
- `server/routes/verify-email.ts` (POST `/api/verify-email/start`, GET `/api/verify-email/confirm/:token`)
- `server/lib/email-verify.ts`
- `tests/server/email-verify.test.ts`

Token-based: user submits email → server generates 64-char token, stores `email_verifications` row with 24h expiry → emails verification link via ESP transactional API → user clicks link → server marks `verified_at`. Verified email gets the 50/day rate limit; unverified stays at 5/hr/IP.

- [ ] **Step 1:** Implement `generateToken()` (crypto.randomBytes), `recordVerification(email)`, `confirmToken(token)`
- [ ] **Step 2:** Implement routes; verify-email/start POSTs to ESP transactional API (use environment-injected webhook for dev stub)
- [ ] **Step 3:** Tests for token expiry, replay protection, idempotent confirm
- [ ] **Step 4:** Commit — `feat: email verification flow`

---

## Task 18: Rate-limit middleware (TDD)

**Files:**
- `server/lib/rate-limit.ts`
- `server/lib/rate-limit.test.ts`

```ts
// server/lib/rate-limit.ts
import type { Request, Response, NextFunction } from 'express';
import { createHash } from 'node:crypto';
import { query } from './db';

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const ANON_LIMIT_PER_HOUR = 5;
const VERIFIED_LIMIT_PER_DAY = 50;

export function ipHash(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? 'strguests-dev-salt';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

export interface RateState {
  remaining: number;
  resetAt: Date;
  scope: 'ip' | 'email';
  email?: string;
}

export async function checkRate(req: Request, tool: string): Promise<RateState> {
  const verifiedEmail = req.cookies?.['sg-verified-email'];
  if (verifiedEmail) {
    const since = new Date(Date.now() - DAY_MS);
    const rows = await query<any[]>(
      'SELECT COUNT(*) as c FROM rate_limits WHERE scope=? AND identifier=? AND tool=? AND used_at > ?',
      ['email', verifiedEmail, tool, since]
    );
    const used = rows[0].c;
    return { remaining: Math.max(0, VERIFIED_LIMIT_PER_DAY - used), resetAt: new Date(Date.now() + DAY_MS), scope: 'email', email: verifiedEmail };
  }
  const id = ipHash(req.ip ?? 'unknown');
  const since = new Date(Date.now() - HOUR_MS);
  const rows = await query<any[]>(
    'SELECT COUNT(*) as c FROM rate_limits WHERE scope=? AND identifier=? AND tool=? AND used_at > ?',
    ['ip', id, tool, since]
  );
  const used = rows[0].c;
  return { remaining: Math.max(0, ANON_LIMIT_PER_HOUR - used), resetAt: new Date(Date.now() + HOUR_MS), scope: 'ip' };
}

export async function recordUse(state: RateState, tool: string) {
  await query(
    'INSERT INTO rate_limits (scope, identifier, tool) VALUES (?, ?, ?)',
    [state.scope, state.scope === 'email' ? state.email! : ipHash('placeholder'), tool]
  );
}

export function rateLimitMiddleware(tool: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const state = await checkRate(req, tool);
    res.locals.rateState = state;
    if (state.remaining <= 0) {
      res.status(429).json({ error: 'rate_limited', resetAt: state.resetAt, scope: state.scope });
      return;
    }
    next();
  };
}
```

- [ ] **Step 1:** TDD — tests cover: anon hits 5/hr, verified hits 50/day, scope switch when cookie present, IP hashing deterministic, no PII in DB
- [ ] **Step 2:** Implement to pass
- [ ] **Step 3:** Commit — `feat: rate-limit middleware with IP/email scopes`

---

## Task 19: `/api/generate-listing` endpoint + UI

**Files:**
- `server/routes/generate-listing.ts`
- `server/lib/prompts/listing.ts`
- `src/components/generators/ListingDescriptionGenerator.tsx`
- `src/pages/listing-description-generator.astro`
- `src/content/tools/listing-description.mdx`
- `tests/server/generate-listing.test.ts`

```ts
// server/lib/prompts/listing.ts
export const LISTING_SYSTEM = `You are a copywriter for short-term rental hosts.
Write Airbnb listing descriptions that are honest, vivid, and conversion-focused.
NEVER invent amenities the host hasn't listed. NEVER make medical/safety claims.
Tone toggles: luxury / family / quirky / professional. Default: hospitable.
Output exactly the sections requested by the user, no preamble, no closing.`;

export interface ListingInput {
  propertyType: string;        // e.g., "2BR cabin"
  location: string;
  amenities: string[];
  vibeToggle: 'luxury' | 'family' | 'quirky' | 'professional' | 'hospitable';
  uniqueFeatures?: string;
}

export function buildListingUserPrompt(input: ListingInput): string {
  return `Write an Airbnb listing description for:
Property: ${input.propertyType} in ${input.location}
Amenities: ${input.amenities.join(', ')}
Vibe: ${input.vibeToggle}
${input.uniqueFeatures ? `Unique features: ${input.uniqueFeatures}` : ''}

Output sections:
1. Headline (one sentence, < 60 chars)
2. The Space (3-4 paragraphs)
3. Guest Access
4. Other Things to Note`;
}
```

```ts
// server/routes/generate-listing.ts
import type { Request, Response } from 'express';
import { z } from 'zod';
import { rateLimitMiddleware, recordUse } from '../lib/rate-limit';
import { generate } from '../lib/openai';
import { LISTING_SYSTEM, buildListingUserPrompt } from '../lib/prompts/listing';
import { query } from '../lib/db';

const InputSchema = z.object({
  propertyType: z.string().min(1).max(80),
  location: z.string().min(1).max(80),
  amenities: z.array(z.string().max(80)).max(40),
  vibeToggle: z.enum(['luxury','family','quirky','professional','hospitable']),
  uniqueFeatures: z.string().max(500).optional(),
});

export const generateListingHandler = [
  rateLimitMiddleware('listing'),
  async (req: Request, res: Response) => {
    const parsed = InputSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'invalid_input', issues: parsed.error.issues });
    const userPrompt = buildListingUserPrompt(parsed.data);
    try {
      const out = await generate({ systemPrompt: LISTING_SYSTEM, userPrompt, maxTokens: 800 });
      await recordUse(res.locals.rateState, 'listing');
      await query(
        'INSERT INTO generation_logs (tool, ip_hash, email, tokens_used, status) VALUES (?, ?, ?, ?, ?)',
        ['listing', res.locals.rateState.scope === 'ip' ? res.locals.rateState.identifier ?? 'unknown' : 'verified', res.locals.rateState.email ?? null, out.tokensUsed, 'ok']
      );
      res.json({ result: out.text, tokensUsed: out.tokensUsed, requestsRemaining: res.locals.rateState.remaining - 1 });
    } catch (err) {
      res.status(502).json({ error: 'upstream_error' });
    }
  },
];
```

- [ ] **Step 1:** Implement prompt + endpoint
- [ ] **Step 2:** Tests: input validation, rate limiting, 200 with valid output structure (mock OpenAI), 502 on upstream error
- [ ] **Step 3:** Implement TSX UI: form on left (propertyType, location, amenities chips, vibe radio, unique-features textarea), preview pane on right (streaming or single-shot), action buttons (Copy / Regenerate / Make Pin)
- [ ] **Step 4:** Astro page wiring
- [ ] **Step 5:** Wire AiRateLimitNotice to read `requestsRemaining` from response
- [ ] **Step 6:** Commit — `feat: listing description generator (AI)`

---

## Task 20: `/api/generate-review` endpoint + UI

**Files:**
- `server/routes/generate-review.ts`
- `server/lib/prompts/review.ts`
- `src/components/generators/ReviewResponseGenerator.tsx`
- `src/pages/review-response-generator.astro`
- `src/content/tools/review-response.mdx`
- `tests/server/generate-review.test.ts`

Same shape as Task 19. Prompt accepts review-rating toggle (5★/4★/bad-review variants per spec) + the review text + optional context. System prompt enforces: no defensive language for bad reviews, lead with empathy, propose concrete remedy.

Commit: `feat: review response generator (AI)`

---

## Task 21: `/api/generate-message` endpoint + UI

**Files:**
- `server/routes/generate-message.ts`
- `server/lib/prompts/message.ts`
- `src/components/generators/MessageTemplateGenerator.tsx`
- `src/pages/message-template-generator.astro`
- `src/content/tools/message-template.mdx`
- `tests/server/generate-message.test.ts`

Same shape as Task 19. Prompt accepts message-stage toggle (booking confirmation / pre-arrival / mid-stay / post-checkout) + tone toggle + custom context.

Commit: `feat: message template generator (AI)`

---

## Task 22: `templates.json` data file (~100 scenarios)

**Files:**
- `src/data/templates.json`
- `scripts/validate-templates.ts`

Schema:
```json
{
  "post-cancellation-apology": {
    "name": "Post-cancellation apology",
    "category": "post-purchase",
    "scenario": "Host cancelled a booking and needs to apologize + remediate",
    "exampleInput": "Cancelled due to plumbing emergency; offered alternate dates",
    "exampleOutput": "[full template text 200-400 words]",
    "lastVerified": "2026-05-05"
  }
}
```

Categories: pre-arrival, check-in, mid-stay, check-out, post-checkout, problem-resolution, review-request, repeat-guest, cancellation, special-occasion.

- [ ] **Step 1:** Hand-compile ~100 scenarios across 10 categories (10 each)
- [ ] **Step 2:** Validation script: each entry has required fields, `lastVerified` is valid ISO date, no duplicate keys
- [ ] **Step 3:** Run validator in CI later (wired in Task 33)
- [ ] **Step 4:** Commit — `data: templates.json — 100 message-template scenarios`

---

## Task 23: `/templates/[scenario]` programmatic pages

**Files:**
- `src/pages/templates/[scenario].astro`
- `src/content/templates/` (5 sample MDX files)

`getStaticPaths` over `templates.json` keys. Each page renders:
- H1 + scenario description (from JSON)
- Example input + example output (formatted with copy-to-clipboard)
- Per-scenario narrative MDX if exists, else fallback to template
- "Customize this for your property →" CTA linking to `/message-template-generator?scenario=<key>`
- Related templates (3 from same category)
- AdSlot, EmailCaptureCard, STRLedgerCTA, ClusterFunnelBlock per R2

- [ ] **Step 1:** Implement `[scenario].astro`
- [ ] **Step 2:** Author 5 sample narrative MDX files (high-traffic scenarios: post-cancellation-apology, check-in-instructions, late-checkout-request, problem-resolution-noise, special-occasion-anniversary)
- [ ] **Step 3:** Confirm build produces 100 HTML files
- [ ] **Step 4:** Commit — `feat: template scenario pages — programmatic with sample MDX`

---

## Task 24: `/templates/` index with sort + filter

**Files:**
- `src/pages/templates/index.astro`
- `src/components/templates/TemplateIndex.tsx`

Sortable + filterable list view. Category filter chips, free-text search, sort by name / category / lastVerified. SSR'd with all templates; client island handles filter/sort.

Commit: `feat: templates index with sort + filter`

---

## Task 25: Pinterest pin generator (Satori)

**Files:**
- `src/og/pin.tsx` (Satori JSX template)
- `src/og/build-pin.ts` (programmatic build helper)
- `src/pages/api/generate-pin.ts` (Astro endpoint, runs server-side at build for cached pins; falls through to client-side generation for AI outputs)
- `tests/og/pin.test.ts`

```tsx
// src/og/pin.tsx — 1000x1500 Pinterest format
import satori from 'satori';

export interface PinInput {
  toolSlug: string;
  title: string;
  subtitle?: string;
  template?: 'minimal' | 'hospitable' | 'fun';
}

export async function buildPinSvg(input: PinInput, fonts: any[]) {
  return satori(
    <div style={{ width: 1000, height: 1500, display: 'flex', flexDirection: 'column', backgroundColor: '#FBF5F0', padding: 80 }}>
      <div style={{ fontSize: 36, fontFamily: 'Inter', color: '#8E5238', textTransform: 'uppercase', letterSpacing: 4 }}>{input.toolSlug.replace(/-/g, ' ')}</div>
      <div style={{ fontSize: 96, fontFamily: 'Cormorant', color: '#1F1F1F', marginTop: 80, lineHeight: 1.1 }}>{input.title}</div>
      {input.subtitle && <div style={{ fontSize: 32, color: '#5A5A5A', marginTop: 40 }}>{input.subtitle}</div>}
      <div style={{ marginTop: 'auto', fontSize: 24, color: '#8E5238' }}>strguests.tools</div>
    </div>,
    { width: 1000, height: 1500, fonts }
  );
}
```

- [ ] **Step 1:** Implement `buildPinSvg()` + `svgToPng()` via `@resvg/resvg-js`
- [ ] **Step 2:** Test produces 1000x1500 PNG with magic bytes
- [ ] **Step 3:** Astro endpoint `/api/generate-pin` accepts POST `{ toolSlug, title, subtitle, template }` and returns PNG (used by AI outputs)
- [ ] **Step 4:** Commit — `feat: pinterest pin generator (satori)`

---

## Task 26: PinterestPinButton wiring across all generators

**Files:** Modify all 7 generator islands

Each generator emits a `pin-payload` CustomEvent with `{ toolSlug, title, subtitle, template }` when output is ready. `PinterestPinButton` listens, calls `/api/generate-pin`, opens Pinterest share intent with the resulting PNG URL.

- [ ] **Step 1:** Add `pin-payload` event emit to each of the 7 generators
- [ ] **Step 2:** Wire pin-button listener
- [ ] **Step 3:** Manual smoke: trigger a pin from each generator, verify Pinterest share opens
- [ ] **Step 4:** Commit — `feat: pinterest pin wiring across all 7 generators`

---

## Task 27: Lead-magnet page

**Files:**
- `src/pages/get-the-pdf.astro`
- `public/pdf/str-guest-comms-playbook-2026.pdf` (stub)

"STR Guest Communication Playbook 2026" — minimal landing with email form, what's-inside list, sample TOC. Posts to ESP webhook. Stub PDF at launch (real content is a separate effort).

Commit: `feat: lead magnet landing page`

---

## Task 28: Landing page

**Files:** `src/pages/index.astro`, `src/components/Hero.astro`, `src/components/ToolGrid.astro`

Hero with hospitality-warm aesthetic, ToolGrid lists all 7 generators (4 PDF + 3 AI clearly labeled), social proof if any, link to `/templates`. ClusterFunnelBlock + FunnelBand at bottom.

**Frontend-design note:** Apply [frontend-design](skill) — landing must feel hospitable, not clinical. Cormorant Garamond gets primary headline weight here.

Commit: `feat: landing page`

---

## Task 29: About + Contact pages

**Files:** `src/pages/about.astro`, `src/pages/contact.astro`

Mirrors strhost.tools Task 21 pattern.

Commit: `feat: about + contact pages`

---

## Task 30: Sitemap + robots.txt

**Files:** Configured via `astro.config.mjs` integrations + `public/robots.txt`

Mirrors strhost.tools Task 22.

Commit: `feat: sitemap + robots`

---

## Task 31: OG images (Satori)

**Files:** `scripts/build-og.mjs`, `src/og/build.ts`, `src/og/template.tsx`

Mirrors strhost.tools Task 23. Adds template variants for tool pages (warmer aesthetic) and template-scenario pages (Article-style).

Commit: `feat: OG images via Satori`

---

## Task 32: GA4 cross-domain analytics

**Files:** `src/components/analytics/GA4.astro`, `src/lib/analytics.ts`

Mirrors strhost.tools Task 24. Strguests-specific events:
- `pdf_downloaded`, `text_copied`, `pin_generated`
- `ai_generation_completed`, `ai_rate_limit_hit`, `email_verified`
- `template_scenario_viewed`

Commit: `feat: ga4 cross-domain + custom events`

---

## Task 33: Playwright E2E smokes

**Files:** `tests/e2e/<tool>.spec.ts` per generator + `tests/e2e/templates.spec.ts`

Per-generator smoke:
- PDF generators: load page, fill form, click download (assert PDF blob received), click pin (assert Pinterest intent opens)
- AI generators: load page, fill form, mock `/api/generate-*` to return canned response, click generate (assert preview pane updates), click copy (assert clipboard receives text)
- Templates: index loads with all 100 listed; sample scenario page loads; CTA navigates to message generator with `?scenario=` param

axe-core integration on every test page; fail on serious violations.

Commit: `test: playwright smokes per generator`

---

## Task 34: GitHub Actions CI

**Files:** `.github/workflows/ci.yml`

Mirrors strhost.tools Task 26 with additions:
- `pnpm db:migrate` against a CI MySQL service container (verifies schema migration is idempotent)
- `pnpm server:build` (typecheck server too)
- Validates `templates.json` via Task 22's validator

Commit: `ci: github actions — typecheck/test/build/migrate`

---

## Task 35: Hostinger deploys (static + Express)

**Files:**
- `.github/workflows/deploy-static.yml` — FTP deploy of `dist/`
- `.github/workflows/deploy-server.yml` — SSH/rsync deploy of `server/dist/` + `package.json` + `node_modules` install + pm2 restart

Two separate workflows so the static surface deploys quickly without waiting on the Express deploy. Both gated on green CI.

- [ ] **Step 1:** Static FTP deploy — same pattern as strhost.tools Task 27
- [ ] **Step 2:** Server SSH deploy:
   - rsync `server/dist`, `package.json`, `pnpm-lock.yaml` to Hostinger Apps directory
   - SSH: `pnpm install --prod && pnpm db:migrate && pm2 restart strguests-api`
   - Health-check `/api/health` returns 200
- [ ] **Step 3:** Set Hostinger env vars (MYSQL_*, OPENAI_API_KEY, EMAIL_VERIFY_SECRET, IP_HASH_SALT, PUBLIC_ESP_WEBHOOK)
- [ ] **Step 4:** Commit — `ci: dual-target hostinger deploy (static FTP + server SSH)`

---

## Task 36: Pre-launch smoke + v0.1.0 tag

**Files:** `scripts/post-deploy-smoke.mjs`

Hits the deployed URL:
- Each of 7 tool pages returns 200 with no console errors
- `/api/health` returns 200
- `/api/rate-limit-status?tool=listing` returns valid JSON
- 5 sample template pages return 200
- OG image PNG exists for `/`, `/listing-description-generator`, `/templates/post-cancellation-apology`
- Sitemap lists all expected routes

If green, tag and push:
```bash
git tag -a v0.1.0 -m "strguests.tools v0.1.0 — initial launch"
git push origin v0.1.0
```

Commit: `chore: post-deploy smoke + v0.1.0`

---

## Spec coverage map (self-review)

| Spec section | Plan tasks |
|---|---|
| §2 Launch cluster (7 tools) | T11–T14 (PDF) + T19–T21 (AI) |
| §3 Site architecture | T11–T14, T19–T21, T22–T24, T27–T29 |
| §4 Decisions log | T1 (Astro+Express), T16 (OpenAI), T9 (pdf-lib), T2 (warm accent), T22 (templates.json), T15 (soft gate), T18 (rate limit), T11–T14 (live preview UX), T25 (Pinterest) |
| §5 Tech & repo | T1, T10 |
| §6 Project layout | All file paths align to spec layout |
| §7 Per-tool page template | T11–T14, T19–T21 (Astro pages render the 13-element layout from R2) |
| §8 Generator interaction model | T11–T14 (PDF), T19–T21 (AI), T26 (Pinterest cross-cutting) |
| §9 Programmatic page system | T22–T24 |
| §10 Monetization | T5 (primitives), T15 (email gate), T19–T21 (rate limit notice), T26 (Pinterest), T27 (lead magnet) |
| §11 Brand layer | T2, T9 (PDF brand chrome) |
| §12 SEO + analytics | T8 (SEO library), T30 (sitemap), T31 (OG), T32 (GA4) |
| §13 Open questions | Captured in `.planning/PROJECT.md` |
| §14 Build, deploy, ops | T34, T35 |
| §15 Distribution | Out of scope for plan (operational, post-launch) |
| §16 Defensibility | T22 (programmatic templates), T25–T26 (Pinterest), T27 (lead magnet) |
| §17 Out of scope | Honored (no native app, no guest accounts, no streaming AI, English only) |
| §18 Cluster bridge | T4 (ClusterFunnelBlock), T5 (STRLedgerCTA), T32 (GA4 cross-domain) |

---

## Out-of-band considerations

- **OpenAI cost ceiling:** at GPT-4o-mini pricing ($0.15/$0.60 per 1M tokens) and ~600 tokens per generation, $1 covers ~600 generations. Anonymous limit (5/hr/IP) caps anonymous burn at ~120 generations/day/IP. Verified-email limit (50/day) is the real cost lever — set monthly burn alert in Phase 6 ops via Hostinger logs analysis.
- **MySQL on Hostinger Business:** confirm row-storage limits before launch. Generation logs grow ~1 row per AI call; plan to archive older than 90 days if storage tightens.
- **Pinterest distribution operationally:** building the pin generator is in-scope (T25–T26). Running a Pinterest account, pin scheduling, board curation — **out of scope for this plan**, separate operational effort.
- **PDF co-branding default:** open question 5 in PROJECT.md. The `brandFooter?: boolean` field on `PdfMeta` (Task 9) lets users toggle. Default is `true` (footer on) per pragmatic recommendation; revisit in pre-launch QA.
