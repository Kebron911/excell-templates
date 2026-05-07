/**
 * PDF library — base template factory for strops.tools printable docs.
 *
 * Phase 2 tools 11 (cleaner dispatch) and 16 (maintenance schedule) extend
 * this — call `createBasePdf({ title, subtitle })` to get a single-page PDF
 * with branded header (wordmark + tagline), footer (URL + page number), and
 * "Generated YYYY-MM-DD" stamp; then add additional content as needed.
 *
 * Color choices come from the strops.tools brand tokens:
 *   - ops-utility green-gray accent (#5A7359)
 *   - navy (#12304E) for headings
 *   - graphite (#2B2B2B) for body
 * pdf-lib expects RGB 0–1; equivalents are precomputed below.
 *
 * Restraint matters here — these PDFs end up taped to laundry-room walls and
 * stuffed in property binders. Branded but understated.
 */

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export const BRAND = {
  siteUrl: 'strops.tools',
  author: 'strops.tools',
  producer: 'strops.tools (pdf-lib)',
  creator: 'strops.tools',
  tagline: 'Free tools for active short-term rental operators.',
} as const;

export const COLORS = {
  navy:     rgb(0.071, 0.188, 0.306),  // #12304E
  accent:   rgb(0.353, 0.451, 0.349),  // #5A7359 ops-utility green-gray
  graphite: rgb(0.169, 0.169, 0.169),  // #2B2B2B
  ink2:     rgb(0.333, 0.314, 0.286),  // #555049
  ink3:     rgb(0.541, 0.506, 0.463),  // #8A8176
  parchment: rgb(0.965, 0.937, 0.886), // #F6EFE2
} as const;

export interface CreateBasePdfOptions {
  /** Document title — drives PDF metadata + header headline. */
  title: string;
  /** Optional smaller line under the title (e.g., property address). */
  subtitle?: string;
  /** Override "Generated YYYY-MM-DD" date string. Default: today (UTC ISO). */
  generatedDate?: string;
  /** Override PDF /Author. Default: 'strops.tools'. */
  author?: string;
  /** Optional /Subject metadata. */
  subject?: string;
  /** Optional /Keywords metadata. */
  keywords?: string[];
}

/**
 * Create a single-page Letter PDF with branded header, footer, and "Generated"
 * stamp. Returns a Uint8Array suitable for browser download.
 *
 * For multi-page documents, Phase 2 tools will adapt: open the doc, draw
 * extra pages, decorate each with `drawHeader`/`drawFooter` (exposed below),
 * and call `doc.save()`.
 */
export async function createBasePdf(opts: CreateBasePdfOptions): Promise<Uint8Array> {
  const {
    title,
    subtitle,
    generatedDate = new Date().toISOString().slice(0, 10),
    author = BRAND.author,
    subject,
    keywords,
  } = opts;

  const doc = await PDFDocument.create();

  // Metadata first (before pages, so it's set when downstream tools add pages).
  doc.setTitle(title);
  doc.setAuthor(author);
  doc.setProducer(BRAND.producer);
  doc.setCreator(BRAND.creator);
  if (subject) doc.setSubject(subject);
  if (keywords && keywords.length > 0) doc.setKeywords(keywords);
  doc.setCreationDate(new Date());
  doc.setModificationDate(new Date());

  // Letter page (612 × 792 pt).
  const page = doc.addPage([612, 792]);

  await drawHeader(doc, page, { title, subtitle });
  drawFooter(doc, page, { generatedDate, pageNumber: 1, totalPages: 1 });

  return await doc.save();
}

export interface DrawHeaderOptions {
  title: string;
  subtitle?: string;
}

/**
 * Draw the strops brand header on `page`. Wordmark "STR Ops·tools" in
 * the top-left, document title below, optional subtitle, accent rule.
 */
export async function drawHeader(
  doc: PDFDocument,
  page: ReturnType<PDFDocument['addPage']>,
  opts: DrawHeaderOptions,
): Promise<void> {
  const helvBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const helv = await doc.embedFont(StandardFonts.Helvetica);
  const helvOblique = await doc.embedFont(StandardFonts.HelveticaOblique);

  const { width, height } = page.getSize();
  const marginX = 48;

  // Wordmark — top-left. "STR Ops" in accent, ".tools" muted graphite.
  const wordmarkY = height - 48;
  const wordmark = 'STR Ops';
  const wordmarkSize = 18;
  const wordmarkWidth = helvBold.widthOfTextAtSize(wordmark, wordmarkSize);
  page.drawText(wordmark, {
    x: marginX,
    y: wordmarkY,
    size: wordmarkSize,
    font: helvBold,
    color: COLORS.accent,
  });
  page.drawText('.tools', {
    x: marginX + wordmarkWidth + 2,
    y: wordmarkY,
    size: 9,
    font: helv,
    color: COLORS.ink2,
  });

  // Tagline — top-right. Italic, small, muted.
  const taglineSize = 8;
  const taglineWidth = helvOblique.widthOfTextAtSize(BRAND.tagline, taglineSize);
  page.drawText(BRAND.tagline, {
    x: width - marginX - taglineWidth,
    y: wordmarkY + 4,
    size: taglineSize,
    font: helvOblique,
    color: COLORS.ink3,
  });

  // Document title — below wordmark.
  const titleY = wordmarkY - 32;
  page.drawText(opts.title, {
    x: marginX,
    y: titleY,
    size: 22,
    font: helvBold,
    color: COLORS.navy,
  });

  // Subtitle — below title, optional.
  let nextY = titleY - 18;
  if (opts.subtitle) {
    page.drawText(opts.subtitle, {
      x: marginX,
      y: nextY,
      size: 11,
      font: helv,
      color: COLORS.ink2,
    });
    nextY -= 14;
  }

  // Accent rule — short ops-utility green line below the title block.
  page.drawRectangle({
    x: marginX,
    y: nextY - 6,
    width: 48,
    height: 1,
    color: COLORS.accent,
  });
}

export interface DrawFooterOptions {
  /** Override "Generated YYYY-MM-DD" date. Default: today (UTC ISO). */
  generatedDate?: string;
  /** Default: 1. */
  pageNumber?: number;
  /** Default: 1. */
  totalPages?: number;
}

/**
 * Draw the strops brand footer: site URL on the left, page number on the
 * right, "Generated YYYY-MM-DD" stamp centered. Subtle, ops-utility, fits the
 * "operator's reference doc" tone — no marketing copy in the footer.
 */
export function drawFooter(
  doc: PDFDocument,
  page: ReturnType<PDFDocument['addPage']>,
  opts: DrawFooterOptions = {},
): void {
  const {
    generatedDate = new Date().toISOString().slice(0, 10),
    pageNumber = 1,
    totalPages = 1,
  } = opts;

  const helv = doc.embedStandardFont(StandardFonts.Helvetica);
  const { width } = page.getSize();
  const marginX = 48;
  const footerY = 28;
  const size = 9;

  // Left: site URL.
  page.drawText(BRAND.siteUrl, {
    x: marginX,
    y: footerY,
    size,
    font: helv,
    color: COLORS.ink2,
  });

  // Center: "Generated YYYY-MM-DD".
  const gen = `Generated ${generatedDate}`;
  const genWidth = helv.widthOfTextAtSize(gen, size);
  page.drawText(gen, {
    x: (width - genWidth) / 2,
    y: footerY,
    size,
    font: helv,
    color: COLORS.ink3,
  });

  // Right: page X of Y.
  const pageStr = `Page ${pageNumber} of ${totalPages}`;
  const pageWidth = helv.widthOfTextAtSize(pageStr, size);
  page.drawText(pageStr, {
    x: width - marginX - pageWidth,
    y: footerY,
    size,
    font: helv,
    color: COLORS.ink2,
  });
}
