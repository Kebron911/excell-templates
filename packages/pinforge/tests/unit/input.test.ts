import { describe, expect, it } from "vitest";
import { PinInputSchema } from "../../src/input.js";

describe("PinInputSchema", () => {
  it("accepts minimum valid input", () => {
    const r = PinInputSchema.safeParse({
      brandId: "strguests",
      topic: "house rules",
      primaryKeyword: "airbnb rules",
      destinationUrl: "https://strguests.tools/x"
    });
    expect(r.success).toBe(true);
  });
  it("rejects bad URL", () => {
    expect(PinInputSchema.safeParse({ brandId: "x", topic: "xxx", primaryKeyword: "yy", destinationUrl: "not-a-url" }).success).toBe(false);
  });
  it("requires sourceUrl when inputMode is url", () => {
    expect(PinInputSchema.safeParse({ brandId: "x", topic: "xxx", primaryKeyword: "yy", destinationUrl: "https://x.com/", inputMode: "url" }).success).toBe(false);
    expect(PinInputSchema.safeParse({ brandId: "x", topic: "xxx", primaryKeyword: "yy", destinationUrl: "https://x.com/", inputMode: "url", sourceUrl: "https://blog.com/" }).success).toBe(true);
  });
});
