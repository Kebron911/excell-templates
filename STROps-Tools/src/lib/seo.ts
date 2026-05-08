export interface FaqEntry { q: string; a: string; }
export interface HowToStep { name: string; text: string; }

export const orgJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'strops.tools',
  url: 'https://strops.tools',
  sameAs: ['https://thestrledger.com'],
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
