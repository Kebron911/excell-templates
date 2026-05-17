import { describe, expect, it } from "vitest";
import { OpenAIAdapter, SeoCopyGenerator } from "../../src/seo/openai-adapter.js";

describe("OpenAIAdapter (MSW-mocked)", () => {
  it("returns valid SeoCopy from canned response", async () => {
    const adapter = new OpenAIAdapter({ apiKey: "sk-test", model: "gpt-4o-mini" });
    const gen = new SeoCopyGenerator(adapter, "gpt-4o-mini");
    const copy = await gen.generate({
      systemPrompt: "you are a copywriter",
      userPrompt: "write copy for: house rules"
    });
    expect(copy.headline).toBe("7 House Rules That Stop Bad Reviews");
    expect(copy.hashtags).toHaveLength(4);
    expect(copy.description.length).toBeGreaterThanOrEqual(150);
  });
});
