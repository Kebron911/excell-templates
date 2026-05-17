import { describe, expect, it } from "vitest";
import { SeoCopySchema } from "../../src/seo/schema.js";

describe("SeoCopySchema", () => {
  it("accepts a complete valid response", () => {
    const ok = {
      headline: "7 House Rules That Stop Bad Reviews",
      pinTitle: "7 House Rules That Stop Bad Airbnb Reviews | STRGuests",
      description: "Tired of guests breaking the rules? These 7 house-rule templates cover noise, pets, parties, and parking — copy and paste into your listing today. Free at strguests.tools.",
      altText: "Coastal vacation rental with bold yellow headline overlay reading '7 House Rules'",
      hashtags: ["#airbnbhost", "#vacationrental", "#strtips"]
    };
    const r = SeoCopySchema.safeParse(ok);
    if (!r.success) console.error(r.error.issues);
    expect(r.success).toBe(true);
  });

  it("rejects headline over 60 chars", () => {
    const bad = { headline: "x".repeat(61), pinTitle: "x", description: "y".repeat(150), altText: "Test alt text describing pin", hashtags: ["#a", "#b", "#c"] };
    expect(SeoCopySchema.safeParse(bad).success).toBe(false);
  });

  it("rejects description shorter than 150 chars", () => {
    const bad = { headline: "x", pinTitle: "x", description: "too short", altText: "Test alt text describing pin", hashtags: ["#a", "#b", "#c"] };
    expect(SeoCopySchema.safeParse(bad).success).toBe(false);
  });

  it("rejects fewer than 3 hashtags", () => {
    const bad = { headline: "x", pinTitle: "x", description: "y".repeat(160), altText: "Test alt text describing pin", hashtags: ["#a", "#b"] };
    expect(SeoCopySchema.safeParse(bad).success).toBe(false);
  });

  it("rejects hashtag without leading #", () => {
    const bad = { headline: "x", pinTitle: "x", description: "y".repeat(160), altText: "Test alt text describing pin", hashtags: ["#a", "bad", "#c"] };
    expect(SeoCopySchema.safeParse(bad).success).toBe(false);
  });

  it("accepts optional items + stat", () => {
    const ok = {
      headline: "5 steps",
      pinTitle: "5 steps to do X",
      description: "y".repeat(160),
      altText: "Test alt text describing pin",
      hashtags: ["#a", "#b", "#c"],
      items: ["one", "two", "three", "four", "five"],
      stat: "73%"
    };
    expect(SeoCopySchema.safeParse(ok).success).toBe(true);
  });
});
