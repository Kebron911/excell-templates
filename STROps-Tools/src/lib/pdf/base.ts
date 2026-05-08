import { PDFDocument, StandardFonts, rgb, PDFPage, PDFFont } from 'pdf-lib';
import { track } from '@lib/analytics';

// Ops accent green-gray = #4F6B5A
export const ACCENT = rgb(0x4f / 255, 0x6b / 255, 0x5a / 255);
export const NAVY = rgb(0x12 / 255, 0x30 / 255, 0x4e / 255);
export const INK = rgb(0x2b / 255, 0x2b / 255, 0x2b / 255);
export const INK2 = rgb(0x55 / 255, 0x50 / 255, 0x49 / 255);
export const PAGE = { width: 612, height: 792 }; // US Letter
export const MARGIN = 54;

export interface BrandedDoc {
  doc: PDFDocument;
  body: PDFFont;
  bold: PDFFont;
  mono: PDFFont;
}

export async function newBrandedDoc(): Promise<BrandedDoc> {
  const doc = await PDFDocument.create();
  doc.setProducer('strops.tools');
  doc.setCreator('strops.tools');
  const body = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const mono = await doc.embedFont(StandardFonts.Courier);
  return { doc, body, bold, mono };
}

export function newPage(d: BrandedDoc): PDFPage {
  return d.doc.addPage([PAGE.width, PAGE.height]);
}

export function drawHeader(page: PDFPage, d: BrandedDoc, title: string, subtitle?: string) {
  page.drawText('strops.tools', {
    x: MARGIN, y: PAGE.height - MARGIN, size: 11, font: d.bold, color: NAVY,
  });
  page.drawText('.', { x: MARGIN + 56, y: PAGE.height - MARGIN, size: 11, font: d.bold, color: ACCENT });
  page.drawText(title, {
    x: MARGIN, y: PAGE.height - MARGIN - 28, size: 20, font: d.bold, color: NAVY,
  });
  if (subtitle) {
    page.drawText(subtitle, {
      x: MARGIN, y: PAGE.height - MARGIN - 46, size: 10, font: d.body, color: INK2,
    });
  }
  page.drawLine({
    start: { x: MARGIN, y: PAGE.height - MARGIN - 56 },
    end:   { x: PAGE.width - MARGIN, y: PAGE.height - MARGIN - 56 },
    thickness: 0.6, color: ACCENT,
  });
}

export function drawFooter(page: PDFPage, d: BrandedDoc, pageNumber: number, total: number) {
  const y = MARGIN - 18;
  page.drawText('strops.tools — free tools for active STR operators', {
    x: MARGIN, y, size: 8, font: d.body, color: INK2,
  });
  page.drawText(`${pageNumber} / ${total}`, {
    x: PAGE.width - MARGIN - 40, y, size: 8, font: d.body, color: INK2,
  });
}

export async function finalize(d: BrandedDoc): Promise<Uint8Array> {
  const pages = d.doc.getPages();
  pages.forEach((p, i) => drawFooter(p, d, i + 1, pages.length));
  return await d.doc.save();
}

export function downloadBytes(bytes: Uint8Array, filename: string) {
  if (typeof window === 'undefined') return;
  const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
  track('pdf_downloaded', { filename });
}

export function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars) {
      lines.push(cur.trim()); cur = w;
    } else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  return lines;
}
