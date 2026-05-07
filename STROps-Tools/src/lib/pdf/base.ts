/**
 * PDF library — base document factory and branded header/footer.
 *
 * Tools 11 (cleaner-dispatch) and 16 (maintenance-schedule) build on top of
 * these primitives. Output is designed to live as a printed reference
 * document in operators' physical workflows, so chrome stays restrained.
 *
 *   const doc = await createBaseDoc({ title: 'Cleaner SOP' });
 *   const page = doc.addPage([612, 792]); // Letter
 *   await drawHeader(doc, page, { title: 'Cleaner SOP', subtitle: '123 Main St' });
 *   drawFooter(page);
 *   const bytes = await doc.save();
 *
 * Color choices come from the strops.tools brand tokens:
 *   - moss-gray accent (#5C7560) for the header rule and accents
 *   - navy (#12304E) for headings
 *   - graphite (#2B2B2B) for body text
 * pdf-lib expects RGB 0–1; equivalents are precomputed below.
 */

import { PDFDocument, StandardFonts, rgb, type PDFPage } from 'pdf-lib';
import type { DrawFooterOptions, DrawHeaderOptions, PdfMeta } from './types';

export const COLORS = {
  navy:       rgb(0.071, 0.188, 0.306),
  moss:       rgb(0.361, 0.459, 0.376),
  graphite:   rgb(0.169, 0.169, 0.169),
  ink2:       rgb(0.333, 0.314, 0.286),
  parchment:  rgb(0.965, 0.937, 0.886),
};

export const PRODUCER = 'strops.tools (pdf-lib)';
export const CREATOR = 'strops.tools';
export const DEFAULT_AUTHOR = 'strops.tools';

/**
 * Create a new PDFDocument with strguests metadata applied.
 * No pages are added — caller is responsible for `doc.addPage(...)`.
 */
export async function createBaseDoc(meta: PdfMeta): Promise<PDFDocument> {
  const doc = await PDFDocument.create();

  doc.setTitle(meta.title);
  doc.setAuthor(meta.author ?? DEFAULT_AUTHOR);
  doc.setProducer(PRODUCER);
  doc.setCreator(CREATOR);

  if (meta.subject) doc.setSubject(meta.subject);
  if (meta.keywords && meta.keywords.length > 0) doc.setKeywords(meta.keywords);

  // Setting creation/modification dates explicitly so output is reproducible
  // when desired (tests pass a fixed Date via createBaseDoc().setCreationDate).
  const now = new Date();
  doc.setCreationDate(now);
  doc.setModificationDate(now);

  return doc;
}

/**
 * Draw the strguests brand header on `page`. Renders title + optional subtitle
 * + terracotta rule (1 px). Coordinates are top-left-relative for clarity:
 * pdf-lib's drawText origin is bottom-left, so we compute y from page.height.
 */
export async function drawHeader(
  doc: PDFDocument,
  page: PDFPage,
  opts: DrawHeaderOptions = {},
): Promise<void> {
  const { title, subtitle, rule = true } = opts;
  const titleText = title ?? doc.getTitle() ?? '';

  const helvBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const helv = await doc.embedFont(StandardFonts.Helvetica);

  const { height } = page.getSize();
  const marginX = 48;
  const topY = height - 56;

  page.drawText(titleText, {
    x: marginX,
    y: topY,
    size: 22,
    font: helvBold,
    color: COLORS.navy,
  });

  let nextY = topY - 18;
  if (subtitle) {
    page.drawText(subtitle, {
      x: marginX,
      y: nextY,
      size: 11,
      font: helv,
      color: COLORS.ink2,
    });
    nextY -= 14;
  }

  if (rule) {
    page.drawRectangle({
      x: marginX,
      y: nextY - 6,
      width: 48,
      height: 1,
      color: COLORS.moss,
    });
  }
}

/**
 * Draw the strguests brand footer on `page`. Prints
 * "Generated YYYY-MM-DD • strops.tools" centered near the bottom edge.
 *
 * Uses Helvetica (a StandardFont) so no extra font load is required.
 */
export function drawFooter(page: PDFPage, opts: DrawFooterOptions = {}): void {
  const { brandFooter = true, generatedDate } = opts;
  if (!brandFooter) return;

  const doc = page.doc;
  const font = doc.embedStandardFont(StandardFonts.Helvetica);

  const date = generatedDate ?? new Date().toISOString().slice(0, 10);
  const text = `Generated ${date}  •  strops.tools`;
  const size = 9;
  const textWidth = font.widthOfTextAtSize(text, size);
  const { width } = page.getSize();

  page.drawText(text, {
    x: (width - textWidth) / 2,
    y: 24,
    size,
    font,
    color: COLORS.ink2,
  });
}
