import type { BrandKit } from "../brand/schema.js";
import type { ScrapedContent } from "../scrape/types.js";

export function buildSystemPrompt(brand: BrandKit): string {
  return `You are a Pinterest SEO copywriter for ${brand.displayName} (${brand.domain}).

BRAND VOICE: ${brand.voice}

BRAND KEYWORDS to weave in naturally where they fit: ${brand.seo.keywords.join(", ")}

DISALLOWED TERMS (never use): ${brand.seo.disallowedTerms.join(", ")}

CTA: End the description with this exact phrase (verbatim): "${brand.seo.ctaSuffix}"

OUTPUT FORMAT: respond with valid JSON only — no markdown fences, no commentary. Schema:
{
  "headline": "≤60 chars — fits on the pin overlay, punchy",
  "pinTitle": "≤100 chars — full Pinterest title field, keyword-rich",
  "description": "150-500 chars — keyword-rich, naturally written, ENDS with the CTA above",
  "altText": "10-500 chars — describes the pin image for accessibility, includes the headline",
  "hashtags": ["3-6 items", "lowercase", "no spaces", "must start with #"],
  "items": ["optional — only when templateId is 'listicle' or 'how-to'", "5-7 items, ≤80 chars each"],
  "stat": "optional — only when templateId is 'big-stat', a short percentage/number like '73%'"
}

QUALITY BAR: every line must earn its place. Cut fluff. Short sentences. Concrete.`;
}

export interface UserPromptInput {
  brand: BrandKit;
  topic: string;
  primaryKeyword: string;
  templateId: string;
}

export function buildUserPrompt(input: UserPromptInput): string {
  const { brand, topic, primaryKeyword, templateId } = input;
  const extras: string[] = [];
  if (templateId === "listicle") extras.push("Include `items`: 5-7 short list items that match the headline.");
  if (templateId === "how-to") extras.push("Include `items`: 3-5 step-by-step actions for the how-to.");
  if (templateId === "big-stat") extras.push("Include `stat`: one compelling percentage or number (e.g., '73%').");
  if (templateId === "before-after") extras.push("The headline should describe the transformation; `description` can hint at before/after.");

  return `Write Pinterest SEO copy for ${brand.displayName} (${brand.domain}).

TOPIC: ${topic}
PRIMARY KEYWORD: ${primaryKeyword}
TEMPLATE: ${templateId}
${extras.length ? "\nTEMPLATE-SPECIFIC:\n- " + extras.join("\n- ") : ""}

Respond with JSON matching the schema in the system prompt.`;
}

export interface UrlGroundedUserPromptInput {
  brand: BrandKit;
  scraped: ScrapedContent;
  templateId: string;
}

export function buildUrlGroundedUserPrompt(input: UrlGroundedUserPromptInput): string {
  const { brand, scraped, templateId } = input;
  const extras: string[] = [];
  if (templateId === "listicle") extras.push("Include `items`: 5-7 short list items that match the headline. You can infer them from the source content.");
  if (templateId === "how-to") extras.push("Include `items`: 3-5 step-by-step actions for the how-to.");
  if (templateId === "big-stat") extras.push("Include `stat`: extract one compelling percentage or number from the source, or invent a plausible one.");
  if (templateId === "before-after") extras.push("The headline should describe the transformation; `description` can hint at before/after.");

  return `Write Pinterest SEO copy for ${brand.displayName} (${brand.domain}) — REWRITE the source content below into pin-optimized copy in the brand voice.

DO NOT copy phrases verbatim from the source. Paraphrase. The pin must stand alone.

TEMPLATE: ${templateId}
${extras.length ? "\nTEMPLATE-SPECIFIC:\n- " + extras.join("\n- ") : ""}

--- SOURCE CONTENT (from ${scraped.sourceUrl}) ---
TITLE: ${scraped.title || "(none)"}
H1: ${scraped.h1 || "(none)"}
META DESCRIPTION: ${scraped.metaDescription || "(none)"}
OG TITLE: ${scraped.ogTitle || "(none)"}
OG DESCRIPTION: ${scraped.ogDescription || "(none)"}
BODY EXCERPT: ${scraped.bodySample}
LANGUAGE: ${scraped.lang}
--- END SOURCE ---

Respond with JSON matching the schema in the system prompt. The destinationUrl in the eventual pin metadata will point to the user's chosen URL, NOT necessarily the source URL above.`;
}
