import type { SiteConfig } from '@str/seo';

export const siteConfig: SiteConfig = {
  siteId: 'host',
  brand: {
    name: 'STR Host Tools',
    wordmark: 'STR Host',
    tagline: 'Free calculators for short-term rental hosts. Built by the team at The STR Ledger.',
    primaryColor: '#1e3a5f', // navy / --brand-navy
    logo: '/brand/logo.svg',
  },
  url: {
    canonical: 'https://strhost.tools',
  },
  analytics: {
    ga4Id: import.meta.env.PUBLIC_GA4_ID,
  },
  nav: [
    { label: 'Fees', href: '/airbnb-fee-calculator' },
    { label: 'Profit', href: '/profit-calculator' },
    { label: 'Cleaning', href: '/cleaning-fee-calculator' },
    { label: 'RevPAR', href: '/revpar-calculator' },
    { label: 'Break-even', href: '/break-even-calculator' },
    { label: 'Co-host', href: '/cohost-split-calculator' },
    { label: 'Tax', href: '/lodging-tax' },
    { label: 'Blog', href: '/blog' },
  ],
  footer: {
    sections: [
      {
        title: 'Calculators',
        links: [
          { label: 'Airbnb fee', href: '/airbnb-fee-calculator' },
          { label: 'Profit', href: '/profit-calculator' },
          { label: 'Cleaning fee', href: '/cleaning-fee-calculator' },
          { label: 'RevPAR', href: '/revpar-calculator' },
          { label: 'Break-even', href: '/break-even-calculator' },
          { label: 'Co-host split', href: '/cohost-split-calculator' },
          { label: 'Lodging tax', href: '/lodging-tax' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Blog', href: '/blog' },
          { label: 'RSS', href: '/feed.xml' },
          { label: 'Free PDF', href: '/get-the-pdf' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy', href: '/privacy' },
          { label: 'Terms', href: '/terms' },
          { label: 'Disclosures', href: '/disclosures' },
        ],
      },
    ],
  },
};
