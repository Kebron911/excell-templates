import { readFile } from "node:fs/promises";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { writePin } from "../../src/output/writer.js";
import type { PinMetadata } from "../../src/input.js";
import { makeTempDir } from "../helpers/temp-output.js";

let dir: string;
let cleanup: () => Promise<void>;
beforeEach(async () => { ({ dir, cleanup } = await makeTempDir()); });
afterEach(async () => { await cleanup(); });

const META: PinMetadata = {
  schema: "pinforge.v1", format: "static", videoSourcePath: null,
  generatedAt: "2026-05-16T21:30:00.000Z", brandId: "strguests", templateId: "big-hook",
  title: "T", description: "D".repeat(160), altText: "Alt text long enough", hashtags: ["#a","#b","#c"],
  boardHint: "B", destinationUrl: "https://x.com/", imagePath: "",
  fallbackUsed: false, backgroundSource: "n8n",
  sourceInputs: { topic: "t", primaryKeyword: "k", inputMode: "topic" }
};

const FAKE_PNG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13]);

describe("writePin", () => {
  it("writes pin.png + pin.json + appends _index.csv", async () => {
    const result = await writePin({ outputDir: dir, slug: "test-pin-1234", date: "2026-05-16", png: FAKE_PNG, metadata: META });
    expect(result.png).toMatch(/2026-05-16[\\/]strguests[\\/]test-pin-1234\.png$/);
    expect(result.json).toMatch(/test-pin-1234\.json$/);
    const pngBytes = await readFile(result.png);
    expect(pngBytes.equals(FAKE_PNG)).toBe(true);
    const json = JSON.parse(await readFile(result.json, "utf8"));
    expect(json.brandId).toBe("strguests");
    expect(json.imagePath).toContain("test-pin-1234.png");
    const index = await readFile(`${dir}/2026-05-16/_index.csv`, "utf8");
    expect(index).toContain("test-pin-1234");
  });

  it("is idempotent — second write replaces in place", async () => {
    await writePin({ outputDir: dir, slug: "x-1234", date: "2026-05-16", png: FAKE_PNG, metadata: META });
    const newPng = Buffer.concat([FAKE_PNG, Buffer.from([0, 0, 0])]);
    await writePin({ outputDir: dir, slug: "x-1234", date: "2026-05-16", png: newPng, metadata: META });
    const written = await readFile(`${dir}/2026-05-16/strguests/x-1234.png`);
    expect(written.equals(newPng)).toBe(true);
  });

  it("rejects slug containing path traversal", async () => {
    await expect(
      writePin({ outputDir: dir, slug: "../evil", date: "2026-05-16", png: FAKE_PNG, metadata: META })
    ).rejects.toThrow(/slug/);
  });

  it("rejects brandId containing path traversal", async () => {
    const bad = { ...META, brandId: "../evil" };
    await expect(
      writePin({ outputDir: dir, slug: "x-1234", date: "2026-05-16", png: FAKE_PNG, metadata: bad })
    ).rejects.toThrow(/brandId/);
  });
});
