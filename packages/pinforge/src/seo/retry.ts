import { PinforgeError } from "../errors.js";

export interface RetryOptions {
  delayMs?: number;
}

export async function withSeoRetry<T>(fn: () => Promise<T>, opts: RetryOptions = {}): Promise<T> {
  const delayMs = opts.delayMs ?? 2000;
  try {
    return await fn();
  } catch (e) {
    if (e instanceof PinforgeError && e.retryable) {
      await new Promise(r => setTimeout(r, delayMs));
      return await fn();
    }
    throw e;
  }
}
