export interface FetchHtmlOptions {
  timeoutMs: number;
  maxBytes: number;
}

const USER_AGENT = "PinForge/0.1 (+https://github.com/Kebron911)";
const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);
const HTML_CONTENT_TYPES = ["text/html", "application/xhtml+xml"];

export async function fetchHtml(url: string, opts: FetchHtmlOptions): Promise<string> {
  // Validate protocol
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`Invalid URL — cannot parse: ${url}`);
  }
  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    throw new Error(`Unsupported protocol: ${parsed.protocol}. Only http/https are allowed.`);
  }

  const res = await fetch(url, {
    signal: AbortSignal.timeout(opts.timeoutMs),
    redirect: "follow",
    headers: { "User-Agent": USER_AGENT }
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`);
  }

  // Validate content-type
  const contentType = res.headers.get("content-type") ?? "";
  const isHtml = HTML_CONTENT_TYPES.some((t) => contentType.includes(t));
  if (!isHtml) {
    throw new Error(`Unexpected content-type "${contentType}" — expected text/html or application/xhtml+xml`);
  }

  // Check content-length header first (fast path)
  const clHeader = res.headers.get("content-length");
  if (clHeader !== null) {
    const cl = parseInt(clHeader, 10);
    if (!isNaN(cl) && cl > opts.maxBytes) {
      throw new Error(`Response size ${cl} bytes exceeds maxBytes limit of ${opts.maxBytes}`);
    }
  }

  // Read body and check actual size
  const buffer = await res.arrayBuffer();
  if (buffer.byteLength > opts.maxBytes) {
    throw new Error(`Response size ${buffer.byteLength} bytes exceeds maxBytes limit of ${opts.maxBytes}`);
  }

  return new TextDecoder().decode(buffer);
}
