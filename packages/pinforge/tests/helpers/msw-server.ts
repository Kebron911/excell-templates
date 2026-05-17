import { afterAll, afterEach, beforeAll } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { readFileSync } from "node:fs";

const seoResponse = JSON.parse(
  readFileSync(new URL("../fixtures/seo-response.json", import.meta.url), "utf8")
);

export const server = setupServer(
  http.post("https://api.openai.com/v1/chat/completions", () => {
    return HttpResponse.json({
      id: "chatcmpl-test",
      object: "chat.completion",
      created: 1700000000,
      model: "gpt-4o-mini",
      choices: [{
        index: 0,
        message: { role: "assistant", content: JSON.stringify(seoResponse) },
        finish_reason: "stop"
      }],
      usage: { prompt_tokens: 100, completion_tokens: 200, total_tokens: 300 }
    });
  }),
  http.post(/\/webhook\/pin-image$/, () => {
    const tinyPng = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      "base64"
    );
    return new HttpResponse(tinyPng, { status: 200, headers: { "Content-Type": "image/png" } });
  })
);

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
