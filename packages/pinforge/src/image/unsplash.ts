import { UnsplashError } from "../errors.js";

export interface UnsplashInput {
  query: string;
  accessKey: string | undefined;
}

interface SearchResult {
  results: { id: string; urls: { regular: string } }[];
}

export async function fetchUnsplash(input: UnsplashInput): Promise<Buffer> {
  if (!input.accessKey) {
    throw new UnsplashError("UNSPLASH_ACCESS_KEY not configured");
  }
  const searchUrl = `https://api.unsplash.com/search/photos?orientation=portrait&per_page=5&query=${encodeURIComponent(input.query)}`;
  const searchRes = await fetch(searchUrl, {
    headers: { Authorization: `Client-ID ${input.accessKey}` }
  });
  if (!searchRes.ok) {
    throw new UnsplashError(`Unsplash search returned ${searchRes.status}`, { status: searchRes.status });
  }
  const json = (await searchRes.json()) as SearchResult;
  if (json.results.length === 0) {
    throw new UnsplashError("Unsplash returned no results", { query: input.query });
  }
  const pick = json.results[0]!;
  const imgRes = await fetch(pick.urls.regular);
  if (!imgRes.ok) {
    throw new UnsplashError(`Unsplash image download returned ${imgRes.status}`, { url: pick.urls.regular });
  }
  return Buffer.from(await imgRes.arrayBuffer());
}
