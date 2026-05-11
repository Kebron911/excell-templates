import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Header from '../src/Header.astro';
import Footer from '../src/Footer.astro';
import Sidebar from '../src/Sidebar.astro';
import Wordmark from '../src/Wordmark.astro';
import FunnelBand from '../src/FunnelBand.astro';
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
});
