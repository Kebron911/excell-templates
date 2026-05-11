export interface FaqEntry { q: string; a: string; }
export interface HowToStep { name: string; text: string; }

export const orgJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'strops.tools',
  url: 'https://strops.tools',
  sameAs: [
    'https://thestrledger.com',
    'https://strhost.tools',
    'https://strguests.tools',
    'https://strbuyers.tools',
    'https://strmanuals.com',
  ],
});

export const webApplicationJsonLd = (opts: { name: string; url: string; description: string; }) => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: opts.name,
  url: opts.url,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: opts.description,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
});

export const faqJsonLd = (faqs: FaqEntry[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const howToJsonLd = (opts: { name: string; description: string; steps: HowToStep[]; }) => ({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: opts.name,
  description: opts.description,
  step: opts.steps.map((s, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: s.name,
    text: s.text,
  })),
});

export const articleJsonLd = (opts: { headline: string; url: string; datePublished: string; dateModified: string; }) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: opts.headline,
  url: opts.url,
  datePublished: opts.datePublished,
  dateModified: opts.dateModified,
});

export interface BlogPostingOpts {
  headline: string;
  description: string;
  url: string;
  slug: string;
  image: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  section: string;
  keywords?: string[];
  wordCount?: number;
}

export const blogPostingJsonLd = (opts: BlogPostingOpts) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  mainEntityOfPage: { '@type': 'WebPage', '@id': opts.url },
  headline: opts.headline,
  description: opts.description,
  image: opts.image,
  url: opts.url,
  datePublished: opts.datePublished,
  dateModified: opts.dateModified,
  author: {
    '@type': 'Person',
    name: opts.authorName,
    url: 'https://thestrledger.com',
  },
  publisher: {
    '@type': 'Organization',
    name: 'strops.tools',
    url: 'https://strops.tools',
  },
  articleSection: opts.section,
  ...(opts.keywords && opts.keywords.length ? { keywords: opts.keywords.join(', ') } : {}),
  ...(opts.wordCount ? { wordCount: opts.wordCount } : {}),
  inLanguage: 'en-US',
});

export interface BreadcrumbCrumb { name: string; url: string; }
export const breadcrumbJsonLd = (crumbs: BreadcrumbCrumb[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: c.url,
  })),
});
