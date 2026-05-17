import type { SeoCopy } from "./schema.js";

export interface LlmAdapterInput {
  systemPrompt: string;
  userPrompt: string;
  model: string;
}

export interface LlmAdapter {
  readonly name: string;
  generateJson(input: LlmAdapterInput): Promise<unknown>;
}

export interface SeoGenerator {
  generate(input: { systemPrompt: string; userPrompt: string }): Promise<SeoCopy>;
}
