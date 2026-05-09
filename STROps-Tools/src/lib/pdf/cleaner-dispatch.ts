import {
  newBrandedDoc,
  newPage,
  drawHeader,
  finalize,
  MARGIN,
  PAGE,
  INK,
  INK2,
  ACCENT,
} from './base';
import type { DispatchResult } from '@lib/calc/cleaner-dispatch';

export async function buildDispatchPdf(r: DispatchResult): Promise<Uint8Array> {
  const d = await newBrandedDoc();
  const page = newPage(d);
  drawHeader(page, d, 'Cleaner Dispatch Sheet', `Date: ${r.date}`);

  let y = PAGE.height - MARGIN - 90;
  const col = {
    property: MARGIN,
    addr: MARGIN + 90,
    br: MARGIN + 280,
    cleaner: MARGIN + 320,
    phone: MARGIN + 430,
  };

  page.drawText('Property', { x: col.property, y, size: 9, font: d.bold, color: INK });
  page.drawText('Address', { x: col.addr, y, size: 9, font: d.bold, color: INK });
  page.drawText('BR', { x: col.br, y, size: 9, font: d.bold, color: INK });
  page.drawText('Cleaner', { x: col.cleaner, y, size: 9, font: d.bold, color: INK });
  page.drawText('Phone', { x: col.phone, y, size: 9, font: d.bold, color: INK });
  y -= 6;
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE.width - MARGIN, y },
    thickness: 0.5,
    color: ACCENT,
  });
  y -= 14;

  for (const a of r.assignments) {
    page.drawText(a.turnover.propertyId, { x: col.property, y, size: 9, font: d.body, color: INK });
    page.drawText(a.turnover.address.slice(0, 28), { x: col.addr, y, size: 9, font: d.body, color: INK });
    page.drawText(String(a.turnover.bedrooms), { x: col.br, y, size: 9, font: d.body, color: INK });
    page.drawText(a.cleaner.name, { x: col.cleaner, y, size: 9, font: d.body, color: INK });
    page.drawText(a.cleaner.phone, { x: col.phone, y, size: 9, font: d.mono, color: INK });
    y -= 14;
    if (y < MARGIN + 100) break;
  }

  y -= 20;
  page.drawText('SMS templates', { x: MARGIN, y, size: 11, font: d.bold, color: INK });
  y -= 16;
  for (const a of r.assignments) {
    const lines = [a.sms.slice(0, 95), a.sms.slice(95)].filter(Boolean);
    page.drawText(`${a.cleaner.name} (${a.cleaner.phone})`, {
      x: MARGIN,
      y,
      size: 9,
      font: d.bold,
      color: INK2,
    });
    y -= 12;
    for (const ln of lines) {
      page.drawText(ln, { x: MARGIN, y, size: 9, font: d.body, color: INK });
      y -= 12;
    }
    y -= 6;
    if (y < MARGIN + 40) break;
  }
  return finalize(d);
}
