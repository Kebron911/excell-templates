import { describe, it, expect } from 'vitest';
import { canonical, ogImageFor } from '../src/meta';
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
  url: { canonical: 'https://strguests.tools' },
  emailGate: { listId: 'guests-main', welcomeSubject: 'Welcome' },
  analytics: {},
  nav: [],
  footer: { sections: [] },
};

const buyersSite: SiteConfig = {
  ...fixtureSite,
  siteId: 'buyers',
  url: { canonical: 'https://strbuyers.tools' },
  brand: { ...fixtureSite.brand, name: 'STR Buyers Tools' },
};

describe('canonical()', () => {
  it('root path returns site root with trailing slash', () => {
    expect(canonical(fixtureSite, '/')).toBe('https://strguests.tools/');
  });

  it('non-root path gets trailing slash appended', () => {
    expect(canonical(fixtureSite, '/about')).toBe('https://strguests.tools/about/');
  });

  it('path already with trailing slash is not double-slashed', () => {
    expect(canonical(fixtureSite, '/about/')).toBe('https://strguests.tools/about/');
  });

  it('path without leading slash is normalized', () => {
    expect(canonical(fixtureSite, 'about')).toBe('https://strguests.tools/about/');
  });

  it('empty string is treated as root', () => {
    expect(canonical(fixtureSite, '')).toBe('https://strguests.tools/');
  });

  it('uses the correct site URL for buyers', () => {
    expect(canonical(buyersSite, '/dscr-loan-calculator')).toBe(
      'https://strbuyers.tools/dscr-loan-calculator/',
    );
  });

  it('strips query string before adding trailing slash, re-appends query', () => {
    const result = canonical(fixtureSite, '/search?q=foo');
    expect(result).toBe('https://strguests.tools/search/?q=foo');
  });

  it('strips hash before adding trailing slash, re-appends hash', () => {
    const result = canonical(fixtureSite, '/page#section');
    expect(result).toBe('https://strguests.tools/page/#section');
  });
});

describe('ogImageFor()', () => {
  it('root path returns og/index.png', () => {
    expect(ogImageFor(fixtureSite, '/')).toBe('https://strguests.tools/og/index.png');
  });

  it('top-level path maps to og/{slug}.png', () => {
    expect(ogImageFor(fixtureSite, '/welcome-book')).toBe(
      'https://strguests.tools/og/welcome-book.png',
    );
  });

  it('uses correct base URL per site', () => {
    expect(ogImageFor(buyersSite, '/dscr-loan-calculator')).toBe(
      'https://strbuyers.tools/og/dscr-loan-calculator.png',
    );
  });

  it('empty path treated as root', () => {
    expect(ogImageFor(fixtureSite, '')).toBe('https://strguests.tools/og/index.png');
  });

  it('city page uses /og/cities/{slug}.png on buyers site', () => {
    expect(ogImageFor(buyersSite, '/cities/austin-tx')).toBe(
      'https://strbuyers.tools/og/cities/austin-tx.png',
    );
  });

  it('city path on guests site uses flat og/{slug}.png (no city special-casing)', () => {
    // guests doesn't have city pages — falls through to generic slug logic
    const result = ogImageFor(fixtureSite, '/cities/austin-tx');
    expect(result).toBe('https://strguests.tools/og/cities-austin-tx.png');
  });
});
