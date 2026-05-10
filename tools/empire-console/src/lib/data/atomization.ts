import { readdir, stat, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { paths } from '../paths.js';

/**
 * Walks copy/_atomization/ — each top-level folder is a Source Topic.
 * Per the content atomization engine spec, each topic explodes into 11
 * platform artifacts (Etsy, Pinterest, FB, blog, email, etc.).
 */

export interface AtomizationArtifact {
  path: string;       // relative to repo root
  name: string;
  size: number;
  mtime: string;
}

export interface AtomizationTopic {
  slug: string;       // folder name
  path: string;       // relative path
  artifacts: AtomizationArtifact[];
  totalSize: number;
  lastTouched: string | null;
  brief: string | null;   // first 200 chars of any *brief*.md if present
}

export interface AtomizationReport {
  topics: AtomizationTopic[];
  totalArtifacts: number;
  totalTopics: number;
}

const ATOMIZATION_DIR = join(paths.root, 'copy', '_atomization');

export async function readAtomization(): Promise<AtomizationReport> {
  let topicDirs;
  try { topicDirs = await readdir(ATOMIZATION_DIR, { withFileTypes: true }); }
  catch { return { topics: [], totalArtifacts: 0, totalTopics: 0 }; }

  const topics: AtomizationTopic[] = [];
  for (const entry of topicDirs) {
    if (!entry.isDirectory() && !(entry.isFile() && entry.name.endsWith('.md'))) continue;
    if (entry.isFile()) continue; // skip top-level standalone files

    const topicDir = join(ATOMIZATION_DIR, entry.name);
    const artifacts: AtomizationArtifact[] = [];
    let brief: string | null = null;

    async function walk(dir: string) {
      let inner;
      try { inner = await readdir(dir, { withFileTypes: true }); } catch { return; }
      for (const e of inner) {
        const full = join(dir, e.name);
        if (e.isDirectory()) await walk(full);
        else if (e.isFile() && /\.(md|txt|html|png|svg|jpg)$/i.test(e.name)) {
          let st;
          try { st = await stat(full); } catch { continue; }
          artifacts.push({
            path: full.slice(paths.root.length + 1).replace(/\\/g, '/'),
            name: e.name,
            size: st.size,
            mtime: st.mtime.toISOString(),
          });
          if (!brief && /brief/i.test(e.name) && /\.md$/i.test(e.name)) {
            try {
              const raw = await readFile(full, 'utf8');
              brief = raw.replace(/[#*`>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 200);
            } catch { /* skip */ }
          }
        }
      }
    }
    await walk(topicDir);

    if (artifacts.length === 0) continue;

    topics.push({
      slug: entry.name,
      path: topicDir.slice(paths.root.length + 1).replace(/\\/g, '/'),
      artifacts,
      totalSize: artifacts.reduce((s, a) => s + a.size, 0),
      lastTouched: artifacts.length
        ? artifacts.map((a) => a.mtime).sort().slice(-1)[0]
        : null,
      brief,
    });
  }

  topics.sort((a, b) =>
    new Date(b.lastTouched ?? 0).getTime() - new Date(a.lastTouched ?? 0).getTime()
  );

  return {
    topics,
    totalTopics: topics.length,
    totalArtifacts: topics.reduce((s, t) => s + t.artifacts.length, 0),
  };
}
