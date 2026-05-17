import { PinforgeError } from "@str/pinforge";

const CODE_TO_STATUS: Record<string, number> = {
  VALIDATION: 400,
  BRAND_NOT_FOUND: 404,
  TEMPLATE_NOT_FOUND: 404,
  SEO_LLM_FAILED: 502,
  N8N_IMAGE_FAILED: 502,
  UNSPLASH_FAILED: 502,
  RENDER_FAILED: 500,
  OUTPUT_WRITE: 500
};

export interface HttpErrorBody {
  error: { code: string; message: string; context: Record<string, unknown> };
}

export interface HttpError {
  status: number;
  body: HttpErrorBody;
}

export function mapErrorToHttp(err: unknown): HttpError {
  if (err instanceof PinforgeError) {
    return {
      status: CODE_TO_STATUS[err.code] ?? 500,
      body: { error: { code: err.code, message: err.message, context: err.context } }
    };
  }
  return {
    status: 500,
    body: { error: { code: "INTERNAL", message: "Internal server error", context: {} } }
  };
}
