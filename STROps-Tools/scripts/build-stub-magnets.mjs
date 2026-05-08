#!/usr/bin/env node
/**
 * Lead magnet stub PDF generator.
 *
 * Phase 4 ships placeholder PDFs at public/pdf/<magnet>-v0.pdf so the three
 * lead-magnet capture pages have something to deliver while the real magnets
 * are authored. Stubs follow the same brand chrome as tool-output PDFs
 * (wordmark, accent rule, footer with site URL + generated date).
 *
 * Run standalone: pnpm exec node scripts/build-stub-magnets.mjs
 *
 * Pure ESM — does not import the TS pdf base lib (avoids tsx dep). Mirrors
 * the brand tokens and chrome inline so the script is self-contained.
 *
 * NOTE: real magnets land in v0.2 (Cleaner SOP authorship is an open
 * question — see CLAUDE.md "Specific Instructions"). When they do, this
 * script's outputs are replaced; the page wiring stays identical.
 */

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const outDir = path.join(root, 'public', 'pdf');

// Brand tokens — mirrors src/lib/pdf/base.ts BRAND + COLORS.
const BRAND = {
  siteUrl: 'strops.tools',
  author: 'strops.tools',
  producer: 'strops.tools (pdf-lib)',
  creator: 'strops.tools',
  tagline: 'Free tools for active short-term rental operators.',
};
const COLORS = {
  navy: rgb(0.071, 0.188, 0.306),
  accent: rgb(0.353, 0.451, 0.349),
  ink2: rgb(0.333, 0.314, 0.286),
  ink3: rgb(0.541, 0.506, 0.463),
};

const MAGNETS = [
  {
    file: 'cleaner-sop-v0.pdf',
    title: 'STR Cleaner SOP',
    subtitle: 'Standard operating procedure for short-term rental turnovers — preview release.',
    body: [
      'This is a placeholder version of the Cleaner SOP — a printable, step-by-step',
      'turnover checklist your cleaning team can follow on every property.',
      '',
      'The full version covers: arrival walkthrough, room-by-room sequence, supply',
      'restock, photo documentation, and the damage-report path. The shipping date',
      'is announced at strops.tools/cleaner-sop.',
      '',
      'Subscribe at strops.tools/cleaner-sop and you\'ll receive the full PDF the',
      'day it ships. No newsletter spam.',
    ],
  },
  {
    file: 'supply-par-v0.pdf',
    title: 'STR Supply Par-Level Sheet',
    subtitle: 'Linens, consumables, and per-property minimums — preview release.',
    body: [
      'This is a placeholder version of the Supply Par-Level Sheet — a printable',
      'reference your cleaner can hang in the laundry room to never run out of',
      'sheets, towels, toiletries, paper goods, or pantry restock items.',
      '',
      'The full version is property-tunable (king/queen mix, bath count, average',
      'monthly bookings) and ships with a per-month restock calendar.',
      '',
      'Subscribe at strops.tools/supply-par to receive the full PDF.',
    ],
  },
  {
    file: 'maintenance-checklist-v0.pdf',
    title: 'STR Maintenance Checklist',
    subtitle: 'Annual + seasonal recurring tasks for a short-term rental — preview release.',
    body: [
      'This is a placeholder version of the Maintenance Checklist — the recurring',
      'tasks an STR forgets until something breaks: HVAC filter, smoke detector',
      'batteries, deep clean cadence, fireplace inspection, water heater flush,',
      'gutter clear, exterior caulk audit.',
      '',
      'The full version sequences tasks by month, by season, by climate zone, and',
      'cross-references the Maintenance schedule generator at',
      'strops.tools/maintenance-schedule.',
      '',
      'Subscribe at strops.tools/maintenance-checklist for the full PDF.',
    ],
  },
];

function drawHeader(page, fonts, title, subtitle) {
  const { width, height } = page.getSize();
  const marginX = 48;
  const wordmarkY = height - 48;

  // Wordmark
  const wordmark = 'STR Ops';
  const wordmarkSize = 18;
  const wordmarkWidth = fonts.bold.widthOfTextAtSize(wordmark, wordmarkSize);
  page.drawText(wordmark, {
    x: marginX, y: wordmarkY, size: wordmarkSize, font: fonts.bold, color: COLORS.accent,
  });
  page.drawText('.tools', {
    x: marginX + wordmarkWidth + 2, y: wordmarkY, size: 9, font: fonts.regular, color: COLORS.ink2,
  });

  // Tagline top-right
  const taglineSize = 8;
  const taglineWidth = fonts.italic.widthOfTextAtSize(BRAND.tagline, taglineSize);
  page.drawText(BRAND.tagline, {
    x: width - marginX - taglineWidth, y: wordmarkY + 4,
    size: taglineSize, font: fonts.italic, color: COLORS.ink3,
  });

  // Title
  const titleY = wordmarkY - 32;
  page.drawText(title, { x: marginX, y: titleY, size: 22, font: fonts.bold, color: COLORS.navy });

  // Subtitle
  const subtitleY = titleY - 18;
  page.drawText(subtitle, {
    x: marginX, y: subtitleY, size: 11, font: fonts.regular, color: COLORS.ink2,
  });

  // Accent rule
  page.drawRectangle({
    x: marginX, y: subtitleY - 20, width: 48, height: 1, color: COLORS.accent,
  });

  return subtitleY - 56;
}

function drawFooter(page, fonts, generatedDate) {
  const { width } = page.getSize();
  const marginX = 48;
  const footerY = 28;
  const size = 9;

  page.drawText(BRAND.siteUrl, { x: marginX, y: footerY, size, font: fonts.regular, color: COLORS.ink2 });

  const gen = `Generated ${generatedDate} — preview release`;
  const genWidth = fonts.regular.widthOfTextAtSize(gen, size);
  page.drawText(gen, {
    x: (width - genWidth) / 2, y: footerY, size, font: fonts.regular, color: COLORS.ink3,
  });

  const pageStr = 'Page 1 of 1';
  const pageWidth = fonts.regular.widthOfTextAtSize(pageStr, size);
  page.drawText(pageStr, {
    x: width - marginX - pageWidth, y: footerY, size, font: fonts.regular, color: COLORS.ink2,
  });
}

async function buildOne({ file, title, subtitle, body }) {
  const doc = await PDFDocument.create();
  doc.setTitle(title);
  doc.setAuthor(BRAND.author);
  doc.setProducer(BRAND.producer);
  doc.setCreator(BRAND.creator);
  doc.setSubject('Lead magnet — preview release');
  doc.setCreationDate(new Date());
  doc.setModificationDate(new Date());

  const page = doc.addPage([612, 792]);
  const fonts = {
    bold: await doc.embedFont(StandardFonts.HelveticaBold),
    regular: await doc.embedFont(StandardFonts.Helvetica),
    italic: await doc.embedFont(StandardFonts.HelveticaOblique),
  };

  let y = drawHeader(page, fonts, title, subtitle);

  // Body
  const lineHeight = 16;
  for (const line of body) {
    page.drawText(line, { x: 48, y, size: 11, font: fonts.regular, color: COLORS.ink2 });
    y -= lineHeight;
  }

  drawFooter(page, fonts, new Date().toISOString().slice(0, 10));

  const bytes = await doc.save();
  await writeFile(path.join(outDir, file), bytes);
  return file;
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const built = [];
  for (const m of MAGNETS) {
    built.push(await buildOne(m));
  }
  console.log(`Stub magnet PDFs built (${built.length}):`);
  built.forEach(f => console.log(`  public/pdf/${f}`));
}

main().catch((err) => {
  console.error('Stub magnet build failed:', err);
  process.exit(1);
});
