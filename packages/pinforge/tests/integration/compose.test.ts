import { describe, expect, it } from "vitest";
import { composePng } from "../../src/render/compose.js";

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1500"><rect width="100%" height="100%" fill="#0f766e"/></svg>`;

describe("composePng", () => {
  it("produces a 1000x1500 PNG buffer", async () => {
    const buf = await composePng(SVG, { width: 1000, height: 1500 });
    expect(Buffer.isBuffer(buf)).toBe(true);
    expect(buf.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  });
});
