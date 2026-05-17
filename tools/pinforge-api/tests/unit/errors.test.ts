import { describe, expect, it } from "vitest";
import { BrandNotFoundError, N8nImageError, RenderError, ValidationError } from "@str/pinforge";
import { mapErrorToHttp } from "../../src/errors.js";

describe("mapErrorToHttp", () => {
  it("maps ValidationError → 400", () => {
    const r = mapErrorToHttp(new ValidationError("bad input"));
    expect(r.status).toBe(400);
    expect(r.body.error.code).toBe("VALIDATION");
  });

  it("maps BrandNotFoundError → 404", () => {
    const r = mapErrorToHttp(new BrandNotFoundError("x", ["y"]));
    expect(r.status).toBe(404);
    expect(r.body.error.code).toBe("BRAND_NOT_FOUND");
    expect(r.body.error.context["availableBrands"]).toEqual(["y"]);
  });

  it("maps N8nImageError → 502", () => {
    const r = mapErrorToHttp(new N8nImageError("timeout"));
    expect(r.status).toBe(502);
  });

  it("maps RenderError → 500", () => {
    const r = mapErrorToHttp(new RenderError("satori"));
    expect(r.status).toBe(500);
  });

  it("maps unknown Error → 500 with generic body", () => {
    const r = mapErrorToHttp(new Error("plain"));
    expect(r.status).toBe(500);
    expect(r.body.error.code).toBe("INTERNAL");
    expect(r.body.error.message).not.toContain("plain");
  });
});
