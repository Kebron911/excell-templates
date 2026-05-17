import OpenAI from "openai";
import { SeoLlmError } from "../errors.js";
import type { LlmAdapter, LlmAdapterInput, SeoGenerator } from "./adapter.js";
import { SeoCopySchema, type SeoCopy } from "./schema.js";

export interface OpenAIAdapterOptions {
  apiKey: string;
  model: string;
  client?: OpenAI;
}

export class OpenAIAdapter implements LlmAdapter {
  readonly name = "openai";
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(opts: OpenAIAdapterOptions) {
    this.client = opts.client ?? new OpenAI({ apiKey: opts.apiKey });
    this.model = opts.model;
  }

  async generateJson(input: LlmAdapterInput): Promise<unknown> {
    try {
      const res = await this.client.chat.completions.create({
        model: input.model ?? this.model,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: input.systemPrompt },
          { role: "user", content: input.userPrompt }
        ],
        temperature: 0.7
      });
      const content = res.choices[0]?.message?.content;
      if (!content) throw new SeoLlmError("OpenAI returned empty content");
      try {
        return JSON.parse(content);
      } catch (e) {
        throw new SeoLlmError("OpenAI returned invalid JSON", { content, cause: String(e) });
      }
    } catch (e) {
      if (e instanceof SeoLlmError) throw e;
      throw new SeoLlmError(`OpenAI call failed: ${e instanceof Error ? e.message : String(e)}`, { cause: String(e) });
    }
  }
}

export class SeoCopyGenerator implements SeoGenerator {
  constructor(private readonly llm: LlmAdapter, private readonly model: string) {}

  async generate(input: { systemPrompt: string; userPrompt: string }): Promise<SeoCopy> {
    const raw = await this.llm.generateJson({ ...input, model: this.model });
    const parsed = SeoCopySchema.safeParse(raw);
    if (!parsed.success) {
      throw new SeoLlmError("LLM output failed SeoCopy schema", { issues: parsed.error.issues, raw });
    }
    return parsed.data;
  }
}
