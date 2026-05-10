import { readFile } from 'node:fs/promises';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import { paths } from '../paths.js';

const Item = z.object({
  id: z.string(),
  title: z.string(),
  why: z.string(),
  owner: z.string().optional(),
  status: z.enum(['in-progress', 'blocked', 'committed', 'exploring']),
  blocker: z.string().optional(),
  relates: z.string().optional(),
});
export type RoadmapItem = z.infer<typeof Item>;

const FileSchema = z.object({
  now: z.array(Item).default([]),
  next: z.array(Item).default([]),
  later: z.array(Item).default([]),
});

export interface RoadmapReport {
  now: RoadmapItem[];
  next: RoadmapItem[];
  later: RoadmapItem[];
  blocked: number;
}

export async function readRoadmap(): Promise<RoadmapReport> {
  let raw: string;
  try { raw = await readFile(paths.roadmap, 'utf8'); }
  catch { return { now: [], next: [], later: [], blocked: 0 }; }
  const parsed = FileSchema.parse(parseYaml(raw) ?? {});
  const all = [...parsed.now, ...parsed.next, ...parsed.later];
  return {
    ...parsed,
    blocked: all.filter((i) => i.status === 'blocked').length,
  };
}
