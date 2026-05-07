/**
 * Maintenance schedule PDF — multi-page calendar table.
 *
 * Builds on `src/lib/pdf/base.ts` brand chrome. Pages auto-break when y-cursor
 * reaches the footer reserve. Footers paginated `Page N of M`.
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
import type { ScheduleResult } from '../calc/maintenance-schedule';

const ROW_HEIGHT = 14;
const FOOTER_RESERVE = 60;

export async function buildSchedulePdf(
  r: ScheduleResult,
  subtitle: string,
): Promise<Uint8Array> {
  const { doc } = await createBrandedDoc({
    title: 'Maintenance Schedule',
    subject: 'Annual maintenance calendar for short-term rental property',
    keywords: ['short-term rental', 'maintenance schedule', 'STR'],
  });
  const helvBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const helv = await doc.embedFont(StandardFonts.Helvetica);

  let { page, bodyTopY } = await addBrandedPage(doc, {
    title: 'Maintenance Schedule',
    subtitle,
  });
  let y = bodyTopY;

  const col = {
    date: MARGIN,
    task: MARGIN + 80,
    cadence: MARGIN + 380,
  };

  function drawTableHeader() {
    page.drawText('Date', { x: col.date, y, size: 9, font: helvBold, color: COLORS.navy });
    page.drawText('Task', { x: col.task, y, size: 9, font: helvBold, color: COLORS.navy });
    page.drawText('Cadence', { x: col.cadence, y, size: 9, font: helvBold, color: COLORS.navy });
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

  drawTableHeader();

  for (const e of r.events) {
    if (y < FOOTER_RESERVE + ROW_HEIGHT) {
      const next = await addBrandedPage(doc, {
        title: 'Maintenance Schedule (cont.)',
        subtitle,
      });
      page = next.page;
      y = next.bodyTopY;
      drawTableHeader();
    }
    page.drawText(e.date, { x: col.date, y, size: 9, font: helv, color: COLORS.graphite });
    page.drawText(e.name, { x: col.task, y, size: 9, font: helv, color: COLORS.graphite });
    page.drawText(`${e.cadenceDays}d`, {
      x: col.cadence,
      y,
      size: 9,
      font: helv,
      color: COLORS.ink2,
    });
    y -= ROW_HEIGHT;
  }

  decorateFooters(doc);
  return await doc.save();
}
