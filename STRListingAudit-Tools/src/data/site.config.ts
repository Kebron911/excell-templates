import type { SiteConfig } from '@str/seo';

export const siteConfig: SiteConfig = {
  siteId: 'audit',
  brand: {
    name: 'Listing Audit Tools',
    wordmark: 'Listing Audit',
    tagline: 'Paste a listing URL — get a 0-100 scorecard and the top 5 fixes in 30 seconds.',
    primaryColor: '#0E7C8C', // diagnostic teal / --accent-500
    logo: '/brand/logo.svg',
  },
  url: {
    canonical: 'https://listingaudit.tools',
  },
  emailGate: {
    listId: 'audit-main',
    welcomeSubject: 'Your full Listing Audit PDF is ready',
  },
  analytics: {
    ga4Id: import.meta.env.PUBLIC_GA4_ID,
  },
  nav: [
    { label: 'Audit a listing', href: '/' },
    { label: 'How it scores', href: '/about' },
    { label: 'Cities', href: '/audit/cities' },
    { label: 'Blog', href: '/blog' },
  ],
  footer: {
    sections: [
      {
        title: 'Audit',
        links: [
          { label: 'Run an audit', href: '/' },
          { label: 'How scoring works', href: '/about' },
          { label: 'City directory', href: '/audit/cities' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Blog', href: '/blog' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy', href: '/privacy' },
          { label: 'Terms', href: '/terms' },
        ],
      },
      {
        title: 'Read',
        links: [
          { label: 'The $50,000 Deduction (book)', href: 'https://thestrledger.com/book' },
        ],
      },
    ],
  },
};
