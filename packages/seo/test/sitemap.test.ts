import { describe, it, expect } from 'vitest';
import { getSitemapUrls } from '../src/sitemap';
import type { SiteConfig } from '../src/site-config';

const fixtureSite: SiteConfig = {
  siteId: 'guests',
  brand: {
    name: 'STR Guests Tools',
    wordmark: 'STR Guests',
    tagline: 'Free tools for hosts',
    primaryColor: '#000',
    logo: '/logo.svg',
  },
  url: {
    canonical: 'https://strguests.tools',
    sitemap: [
      'https://strguests.tools/',
      'https://strguests.tools/welcome-book/',
      'https://strguests.tools/check-in-instructions/',
    ],
  },
  emailGate: { listId: 'guests-main', welcomeSubject: 'Welcome' },
  analytics: {},
  nav: [],
  footer: { sections: [] },
};

const noSitemapSite: SiteConfig = {
  ...fixtureSite,
  url: { canonical: 'https://strguests.tools' },
};

describe('getSitemapUrls()', () => {
  it('returns sitemap array when defined', () => {
    const urls = getSitemapUrls(fixtureSite);
    expect(urls).toHaveLength(3);
  });

  it('includes the root URL', () => {
    const urls = getSitemapUrls(fixtureSite);
    expect(urls).toContain('https://strguests.tools/');
  });

  it('returns empty array when sitemap not configured', () => {
    expect(getSitemapUrls(noSitemapSite)).toEqual([]);
  });

  it('all entries are strings', () => {
    const urls = getSitemapUrls(fixtureSite);
    urls.forEach(u => expect(typeof u).toBe('string'));
  });

  it('returns a new array (not a reference to internal)', () => {
    const a = getSitemapUrls(fixtureSite);
    const b = getSitemapUrls(fixtureSite);
    expect(a).not.toBe(b);
  });
});
