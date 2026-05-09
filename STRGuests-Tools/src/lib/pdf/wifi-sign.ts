/**
 * Wi-Fi Sign PDF builder — Task 13 (Phase 2).
 *
 * Single-page, design-heavy. Three template variants share the same data
 * shape but differ in layout and tone:
 *   - 'minimal'     — quiet typography, lots of whitespace, no flourishes
 *   - 'hospitable'  — terracotta accent rule, warmer, recommended for most STRs
 *   - 'fun'         — large QR + playful header copy, for vacation properties
 *
 * Each template embeds a QR code (PNG via embedPng) so guests can connect
 * by scanning. SSID + password are also rendered in large monospace text
 * for the "I'll just type it in" path.
 */

import { StandardFonts } from 'pdf-lib';
import type { PDFDocument, PDFPage, PDFFont } from 'pdf-lib';
import { createBaseDoc, drawFooter, COLORS } from './base';
import { buildWifiQrPng } from './wifi-qr';

export type WifiSignTemplate = 'minimal' | 'hospitable' | 'fun';

export interface WifiSignInput {
  ssid: string;
  password: string;
  template?: WifiSignTemplate;
  /** Optional property/house name shown above the credentials. */
  houseName?: string;
  /** Drop the strguests footer. */
  brandFooter?: boolean;
}

const PAGE_W = 612;
const PAGE_H = 792;

interface Fonts {
  helv: PDFFont;
  helvBold: PDFFont;
  courier: PDFFont;
  courierBold: PDFFont;
  timesItalic: PDFFont;
}

async function embedFonts(doc: PDFDocument): Promise<Fonts> {
  return {
    helv: await doc.embedFont(StandardFonts.Helvetica),
    helvBold: await doc.embedFont(StandardFonts.HelveticaBold),
    courier: await doc.embedFont(StandardFonts.Courier),
    courierBold: await doc.embedFont(StandardFonts.CourierBold),
    timesItalic: await doc.embedFont(StandardFonts.TimesRomanItalic),
  };
}

function drawCentered(
  page: PDFPage,
  text: string,
  font: PDFFont,
  size: number,
  y: number,
  color: any,
): void {
  const w = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: (PAGE_W - w) / 2, y, size, font, color });
}

async function drawMinimal(
  doc: PDFDocument,
  page: PDFPage,
  fonts: Fonts,
  input: WifiSignInput,
  qrPng: any,
): Promise<void> {
  // Quiet, lots of whitespace.
  drawCentered(page, 'WI-FI', fonts.helv, 11, PAGE_H - 120, COLORS.ink2);
  if (input.houseName) {
    drawCentered(page, input.houseName, fonts.timesItalic, 18, PAGE_H - 160, COLORS.graphite);
  }

  // QR centered
  const qrSize = 220;
  page.drawImage(qrPng, {
    x: (PAGE_W - qrSize) / 2,
    y: PAGE_H / 2 - qrSize / 2 + 40,
    width: qrSize,
    height: qrSize,
  });

  // Credentials below
  drawCentered(page, 'NETWORK', fonts.helv, 9, 250, COLORS.ink2);
  drawCentered(page, input.ssid, fonts.courierBold, 18, 228, COLORS.navy);
  drawCentered(page, 'PASSWORD', fonts.helv, 9, 195, COLORS.ink2);
  drawCentered(page, input.password, fonts.courierBold, 18, 173, COLORS.navy);

  drawCentered(page, 'Scan or type — either works.', fonts.timesItalic, 11, 130, COLORS.ink2);
}

async function drawHospitable(
  doc: PDFDocument,
  page: PDFPage,
  fonts: Fonts,
  input: WifiSignInput,
  qrPng: any,
): Promise<void> {
  // Recommended default — terracotta rule, soft warmth.
  drawCentered(page, 'WELCOME', fonts.helv, 10, PAGE_H - 100, COLORS.terracotta);
  if (input.houseName) {
    drawCentered(page, input.houseName, fonts.helvBold, 26, PAGE_H - 140, COLORS.navy);
  }
  // Accent rule
  page.drawRectangle({
    x: PAGE_W / 2 - 30,
    y: PAGE_H - 168,
    width: 60,
    height: 2,
    color: COLORS.terracotta,
  });
  drawCentered(page, 'Get connected', fonts.timesItalic, 16, PAGE_H - 200, COLORS.graphite);

  // QR
  const qrSize = 200;
  page.drawImage(qrPng, {
    x: (PAGE_W - qrSize) / 2,
    y: PAGE_H / 2 - qrSize / 2 + 10,
    width: qrSize,
    height: qrSize,
  });

  // Credentials block (terracotta-bordered)
  const blockX = 110;
  const blockY = 200;
  const blockW = PAGE_W - blockX * 2;
  const blockH = 110;
  page.drawRectangle({
    x: blockX,
    y: blockY,
    width: blockW,
    height: blockH,
    borderColor: COLORS.terracotta,
    borderWidth: 1,
    color: COLORS.parchment,
  });
  page.drawText('NETWORK', { x: blockX + 16, y: blockY + blockH - 22, size: 9, font: fonts.helvBold, color: COLORS.ink2 });
  page.drawText(input.ssid, { x: blockX + 16, y: blockY + blockH - 44, size: 18, font: fonts.courierBold, color: COLORS.navy });
  page.drawText('PASSWORD', { x: blockX + 16, y: blockY + blockH - 70, size: 9, font: fonts.helvBold, color: COLORS.ink2 });
  page.drawText(input.password, { x: blockX + 16, y: blockY + blockH - 92, size: 18, font: fonts.courierBold, color: COLORS.navy });

  drawCentered(page, 'Make yourself at home.', fonts.timesItalic, 12, 160, COLORS.ink2);
}

async function drawFun(
  doc: PDFDocument,
  page: PDFPage,
  fonts: Fonts,
  input: WifiSignInput,
  qrPng: any,
): Promise<void> {
  // Big QR, playful header, casual copy.
  // » (WinAnsi 0xBB) instead of → (U+2192) — pdf-lib's standard fonts are
  // WinAnsi-only and cannot encode arrows. » carries the same "this way" visual.
  drawCentered(page, "WI-FI'S OVER HERE »", fonts.helvBold, 22, PAGE_H - 110, COLORS.terracotta);
  if (input.houseName) {
    drawCentered(page, input.houseName, fonts.timesItalic, 14, PAGE_H - 140, COLORS.ink2);
  }

  // BIG QR
  const qrSize = 320;
  page.drawImage(qrPng, {
    x: (PAGE_W - qrSize) / 2,
    y: PAGE_H / 2 - qrSize / 2 + 30,
    width: qrSize,
    height: qrSize,
  });

  // Credentials below
  drawCentered(page, 'or type:', fonts.timesItalic, 12, 180, COLORS.ink2);
  drawCentered(page, input.ssid, fonts.courierBold, 16, 156, COLORS.navy);
  drawCentered(page, input.password, fonts.courierBold, 16, 134, COLORS.terracotta);
}

export async function buildWifiSignPdf(input: WifiSignInput): Promise<Uint8Array> {
  const { ssid, password, template = 'hospitable', brandFooter = true } = input;

  const doc = await createBaseDoc({
    title: input.houseName ? `Wi-Fi — ${input.houseName}` : `Wi-Fi — ${ssid}`,
    subject: 'Printable Wi-Fi sign for short-term rental guests',
    keywords: ['airbnb', 'wifi', 'qr code', 'guest', input.houseName ?? ssid],
  });

  const fonts = await embedFonts(doc);
  const page = doc.addPage([PAGE_W, PAGE_H]);

  const qrBytes = await buildWifiQrPng({ ssid, password }, 480);
  const qrPng = await doc.embedPng(qrBytes);

  switch (template) {
    case 'minimal':
      await drawMinimal(doc, page, fonts, input, qrPng);
      break;
    case 'fun':
      await drawFun(doc, page, fonts, input, qrPng);
      break;
    case 'hospitable':
    default:
      await drawHospitable(doc, page, fonts, input, qrPng);
      break;
  }

  drawFooter(page, { brandFooter });
  return doc.save();
}
