import type { SeoCopy } from "../seo/schema.js";
import type { RenderedCopy } from "../templates/types.js";

export function mapSeoToRenderedCopy(seo: SeoCopy, ctaSuffix: string): RenderedCopy {
  return {
    headline: seo.headline,
    description: seo.description,
    items: seo.items,
    stat: seo.stat,
    cta: ctaSuffix
  };
}
