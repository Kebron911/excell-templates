#!/usr/bin/env node
/**
 * copy-pdfs-to-dist.mjs — Path B PDF delivery.
 *
 * Reads PDFs from STRManuals/site/private/ and copies them into
 * dist/dl/{HASH}/{slug}/v1.pdf, where HASH = STRMANUALS_DOWNLOAD_HASH.
 *
 * The hash makes the URL unguessable but otherwise the PDFs are
 * statically served by Hostinger like any other asset. n8n's W01b
 * order-confirmation email links to the hashed path. See
 * STRManuals/docs/PDF-HOSTING.md (Option 1) for the rationale and
 * rotation policy.
 *
 * Idempotent: re-running with the same HASH is a no-op modulo mtimes.
 *
 * Usage:
 *   STRMANUALS_DOWNLOAD_HASH=<32-hex> node scripts/copy-pdfs-to-dist.mjs
 *
 * Hooked into `pnpm build` via package.json so the deploy workflow
 * gets the hashed copies for free.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, '..');
const PRIVATE_DIR = path.join(SITE_ROOT, 'private');
const DIST_DIR = path.join(SITE_ROOT, 'dist');

// Astro auto-loads .env during build but standalone Node scripts don't.
// Load it explicitly so STRMANUALS_DOWNLOAD_HASH is available when
// `pnpm build` chains: `astro build && node scripts/copy-pdfs-to-dist.mjs`.
// In CI the env is set directly by the GitHub Actions `env:` block, in
// which case this is a no-op.
dotenv.config({ path: path.join(SITE_ROOT, '.env') });

const HASH = process.env.STRMANUALS_DOWNLOAD_HASH;
if (!HASH || !/^[a-f0-9]{16,}$/i.test(HASH)) {
  console.error('ERROR: STRMANUALS_DOWNLOAD_HASH not set or not hex (need ≥16 hex chars).');
  console.error('Generate with:');
  console.error('  node -e "console.log(require(\\"crypto\\").randomBytes(16).toString(\\"hex\\"))"');
  console.error('and add to STRManuals/site/.env as STRMANUALS_DOWNLOAD_HASH=<value>.');
  process.exit(2);
}

if (!fs.existsSync(DIST_DIR)) {
  console.error(`ERROR: ${DIST_DIR} does not exist. Run \`pnpm build\` first.`);
  process.exit(2);
}

// Map: source file → destination relative to dist/
const COPIES = [
  // 6 purchasable manuals
  { src: 'manuals/str-tax-loophole-playbook/v1.pdf',         dst: `dl/${HASH}/str-tax-loophole-playbook/v1.pdf` },
  { src: 'manuals/material-participation-survival-kit/v1.pdf', dst: `dl/${HASH}/material-participation-survival-kit/v1.pdf` },
  { src: 'manuals/why-bookings-down/v1.pdf',                 dst: `dl/${HASH}/why-bookings-down/v1.pdf` },
  { src: 'manuals/direct-bookings-starter/v1.pdf',           dst: `dl/${HASH}/direct-bookings-starter/v1.pdf` },
  { src: 'manuals/permit-regulation-survival/v1.pdf',        dst: `dl/${HASH}/permit-regulation-survival/v1.pdf` },
  // Free lead magnet — uses the same HASH; rotating invalidates both
  // purchased-product URLs and magnet URLs at once, which is fine since
  // active magnet downloads are short-lived.
  { src: 'free/tax-loophole-explainer.pdf',                  dst: `dl/${HASH}/free/tax-loophole-explainer.pdf` },
];

let copied = 0;
let missing = 0;
let bytes = 0;

for (const { src, dst } of COPIES) {
  const srcPath = path.join(PRIVATE_DIR, src);
  const dstPath = path.join(DIST_DIR, dst);
  if (!fs.existsSync(srcPath)) {
    console.warn(`SKIP  ${src} → source missing`);
    missing++;
    continue;
  }
  fs.mkdirSync(path.dirname(dstPath), { recursive: true });
  fs.copyFileSync(srcPath, dstPath);
  const size = fs.statSync(dstPath).size;
  bytes += size;
  copied++;
  console.log(`COPY  private/${src}  →  dist/${dst}  (${(size / 1024).toFixed(1)} KB)`);
}

console.log(
  `\nCopied ${copied} PDF${copied === 1 ? '' : 's'} (${(bytes / 1024 / 1024).toFixed(2)} MB total)` +
    (missing > 0 ? ` · ${missing} source(s) missing` : '') +
    `.\nServed at: https://strmanuals.com/dl/${HASH}/{slug}/v1.pdf`,
);

// The MAN-BUNDLE-01 SKU doesn't get its own file — its email merge var
// should ship all 5 individual URLs OR a single archive. For now, n8n
// emits 5 links in the bundle email template; archive generation is
// deferred. Document this in the n8n W01b spec.

if (missing > 0) {
  // CI-aware tolerance: in GitHub Actions (CI=true) the PDF source files
  // are intentionally absent — they live in private storage that the runner
  // doesn't have access to (n8n delivers via a separate path). We still log
  // the warning so the issue is visible, but don't block the static site
  // deploy. Locally, missing PDFs are a real dev-time problem → exit 1.
  if (process.env.CI === 'true') {
    console.warn(
      `\n⚠ ${missing} PDF source(s) missing — site deploying without /dl/ files. ` +
        `n8n delivery is the canonical path; this script is supplementary.`,
    );
    process.exit(0);
  }
  process.exit(1);
}
