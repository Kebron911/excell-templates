import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanHtml, scrapeWithFetch, sha256Hex } from '../../server/lib/scrape/fetch-cheerio';
import { ScrapeError, scrapeUrl, TIERS } from '../../server/lib/scrape';

describe('sha256Hex', () => {
  it('produces stable 64-char hex digests', () => {
    const h = sha256Hex('hello');
    expect(h).toMatch(/^[0-9a-f]{64}$/);
    expect(sha256Hex('hello')).toBe(h);
  });

  it('produces different digests for different inputs', () => {
    expect(sha256Hex('a')).not.toBe(sha256Hex('b'));
  });
});

describe('cleanHtml', () => {
  it('extracts the title and strips scripts and styles', () => {
    const html = `<!doctype html><html><head>
      <title>Salt Lake City STR Ordinance</title>
      <style>body { color: red }</style>
      <script>alert('xss')</script>
    </head><body>
      <header><nav>Skip nav</nav></header>
      <main><h1>STR Ordinance</h1><p>Permits required for all short-term rentals.</p></main>
      <footer>Footer junk</footer>
    </body></html>`;
    const { text, title } = cleanHtml(html);
    expect(title).toBe('Salt Lake City STR Ordinance');
    expect(text).toContain('STR Ordinance');
    expect(text).toContain('Permits required');
    expect(text).not.toContain('xss');
    expect(text).not.toContain('color: red');
    expect(text).not.toContain('Footer junk');
  });

  it('collapses whitespace and newlines', () => {
    const html = '<body><p>one</p>\n\n\n\n<p>two</p>     <p>three</p></body>';
    const { text } = cleanHtml(html);
    expect(text).not.toMatch(/\n{3,}/);
    expect(text).not.toMatch(/ {2,}/);
  });

  it('returns null title when no <title> present', () => {
    expect(cleanHtml('<body>hi</body>').title).toBeNull();
  });
});

describe('scrapeWithFetch', () => {
  let fetchSpy: ReturnType<typeof vi.fn>;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    fetchSpy = vi.fn();
    globalThis.fetch = fetchSpy as unknown as typeof fetch;
  });
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  function mockResponse(body: string, init: Partial<Response> & { contentType?: string; status?: number } = {}) {
    return new Response(body, {
      status: init.status ?? 200,
      headers: { 'content-type': init.contentType ?? 'text/html; charset=utf-8' },
    });
  }

  it('returns a ScrapeResult with hash and tier=fetch_cheerio', async () => {
    fetchSpy.mockResolvedValueOnce(mockResponse('<html><title>Hi</title><body>hello</body></html>'));
    const result = await scrapeWithFetch('https://example.com/code');
    expect(result.tier).toBe('fetch_cheerio');
    expect(result.status).toBe(200);
    expect(result.title).toBe('Hi');
    expect(result.text).toContain('hello');
    expect(result.hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('throws ScrapeError on non-2xx by default', async () => {
    fetchSpy.mockResolvedValueOnce(mockResponse('forbidden', { status: 403 }));
    await expect(scrapeWithFetch('https://example.com/x')).rejects.toBeInstanceOf(ScrapeError);
  });

  it('accepts non-2xx when failOnNon2xx=false', async () => {
    fetchSpy.mockResolvedValueOnce(mockResponse('<body>still has content</body>', { status: 403 }));
    const result = await scrapeWithFetch('https://example.com/x', { failOnNon2xx: false });
    expect(result.status).toBe(403);
    expect(result.text).toContain('still has content');
  });

  it('wraps fetch failure as ScrapeError(tier=fetch_cheerio)', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('ECONNREFUSED'));
    await expect(scrapeWithFetch('https://example.com')).rejects.toMatchObject({
      name: 'ScrapeError',
      tier: 'fetch_cheerio',
    });
  });
});

describe('scrapeUrl orchestrator', () => {
  const originalTiers = { ...TIERS };
  afterEach(() => {
    Object.assign(TIERS, originalTiers);
  });

  it('returns result and records single attempt when tier-1 succeeds', async () => {
    TIERS.fetch_cheerio = vi.fn().mockResolvedValue({
      url: 'u',
      tier: 'fetch_cheerio',
      status: 200,
      contentType: 'text/html',
      text: 'ok',
      html: '<html/>',
      hash: 'h',
      title: null,
      scrapedAt: new Date().toISOString(),
    });
    const out = await scrapeUrl('u');
    expect(out.attempts).toEqual(['fetch_cheerio']);
    expect(out.text).toBe('ok');
  });

  it('falls through to next configured tier on failure', async () => {
    TIERS.fetch_cheerio = vi.fn().mockRejectedValue(new ScrapeError('boom', 'fetch_cheerio'));
    TIERS.playwright = vi.fn().mockResolvedValue({
      url: 'u',
      tier: 'playwright',
      status: 200,
      contentType: 'text/html',
      text: 'pw',
      html: null,
      hash: 'h2',
      title: null,
      scrapedAt: new Date().toISOString(),
    });
    const out = await scrapeUrl('u');
    expect(out.attempts).toEqual(['fetch_cheerio', 'playwright']);
    expect(out.tier).toBe('playwright');
  });

  it('throws when every tier fails or is unconfigured', async () => {
    TIERS.fetch_cheerio = vi.fn().mockRejectedValue(new ScrapeError('a', 'fetch_cheerio'));
    TIERS.playwright = null;
    TIERS.firecrawl = null;
    await expect(scrapeUrl('u')).rejects.toBeInstanceOf(ScrapeError);
  });
});
