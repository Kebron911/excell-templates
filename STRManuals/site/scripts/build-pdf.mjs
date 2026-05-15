// Build designed PDFs from manuscripts.
// Renders each /render/manuals/<slug> route through Puppeteer's print pipeline,
// saves the resulting PDF to private/manuals/<sku>/v1.pdf.
//
// Usage:
//   node scripts/build-pdf.mjs           # build all manuals
//   node scripts/build-pdf.mjs tax-01    # build a single slug
//
// Requires the dev server to already be running at http://localhost:4321.

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import puppeteer from 'puppeteer';

const SITE = process.env.SITE || 'http://localhost:4321';

const TARGETS = [
  { slug: 'tax-01', outPath: 'private/manuals/str-tax-loophole-playbook/v1.pdf' },
  { slug: 'tax-02', outPath: 'private/manuals/material-participation-survival-kit/v1.pdf' },
  { slug: 'rev-01', outPath: 'private/manuals/why-bookings-down/v1.pdf' },
  { slug: 'rev-02', outPath: 'private/manuals/direct-bookings-starter/v1.pdf' },
  { slug: 'lgl-01', outPath: 'private/manuals/permit-regulation-survival/v1.pdf' },
  { slug: 'free',   outPath: 'private/free/tax-loophole-explainer.pdf' },
];

const args = process.argv.slice(2);
const filter = args[0]?.toLowerCase();
const targets = filter ? TARGETS.filter((t) => t.slug === filter) : TARGETS;

if (targets.length === 0) {
  console.error(`No targets matched "${filter}". Valid slugs: ${TARGETS.map((t) => t.slug).join(', ')}`);
  process.exit(1);
}

async function buildOne(browser, target) {
  // Trailing slash matters: astro.config.mjs sets trailingSlash: 'always',
  // so the bare path 308-redirects only on the prod build but the dev
  // server returns 404. Hit the canonical form directly.
  const url = `${SITE}/render/manuals/${target.slug}/`;
  console.log(`→ ${target.slug}: ${url}`);

  const page = await browser.newPage();
  page.on('pageerror', (err) => console.warn(`  page error: ${err.message}`));

  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60_000 });

  // Force the print stylesheet to apply (Puppeteer treats this as @media print)
  await page.emulateMediaType('print');

  // Wait a beat for fonts to settle
  await new Promise((r) => setTimeout(r, 1500));

  const pdfBuffer = await page.pdf({
    width: '6in',
    height: '9in',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true,
  });

  await page.close();

  const outAbs = resolve(process.cwd(), target.outPath);
  await mkdir(dirname(outAbs), { recursive: true });
  await writeFile(outAbs, pdfBuffer);

  const sizeKB = (pdfBuffer.length / 1024).toFixed(1);
  console.log(`  ✓ ${target.outPath} (${sizeKB} KB)`);
}

async function main() {
  console.log(`Rendering ${targets.length} manual(s) from ${SITE}\n`);

  // Use system Chrome to avoid Puppeteer's bundled Chromium download (which can fail
  // on corrupted ZIPs). Override with PUPPETEER_EXECUTABLE_PATH env var if needed.
  const systemChrome =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    (process.platform === 'win32'
      ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      : process.platform === 'darwin'
      ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      : '/usr/bin/google-chrome');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: systemChrome,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    for (const target of targets) {
      try {
        await buildOne(browser, target);
      } catch (err) {
        console.error(`  ✗ ${target.slug}: ${err.message}`);
      }
    }
  } finally {
    await browser.close();
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
