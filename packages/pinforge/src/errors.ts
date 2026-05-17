export abstract class PinforgeError extends Error {
  abstract readonly code: string;
  abstract readonly retryable: boolean;
  readonly context: Record<string, unknown>;
  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message);
    this.name = this.constructor.name;
    this.context = context;
  }
}

export class ValidationError extends PinforgeError {
  readonly code = "VALIDATION";
  readonly retryable = false;
}

export class BrandNotFoundError extends PinforgeError {
  readonly code = "BRAND_NOT_FOUND";
  readonly retryable = false;
  constructor(brandId: string, availableBrands: string[]) {
    super(`No brand kit for '${brandId}'`, { brandId, availableBrands });
  }
}

export class TemplateNotFoundError extends PinforgeError {
  readonly code = "TEMPLATE_NOT_FOUND";
  readonly retryable = false;
}

export class SeoLlmError extends PinforgeError {
  readonly code = "SEO_LLM_FAILED";
  readonly retryable = true;
}

export class N8nImageError extends PinforgeError {
  readonly code = "N8N_IMAGE_FAILED";
  readonly retryable = true;
}

export class UnsplashError extends PinforgeError {
  readonly code = "UNSPLASH_FAILED";
  readonly retryable = true;
}

export class RenderError extends PinforgeError {
  readonly code = "RENDER_FAILED";
  readonly retryable = false;
}

export class OutputWriteError extends PinforgeError {
  readonly code = "OUTPUT_WRITE";
  readonly retryable = true;
}
