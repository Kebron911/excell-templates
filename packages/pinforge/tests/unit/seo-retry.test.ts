import { describe, expect, it, vi } from "vitest";
import { SeoLlmError } from "../../src/errors.js";
import { withSeoRetry } from "../../src/seo/retry.js";

describe("withSeoRetry", () => {
  it("returns immediately on success", async () => {
    const fn = vi.fn().mockResolvedValue("ok");
    const result = await withSeoRetry(fn, { delayMs: 1 });
    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries once on SeoLlmError, then succeeds", async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new SeoLlmError("transient"))
      .mockResolvedValueOnce("ok");
    const result = await withSeoRetry(fn, { delayMs: 1 });
    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("gives up after 1 retry", async () => {
    const fn = vi.fn().mockRejectedValue(new SeoLlmError("persistent"));
    await expect(withSeoRetry(fn, { delayMs: 1 })).rejects.toBeInstanceOf(SeoLlmError);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
