/**
 * Welcome Book PDF builder — Task 12 (Phase 2).
 *
 * Multi-page guidebook. Sections (each optional):
 *   1. Cover                    — large title + tagline + property name
 *   2. Wi-Fi + access codes     — SSID/password tiles + door code
 *   3. Neighborhood favorites   — bulleted list
 *   4. House tips               — numbered tips
 *   5. Emergency contacts       — host + hospital + police
 *
 * One section per page. Sections with no data are skipped entirely.
 * The cover always renders so the PDF is never zero-page.
 */

import { StandardFonts } from 'pdf-lib';
import type { PDFDocument, PDFPage, PDFFont } from 'pdf-lib';
import { createBaseDoc, drawHeader, drawFooter, COLORS } from './base';
import { formatPhone } from '@str/format';

export interface WelcomeBookInput {
  propertyName: string;
  hostName?: string;
  cover: {
    tagline: string;
    heroNote?: string;
  };
  wifi?: {
    ssid: string;
    password: string;
    notes?: string;
  };
  accessCodes?: {
    doorCode?: string;
    garageCode?: string;
    notes?: string;
  };
  neighborhood?: {
    favorites: Array<{ name: string; detail?: string }>;
  };
  houseTips?: string[];
  emergency?: {
    hostPhone?: string;
    nearestHospital?: string;
    police?: string;
    notes?: string;
  };
  /** Drop the strguests.tools footer (for hosts who want a fully unbranded book). */
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
  timesItalic: PDFFont;
}

async function embedFonts(doc: PDFDocument): Promise<Fonts> {
  return {
    helv: await doc.embedFont(StandardFonts.Helvetica),
    helvBold: await doc.embedFont(StandardFonts.HelveticaBold),
    timesItalic: await doc.embedFont(StandardFonts.TimesRomanItalic),
  };
}

function newPage(doc: PDFDocument): PDFPage {
  return doc.addPage([PAGE_W, PAGE_H]);
}

// ---- Section renderers --------------------------------------------------------

function drawCover(page: PDFPage, fonts: Fonts, input: WelcomeBookInput): void {
  // Hero block — centered title, italic tagline, property name plate.
  const centerX = PAGE_W / 2;

  const eyebrow = 'A guidebook for your stay';
  const eyebrowSize = 11;
  const eyebrowWidth = fonts.helv.widthOfTextAtSize(eyebrow, eyebrowSize);
  page.drawText(eyebrow, {
    x: centerX - eyebrowWidth / 2,
    y: PAGE_H - 200,
    size: eyebrowSize,
    font: fonts.helv,
    color: COLORS.terracotta,
  });

  const title = 'Welcome';
  const titleSize = 56;
  const titleWidth = fonts.helvBold.widthOfTextAtSize(title, titleSize);
  page.drawText(title, {
    x: centerX - titleWidth / 2,
    y: PAGE_H - 270,
    size: titleSize,
    font: fonts.helvBold,
    color: COLORS.navy,
  });

  // Terracotta separator
  page.drawRectangle({
    x: centerX - 24,
    y: PAGE_H - 300,
    width: 48,
    height: 2,
    color: COLORS.terracotta,
  });

  const taglineSize = 18;
  const taglineWidth = fonts.timesItalic.widthOfTextAtSize(input.cover.tagline, taglineSize);
  page.drawText(input.cover.tagline, {
    x: centerX - taglineWidth / 2,
    y: PAGE_H - 340,
    size: taglineSize,
    font: fonts.timesItalic,
    color: COLORS.graphite,
  });

  // Property name plate
  const propSize = 14;
  const propText = input.propertyName.toUpperCase();
  const propWidth = fonts.helvBold.widthOfTextAtSize(propText, propSize);
  page.drawText(propText, {
    x: centerX - propWidth / 2,
    y: 200,
    size: propSize,
    font: fonts.helvBold,
    color: COLORS.navy,
  });

  if (input.cover.heroNote) {
    const noteSize = 10;
    const w = fonts.helv.widthOfTextAtSize(input.cover.heroNote, noteSize);
    page.drawText(input.cover.heroNote, {
      x: centerX - w / 2,
      y: 175,
      size: noteSize,
      font: fonts.helv,
      color: COLORS.ink2,
    });
  }

  if (input.hostName) {
    const t = `Hosted by ${input.hostName}`;
    const w = fonts.helv.widthOfTextAtSize(t, 10);
    page.drawText(t, {
      x: centerX - w / 2,
      y: 150,
      size: 10,
      font: fonts.helv,
      color: COLORS.ink2,
    });
  }
}

async function drawWifiPage(
  doc: PDFDocument,
  fonts: Fonts,
  input: NonNullable<WelcomeBookInput['wifi']>,
  access: WelcomeBookInput['accessCodes'],
): Promise<PDFPage> {
  const page = newPage(doc);
  await drawHeader(doc, page, { title: 'Wi-Fi & access', subtitle: 'Connect on arrival', rule: true });

  let y = PAGE_H - BODY_TOP;

  // Wi-Fi tile
  page.drawRectangle({
    x: MARGIN_X,
    y: y - 100,
    width: PAGE_W - MARGIN_X * 2,
    height: 100,
    borderColor: COLORS.terracotta,
    borderWidth: 1,
    color: COLORS.parchment,
  });
  page.drawText('NETWORK', { x: MARGIN_X + 16, y: y - 26, size: 9, font: fonts.helvBold, color: COLORS.ink2 });
  page.drawText(input.ssid,  { x: MARGIN_X + 16, y: y - 46, size: 18, font: fonts.helvBold, color: COLORS.navy });
  page.drawText('PASSWORD', { x: MARGIN_X + 16, y: y - 66, size: 9, font: fonts.helvBold, color: COLORS.ink2 });
  page.drawText(input.password, { x: MARGIN_X + 16, y: y - 86, size: 18, font: fonts.helvBold, color: COLORS.navy });

  y -= 120;
  if (input.notes) {
    page.drawText(input.notes, { x: MARGIN_X, y, size: 10, font: fonts.helv, color: COLORS.ink2 });
    y -= LINE_H;
  }

  if (access) {
    y -= 20;
    page.drawText('Access codes', { x: MARGIN_X, y, size: 14, font: fonts.helvBold, color: COLORS.navy });
    y -= LINE_H;
    if (access.doorCode) {
      page.drawText(`Front door code: ${access.doorCode}`, { x: MARGIN_X, y, size: 12, font: fonts.helv, color: COLORS.graphite });
      y -= LINE_H;
    }
    if (access.garageCode) {
      page.drawText(`Garage code: ${access.garageCode}`, { x: MARGIN_X, y, size: 12, font: fonts.helv, color: COLORS.graphite });
      y -= LINE_H;
    }
    if (access.notes) {
      page.drawText(access.notes, { x: MARGIN_X, y, size: 10, font: fonts.helv, color: COLORS.ink2 });
    }
  }

  return page;
}

async function drawNeighborhoodPage(
  doc: PDFDocument,
  fonts: Fonts,
  fav: NonNullable<WelcomeBookInput['neighborhood']>,
): Promise<PDFPage> {
  const page = newPage(doc);
  await drawHeader(doc, page, { title: 'Neighborhood favorites', subtitle: 'Where the locals go', rule: true });
  let y = PAGE_H - BODY_TOP;

  for (const item of fav.favorites) {
    if (y < 80) break;
    page.drawText(item.name, { x: MARGIN_X, y, size: 13, font: fonts.helvBold, color: COLORS.navy });
    if (item.detail) {
      y -= LINE_H * 0.85;
      page.drawText(item.detail, { x: MARGIN_X + 12, y, size: 11, font: fonts.helv, color: COLORS.ink2 });
    }
    y -= LINE_H * 1.4;
  }
  return page;
}

async function drawHouseTipsPage(
  doc: PDFDocument,
  fonts: Fonts,
  tips: string[],
): Promise<PDFPage> {
  const page = newPage(doc);
  await drawHeader(doc, page, { title: 'House tips', subtitle: 'Little things that make the stay smoother', rule: true });
  let y = PAGE_H - BODY_TOP;

  tips.forEach((tip, i) => {
    if (y < 80) return;
    page.drawText(`${i + 1}.`, { x: MARGIN_X, y, size: 12, font: fonts.helvBold, color: COLORS.terracotta });
    page.drawText(tip, { x: MARGIN_X + 22, y, size: 12, font: fonts.helv, color: COLORS.graphite });
    y -= LINE_H * 1.4;
  });
  return page;
}

async function drawEmergencyPage(
  doc: PDFDocument,
  fonts: Fonts,
  emerg: NonNullable<WelcomeBookInput['emergency']>,
): Promise<PDFPage> {
  const page = newPage(doc);
  await drawHeader(doc, page, { title: 'Emergency', subtitle: 'If something goes wrong', rule: true });
  let y = PAGE_H - BODY_TOP;

  const rows: Array<[string, string | undefined]> = [
    ['Host',             emerg.hostPhone ? formatPhone(emerg.hostPhone) : undefined],
    ['Nearest hospital', emerg.nearestHospital],
    ['Police',           emerg.police ?? '911'],
  ];

  for (const [label, value] of rows) {
    if (!value) continue;
    page.drawText(label.toUpperCase(), { x: MARGIN_X, y, size: 9, font: fonts.helvBold, color: COLORS.ink2 });
    y -= LINE_H * 0.85;
    page.drawText(value, { x: MARGIN_X, y, size: 14, font: fonts.helvBold, color: COLORS.navy });
    y -= LINE_H * 1.6;
  }

  if (emerg.notes) {
    page.drawText(emerg.notes, { x: MARGIN_X, y, size: 11, font: fonts.helv, color: COLORS.graphite });
  }
  return page;
}

// ---- Top-level builder --------------------------------------------------------

export async function buildWelcomeBookPdf(input: WelcomeBookInput): Promise<Uint8Array> {
  const { propertyName, brandFooter = true } = input;

  const doc = await createBaseDoc({
    title: `Welcome Book — ${propertyName}`,
    subject: 'Welcome book for short-term rental guests',
    keywords: ['airbnb', 'welcome book', 'guidebook', propertyName],
  });

  const fonts = await embedFonts(doc);
  const footerOpts = { brandFooter };

  // 1. Cover (always rendered)
  const cover = newPage(doc);
  drawCover(cover, fonts, input);
  drawFooter(cover, footerOpts);

  // 2. Wi-Fi + access codes
  if (input.wifi) {
    const p = await drawWifiPage(doc, fonts, input.wifi, input.accessCodes);
    drawFooter(p, footerOpts);
  } else if (input.accessCodes) {
    // Access without Wi-Fi — still useful, render its own page
    const p = newPage(doc);
    await drawHeader(doc, p, { title: 'Access codes', subtitle: 'On arrival', rule: true });
    let y = PAGE_H - BODY_TOP;
    if (input.accessCodes.doorCode) {
      p.drawText(`Front door code: ${input.accessCodes.doorCode}`, { x: MARGIN_X, y, size: 12, font: fonts.helv, color: COLORS.graphite });
      y -= LINE_H;
    }
    if (input.accessCodes.garageCode) {
      p.drawText(`Garage code: ${input.accessCodes.garageCode}`, { x: MARGIN_X, y, size: 12, font: fonts.helv, color: COLORS.graphite });
    }
    drawFooter(p, footerOpts);
  }

  // 3. Neighborhood
  if (input.neighborhood && input.neighborhood.favorites.length > 0) {
    const p = await drawNeighborhoodPage(doc, fonts, input.neighborhood);
    drawFooter(p, footerOpts);
  }

  // 4. House tips
  if (input.houseTips && input.houseTips.length > 0) {
    const p = await drawHouseTipsPage(doc, fonts, input.houseTips);
    drawFooter(p, footerOpts);
  }

  // 5. Emergency
  if (input.emergency) {
    const p = await drawEmergencyPage(doc, fonts, input.emergency);
    drawFooter(p, footerOpts);
  }

  return doc.save();
}
