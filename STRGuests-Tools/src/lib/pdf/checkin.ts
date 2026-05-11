/**
 * Check-in Instructions PDF builder — Task 14 (Phase 2).
 *
 * Multi-page arrival guide. Sections (each optional):
 *   1. Cover               — property + arrival window + host signature
 *   2. Getting here        — address + parking + optional parking-photo
 *   3. Getting in          — door code + optional door-photo
 *   4. Wi-Fi essentials    — SSID + password tile (no QR — see wifi-sign)
 *   5. First-night basics  — short list (lights, thermostat, trash, water)
 *   6. Emergency contacts  — host phone + nearest hospital + police
 *
 * Image inputs are raw bytes (Uint8Array) plus a `kind` discriminator so
 * pdf-lib chooses embedPng vs embedJpg. Browser callers feed FileReader
 * results; tests can pass tiny hardcoded fixtures.
 */

import { StandardFonts } from 'pdf-lib';
import type { PDFDocument, PDFPage, PDFFont, PDFImage } from 'pdf-lib';
import { createBaseDoc, drawHeader, drawFooter, COLORS } from './base';
import { formatPhone } from '@str/format';

export type CheckinImageKind = 'png' | 'jpg';

export interface CheckinImage {
  bytes: Uint8Array;
  kind: CheckinImageKind;
  /** Optional caption rendered below the image. */
  caption?: string;
}

export interface CheckinInput {
  propertyName: string;
  hostName?: string;
  arrivalWindow?: string; // e.g., "After 4pm — before 9pm"
  address?: string;
  parking?: {
    notes: string;
    photo?: CheckinImage;
  };
  doorAccess?: {
    code?: string;
    notes?: string;
    photo?: CheckinImage;
  };
  wifi?: {
    ssid: string;
    password: string;
  };
  firstNight?: string[];      // short instruction list
  emergency?: {
    hostPhone?: string;
    nearestHospital?: string;
    police?: string;
  };
  brandFooter?: boolean;
}

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN_X = 60;
const BODY_TOP = 130;
const LINE_H = 18;

interface Fonts {
  helv: PDFFont;
  helvBold: PDFFont;
  courierBold: PDFFont;
  timesItalic: PDFFont;
}

async function embedFonts(doc: PDFDocument): Promise<Fonts> {
  return {
    helv: await doc.embedFont(StandardFonts.Helvetica),
    helvBold: await doc.embedFont(StandardFonts.HelveticaBold),
    courierBold: await doc.embedFont(StandardFonts.CourierBold),
    timesItalic: await doc.embedFont(StandardFonts.TimesRomanItalic),
  };
}

async function embedImage(doc: PDFDocument, img: CheckinImage): Promise<PDFImage> {
  return img.kind === 'png' ? doc.embedPng(img.bytes) : doc.embedJpg(img.bytes);
}

/**
 * Lays out a captioned image inside a max-width box, preserving aspect ratio.
 * Returns the y position consumed below the image (caller decrements y to it).
 */
function drawCaptionedImage(
  page: PDFPage,
  img: PDFImage,
  fonts: Fonts,
  caption: string | undefined,
  x: number,
  y: number,
  maxW: number,
  maxH: number,
): number {
  const ratio = img.width / img.height;
  let w = maxW;
  let h = w / ratio;
  if (h > maxH) {
    h = maxH;
    w = h * ratio;
  }
  page.drawImage(img, { x, y: y - h, width: w, height: h });
  let next = y - h - 6;
  if (caption) {
    page.drawText(caption, { x, y: next - 10, size: 9, font: fonts.timesItalic, color: COLORS.ink2 });
    next -= 18;
  }
  return next;
}

// ---- Section renderers --------------------------------------------------------

function drawCover(page: PDFPage, fonts: Fonts, input: CheckinInput): void {
  const cx = PAGE_W / 2;

  const eyebrow = 'CHECK-IN INSTRUCTIONS';
  const eyebrowW = fonts.helvBold.widthOfTextAtSize(eyebrow, 11);
  page.drawText(eyebrow, {
    x: cx - eyebrowW / 2,
    y: PAGE_H - 200,
    size: 11,
    font: fonts.helvBold,
    color: COLORS.terracotta,
  });

  const title = input.propertyName;
  const titleSize = 36;
  const titleW = fonts.helvBold.widthOfTextAtSize(title, titleSize);
  page.drawText(title, {
    x: cx - titleW / 2,
    y: PAGE_H - 260,
    size: titleSize,
    font: fonts.helvBold,
    color: COLORS.navy,
  });

  page.drawRectangle({
    x: cx - 24,
    y: PAGE_H - 290,
    width: 48,
    height: 2,
    color: COLORS.terracotta,
  });

  if (input.arrivalWindow) {
    const t = `Arrival: ${input.arrivalWindow}`;
    const w = fonts.timesItalic.widthOfTextAtSize(t, 16);
    page.drawText(t, {
      x: cx - w / 2,
      y: PAGE_H - 330,
      size: 16,
      font: fonts.timesItalic,
      color: COLORS.graphite,
    });
  }

  if (input.address) {
    const w = fonts.helv.widthOfTextAtSize(input.address, 12);
    page.drawText(input.address, {
      x: cx - w / 2,
      y: 220,
      size: 12,
      font: fonts.helv,
      color: COLORS.ink2,
    });
  }

  if (input.hostName) {
    const t = `— ${input.hostName}`;
    const w = fonts.helvBold.widthOfTextAtSize(t, 11);
    page.drawText(t, { x: cx - w / 2, y: 195, size: 11, font: fonts.helvBold, color: COLORS.navy });
  }
}

async function drawGettingHere(
  doc: PDFDocument,
  fonts: Fonts,
  input: NonNullable<CheckinInput['parking']>,
  address: string | undefined,
): Promise<PDFPage> {
  const page = doc.addPage([PAGE_W, PAGE_H]);
  await drawHeader(doc, page, { title: 'Getting here', subtitle: 'Address + parking', rule: true });
  let y = PAGE_H - BODY_TOP;

  if (address) {
    page.drawText('ADDRESS', { x: MARGIN_X, y, size: 9, font: fonts.helvBold, color: COLORS.ink2 });
    y -= 16;
    page.drawText(address, { x: MARGIN_X, y, size: 14, font: fonts.helvBold, color: COLORS.navy });
    y -= LINE_H * 1.6;
  }

  page.drawText('PARKING', { x: MARGIN_X, y, size: 9, font: fonts.helvBold, color: COLORS.ink2 });
  y -= 16;
  // word-wrap: very simple — split on \n, then clip each line at ~84 chars.
  for (const raw of input.notes.split('\n')) {
    if (y < 100) break;
    const line = raw.length > 84 ? raw.slice(0, 84) : raw;
    page.drawText(line, { x: MARGIN_X, y, size: 12, font: fonts.helv, color: COLORS.graphite });
    y -= LINE_H;
  }
  y -= 6;

  if (input.photo) {
    const img = await embedImage(doc, input.photo);
    y = drawCaptionedImage(page, img, fonts, input.photo.caption, MARGIN_X, y - 4, PAGE_W - MARGIN_X * 2, 280);
  }
  return page;
}

async function drawGettingIn(
  doc: PDFDocument,
  fonts: Fonts,
  input: NonNullable<CheckinInput['doorAccess']>,
): Promise<PDFPage> {
  const page = doc.addPage([PAGE_W, PAGE_H]);
  await drawHeader(doc, page, { title: 'Getting in', subtitle: 'Door access', rule: true });
  let y = PAGE_H - BODY_TOP;

  if (input.code) {
    page.drawText('DOOR CODE', { x: MARGIN_X, y, size: 9, font: fonts.helvBold, color: COLORS.ink2 });
    y -= 22;
    page.drawText(input.code, { x: MARGIN_X, y, size: 32, font: fonts.courierBold, color: COLORS.navy });
    y -= 36;
  }

  if (input.notes) {
    for (const raw of input.notes.split('\n')) {
      if (y < 120) break;
      const line = raw.length > 84 ? raw.slice(0, 84) : raw;
      page.drawText(line, { x: MARGIN_X, y, size: 12, font: fonts.helv, color: COLORS.graphite });
      y -= LINE_H;
    }
  }
  y -= 8;

  if (input.photo) {
    const img = await embedImage(doc, input.photo);
    y = drawCaptionedImage(page, img, fonts, input.photo.caption, MARGIN_X, y - 4, PAGE_W - MARGIN_X * 2, 320);
  }
  return page;
}

async function drawWifiPage(
  doc: PDFDocument,
  fonts: Fonts,
  input: NonNullable<CheckinInput['wifi']>,
): Promise<PDFPage> {
  const page = doc.addPage([PAGE_W, PAGE_H]);
  await drawHeader(doc, page, { title: 'Wi-Fi', subtitle: 'For the first-night essentials', rule: true });
  const y = PAGE_H - BODY_TOP;

  page.drawRectangle({
    x: MARGIN_X,
    y: y - 110,
    width: PAGE_W - MARGIN_X * 2,
    height: 110,
    borderColor: COLORS.terracotta,
    borderWidth: 1,
    color: COLORS.parchment,
  });
  page.drawText('NETWORK',  { x: MARGIN_X + 16, y: y - 28, size: 9,  font: fonts.helvBold,    color: COLORS.ink2 });
  page.drawText(input.ssid, { x: MARGIN_X + 16, y: y - 50, size: 18, font: fonts.courierBold, color: COLORS.navy });
  page.drawText('PASSWORD', { x: MARGIN_X + 16, y: y - 74, size: 9,  font: fonts.helvBold,    color: COLORS.ink2 });
  page.drawText(input.password, { x: MARGIN_X + 16, y: y - 96, size: 18, font: fonts.courierBold, color: COLORS.navy });
  return page;
}

async function drawFirstNight(
  doc: PDFDocument,
  fonts: Fonts,
  items: string[],
): Promise<PDFPage> {
  const page = doc.addPage([PAGE_W, PAGE_H]);
  await drawHeader(doc, page, { title: 'First-night basics', subtitle: 'Quick orientation', rule: true });
  let y = PAGE_H - BODY_TOP;

  items.forEach((item, i) => {
    if (y < 80) return;
    page.drawText(`${i + 1}.`, { x: MARGIN_X, y, size: 12, font: fonts.helvBold, color: COLORS.terracotta });
    page.drawText(item.length > 84 ? item.slice(0, 84) : item, {
      x: MARGIN_X + 22,
      y,
      size: 12,
      font: fonts.helv,
      color: COLORS.graphite,
    });
    y -= LINE_H * 1.4;
  });
  return page;
}

async function drawEmergency(
  doc: PDFDocument,
  fonts: Fonts,
  input: NonNullable<CheckinInput['emergency']>,
): Promise<PDFPage> {
  const page = doc.addPage([PAGE_W, PAGE_H]);
  await drawHeader(doc, page, { title: 'Emergency', subtitle: 'If something goes wrong', rule: true });
  let y = PAGE_H - BODY_TOP;

  const rows: Array<[string, string | undefined]> = [
    ['Host',             input.hostPhone ? formatPhone(input.hostPhone) : undefined],
    ['Nearest hospital', input.nearestHospital],
    ['Police',           input.police ?? '911'],
  ];

  for (const [label, value] of rows) {
    if (!value) continue;
    page.drawText(label.toUpperCase(), { x: MARGIN_X, y, size: 9, font: fonts.helvBold, color: COLORS.ink2 });
    y -= 16;
    page.drawText(value, { x: MARGIN_X, y, size: 14, font: fonts.helvBold, color: COLORS.navy });
    y -= LINE_H * 1.6;
  }
  return page;
}

// ---- Top-level builder --------------------------------------------------------

export async function buildCheckinPdf(input: CheckinInput): Promise<Uint8Array> {
  const { propertyName, brandFooter = true } = input;

  const doc = await createBaseDoc({
    title: `Check-in — ${propertyName}`,
    subject: 'Arrival instructions for short-term rental guests',
    keywords: ['airbnb', 'check-in', 'arrival', 'instructions', propertyName],
  });

  const fonts = await embedFonts(doc);
  const footerOpts = { brandFooter };

  // Cover (always)
  const cover = doc.addPage([PAGE_W, PAGE_H]);
  drawCover(cover, fonts, input);
  drawFooter(cover, footerOpts);

  if (input.parking || input.address) {
    const p = await drawGettingHere(doc, fonts, input.parking ?? { notes: '' }, input.address);
    drawFooter(p, footerOpts);
  }

  if (input.doorAccess && (input.doorAccess.code || input.doorAccess.notes || input.doorAccess.photo)) {
    const p = await drawGettingIn(doc, fonts, input.doorAccess);
    drawFooter(p, footerOpts);
  }

  if (input.wifi) {
    const p = await drawWifiPage(doc, fonts, input.wifi);
    drawFooter(p, footerOpts);
  }

  if (input.firstNight && input.firstNight.length > 0) {
    const p = await drawFirstNight(doc, fonts, input.firstNight);
    drawFooter(p, footerOpts);
  }

  if (input.emergency) {
    const p = await drawEmergency(doc, fonts, input.emergency);
    drawFooter(p, footerOpts);
  }

  return doc.save();
}
