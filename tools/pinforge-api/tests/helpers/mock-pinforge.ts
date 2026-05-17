import { vi } from "vitest";
import type { PinResult, PinMetadata } from "@str/pinforge";

export function makeFakePin(overrides: Partial<PinMetadata> = {}): PinResult {
  const meta: PinMetadata = {
    schema: "pinforge.v1",
    format: "static",
    videoSourcePath: null,
    generatedAt: "2026-05-17T00:00:00.000Z",
    brandId: "strguests",
    templateId: "big-hook",
    title: "Mocked title",
    description: "M".repeat(160),
    altText: "Mocked alt text long enough to pass",
    hashtags: ["#a", "#b", "#c"],
    boardHint: "STR Host Tips",
    destinationUrl: "https://strguests.tools/x",
    imagePath: "pins/2026-05-17/strguests/mocked-1234.png",
    fallbackUsed: false,
    backgroundSource: "n8n",
    sourceInputs: { topic: "mocked", primaryKeyword: "mock", inputMode: "topic" },
    ...overrides
  };

  return {
    // Minimal valid PNG header bytes
    pinPng: Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    metadata: meta,
    paths: { png: "/tmp/mocked.png", json: "/tmp/mocked.json" }
  };
}

export function stubGeneratePin(
  impl: (...args: unknown[]) => Promise<PinResult> | PinResult
) {
  return vi.fn(impl);
}
