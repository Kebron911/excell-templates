import type { SiteConfig } from '@str/seo';

export const siteConfig: SiteConfig = {
  siteId: 'guests',
  brand: {
    name: 'STR Guests Tools',
    wordmark: 'strguests.tools',
    tagline: 'Free generators for short-term rental hosts to delight guests.',
    primaryColor: '#c2410c', // terracotta / --accent-500 (orange-700 equivalent)
    logo: '/brand/logo.svg',
  },
  url: {
    canonical: 'https://strguests.tools',
  },
  emailGate: {
    listId: 'guests-main',
    welcomeSubject: 'Your STR Guests Tools download is ready',
  },
  analytics: {
    ga4Id: import.meta.env.PUBLIC_GA4_ID,
  },
  nav: [
    { label: 'Rules', href: '/house-rules-pdf' },
    { label: 'Welcome', href: '/welcome-book' },
    { label: 'Wi-Fi', href: '/wifi-sign' },
    { label: 'Check-in', href: '/check-in-instructions' },
    { label: 'Listing', href: '/listing-description' },
    { label: 'Reviews', href: '/review-response' },
    { label: 'Messages', href: '/guest-messages' },
    { label: 'Blog', href: '/blog' },
  ],
  footer: {
    sections: [
      {
        title: 'Generators',
        links: [
          { label: 'House Rules PDF', href: '/house-rules-pdf' },
          { label: 'Welcome Book', href: '/welcome-book' },
          { label: 'Wi-Fi Sign', href: '/wifi-sign' },
          { label: 'Check-in Instructions', href: '/check-in-instructions' },
          { label: 'Listing Description', href: '/listing-description' },
          { label: 'Review Response', href: '/review-response' },
          { label: 'Guest Messages', href: '/guest-messages' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Blog', href: '/blog' },
          { label: 'RSS', href: '/feed.xml' },
          { label: 'Free templates', href: '/get-the-templates' },
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
