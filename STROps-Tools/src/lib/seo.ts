/**
 * STROps seo shim — re-exports shared @str/seo functions under the
 * legacy local names so that all callsites remain unchanged after Phase-3
 * wiring. Internally delegates to @str/seo canonical builders.
 *
 * Kept (not deleted) in Phase 3 because the local API shape differs from
 * the shared API: FAQ {q,a} vs {question,answer}, itemList bare array vs
 * {name,items}, webApplication {url} vs {toolPath}, etc.
 */
import {
  buildOrganization,
  buildWebApplication,
  buildFAQPage,
  buildHowTo,
  buildBreadcrumb,
  buildItemList,
  buildBlogPosting,
} from '@str/seo';
export type { SiteConfig } from '@str/seo';
import { siteConfig } from '@/data/site.config';

// ---------- Organization ----------

export const orgJsonLd = () => buildOrganization(siteConfig);

// ---------- WebApplication ----------
// Local shape: { name, url, description }
// Shared shape: { name, description, toolPath }

export const webApplicationJsonLd = (opts: { name: string; url: string; description: string }) => {
  let toolPath = '/';
  try { toolPath = new URL(opts.url).pathname; } catch { toolPath = opts.url; }
  return buildWebApplication(siteConfig, {
    name: opts.name,
    description: opts.description,
    toolPath,
    applicationCategory: 'BusinessApplication',
  });
};

// ---------- FAQPage ----------
// Local shape: { q, a }[]  →  shared: { question, answer }[]

export interface FaqEntry { q: string; a: string; }

export const faqJsonLd = (faqs: FaqEntry[]) =>
  buildFAQPage(faqs.map(f => ({ question: f.q, answer: f.a })));

// ---------- HowTo ----------
// Shapes match exactly

export interface HowToStep { name: string; text: string; }

export const howToJsonLd = (opts: { name: string; description: string; steps: HowToStep[] }) =>
  buildHowTo(opts);

// ---------- Article (simple, used in about.astro) ----------
// No shared equivalent with this minimal shape — keep local impl

export const articleJsonLd = (opts: {
  headline: string;
  url: string;
  datePublished: string;
  dateModified: string;
}) => ({
  '@context': 'https://schema.org' as const,
  '@type': 'Article',
  headline: opts.headline,
  url: opts.url,
  datePublished: opts.datePublished,
  dateModified: opts.dateModified,
});

// ---------- BlogPosting ----------

export interface BlogPostingOpts {
  headline: string;
  description: string;
  url: string;
  slug?: string;
  image: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  section: string;
  keywords?: string[];
  wordCount?: number;
}

export const blogPostingJsonLd = (opts: BlogPostingOpts) =>
  buildBlogPosting(siteConfig, {
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    image: opts.image,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    authorName: opts.authorName,
    section: opts.section,
    keywords: opts.keywords,
    wordCount: opts.wordCount,
  });

// ---------- Breadcrumb ----------
// Local shape: { name, url }[] — compatible with shared { name, url? }[]

export interface BreadcrumbCrumb { name: string; url: string; }

export const breadcrumbJsonLd = (crumbs: BreadcrumbCrumb[]) =>
  buildBreadcrumb(siteConfig, crumbs);

// ---------- ItemList ----------
// Local shape: { name, url }[]
// Shared shape: buildItemList(siteConfig, { name, items: { name, path }[] })

export interface ItemListEntry { name: string; url: string; }

export const itemListJsonLd = (items: ItemListEntry[]) =>
  buildItemList(siteConfig, {
    name: 'STR Ops Tools directory',
    items: items.map(i => {
      let path = i.url;
      try { path = new URL(i.url).pathname; } catch { /* already a path */ }
      return { name: i.name, path };
    }),
  });
