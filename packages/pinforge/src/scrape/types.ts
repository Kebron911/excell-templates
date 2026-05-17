export interface ScrapedContent {
  /** Original URL the content was fetched from. */
  sourceUrl: string;
  /** Cleaned <title> contents, or empty string. */
  title: string;
  /** First <h1> text, or empty string. */
  h1: string;
  /** <meta name="description"> contents, or empty string. */
  metaDescription: string;
  /** OpenGraph <meta property="og:title">, or empty string. */
  ogTitle: string;
  /** OpenGraph <meta property="og:description">, or empty string. */
  ogDescription: string;
  /** First ≤500 chars of body text (after stripping nav/header/footer/script). */
  bodySample: string;
  /** Detected primary language from <html lang>, defaults to "en". */
  lang: string;
}
