import { extractContent } from "./extractor.js";
import { fetchHtml, type FetchHtmlOptions } from "./fetcher.js";
import type { ScrapedContent } from "./types.js";

export interface ScrapeOptions {
  timeoutMs?: number;
  maxBytes?: number;
}

export async function scrapeUrl(sourceUrl: string, opts: ScrapeOptions = {}): Promise<ScrapedContent> {
  const html = await fetchHtml(sourceUrl, {
    timeoutMs: opts.timeoutMs ?? 15_000,
    maxBytes: opts.maxBytes ?? 2 * 1024 * 1024 // 2 MB cap
  });
  return extractContent(html, sourceUrl);
}

export type { ScrapedContent } from "./types.js";
export { extractContent } from "./extractor.js";
export { fetchHtml, type FetchHtmlOptions } from "./fetcher.js";
