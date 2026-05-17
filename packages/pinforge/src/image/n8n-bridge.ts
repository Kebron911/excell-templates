import { N8nImageError } from "../errors.js";
import { buildPinImagePrompt, type PinImagePromptInput } from "./prompt.js";

export interface N8nOptions {
  baseUrl: string | undefined;
  apiKey: string | undefined;
  timeoutMs: number;
}

export async function fetchPinBackground(input: PinImagePromptInput, opts: N8nOptions): Promise<Buffer> {
  if (!opts.baseUrl) {
    throw new N8nImageError("N8N_BASE_URL not configured", { hint: "set N8N_BASE_URL in .env" });
  }
  const prompt = buildPinImagePrompt(input);
  const url = `${opts.baseUrl.replace(/\/+$/, "")}/webhook/pin-image`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(opts.apiKey ? { "X-API-Key": opts.apiKey } : {})
      },
      body: JSON.stringify({
        prompt,
        aspectRatio: "2:3",
        style: input.brand.imageStyle ?? "photographic"
      }),
      signal: AbortSignal.timeout(opts.timeoutMs)
    });
  } catch (e) {
    throw new N8nImageError(`n8n fetch failed: ${e instanceof Error ? e.message : String(e)}`, { url, cause: String(e) });
  }

  if (!response.ok) {
    throw new N8nImageError(`n8n returned ${response.status}`, { url, status: response.status });
  }
  const buf = Buffer.from(await response.arrayBuffer());
  if (buf.length === 0) {
    throw new N8nImageError("n8n returned empty body", { url });
  }
  return buf;
}
