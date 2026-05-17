/**
 * Tier-1 scraper: native fetch + cheerio.
 * Handles ~80% of static municipal-code pages cheaply.
 *
 * Caller is responsible for falling through to tier 2 (Playwright) on
 * ScrapeError. This module makes NO retries — orchestrator owns retry policy.
 */
import { createHash } from 'node:crypto';
import * as cheerio from 'cheerio';
import { ScrapeError, type ScrapeOptions, type ScrapeResult } from './types';

const DEFAULT_UA =
  'Mozilla/5.0 (compatible; STRLawsBot/1.0; +https://strlaws.com/legal/sources)';
const DEFAULT_TIMEOUT_MS = 15_000;

export function sha256Hex(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

/**
 * Strip boilerplate (scripts, styles, nav, footer) and collapse whitespace.
 * Exported for testing.
 */
export function cleanHtml(html: string): { text: string; title: string | null } {
  const $ = cheerio.load(html);
  const title = $('title').first().text().trim() || null;

  $('script, style, noscript, svg, iframe, link, meta, header nav, footer, aside').remove();

  const text = $('body').text() || $.root().text();
  const normalized = text
    .replace(/ /g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return { text: normalized, title };
}

export async function scrapeWithFetch(
  url: string,
  options: ScrapeOptions = {},
): Promise<ScrapeResult> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const failOnNon2xx = options.failOnNon2xx ?? true;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': options.userAgent ?? DEFAULT_UA,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
  } catch (err) {
    clearTimeout(timer);
    throw new ScrapeError(`fetch failed: ${(err as Error).message}`, 'fetch_cheerio', err);
  }
  clearTimeout(timer);

  if (failOnNon2xx && (response.status < 200 || response.status >= 300)) {
    throw new ScrapeError(`HTTP ${response.status} on ${url}`, 'fetch_cheerio');
  }

  const contentType = response.headers.get('content-type');
  const body = await response.text();

  const isHtml = !contentType || contentType.includes('text/html') || contentType.includes('xml');
  const { text, title } = isHtml ? cleanHtml(body) : { text: body.trim(), title: null };

  return {
    url,
    tier: 'fetch_cheerio',
    status: response.status,
    contentType,
    text,
    html: isHtml ? body : null,
    hash: sha256Hex(text),
    title,
    scrapedAt: new Date().toISOString(),
  };
}
