import { describe, expect, it } from "vitest";
import { ValidationError } from "../../src/errors.js";
import { validateDestinationDomain } from "../../src/orchestrator/validate-domain.js";

describe("validateDestinationDomain", () => {
  it("accepts URL whose host is in allowedDomains", () => {
    expect(() => validateDestinationDomain("https://strguests.tools/x", ["strguests.tools"])).not.toThrow();
  });
  it("accepts subdomain match", () => {
    expect(() => validateDestinationDomain("https://www.strguests.tools/x", ["strguests.tools"])).not.toThrow();
  });
  it("rejects host not in allowlist", () => {
    expect(() => validateDestinationDomain("https://evil.com/x", ["strguests.tools"])).toThrow(ValidationError);
  });
  it("rejects non-http(s) URL", () => {
    expect(() => validateDestinationDomain("javascript:alert(1)", ["x.com"])).toThrow();
  });
});
