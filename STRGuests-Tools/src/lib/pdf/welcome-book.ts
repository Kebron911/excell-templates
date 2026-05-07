/**
 * Welcome Book PDF generator.
 *
 * Multi-page Letter PDF: cover, table of contents, host-defined sections,
 * local picks, emergency contacts, branded footer on every page.
 */

import { StandardFonts, type PDFFont, type PDFPage } from 'pdf-lib';
import { COLORS, createBaseDoc, drawFooter, drawHeader } from './base';

export interface WelcomeBookSection {
  heading: string;
  body: string;
}

export interface WelcomeBookPick {
  name: string;
  category: string;
  note?: string;
}

export interface WelcomeBookEmergency {
  label: string;
  value: string;
}

export interface WelcomeBookInput {
  propertyName: string;
  hostName: string;
  hostBio?: string;
  wifi?: { ssid: string; password: string };
  sections: WelcomeBookSection[];
  localPicks?: WelcomeBookPick[];
  emergency?: WelcomeBookEmergency[];
  checkout?: string;
}

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN_X = 56;
const BODY_TOP_Y = 700;
const BODY_BOTTOM_Y = 64;

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const paragraphs = text.split(/\n+/);
  const out: string[] = [];
  for (const para of paragraphs) {
    const words = para.split(/\s+/);
    let line = '';
    for (const word of words) {
      const tentative = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(tentative, size) > maxWidth && line) {
        out.push(line);
        line = word;
      } else {
        line = tentative;
      }
    }
    if (line) out.push(line);
    out.push(''); // paragraph break
  }
  return out;
}

export async function buildWelcomeBookPdf(input: WelcomeBookInput): Promise<Uint8Array> {
  const doc = await createBaseDoc({
    title: `Welcome — ${input.propertyName}`,
    subject: 'Guest welcome book',
    keywords: ['airbnb', 'vrbo', 'welcome book', 'guidebook'],
  });

  const helv = await doc.embedFont(StandardFonts.Helvetica);
  const helvBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const helvOblique = await doc.embedFont(StandardFonts.HelveticaOblique);

  // === Cover page ===
  const cover = doc.addPage([PAGE_W, PAGE_H]);
  // Decorative banner
  cover.drawRectangle({
    x: 0,
    y: PAGE_H - 240,
    width: PAGE_W,
    height: 240,
    color: COLORS.terracotta,
  });
  cover.drawText('Welcome', {
    x: MARGIN_X,
    y: PAGE_H - 130,
    size: 56,
    font: helvBold,
    color: COLORS.parchment,
  });
  cover.drawText('to', {
    x: MARGIN_X,
    y: PAGE_H - 175,
    size: 28,
    font: helvOblique,
    color: COLORS.parchment,
  });
  cover.drawText(input.propertyName, {
    x: MARGIN_X,
    y: PAGE_H - 220,
    size: 28,
    font: helvBold,
    color: COLORS.parchment,
  });

  cover.drawText(`Hosted by ${input.hostName}`, {
    x: MARGIN_X,
    y: PAGE_H - 290,
    size: 13,
    font: helvBold,
    color: COLORS.navy,
  });
  if (input.hostBio) {
    const bioLines = wrap(input.hostBio, helv, 11, PAGE_W - MARGIN_X * 2);
    let y = PAGE_H - 312;
    for (const line of bioLines) {
      if (line) cover.drawText(line, { x: MARGIN_X, y, size: 11, font: helv, color: COLORS.graphite });
      y -= 14;
    }
  }
  if (input.wifi) {
    let y = 220;
    cover.drawRectangle({
      x: MARGIN_X,
      y: 80,
      width: PAGE_W - MARGIN_X * 2,
      height: 160,
      borderColor: COLORS.terracotta,
      borderWidth: 1,
    });
    cover.drawText('Wi-Fi', { x: MARGIN_X + 16, y: y - 12, size: 18, font: helvBold, color: COLORS.navy });
    cover.drawText(`Network: ${input.wifi.ssid}`, { x: MARGIN_X + 16, y: y - 50, size: 13, font: helv, color: COLORS.graphite });
    cover.drawText(`Password: ${input.wifi.password}`, { x: MARGIN_X + 16, y: y - 72, size: 13, font: helv, color: COLORS.graphite });
    if (input.checkout) {
      cover.drawText(`Checkout: ${input.checkout}`, { x: MARGIN_X + 16, y: y - 110, size: 13, font: helvBold, color: COLORS.terracotta });
    }
  }
  drawFooter(cover);

  // === Table of contents ===
  const tocPage = doc.addPage([PAGE_W, PAGE_H]);
  await drawHeader(doc, tocPage, { title: 'Table of contents', subtitle: input.propertyName });
  let tocY = BODY_TOP_Y;
  const tocItems: string[] = [...input.sections.map((s) => s.heading)];
  if (input.localPicks && input.localPicks.length > 0) tocItems.push('Local picks');
  if (input.emergency && input.emergency.length > 0) tocItems.push('Emergency contacts');
  for (let i = 0; i < tocItems.length; i++) {
    tocPage.drawText(`${i + 1}.`, { x: MARGIN_X, y: tocY, size: 12, font: helvBold, color: COLORS.navy });
    tocPage.drawText(tocItems[i], { x: MARGIN_X + 28, y: tocY, size: 12, font: helv, color: COLORS.graphite });
    tocY -= 22;
  }
  drawFooter(tocPage);

  // === Section pages ===
  for (const section of input.sections) {
    let page = doc.addPage([PAGE_W, PAGE_H]);
    await drawHeader(doc, page, { title: section.heading, subtitle: input.propertyName });
    const lines = wrap(section.body, helv, 11, PAGE_W - MARGIN_X * 2);
    let y = BODY_TOP_Y;
    for (const line of lines) {
      if (y < BODY_BOTTOM_Y + 30) {
        drawFooter(page);
        page = doc.addPage([PAGE_W, PAGE_H]);
        await drawHeader(doc, page, { title: `${section.heading} (cont.)`, subtitle: input.propertyName });
        y = BODY_TOP_Y;
      }
      if (line) page.drawText(line, { x: MARGIN_X, y, size: 11, font: helv, color: COLORS.graphite });
      y -= 16;
    }
    drawFooter(page);
  }

  // === Local picks ===
  if (input.localPicks && input.localPicks.length > 0) {
    let page = doc.addPage([PAGE_W, PAGE_H]);
    await drawHeader(doc, page, { title: 'Local picks', subtitle: input.propertyName });
    let y = BODY_TOP_Y;
    for (const pick of input.localPicks) {
      const blockHeight = pick.note ? 50 : 30;
      if (y - blockHeight < BODY_BOTTOM_Y + 20) {
        drawFooter(page);
        page = doc.addPage([PAGE_W, PAGE_H]);
        await drawHeader(doc, page, { title: 'Local picks (cont.)', subtitle: input.propertyName });
        y = BODY_TOP_Y;
      }
      page.drawText(pick.name, { x: MARGIN_X, y, size: 13, font: helvBold, color: COLORS.navy });
      page.drawText(pick.category, {
        x: MARGIN_X,
        y: y - 16,
        size: 10,
        font: helvOblique,
        color: COLORS.terracotta,
      });
      if (pick.note) {
        const noteLines = wrap(pick.note, helv, 11, PAGE_W - MARGIN_X * 2);
        let ny = y - 34;
        for (const line of noteLines) {
          if (line) page.drawText(line, { x: MARGIN_X, y: ny, size: 11, font: helv, color: COLORS.graphite });
          ny -= 14;
        }
      }
      y -= blockHeight + 10;
    }
    drawFooter(page);
  }

  // === Emergency contacts ===
  if (input.emergency && input.emergency.length > 0) {
    const page = doc.addPage([PAGE_W, PAGE_H]);
    await drawHeader(doc, page, { title: 'Emergency contacts', subtitle: input.propertyName });
    let y = BODY_TOP_Y;
    for (const e of input.emergency) {
      page.drawText(e.label, { x: MARGIN_X, y, size: 12, font: helvBold, color: COLORS.navy });
      page.drawText(e.value, { x: MARGIN_X + 200, y, size: 12, font: helv, color: COLORS.graphite });
      y -= 22;
    }
    drawFooter(page);
  }

  return doc.save();
}

// Re-export the page constants for tests/components that need them.
export const WELCOME_BOOK_PAGE_W = PAGE_W;
export const WELCOME_BOOK_PAGE_H = PAGE_H;
// Suppress unused-warning for PDFPage import — used for type narrowing in callbacks.
export type _PDFPage = PDFPage;
