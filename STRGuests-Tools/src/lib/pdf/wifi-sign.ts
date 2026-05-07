/**
 * Wi-Fi Sign PDF generator.
 *
 * Single-page Letter PDF, three frame-ready design templates:
 *   - 'minimal' — clean centered layout, terracotta accent rule
 *   - 'cottage' — warm parchment block with serif-style headings
 *   - 'modern' — bold blocks, high-contrast SSID + password
 *
 * Template "design" is achieved with shape + typography hierarchy only;
 * no image embedding required.
 */

import { StandardFonts, type PDFFont } from 'pdf-lib';
import { COLORS, createBaseDoc, drawFooter } from './base';

export type WifiSignTemplate = 'minimal' | 'cottage' | 'modern';

export interface WifiSignInput {
  propertyName: string;
  ssid: string;
  password: string;
  template?: WifiSignTemplate;
  note?: string;
}

const PAGE_W = 612;
const PAGE_H = 792;

interface DrawContext {
  page: import('pdf-lib').PDFPage;
  helv: PDFFont;
  helvBold: PDFFont;
  helvOblique: PDFFont;
}

function drawCenteredText(
  ctx: DrawContext,
  text: string,
  y: number,
  size: number,
  font: PDFFont,
  color = COLORS.navy,
) {
  const width = font.widthOfTextAtSize(text, size);
  ctx.page.drawText(text, {
    x: (PAGE_W - width) / 2,
    y,
    size,
    font,
    color,
  });
}

function drawMinimal(ctx: DrawContext, input: WifiSignInput) {
  const { page } = ctx;

  // Top accent rule (centered, short)
  page.drawRectangle({
    x: PAGE_W / 2 - 30,
    y: 660,
    width: 60,
    height: 2,
    color: COLORS.terracotta,
  });

  drawCenteredText(ctx, 'Wi-Fi', 580, 56, ctx.helvBold, COLORS.navy);
  drawCenteredText(ctx, input.propertyName, 540, 14, ctx.helvOblique, COLORS.ink2);

  drawCenteredText(ctx, 'Network', 430, 13, ctx.helv, COLORS.ink2);
  drawCenteredText(ctx, input.ssid, 400, 28, ctx.helvBold, COLORS.navy);

  drawCenteredText(ctx, 'Password', 320, 13, ctx.helv, COLORS.ink2);
  drawCenteredText(ctx, input.password, 290, 28, ctx.helvBold, COLORS.terracotta);

  if (input.note) {
    drawCenteredText(ctx, input.note, 200, 12, ctx.helvOblique, COLORS.ink2);
  }
}

function drawCottage(ctx: DrawContext, input: WifiSignInput) {
  const { page } = ctx;

  // Parchment-warm block with rounded feel via inset
  page.drawRectangle({
    x: 60,
    y: 120,
    width: PAGE_W - 120,
    height: PAGE_H - 240,
    color: COLORS.parchment,
    borderColor: COLORS.terracotta,
    borderWidth: 2,
  });

  // Decorative leaf-bar (just a centered terracotta strip)
  page.drawRectangle({
    x: PAGE_W / 2 - 80,
    y: 600,
    width: 160,
    height: 4,
    color: COLORS.terracotta,
  });

  drawCenteredText(ctx, 'WI-FI', 540, 36, ctx.helvBold, COLORS.navy);
  drawCenteredText(ctx, input.propertyName, 500, 16, ctx.helvOblique, COLORS.terracotta);

  drawCenteredText(ctx, 'connect to', 420, 12, ctx.helvOblique, COLORS.ink2);
  drawCenteredText(ctx, input.ssid, 388, 24, ctx.helvBold, COLORS.navy);

  drawCenteredText(ctx, 'with the password', 320, 12, ctx.helvOblique, COLORS.ink2);
  drawCenteredText(ctx, input.password, 288, 24, ctx.helvBold, COLORS.navy);

  drawCenteredText(ctx, 'enjoy your stay', 200, 13, ctx.helvOblique, COLORS.ink2);

  if (input.note) {
    drawCenteredText(ctx, input.note, 170, 11, ctx.helv, COLORS.ink2);
  }
}

function drawModern(ctx: DrawContext, input: WifiSignInput) {
  const { page } = ctx;

  // Top navy block
  page.drawRectangle({
    x: 0,
    y: PAGE_H - 220,
    width: PAGE_W,
    height: 220,
    color: COLORS.navy,
  });
  drawCenteredText(ctx, 'WI-FI', PAGE_H - 140, 84, ctx.helvBold, COLORS.parchment);
  drawCenteredText(ctx, input.propertyName.toUpperCase(), PAGE_H - 180, 12, ctx.helvBold, COLORS.terracotta);

  // SSID block
  page.drawRectangle({
    x: 60,
    y: 380,
    width: PAGE_W - 120,
    height: 130,
    color: COLORS.parchment,
    borderColor: COLORS.navy,
    borderWidth: 2,
  });
  drawCenteredText(ctx, 'NETWORK', 480, 12, ctx.helvBold, COLORS.terracotta);
  drawCenteredText(ctx, input.ssid, 430, 32, ctx.helvBold, COLORS.navy);

  // Password block
  page.drawRectangle({
    x: 60,
    y: 220,
    width: PAGE_W - 120,
    height: 130,
    color: COLORS.terracotta,
  });
  drawCenteredText(ctx, 'PASSWORD', 320, 12, ctx.helvBold, COLORS.parchment);
  drawCenteredText(ctx, input.password, 270, 32, ctx.helvBold, COLORS.parchment);

  if (input.note) {
    drawCenteredText(ctx, input.note, 160, 12, ctx.helvOblique, COLORS.ink2);
  }
}

export async function buildWifiSignPdf(input: WifiSignInput): Promise<Uint8Array> {
  const doc = await createBaseDoc({
    title: `Wi-Fi — ${input.propertyName}`,
    subject: 'Guest Wi-Fi sign',
    keywords: ['airbnb', 'wifi', 'sign', 'short-term rental'],
  });

  const page = doc.addPage([PAGE_W, PAGE_H]);
  const helv = await doc.embedFont(StandardFonts.Helvetica);
  const helvBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const helvOblique = await doc.embedFont(StandardFonts.HelveticaOblique);

  const ctx: DrawContext = { page, helv, helvBold, helvOblique };
  const template = input.template ?? 'minimal';

  switch (template) {
    case 'cottage':
      drawCottage(ctx, input);
      break;
    case 'modern':
      drawModern(ctx, input);
      break;
    case 'minimal':
    default:
      drawMinimal(ctx, input);
      break;
  }

  drawFooter(page);
  return doc.save();
}
