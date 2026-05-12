import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Header from '../src/Header.astro';
import Footer from '../src/Footer.astro';
import Sidebar from '../src/Sidebar.astro';
import Wordmark from '../src/Wordmark.astro';
import FunnelBand from '../src/FunnelBand.astro';
import AppSidebar from '../src/AppSidebar.astro';
import type { SiteConfig } from '@str/seo';

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
  nav: [
    { label: 'Templates', href: '/templates' },
    { label: 'Blog', href: '/blog' },
  ],
  footer: {
    sections: [
      {
        title: 'Site',
        links: [{ label: 'Home', href: '/' }],
      },
    ],
  },
};

beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-01-15T12:00:00Z'));
});

afterAll(() => {
  vi.useRealTimers();
});

describe('@str/ui-chrome snapshots', () => {
  it('Header renders with siteConfig nav', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Header, { props: { siteConfig: fixtureSite } });
    expect(html).toContain('STR Guests');
    expect(html).toContain('Templates');
    expect(html).toContain('Blog');
    expect(html).toMatchSnapshot();
  });

  it('Footer renders with siteConfig footer sections', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Footer, { props: { siteConfig: fixtureSite } });
    expect(html).toContain('Site');
    expect(html).toContain('Home');
    expect(html).toMatchSnapshot();
  });

  it('Sidebar renders', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Sidebar, { props: { siteConfig: fixtureSite } });
    expect(html).toMatchSnapshot();
  });

  it('Wordmark renders brand wordmark', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Wordmark, { props: { siteConfig: fixtureSite } });
    expect(html).toContain('STR Guests');
    expect(html).toMatchSnapshot();
  });

  it('FunnelBand renders', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(FunnelBand, { props: { siteConfig: fixtureSite } });
    expect(html).toMatchSnapshot();
  });

  // Layout snapshots are omitted because Layout renders a full html/head/body document
  // which produces large, volatile snapshots. Covered by visual regression tests in Task 7-8.

  it('AppSidebar renders 2-line card when description present', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(AppSidebar, {
      props: {
        siteConfig: fixtureSite,
        items: [
          { slug: 'house-rules', label: 'House Rules', description: 'PDF generator', href: '/house-rules-pdf' },
          { slug: 'wifi-sign', label: 'Wi-Fi Sign', description: 'Print-ready PDF' },
        ],
        current: 'wifi-sign',
      },
    });
    expect(html).toContain('House Rules');
    expect(html).toContain('PDF generator');
    expect(html).not.toContain('Wi-Fi Sign');
    expect(html).toMatchSnapshot();
  });

  it('AppSidebar renders 1-line nav when description absent', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(AppSidebar, {
      props: {
        siteConfig: fixtureSite,
        items: [
          { slug: 'turnover-scheduler', label: 'Turnover scheduler' },
          { slug: 'cleaner-dispatch', label: 'Cleaner dispatch' },
        ],
        current: 'turnover-scheduler',
      },
    });
    expect(html).toContain('Cleaner dispatch');
    expect(html).not.toContain('Turnover scheduler');
    expect(html).toMatchSnapshot();
  });
});
