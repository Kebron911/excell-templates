export type SiteId = 'guests' | 'buyers' | 'host' | 'ops';

export interface NavItem {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: NavItem[];
}

export interface SiteConfig {
  siteId: SiteId;
  brand: {
    name: string;
    wordmark: string;
    tagline: string;
    primaryColor: string;
    logo: string;
  };
  url: {
    canonical: string; // e.g., 'https://strguests.tools'
    sitemap?: string[];
  };
  emailGate?: {
    listId: string;
    welcomeSubject: string;
  };
  analytics: {
    ga4Id?: string;
  };
  nav: NavItem[];
  footer: { sections: FooterSection[] };
}
