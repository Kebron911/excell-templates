import * as cheerio from "cheerio";
import type { ScrapedContent } from "./types.js";

const BODY_SAMPLE_MAX = 500;

export function extractContent(html: string, sourceUrl: string): ScrapedContent {
  const $ = cheerio.load(html);

  // Strip nav, header, footer, script, style — they pollute body sample
  $("nav, header, footer, script, style, noscript, aside, form, button").remove();

  const title = ($("title").first().text() ?? "").trim();
  const h1 = ($("h1").first().text() ?? "").trim();
  const metaDescription = ($("meta[name='description']").attr("content") ?? "").trim();
  const ogTitle = ($("meta[property='og:title']").attr("content") ?? "").trim();
  const ogDescription = ($("meta[property='og:description']").attr("content") ?? "").trim();

  // Detect language from <html lang>, default "en"
  const lang = ($("html").attr("lang") ?? "en").trim() || "en";

  // bodySample: prefer <article>, fall back to <main>, then <body>
  let bodyEl = $("article").first();
  if (!bodyEl.length) bodyEl = $("main").first();
  if (!bodyEl.length) bodyEl = $("body").first();

  const rawText = (bodyEl.text() ?? "").replace(/\s+/g, " ").trim();
  const bodySample = rawText.slice(0, BODY_SAMPLE_MAX);

  return { sourceUrl, title, h1, metaDescription, ogTitle, ogDescription, bodySample, lang };
}
