import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { BrandNotFoundError } from "../../src/errors.js";
import { listBrandIds, loadBrandKit } from "../../src/brand/kit-loader.js";

const BRANDS_DIR = fileURLToPath(new URL("../../brands/", import.meta.url));

describe("loadBrandKit", () => {
  it("loads + validates strguests.json", async () => {
    const kit = await loadBrandKit("strguests", BRANDS_DIR);
    expect(kit.brandId).toBe("strguests");
    expect(kit.colors.primary).toBe("#0f766e");
  });

  it("throws BrandNotFoundError for unknown brand with availableBrands list", async () => {
    await expect(loadBrandKit("dermmap", BRANDS_DIR)).rejects.toMatchObject({
      code: "BRAND_NOT_FOUND",
      context: expect.objectContaining({ brandId: "dermmap", availableBrands: expect.arrayContaining(["strguests"]) })
    });
  });

  it("rejects path traversal in brandId", async () => {
    await expect(loadBrandKit("../etc/passwd", BRANDS_DIR)).rejects.toThrow();
  });
});

describe("listBrandIds", () => {
  it("returns sorted list of brand JSON files", async () => {
    const ids = await listBrandIds(BRANDS_DIR);
    expect(ids).toContain("strguests");
  });
});
