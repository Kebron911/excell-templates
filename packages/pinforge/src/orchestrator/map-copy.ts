import type { SeoCopy } from "../seo/schema.js";
import type { RenderedCopy } from "../templates/types.js";

export function mapSeoToRenderedCopy(seo: SeoCopy, ctaSuffix: string): RenderedCopy {
  const result: RenderedCopy = {
    headline: seo.headline,
    description: seo.description,
    cta: ctaSuffix
  };
  if (seo.items !== undefined) result.items = seo.items;
  if (seo.stat !== undefined) result.stat = seo.stat;
  return result;
}
