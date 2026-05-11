import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * `cities` content collection — in-depth MDX analyses for selected markets,
 * keyed by the cities.json slug (e.g. `austin-tx`). When an MDX exists for a
 * city slug, the city page renders the body under "In-depth analysis"; when
 * absent, the page renders an EmailCaptureCard waitlist instead.
 */
const cities = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/cities' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    lastUpdated: z.string(),
    summary: z.string(),
  }),
});

/**
 * `posts` content collection — buyer-side blog posts. Slug = filename
 * without `.mdx`. The 8 slugs originally pre-listed in the sitemap
 * (analyzing-airbnb-comps-before-you-buy, dscr-loan-vs-conventional-for-
 * airbnb, etc.) map 1:1 to filenames here when published.
 */
const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    datePublished: z.string(),
    dateModified: z.string().optional(),
    author: z.string().default('The STR Ledger'),
    category: z.enum(['financing', 'underwriting', 'regulation', 'insurance', 'startup-costs', 'market-selection']),
    keyword: z.string(),
    relatedTools: z.array(z.string()).default([]),
    readMinutes: z.number().int().positive(),
  }),
});

export const collections = { cities, posts };
