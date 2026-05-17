import { beforeEach, describe, expect, it } from "vitest";
import { TemplateNotFoundError } from "../../src/errors.js";
import { _resetRegistry, getTemplate, listTemplateIds, registerTemplate } from "../../src/templates/registry.js";
import type { PinTemplate } from "../../src/templates/types.js";

const fake: PinTemplate = {
  id: "fake-test",
  displayName: "Fake",
  supports: ["solid"],
  dimensions: { width: 1000, height: 1500 },
  render: () => null
};

describe("template registry", () => {
  beforeEach(() => { _resetRegistry(); });

  it("registers + retrieves a template", () => {
    registerTemplate(fake);
    expect(getTemplate("fake-test").id).toBe("fake-test");
  });
  it("throws TemplateNotFoundError for unknown id", () => {
    expect(() => getTemplate("nope")).toThrow(TemplateNotFoundError);
  });
  it("listTemplateIds returns sorted ids including registered", () => {
    registerTemplate(fake);
    expect(listTemplateIds()).toContain("fake-test");
  });
});
