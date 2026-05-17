import { describe, expect, it } from "vitest";
import { generateSolidBackground } from "../../src/image/solid.js";

describe("generateSolidBackground", () => {
  it("produces a 1000x1500 PNG buffer for a hex color", async () => {
    const buf = await generateSolidBackground("#0f766e");
    expect(Buffer.isBuffer(buf)).toBe(true);
    expect(buf.length).toBeGreaterThan(0);
    expect(buf.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  });
});
