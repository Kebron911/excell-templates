/**
 * Shared types for the strguests.tools PDF library.
 *
 * The four PDF generators (house rules, welcome book, wifi sign,
 * check-in instructions) all open a base document via `createBaseDoc`,
 * draw their own content, then optionally apply branded header/footer
 * via `drawHeader` / `drawFooter`.
 */

export interface PdfMeta {
  /** PDF /Title metadata. Shown in the OS preview / PDF readers. */
  title: string;
  /** Optional /Author metadata. Defaults to "strguests.tools". */
  author?: string;
  /** Optional /Subject metadata. */
  subject?: string;
  /** Optional /Keywords metadata. */
  keywords?: string[];
}

export interface DrawHeaderOptions {
  /** Headline shown on the page. Falls back to PDF title when absent. */
  title?: string;
  /** Smaller line under the title. Optional. */
  subtitle?: string;
  /** Print the terracotta accent rule below the title. Default: true. */
  rule?: boolean;
}

export interface DrawFooterOptions {
  /**
   * Print the "Generated YYYY-MM-DD • strguests.tools" footer.
   * Default: true. Set false for branded master templates the host edits
   * before printing themselves.
   */
  brandFooter?: boolean;
  /** Override the date string. Default: today, ISO yyyy-mm-dd. */
  generatedDate?: string;
}
