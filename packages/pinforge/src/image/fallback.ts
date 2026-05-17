import type { BrandKit } from "../brand/schema.js";
import { logger } from "../logger.js";
import { fetchPinBackground } from "./n8n-bridge.js";
import { generateSolidBackground } from "./solid.js";
import { fetchUnsplash } from "./unsplash.js";

export type BackgroundSource = "n8n" | "unsplash" | "solid";

export interface ResolveOptions {
  n8nBaseUrl: string | undefined;
  n8nKey: string | undefined;
  n8nTimeoutMs: number;
  unsplashKey: string | undefined;
}

export interface ResolvedBackground {
  buffer: Buffer;
  source: BackgroundSource;
  fallbackUsed: boolean;
}

export async function resolvePinBackground(
  input: { brand: BrandKit; topic: string; primaryKeyword: string },
  opts: ResolveOptions
): Promise<ResolvedBackground> {
  if (opts.n8nBaseUrl) {
    try {
      const buf = await fetchPinBackground(input, {
        baseUrl: opts.n8nBaseUrl,
        apiKey: opts.n8nKey,
        timeoutMs: opts.n8nTimeoutMs
      });
      return { buffer: buf, source: "n8n", fallbackUsed: false };
    } catch (e) {
      logger.warn({ err: String(e) }, "n8n image fetch failed, falling back");
    }
  }

  if (opts.unsplashKey) {
    try {
      const query = [input.primaryKeyword, ...(input.brand.imageKeywords ?? [])].join(" ");
      const buf = await fetchUnsplash({ query, accessKey: opts.unsplashKey });
      return { buffer: buf, source: "unsplash", fallbackUsed: true };
    } catch (e) {
      logger.warn({ err: String(e) }, "Unsplash fetch failed, falling back to solid");
    }
  }

  const buf = await generateSolidBackground(input.brand.colors.primaryDark);
  return { buffer: buf, source: "solid", fallbackUsed: true };
}
