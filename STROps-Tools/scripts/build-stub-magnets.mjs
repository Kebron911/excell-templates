#!/usr/bin/env node
/**
 * Generates 1-page stub PDFs for the three lead magnets.
 *
 * The "real" magnets land in v0.2 — these stubs let the capture pages
 * link to a downloadable preview today without blocking on copy work
 * (Cleaner SOP authorship is the open question per .planning/PROJECT.md).
 *
 * Outputs to public/pdf/. Run via `pnpm run build:magnets`.
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const ACCENT = rgb(0x4f / 255, 0x6b / 255, 0x5a / 255);
const NAVY = rgb(0x12 / 255, 0x30 / 255, 0x4e / 255);
const INK2 = rgb(0x55 / 255, 0x50 / 255, 0x49 / 255);

const MAGNETS = [
  {
    file: 'cleaner-sop-v0.pdf',
    title: 'STR Cleaner SOP — preview',
    body: [
      'This is a stub preview of the strops.tools Cleaner SOP.',
      'The full version is emailed when you subscribe at',
      'https://strops.tools/get-the-cleaner-sop.',
      '',
      'It will cover: arrival walkthrough, kitchen reset,',
      'bath reset, linens cycle, restock check, and a final',
      'photo/checklist sign-off your cleaners can sign.',
    ],
  },
  {
    file: 'maintenance-checklist-v0.pdf',
    title: 'STR Maintenance Checklist — preview',
    body: [
      'This is a stub preview of the strops.tools',
      'Maintenance Checklist.',
      '',
      'The full version covers per-turn items, monthly',
      'rotations, quarterly inspections, and the annual',
      'big-ticket schedule (HVAC service, dryer vent,',
      'gutters, water heater flush, roof + caulk audit).',
    ],
  },
  {
    file: 'supply-par-v0.pdf',
    title: 'STR Supply Par-Level Sheet — preview',
    body: [
      'This is a stub preview of the strops.tools',
      'Supply Par-Level Sheet.',
      '',
      'The full version sets per-bedroom par levels for',
      'sheets, towels, paper goods, kitchen consumables,',
      'and amenity restocks — the same numbers the linen',
      'par calculator and restock calculator use.',
    ],
  },
];

await mkdir('public/pdf', { recursive: true });

for (const m of MAGNETS) {
  const doc = await PDFDocument.create();
  doc.setProducer('strops.tools');
  doc.setCreator('strops.tools');
  const body = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const page = doc.addPage([612, 792]);

  // Header
  page.drawText('strops.tools', { x: 54, y: 738, size: 11, font: bold, color: NAVY });
  page.drawText('.', { x: 110, y: 738, size: 11, font: bold, color: ACCENT });
  page.drawText(m.title, { x: 54, y: 710, size: 20, font: bold, color: NAVY });
  page.drawText('Stub release — full version emailed after subscription.', {
    x: 54, y: 692, size: 10, font: body, color: INK2,
  });
  page.drawLine({
    start: { x: 54, y: 682 },
    end: { x: 558, y: 682 },
    thickness: 0.6,
    color: ACCENT,
  });

  // Body
  let y = 650;
  for (const line of m.body) {
    page.drawText(line, { x: 54, y, size: 12, font: body, color: INK2 });
    y -= 18;
  }

  // Footer
  page.drawText('strops.tools — free tools for active STR operators', {
    x: 54, y: 36, size: 8, font: body, color: INK2,
  });
  page.drawText('1 / 1', { x: 518, y: 36, size: 8, font: body, color: INK2 });

  const bytes = await doc.save();
  await writeFile(`public/pdf/${m.file}`, bytes);
  console.log(`stub magnet built: public/pdf/${m.file}`);
}
