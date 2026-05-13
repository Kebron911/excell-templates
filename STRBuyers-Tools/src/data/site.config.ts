import type { SiteConfig } from '@str/seo';

export const siteConfig: SiteConfig = {
  siteId: 'buyers',
  brand: {
    name: 'STR Buyers Tools',
    wordmark: 'STR Buyers',
    tagline: 'Free calculators for STR acquisition — DSCR, cash-on-cash, comps, and market scores.',
    primaryColor: '#1e3a5f', // navy / --accent-deep (finance-trust palette)
    logo: '/brand/logo.svg',
  },
  url: {
    canonical: 'https://strbuyers.tools',
  },
  analytics: {
    ga4Id: import.meta.env.PUBLIC_GA4_ID,
  },
  nav: [
    { label: 'DSCR', href: '/dscr-loan-calculator' },
    { label: 'Down pmt', href: '/down-payment-calculator' },
    { label: 'Comps', href: '/comp-analyzer' },
    { label: 'Market', href: '/market-score' },
    { label: 'Cash-on-cash', href: '/cash-on-cash-calculator' },
    { label: 'Year 1 cash', href: '/year-1-cash-needs' },
    { label: 'Furnishing', href: '/furnishing-budget-calculator' },
    { label: 'Blog', href: '/blog' },
  ],
  footer: {
    sections: [
      {
        title: 'Calculators',
        links: [
          { label: 'DSCR loan', href: '/dscr-loan-calculator' },
          { label: 'Down payment', href: '/down-payment-calculator' },
          { label: 'Comp analyzer', href: '/comp-analyzer' },
          { label: 'Market score', href: '/market-score' },
          { label: 'Cash-on-cash', href: '/cash-on-cash-calculator' },
          { label: 'Year 1 cash needs', href: '/year-1-cash-needs' },
          { label: 'Furnishing budget', href: '/furnishing-budget-calculator' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Blog', href: '/blog' },
          { label: 'Markets directory', href: '/cities/' },
          { label: 'Buyer checklist', href: '/get-the-buyer-checklist' },
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
