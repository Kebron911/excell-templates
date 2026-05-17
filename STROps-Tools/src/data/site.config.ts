import type { SiteConfig } from '@str/seo';

export const siteConfig: SiteConfig = {
  siteId: 'ops',
  brand: {
    name: 'STR Ops Tools',
    wordmark: 'STR Ops',
    tagline: 'Free tools for active short-term rental operators.',
    primaryColor: '#1e3a5f', // navy / --accent
    logo: '/brand/logo.svg',
  },
  url: {
    canonical: 'https://strops.tools',
  },
  analytics: {
    ga4Id: import.meta.env.PUBLIC_GA4_ID,
  },
  nav: [
    { label: 'Turnover', href: '/turnover-scheduler' },
    { label: 'Dispatch', href: '/cleaner-dispatch' },
    { label: 'Smart lock', href: '/smart-lock-codes' },
    { label: 'Linen par', href: '/linen-par-calculator' },
    { label: 'Restock', href: '/restock-calculator' },
    { label: 'Damage', href: '/damage-cost-lookup' },
    { label: 'Maintenance', href: '/maintenance-schedule' },
    { label: 'Blog', href: '/blog' },
  ],
  footer: {
    sections: [
      {
        title: 'Tools',
        links: [
          { label: 'Turnover scheduler', href: '/turnover-scheduler' },
          { label: 'Cleaner dispatch', href: '/cleaner-dispatch' },
          { label: 'Smart lock codes', href: '/smart-lock-codes' },
          { label: 'Linen par calculator', href: '/linen-par-calculator' },
          { label: 'Restock calculator', href: '/restock-calculator' },
          { label: 'Damage cost lookup', href: '/damage-cost-lookup' },
          { label: 'Maintenance schedule', href: '/maintenance-schedule' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'Maintenance index', href: '/maintenance/' },
          { label: 'Replacement cost index', href: '/replace/' },
          { label: 'Cleaner SOP', href: '/get-the-cleaner-sop' },
          { label: 'Maintenance checklist', href: '/get-the-maintenance-checklist' },
          { label: 'Supply par sheet', href: '/get-the-supply-par' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'Blog', href: '/blog' },
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'RSS feed', href: '/feed.xml' },
          { label: 'Sitemap', href: '/sitemap-index.xml' },
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
