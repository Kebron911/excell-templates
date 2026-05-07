/**
 * House Rules PDF builder — Task 11 (Phase 2).
 *
 * Renders a single-or-multi-page printable house-rules document.
 * Layout per the strguests brand:
 *   - Branded header (title + subtitle + terracotta accent rule, via base.ts)
 *   - Open-square checkbox glyph + rule text per row
 *   - Optional host signature line
 *   - Brand footer (via base.ts)
 *
 * Pagination handled here: rules wrap to a new page when y drops below the
 * bottom margin. We intentionally don't word-wrap individual rules — preset
 * rules and host-authored rules are short. If a rule exceeds the line width,
 * pdf-lib clips it; the UI form should keep custom rules under ~80 chars.
 */

import { StandardFonts } from 'pdf-lib';
import { createBaseDoc, drawHeader, drawFooter, COLORS } from './base';
import type { PDFDocument, PDFPage } from 'pdf-lib';

export interface HouseRulesInput {
  propertyName: string;
  hostName?: string;
  /** Rendered as one row per entry. Order preserved. */
  rules: string[];
}

const MARGIN_X = 50;
const TOP_OF_BODY = 130; // headroom for header (title + subtitle + rule)
const BOTTOM_MARGIN = 80;
const LINE_HEIGHT = 22;

async function startNewPage(
  doc: PDFDocument,
  propertyName: string,
  pageNumber: number,
  totalSoFar: number,
): Promise<{ page: PDFPage; y: number }> {
  const page = doc.addPage([612, 792]); // US Letter
  // Continuation pages get a lighter header — title only, no subtitle/rule.
  await drawHeader(doc, page, {
    title: pageNumber === 1 ? 'House Rules' : `House Rules (cont. ${pageNumber})`,
    subtitle: pageNumber === 1 ? propertyName : undefined,
    rule: pageNumber === 1,
  });
  const y = page.getHeight() - TOP_OF_BODY;
  void totalSoFar; // reserved for future "rule X of Y" annotation
  return { page, y };
}

export async function buildHouseRulesPdf(input: HouseRulesInput): Promise<Uint8Array> {
  const { propertyName, hostName, rules } = input;

  const doc = await createBaseDoc({
    title: `House Rules — ${propertyName}`,
    subject: 'Guest house rules',
    keywords: ['airbnb', 'house rules', 'short-term rental', propertyName],
  });

  const helv = await doc.embedFont(StandardFonts.Helvetica);
  const helvBold = await doc.embedFont(StandardFonts.HelveticaBold);

  let pageNumber = 1;
  let { page, y } = await startNewPage(doc, propertyName, pageNumber, 0);

  // Always at least one page even when rules is empty (caught by test).
  if (rules.length === 0) {
    drawFooter(page);
  }

  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];

    if (y < BOTTOM_MARGIN + LINE_HEIGHT) {
      drawFooter(page);
      pageNumber++;
      const next = await startNewPage(doc, propertyName, pageNumber, i);
      page = next.page;
      y = next.y;
    }

    // Open square glyph + rule text. Geometry: 11x11 box, 1px stroke, ink2.
    page.drawRectangle({
      x: MARGIN_X,
      y: y - 1,
      width: 11,
      height: 11,
      borderColor: COLORS.ink2,
      borderWidth: 1,
    });
    page.drawText(rule, {
      x: MARGIN_X + 18,
      y,
      size: 12,
      font: helv,
      color: COLORS.graphite,
    });
    y -= LINE_HEIGHT;
  }

  if (hostName) {
    if (y < BOTTOM_MARGIN + LINE_HEIGHT * 2) {
      drawFooter(page);
      pageNumber++;
      const next = await startNewPage(doc, propertyName, pageNumber, rules.length);
      page = next.page;
      y = next.y;
    }
    y -= LINE_HEIGHT;
    page.drawText(`— ${hostName}`, {
      x: MARGIN_X,
      y,
      size: 10,
      font: helvBold,
      color: COLORS.navy,
    });
  }

  drawFooter(page);
  return doc.save();
}
