import type { BrandKit } from "../brand/schema.js";

export interface PinImagePromptInput {
  brand: BrandKit;
  topic: string;
  primaryKeyword: string;
}

export function buildPinImagePrompt(input: PinImagePromptInput): string {
  const { brand, topic, primaryKeyword } = input;
  const style = brand.imageStyle ?? "photographic, natural lighting, professional editorial quality";
  const extraKeywords = (brand.imageKeywords ?? []).join(", ");
  return [
    `Vertical 2:3 composition (portrait orientation, 1000x1500 pixels).`,
    `Top-third focal point. Leave bottom 60% relatively uncluttered for text overlay.`,
    `Subject: ${topic}. Related to: ${primaryKeyword}.${extraKeywords ? ` Visual cues: ${extraKeywords}.` : ""}`,
    `Style: ${style}.`,
    `No text, no watermark, no logos, no UI elements. Just the scene.`
  ].join(" ");
}
