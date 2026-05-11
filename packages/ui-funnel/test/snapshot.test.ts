import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import EmailCaptureCard from '../src/EmailCaptureCard.astro';
import STRLedgerCTA from '../src/STRLedgerCTA.astro';
import ClusterFunnelBlock from '../src/ClusterFunnelBlock.astro';
import AdSlot from '../src/AdSlot.astro';
import type { SiteConfig } from '@str/seo';

function normalizeForSnapshot(html: string): string {
  // Strip <script type="module" src="..."></script> tags — they embed
  // absolute file paths from the test worktree and aren't portable.
  return html.replace(/<script type="module" src="[^"]*"><\/script>/g, '');
}

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

describe('@str/ui-funnel snapshots', () => {
  it('EmailCaptureCard renders with magnet and endpoint', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(EmailCaptureCard, {
      props: {
        siteConfig: fixtureSite,
        magnet: 'house-rules-pdf',
        endpoint: '/api/email-gate',
        headline: 'Get your free template',
        cta: 'Send it to me',
      },
    });
    expect(html).toContain('house-rules-pdf');
    expect(html).toContain('Get your free template');
    expect(html).toContain('Send it to me');
    expect(html).toContain('/api/email-gate');
    expect(normalizeForSnapshot(html)).toMatchSnapshot();
  });

  it('STRLedgerCTA renders with known tool slug', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(STRLedgerCTA, {
      props: {
        siteConfig: fixtureSite,
        tool: 'house-rules-pdf',
      },
    });
    expect(html).toContain('STR Ledger');
    expect(html).toContain('thestrledger.com');
    expect(html).toContain('house-rules-pdf');
    expect(normalizeForSnapshot(html)).toMatchSnapshot();
  });

  it('STRLedgerCTA renders fallback for unknown tool', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(STRLedgerCTA, {
      props: {
        siteConfig: fixtureSite,
        tool: 'unknown-tool',
      },
    });
    expect(html).toContain('Browse The STR Ledger');
    expect(normalizeForSnapshot(html)).toMatchSnapshot();
  });

  it('ClusterFunnelBlock renders 3 links (excludes current cluster)', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ClusterFunnelBlock, {
      props: {
        siteConfig: fixtureSite,
        currentCluster: 'guest-xp',
      },
    });
    expect(html).toContain('strbuyers.tools');
    expect(html).toContain('strhost.tools');
    expect(html).toContain('strops.tools');
    expect(html).not.toContain('strguests.tools');
    expect(normalizeForSnapshot(html)).toMatchSnapshot();
  });

  it('AdSlot renders placeholder when AdSense not enabled', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(AdSlot, {
      props: {
        siteConfig: fixtureSite,
        location: 'in-content',
      },
    });
    expect(html).toContain('ad-slot');
    expect(html).toContain('in-content');
    expect(normalizeForSnapshot(html)).toMatchSnapshot();
  });
});
