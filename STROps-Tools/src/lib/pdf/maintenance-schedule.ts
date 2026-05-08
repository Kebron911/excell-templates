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
import type { ScheduleResult } from '@lib/calc/maintenance-schedule';

export async function buildSchedulePdf(
  r: ScheduleResult,
  title: string,
): Promise<Uint8Array> {
  const d = await newBrandedDoc();
  let page = newPage(d);
  drawHeader(page, d, 'Maintenance Schedule', title);
  let y = PAGE.height - MARGIN - 90;
  page.drawText('Date', { x: MARGIN, y, size: 9, font: d.bold, color: INK });
  page.drawText('Task', { x: MARGIN + 80, y, size: 9, font: d.bold, color: INK });
  page.drawText('Cadence', { x: MARGIN + 360, y, size: 9, font: d.bold, color: INK });
  y -= 6;
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE.width - MARGIN, y },
    thickness: 0.5,
    color: ACCENT,
  });
  y -= 14;
  for (const e of r.events) {
    if (y < MARGIN + 40) {
      page = newPage(d);
      drawHeader(page, d, 'Maintenance Schedule (cont.)', title);
      y = PAGE.height - MARGIN - 90;
    }
    page.drawText(e.date, { x: MARGIN, y, size: 9, font: d.mono, color: INK });
    page.drawText(e.name, { x: MARGIN + 80, y, size: 9, font: d.body, color: INK });
    page.drawText(`${e.cadenceDays}d`, {
      x: MARGIN + 360,
      y,
      size: 9,
      font: d.mono,
      color: INK2,
    });
    y -= 13;
  }
  return finalize(d);
}
