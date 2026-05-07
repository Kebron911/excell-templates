/**
 * House Rules PDF generator.
 *
 * Single-page Letter PDF: branded header/footer, property + contact subhead,
 * numbered checkbox rules, optional signature block. Designed to be printable
 * on a single page; spills to a second page only if rules > ~18 entries.
 */

import { StandardFonts, type PDFPage, type PDFFont } from 'pdf-lib';
import { COLORS, createBaseDoc, drawFooter, drawHeader } from './base';

export interface HouseRulesInput {
  propertyName: string;
  address?: string;
  rules: string[];
  checkInTime?: string;   // e.g. "3:00 PM"
  checkOutTime?: string;  // e.g. "11:00 AM"
  hostName?: string;
  contactPhone?: string;
  signatureLine?: boolean;
}

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN_X = 48;
const BODY_TOP = 700; // y of first rule (below header)
const LINE_HEIGHT = 22;
const RULE_WRAP_WIDTH = PAGE_W - MARGIN_X * 2 - 28;

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const tentative = line ? `${line} ${word}` : word;
    const w = font.widthOfTextAtSize(tentative, size);
    if (w > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = tentative;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawCheckbox(page: PDFPage, x: number, y: number) {
  page.drawRectangle({
    x,
    y,
    width: 12,
    height: 12,
    borderColor: COLORS.navy,
    borderWidth: 1,
  });
}

export async function buildHouseRulesPdf(input: HouseRulesInput): Promise<Uint8Array> {
  const doc = await createBaseDoc({
    title: `House Rules — ${input.propertyName}`,
    subject: 'Guest house rules',
    keywords: ['airbnb', 'vrbo', 'house rules', 'short-term rental'],
  });

  const helv = await doc.embedFont(StandardFonts.Helvetica);
  const helvBold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page = doc.addPage([PAGE_W, PAGE_H]);
  await drawHeader(doc, page, {
    title: 'House Rules',
    subtitle: input.address ? `${input.propertyName} · ${input.address}` : input.propertyName,
  });

  // Check-in / check-out band (if provided)
  let cursorY = BODY_TOP + 16;
  if (input.checkInTime || input.checkOutTime) {
    const parts: string[] = [];
    if (input.checkInTime) parts.push(`Check-in: ${input.checkInTime}`);
    if (input.checkOutTime) parts.push(`Check-out: ${input.checkOutTime}`);
    page.drawText(parts.join('   ·   '), {
      x: MARGIN_X,
      y: cursorY,
      size: 11,
      font: helvBold,
      color: COLORS.terracotta,
    });
    cursorY -= 24;
  }

  // Numbered rules with checkboxes
  const RULE_FONT_SIZE = 11;
  for (let i = 0; i < input.rules.length; i++) {
    const lines = wrap(input.rules[i], helv, RULE_FONT_SIZE, RULE_WRAP_WIDTH);
    const blockHeight = Math.max(LINE_HEIGHT, lines.length * (RULE_FONT_SIZE + 4));

    // Page break if needed
    if (cursorY - blockHeight < 80) {
      drawFooter(page);
      page = doc.addPage([PAGE_W, PAGE_H]);
      await drawHeader(doc, page, {
        title: 'House Rules (continued)',
        subtitle: input.propertyName,
      });
      cursorY = BODY_TOP + 16;
    }

    // checkbox
    drawCheckbox(page, MARGIN_X, cursorY - 9);

    // number
    page.drawText(`${i + 1}.`, {
      x: MARGIN_X + 18,
      y: cursorY - 8,
      size: RULE_FONT_SIZE,
      font: helvBold,
      color: COLORS.navy,
    });

    // wrapped rule text
    let lineY = cursorY - 8;
    for (const line of lines) {
      page.drawText(line, {
        x: MARGIN_X + 36,
        y: lineY,
        size: RULE_FONT_SIZE,
        font: helv,
        color: COLORS.graphite,
      });
      lineY -= RULE_FONT_SIZE + 4;
    }

    cursorY -= blockHeight + 6;
  }

  // Signature + host block at bottom
  if (input.signatureLine || input.hostName || input.contactPhone) {
    if (cursorY < 160) {
      drawFooter(page);
      page = doc.addPage([PAGE_W, PAGE_H]);
      await drawHeader(doc, page, { title: 'House Rules (continued)', subtitle: input.propertyName });
      cursorY = BODY_TOP + 16;
    }

    cursorY -= 12;
    page.drawRectangle({
      x: MARGIN_X,
      y: cursorY,
      width: PAGE_W - MARGIN_X * 2,
      height: 1,
      color: COLORS.ink2,
    });
    cursorY -= 18;

    if (input.hostName) {
      page.drawText(`Host: ${input.hostName}`, {
        x: MARGIN_X,
        y: cursorY,
        size: 11,
        font: helv,
        color: COLORS.graphite,
      });
      cursorY -= 16;
    }
    if (input.contactPhone) {
      page.drawText(`Contact: ${input.contactPhone}`, {
        x: MARGIN_X,
        y: cursorY,
        size: 11,
        font: helv,
        color: COLORS.graphite,
      });
      cursorY -= 16;
    }
    if (input.signatureLine) {
      cursorY -= 8;
      page.drawText('Guest signature: __________________________   Date: ____________', {
        x: MARGIN_X,
        y: cursorY,
        size: 11,
        font: helv,
        color: COLORS.graphite,
      });
    }
  }

  drawFooter(page);
  return doc.save();
}
