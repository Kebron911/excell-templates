export interface FetchSheetOptions {
  timeoutMs?: number;
}

/**
 * Fetch a publicly-published Google Sheet as CSV text.
 * Only accepts https:// URLs on docs.google.com.
 */
export async function fetchPublishedSheetCsv(
  url: URL | string,
  opts: FetchSheetOptions = {}
): Promise<string> {
  const parsed = typeof url === "string" ? new URL(url) : url;

  if (parsed.protocol !== "https:") {
    throw new Error("Sheet URL must use https: protocol");
  }

  const host = parsed.hostname.toLowerCase();
  if (host !== "docs.google.com" && !host.endsWith(".docs.google.com")) {
    throw new Error(
      `Sheet URL host must be docs.google.com, got: ${parsed.hostname}`
    );
  }

  const timeoutMs = opts.timeoutMs ?? 15_000;
  const signal = AbortSignal.timeout(timeoutMs);

  const res = await fetch(parsed.toString(), { signal, redirect: "follow" });

  if (!res.ok) {
    throw new Error(
      `Sheet fetch failed with status ${res.status} ${res.statusText}`
    );
  }

  const ct = res.headers.get("content-type") ?? "";
  const acceptable =
    ct.includes("csv") || ct.includes("text/plain") || ct.includes("octet-stream");
  if (!acceptable) {
    throw new Error(
      `Unexpected content-type from sheet URL: ${ct}`
    );
  }

  return res.text();
}
