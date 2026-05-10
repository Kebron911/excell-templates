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
 * `blog` content collection — long-form supporting MDX. Loaded by
 * src/pages/blog/[...slug].astro and indexed by src/pages/blog/index.astro.
 * Schema mirrors the seo.ts ArticleInput contract so post frontmatter feeds
 * the JSON-LD builder directly.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    datePublished: z.string(),
    dateModified: z.string().optional(),
    category: z.enum([
      'financing',
      'markets',
      'underwriting',
      'operations',
      'regulation',
    ]),
    relatedTool: z.string().optional(),
    affiliateVendors: z.array(z.string()).optional(),
    readingTimeMin: z.number().int().positive(),
    /** 40–60 word direct answer rendered above the fold. Drives AIO /
     * Perplexity citation and featured-snippet eligibility. */
    keyTakeaway: z.string().optional(),
    /** People-Also-Ask seed Q&A. Emitted as FAQPage JSON-LD AND rendered
     * as an on-page <details> section at the bottom of the post. */
    faqs: z
      .array(
        z.object({
          q: z.string(),
          a: z.string(),
        }),
      )
      .optional(),
    /** Inline links to sibling blog post slugs. Rendered as a "Related
     * reading" block above the funnel. */
    relatedPosts: z.array(z.string()).optional(),
  }),
});

export const collections = { cities, blog };
