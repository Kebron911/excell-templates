export const VERSION = "0.1.0";

export {
  BrandKitSchema,
  BackgroundTypeSchema,
  ImageTreatmentSchema,
  type BackgroundType,
  type BrandKit,
  type ImageTreatment
} from "./brand/schema.js";

export { loadBrandKit, listBrandIds } from "./brand/kit-loader.js";

export {
  BrandNotFoundError,
  N8nImageError,
  OutputWriteError,
  PinforgeError,
  RenderError,
  SeoLlmError,
  TemplateNotFoundError,
  UnsplashError,
  ValidationError
} from "./errors.js";

export { loadEnv, type PinforgeEnv } from "./env.js";

export { makeSlug, slugify, todayIso, type SlugArgs } from "./slug.js";

export { logger, type PinforgeLogger } from "./logger.js";

export { getTemplate, listTemplateIds, listTemplates } from "./templates/index.js";
export type { PinTemplate, TemplateInput, RenderedCopy, RenderedBackground } from "./templates/types.js";

export { SeoCopySchema, type SeoCopy } from "./seo/schema.js";
export { buildSystemPrompt, buildUserPrompt, type UserPromptInput } from "./seo/prompts.js";
export { OpenAIAdapter, SeoCopyGenerator } from "./seo/openai-adapter.js";
export type { LlmAdapter, LlmAdapterInput, SeoGenerator } from "./seo/adapter.js";
export { withSeoRetry, type RetryOptions } from "./seo/retry.js";

export { buildPinImagePrompt, type PinImagePromptInput } from "./image/prompt.js";
export { fetchPinBackground, type N8nOptions } from "./image/n8n-bridge.js";
export { fetchUnsplash, type UnsplashInput } from "./image/unsplash.js";
export { generateSolidBackground } from "./image/solid.js";
export { resolvePinBackground, type ResolveOptions, type ResolvedBackground, type BackgroundSource } from "./image/fallback.js";
