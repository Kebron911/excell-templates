import { z } from "zod";

export const SeoCopySchema = z.object({
  headline: z.string().min(3).max(60, "headline must be ≤60 chars for pin overlay"),
  pinTitle: z.string().min(3).max(100, "pinTitle must be ≤100 chars for Pinterest"),
  description: z.string().min(150, "description must be ≥150 chars for Pinterest SEO").max(500),
  altText: z.string().min(10).max(500),
  hashtags: z.array(
    z.string().regex(/^#[a-z0-9]+$/i, "hashtag must start with # and be alphanumeric")
  ).min(3).max(6),
  items: z.array(z.string().min(1)).max(7).optional(),
  stat: z.string().max(20).optional()
});

export type SeoCopy = z.infer<typeof SeoCopySchema>;
