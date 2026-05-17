import { describe, expect, it } from "vitest";
import { BrandNotFoundError, N8nImageError, PinforgeError, ValidationError } from "../../src/errors.js";

describe("PinforgeError hierarchy", () => {
  it("ValidationError is non-retryable", () => {
    const e = new ValidationError("bad input", { field: "topic" });
    expect(e).toBeInstanceOf(PinforgeError);
    expect(e.code).toBe("VALIDATION");
    expect(e.retryable).toBe(false);
    expect(e.context).toEqual({ field: "topic" });
  });

  it("N8nImageError is retryable", () => {
    const e = new N8nImageError("timeout");
    expect(e.code).toBe("N8N_IMAGE_FAILED");
    expect(e.retryable).toBe(true);
  });

  it("BrandNotFoundError surfaces availableBrands", () => {
    const e = new BrandNotFoundError("strguests", ["excel-templates"]);
    expect(e.context.availableBrands).toEqual(["excel-templates"]);
  });
});
