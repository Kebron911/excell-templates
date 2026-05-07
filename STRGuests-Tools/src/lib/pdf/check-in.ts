/**
 * Check-in Instructions PDF generator.
 *
 * Multi-page Letter PDF: arrival summary card, numbered access steps with
 * optional embedded photos (data-URL → pdf-lib embedJpg/embedPng), Wi-Fi
 * + emergency block on the last page.
 *
 * Photos are caller-supplied as data URLs from FileReader.readAsDataURL.
 * Empty/invalid data URLs are silently skipped — generator stays robust
 * during live preview as the host pastes URLs.
 */

import { StandardFonts, type PDFFont, type PDFImage, type PDFPage } from 'pdf-lib';
import { COLORS, createBaseDoc, drawFooter, drawHeader } from './base';

export interface CheckInStep {
  step: string;             // short title, e.g. "Find the lockbox"
  description: string;      // 1–3 sentence detail
  photoDataUrl?: string;    // data:image/(jpeg|png);base64,…
}

export interface CheckInInput {
  propertyName: string;
  address?: string;
  doorCode?: string;
  parkingInstructions?: string;
  hostPhone?: string;
  wifi?: { ssid: string; password: string };
  steps: CheckInStep[];
}

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN_X = 56;
const BODY_TOP = 700;
const BODY_BOTTOM = 80;

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const tentative = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(tentative, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = tentative;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function embedDataUrl(doc: import('pdf-lib').PDFDocument, dataUrl: string): Promise<PDFImage | null> {
  try {
    const match = /^data:image\/(jpeg|jpg|png);base64,(.+)$/i.exec(dataUrl.trim());
    if (!match) return null;
    const fmt = match[1].toLowerCase();
    const base64 = match[2];
    const bytes = base64ToBytes(base64);
    if (fmt === 'png') return await doc.embedPng(bytes);
    return await doc.embedJpg(bytes);
  } catch {
    return null;
  }
}

function base64ToBytes(base64: string): Uint8Array {
  if (typeof globalThis.atob === 'function') {
    const bin = globalThis.atob(base64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  // Node fallback (tests).
  return Uint8Array.from(Buffer.from(base64, 'base64'));
}

export async function buildCheckInPdf(input: CheckInInput): Promise<Uint8Array> {
  const doc = await createBaseDoc({
    title: `Check-in — ${input.propertyName}`,
    subject: 'Guest check-in instructions',
    keywords: ['airbnb', 'check-in', 'arrival', 'short-term rental'],
  });

  const helv = await doc.embedFont(StandardFonts.Helvetica);
  const helvBold = await doc.embedFont(StandardFonts.HelveticaBold);

  // === Cover / summary card ===
  const summary = doc.addPage([PAGE_W, PAGE_H]);
  await drawHeader(doc, summary, {
    title: 'Check-in Instructions',
    subtitle: input.address ? `${input.propertyName} · ${input.address}` : input.propertyName,
  });

  let cardY = 600;
  summary.drawRectangle({
    x: MARGIN_X,
    y: cardY - 200,
    width: PAGE_W - MARGIN_X * 2,
    height: 200,
    color: COLORS.parchment,
    borderColor: COLORS.terracotta,
    borderWidth: 1,
  });

  const innerX = MARGIN_X + 18;
  let innerY = cardY - 28;

  if (input.doorCode) {
    summary.drawText('Door code', { x: innerX, y: innerY, size: 11, font: helvBold, color: COLORS.terracotta });
    innerY -= 22;
    summary.drawText(input.doorCode, { x: innerX, y: innerY, size: 26, font: helvBold, color: COLORS.navy });
    innerY -= 32;
  }
  if (input.parkingInstructions) {
    summary.drawText('Parking', { x: innerX, y: innerY, size: 11, font: helvBold, color: COLORS.terracotta });
    innerY -= 16;
    const lines = wrap(input.parkingInstructions, helv, 11, PAGE_W - MARGIN_X * 2 - 36);
    for (const line of lines) {
      summary.drawText(line, { x: innerX, y: innerY, size: 11, font: helv, color: COLORS.graphite });
      innerY -= 14;
    }
    innerY -= 6;
  }
  if (input.hostPhone) {
    summary.drawText('Host on call', { x: innerX, y: innerY, size: 11, font: helvBold, color: COLORS.terracotta });
    innerY -= 16;
    summary.drawText(input.hostPhone, { x: innerX, y: innerY, size: 14, font: helvBold, color: COLORS.navy });
  }

  drawFooter(summary);

  // === Step pages ===
  let page: PDFPage = doc.addPage([PAGE_W, PAGE_H]);
  await drawHeader(doc, page, { title: 'Arrival steps', subtitle: input.propertyName });
  let cursorY = BODY_TOP;
  let stepNum = 0;

  for (const step of input.steps) {
    stepNum += 1;

    // Embed photo if provided
    let img: PDFImage | null = null;
    if (step.photoDataUrl) img = await embedDataUrl(doc, step.photoDataUrl);

    // Pre-compute layout heights
    const titleHeight = 18;
    const descLines = wrap(step.description, helv, 11, PAGE_W - MARGIN_X * 2 - 36);
    const descHeight = descLines.length * 15;
    const photoHeight = img ? 160 : 0;
    const blockHeight = titleHeight + 10 + descHeight + (photoHeight ? photoHeight + 8 : 0) + 18;

    if (cursorY - blockHeight < BODY_BOTTOM) {
      drawFooter(page);
      page = doc.addPage([PAGE_W, PAGE_H]);
      await drawHeader(doc, page, { title: 'Arrival steps (cont.)', subtitle: input.propertyName });
      cursorY = BODY_TOP;
    }

    page.drawText(`${stepNum}.`, { x: MARGIN_X, y: cursorY - 14, size: 16, font: helvBold, color: COLORS.terracotta });
    page.drawText(step.step, {
      x: MARGIN_X + 30,
      y: cursorY - 14,
      size: 14,
      font: helvBold,
      color: COLORS.navy,
    });
    cursorY -= 30;

    for (const line of descLines) {
      page.drawText(line, { x: MARGIN_X + 30, y: cursorY, size: 11, font: helv, color: COLORS.graphite });
      cursorY -= 15;
    }

    if (img) {
      cursorY -= 6;
      const dims = img.scaleToFit(PAGE_W - MARGIN_X * 2 - 30, photoHeight);
      page.drawImage(img, {
        x: MARGIN_X + 30,
        y: cursorY - dims.height,
        width: dims.width,
        height: dims.height,
      });
      cursorY -= dims.height + 6;
    }

    cursorY -= 12;
  }

  drawFooter(page);

  // === Wi-Fi + tail page ===
  if (input.wifi) {
    const wifiPage = doc.addPage([PAGE_W, PAGE_H]);
    await drawHeader(doc, wifiPage, { title: 'Once you’re in', subtitle: input.propertyName });
    wifiPage.drawText('Wi-Fi', { x: MARGIN_X, y: 660, size: 16, font: helvBold, color: COLORS.navy });
    wifiPage.drawText(`Network: ${input.wifi.ssid}`, { x: MARGIN_X, y: 632, size: 12, font: helv, color: COLORS.graphite });
    wifiPage.drawText(`Password: ${input.wifi.password}`, { x: MARGIN_X, y: 612, size: 12, font: helv, color: COLORS.graphite });
    drawFooter(wifiPage);
  }

  return doc.save();
}
