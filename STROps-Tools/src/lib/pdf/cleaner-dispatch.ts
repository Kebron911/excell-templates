/**
 * Cleaner dispatch PDF — printable assignment table + SMS templates.
 *
 * Extends `src/lib/pdf/base.ts` brand chrome. Multi-page-aware: when the
 * assignment table or SMS block overruns one page, opens a fresh branded
 * page mid-stream and continues. Footers paginate as `Page N of M`.
 */

import { StandardFonts } from 'pdf-lib';
import {
  COLORS,
  MARGIN,
  PAGE,
  addBrandedPage,
  createBrandedDoc,
  decorateFooters,
} from './base';
import type { DispatchResult } from '../calc/cleaner-dispatch';

const ROW_HEIGHT = 14;
const FOOTER_RESERVE = 60; // leave room above footer

export async function buildDispatchPdf(r: DispatchResult): Promise<Uint8Array> {
  const { doc } = await createBrandedDoc({
    title: 'Cleaner Dispatch Sheet',
    subject: `Cleaner dispatch — ${r.date}`,
    keywords: ['short-term rental', 'cleaner dispatch', r.date],
  });
  const helvBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const helv = await doc.embedFont(StandardFonts.Helvetica);
  const helvOblique = await doc.embedFont(StandardFonts.HelveticaOblique);

  let { page, bodyTopY } = await addBrandedPage(doc, {
    title: 'Cleaner Dispatch Sheet',
    subtitle: `Date: ${r.date}`,
  });
  let y = bodyTopY;

  const col = {
    property: MARGIN,
    addr: MARGIN + 70,
    br: MARGIN + 270,
    cleaner: MARGIN + 310,
    phone: MARGIN + 430,
  };

  function drawAssignmentHeader() {
    page.drawText('Property', { x: col.property, y, size: 9, font: helvBold, color: COLORS.navy });
    page.drawText('Address', { x: col.addr, y, size: 9, font: helvBold, color: COLORS.navy });
    page.drawText('BR', { x: col.br, y, size: 9, font: helvBold, color: COLORS.navy });
    page.drawText('Cleaner', { x: col.cleaner, y, size: 9, font: helvBold, color: COLORS.navy });
    page.drawText('Phone', { x: col.phone, y, size: 9, font: helvBold, color: COLORS.navy });
    y -= 6;
    page.drawRectangle({
      x: MARGIN,
      y,
      width: PAGE.width - MARGIN * 2,
      height: 0.6,
      color: COLORS.accent,
    });
    y -= 14;
  }

  async function pageBreakIfNeeded(reserve: number, title: string) {
    if (y < FOOTER_RESERVE + reserve) {
      const next = await addBrandedPage(doc, { title, subtitle: `Date: ${r.date} (continued)` });
      page = next.page;
      y = next.bodyTopY;
    }
  }

  drawAssignmentHeader();

  for (const a of r.assignments) {
    await pageBreakIfNeeded(ROW_HEIGHT, 'Cleaner Dispatch Sheet');
    if (y === (await Promise.resolve(y))) {
      // (no-op — kept so TS sees `y` mutates after pageBreak)
    }
    page.drawText(a.turnover.propertyId, { x: col.property, y, size: 9, font: helv, color: COLORS.graphite });
    page.drawText(a.turnover.address.slice(0, 30), { x: col.addr, y, size: 9, font: helv, color: COLORS.graphite });
    page.drawText(String(a.turnover.bedrooms), { x: col.br, y, size: 9, font: helv, color: COLORS.graphite });
    page.drawText(a.cleaner.name, { x: col.cleaner, y, size: 9, font: helv, color: COLORS.graphite });
    page.drawText(a.cleaner.phone, { x: col.phone, y, size: 9, font: helv, color: COLORS.graphite });
    y -= ROW_HEIGHT;
  }

  // SMS templates section.
  y -= 18;
  await pageBreakIfNeeded(50, 'Cleaner Dispatch Sheet');
  page.drawText('SMS templates', { x: MARGIN, y, size: 11, font: helvBold, color: COLORS.navy });
  y -= 16;
  page.drawText('Copy/paste each line into your SMS app or PMS auto-message.', {
    x: MARGIN,
    y,
    size: 8,
    font: helvOblique,
    color: COLORS.ink2,
  });
  y -= 18;

  for (const a of r.assignments) {
    await pageBreakIfNeeded(36, 'Cleaner Dispatch Sheet');
    page.drawText(`${a.cleaner.name} (${a.cleaner.phone})`, {
      x: MARGIN,
      y,
      size: 9,
      font: helvBold,
      color: COLORS.ink2,
    });
    y -= 12;
    // Wrap SMS at ~95 chars/line.
    const lines = wrap(a.sms, 95);
    for (const ln of lines) {
      await pageBreakIfNeeded(12, 'Cleaner Dispatch Sheet');
      page.drawText(ln, { x: MARGIN, y, size: 9, font: helv, color: COLORS.graphite });
      y -= 12;
    }
    y -= 6;
  }

  decorateFooters(doc);
  return await doc.save();
}

function wrap(text: string, width: number): string[] {
  if (text.length <= width) return [text];
  const out: string[] = [];
  let rest = text;
  while (rest.length > width) {
    // Prefer wrapping at last space within window.
    const slice = rest.slice(0, width);
    const cut = slice.lastIndexOf(' ');
    const at = cut > width / 2 ? cut : width;
    out.push(rest.slice(0, at));
    rest = rest.slice(at).trimStart();
  }
  if (rest) out.push(rest);
  return out;
}
