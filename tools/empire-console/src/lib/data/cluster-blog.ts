import { readdir, stat, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import matter from 'gray-matter';
import { paths } from '../paths.js';

export interface BlogPost {
  site: string;
  slug: string;
  title: string;
  description: string | null;
  publishDate: string | null;
  draft: boolean;
  source: string;        // relative path
  mtime: string;
}

export interface ClusterBlogReport {
  posts: BlogPost[];
  bySite: Record<string, BlogPost[]>;
  totals: { total: number; published: number; drafts: number };
}

// Each sister site puts blog posts at src/content/blog/*.md or src/pages/blog/*.md.
// We probe both.
const CANDIDATE_DIRS = [
  'src/content/blog',
  'src/pages/blog',
];

async function discoverBlogPosts(siteId: string, siteDir: string): Promise<BlogPost[]> {
  const out: BlogPost[] = [];
  for (const sub of CANDIDATE_DIRS) {
    const blogDir = join(siteDir, sub);
    let entries;
    try { entries = await readdir(blogDir, { withFileTypes: true }); }
    catch { continue; }
    for (const entry of entries) {
      if (!entry.isFile() || !/\.(md|mdx)$/.test(entry.name)) continue;
      // Skip index pages
      if (/^index\.(md|mdx)$/.test(entry.name)) continue;
      const full = join(blogDir, entry.name);
      const slug = entry.name.replace(/\.(md|mdx)$/, '');
      let raw = '';
      try { raw = await readFile(full, 'utf8'); } catch { continue; }
      let fm: Record<string, unknown> = {};
      try { fm = matter(raw).data as Record<string, unknown>; }
      catch { /* malformed frontmatter — fall back to filename-only */ }
      const st = await stat(full);
      out.push({
        site: siteId,
        slug,
        title: stringOr(fm.title) ?? slug,
        description: stringOr(fm.description) ?? null,
        publishDate: stringOr(fm.publishDate) ?? stringOr(fm.date) ?? stringOr(fm.pubDate),
        draft: Boolean(fm.draft),
        source: full.slice(paths.root.length + 1).replace(/\\/g, '/'),
        mtime: st.mtime.toISOString(),
      });
    }
  }
  return out;
}

function stringOr(v: unknown): string | null {
  if (typeof v === 'string') return v;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return null;
}

export async function readClusterBlog(): Promise<ClusterBlogReport> {
  const allPosts: BlogPost[] = [];
  for (const site of paths.sites) {
    const posts = await discoverBlogPosts(site.id, site.dir);
    allPosts.push(...posts);
  }
  allPosts.sort((a, b) => {
    const aDate = a.publishDate ?? a.mtime;
    const bDate = b.publishDate ?? b.mtime;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  const bySite: Record<string, BlogPost[]> = {};
  for (const p of allPosts) (bySite[p.site] ??= []).push(p);

  return {
    posts: allPosts,
    bySite,
    totals: {
      total: allPosts.length,
      published: allPosts.filter((p) => !p.draft).length,
      drafts: allPosts.filter((p) => p.draft).length,
    },
  };
}
