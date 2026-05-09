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

export const collections = { cities };
