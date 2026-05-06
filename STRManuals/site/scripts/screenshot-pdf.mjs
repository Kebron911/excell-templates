// Quick visual sanity check: screenshot the rendered manual in print-mode.
// Saves to /tmp/<slug>.png at the project root for inspection.
//
// Usage: node scripts/screenshot-pdf.mjs <slug> [pageIndex]

import puppeteer from 'puppeteer';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const SITE = process.env.SITE || 'http://localhost:4321';
const slug = process.argv[2] || 'free';

const systemChrome = process.env.PUPPETEER_EXECUTABLE_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const browser = await puppeteer.launch({
  headless: 'new',
  executablePath: systemChrome,
  args: ['--no-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 580, height: 870, deviceScaleFactor: 2 });
await page.goto(`${SITE}/render/manuals/${slug}`, { waitUntil: 'networkidle0' });
await page.emulateMediaType('print');
await new Promise((r) => setTimeout(r, 1500));

const outDir = resolve(process.cwd(), 'private', 'screenshots');
await mkdir(outDir, { recursive: true });

// Capture multiple "page-like" screenshots by scrolling through the document
const pageHeight = 870;
const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight);
const numPages = Math.min(6, Math.ceil(totalHeight / pageHeight));

for (let i = 0; i < numPages; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), i * pageHeight);
  await new Promise((r) => setTimeout(r, 300));
  const out = resolve(outDir, `${slug}-p${i + 1}.png`);
  await page.screenshot({ path: out, fullPage: false });
  console.log(`saved ${out}`);
}

await browser.close();
