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
