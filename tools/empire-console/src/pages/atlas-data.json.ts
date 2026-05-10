/**
 * Static endpoint that emits the flattened Atlas data as JSON.
 * Cmd+K palette fetches this once on first open instead of inlining
 * ~15KB of JSON into every page render.
 *
 * Astro routes ending in `.json.ts` are built into `dist/atlas-data.json`
 * at build time — no runtime needed.
 */
import type { APIRoute } from 'astro';
import { readAtlas, flattenForPalette } from '@/lib/data/atlas';

export const GET: APIRoute = async () => {
  const report = await readAtlas();
  const items = flattenForPalette(report);
  return new Response(JSON.stringify(items), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60',
    },
  });
};
