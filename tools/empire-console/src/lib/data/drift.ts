import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { parse as parseYaml } from 'yaml';
import { paths } from '../paths.js';
import { readAtlas, type AtlasItem } from './atlas.js';

const execAsync = promisify(exec);

/**
 * Three-bucket drift detection between the dashboard's registry view and
 * reality. Surface failures both in CI (scripts/validate-drift.ts) and on
 * the /maintain/drift page.
 *
 * Buckets:
 *   structural — atlas paths that don't resolve, sites with missing repo_path
 *   conventions — required fields missing on SKUs / site yamls
 *   process — files modified in recent git history that the atlas points to
 *              (heuristic: the path is referenced; doesn't prove the entry
 *              is stale, but flags spots to glance at)
 *
 * Severity:
 *   bad  — definite drift, atlas points at something that doesn't exist
 *   warn — recoverable / suspicious, e.g. missing optional convention field
 *   info — process signal (recent touch, no action required)
 */

export type DriftSeverity = 'bad' | 'warn' | 'info';

export interface DriftFinding {
  bucket: 'structural' | 'conventions' | 'process';
  severity: DriftSeverity;
  ref: string;        // identifier for the offender (atlas path, sku id, etc.)
  message: string;
  hint?: string;      // how to fix
}

export interface DriftReport {
  generatedAt: string;
  findings: DriftFinding[];
  totals: {
    structural: { bad: number; warn: number; info: number };
    conventions: { bad: number; warn: number; info: number };
    process: { bad: number; warn: number; info: number };
    bad: number;
    warn: number;
    info: number;
  };
}

const REQUIRED_SITE_FIELDS = ['id', 'name', 'role', 'repo_path', 'domain'] as const;
const REQUIRED_BRIEF_FIELDS = ['Etsy price', 'Own-site price', 'Wave', 'Tier'] as const;

async function fileExists(absPath: string): Promise<boolean> {
  try { await stat(absPath); return true; } catch { return false; }
}

function resolveFromRoot(p: string): string {
  // Atlas paths may be absolute-from-repo (e.g. "ops/atlas.yaml") or include /
  // leading slash. Normalize.
  const clean = p.replace(/^\.\//, '').replace(/^\/+/, '');
  return resolve(paths.root, clean);
}

async function checkStructural(): Promise<DriftFinding[]> {
  const findings: DriftFinding[] = [];

  // 1. ops/atlas.yaml — every yaml|doc|code|runbook|internal path resolves.
  const atlas = await readAtlas();
  for (const sec of atlas.sections) {
    for (const grp of sec.groups) {
      for (const it of grp.items) {
        if (!it.url) continue;
        if (it.status === 'placeholder') continue;
        if (it.kind === 'external') continue;
        if (it.kind === 'internal') continue; // covered by validate-atlas
        // Internal-to-repo path
        const abs = resolveFromRoot(it.url);
        if (!(await fileExists(abs))) {
          findings.push({
            bucket: 'structural',
            severity: 'bad',
            ref: `atlas.yaml → ${sec.label} → ${it.name}`,
            message: `Path does not exist: ${it.url}`,
            hint: it.status ? `Mark as status: placeholder if not yet built` : 'Remove from atlas or restore the file',
          });
        }
      }
    }
  }

  // 2. Per-site atlases — repo_path must point to a real directory.
  try {
    const entries = (await readdir(paths.atlasSites)).filter((f) => f.endsWith('.yaml'));
    for (const file of entries) {
      const raw = await readFile(join(paths.atlasSites, file), 'utf8');
      const data = (parseYaml(raw) ?? {}) as Record<string, unknown>;
      const site = (data.site ?? {}) as Record<string, unknown>;
      const id = String(site.id ?? file.replace(/\.yaml$/, ''));
      const repoPath = typeof site.repo_path === 'string' ? site.repo_path : null;
      if (repoPath) {
        const abs = resolveFromRoot(repoPath);
        if (!(await fileExists(abs))) {
          findings.push({
            bucket: 'structural',
            severity: 'bad',
            ref: `ops/atlas/sites/${file}`,
            message: `repo_path does not exist: ${repoPath}`,
            hint: 'Update repo_path or rename the directory',
          });
        }
      }
      // Each item.url in per-site sections should also resolve.
      const sections = (data.sections ?? []) as Array<Record<string, unknown>>;
      for (const sec of sections) {
        const items = Array.isArray(sec.items)
          ? (sec.items as Array<Record<string, unknown>>)
          : (Array.isArray((sec.groups as Array<Record<string, unknown>> | undefined))
              ? ((sec.groups as Array<Record<string, unknown>>).flatMap((g) => Array.isArray(g.items) ? g.items as Array<Record<string, unknown>> : []))
              : []);
        for (const it of items) {
          const url = typeof it.url === 'string' ? it.url : '';
          const kind = typeof it.kind === 'string' ? it.kind : '';
          const status = typeof it.status === 'string' ? it.status : '';
          if (!url || status === 'placeholder') continue;
          if (kind === 'external' || kind === 'internal') continue;
          if (url.startsWith('http')) continue;
          const abs = resolveFromRoot(url);
          if (!(await fileExists(abs))) {
            findings.push({
              bucket: 'structural',
              severity: 'bad',
              ref: `ops/atlas/sites/${file} → ${id}`,
              message: `Item path missing: ${url}`,
              hint: 'Restore the file or remove the entry',
            });
          }
        }
      }
    }
  } catch { /* directory missing — caught elsewhere */ }

  return findings;
}

async function checkConventions(): Promise<DriftFinding[]> {
  const findings: DriftFinding[] = [];

  // 1. Per-site yamls must have all 5 required fields.
  try {
    const entries = (await readdir(paths.atlasSites)).filter((f) => f.endsWith('.yaml'));
    for (const file of entries) {
      const raw = await readFile(join(paths.atlasSites, file), 'utf8');
      const data = (parseYaml(raw) ?? {}) as Record<string, unknown>;
      const site = (data.site ?? {}) as Record<string, unknown>;
      for (const field of REQUIRED_SITE_FIELDS) {
        if (!site[field] || String(site[field]).trim() === '') {
          findings.push({
            bucket: 'conventions',
            severity: 'warn',
            ref: `ops/atlas/sites/${file}`,
            message: `Missing required site.${field}`,
            hint: `Add site.${field} per the schema in ops/atlas/sites/strguests.yaml`,
          });
        }
      }
    }
  } catch { /* skip */ }

  // 2. Every SKU brief must have the 4 canonical fields in its frontmatter.
  try {
    const briefsDir = join(paths.templates, '_briefs');
    const files = (await readdir(briefsDir)).filter((f) => f.endsWith('.md') && /^[A-Z]{3}-\d{3}/.test(f));
    for (const file of files) {
      const sku = file.match(/^([A-Z]{3}-\d{3})/)?.[1];
      if (!sku) continue;
      const raw = await readFile(join(briefsDir, file), 'utf8');
      const missing: string[] = [];
      for (const field of REQUIRED_BRIEF_FIELDS) {
        const pattern = new RegExp(`\\*\\*${field.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')}:\\*\\*`, 'i');
        if (!pattern.test(raw)) missing.push(field);
      }
      if (missing.length > 0) {
        findings.push({
          bucket: 'conventions',
          severity: missing.length === REQUIRED_BRIEF_FIELDS.length ? 'bad' : 'warn',
          ref: `templates/_briefs/${file}`,
          message: `Missing brief fields: ${missing.join(', ')}`,
          hint: 'Add **<Field>:** <value> lines near the top of the brief',
        });
      }
    }
  } catch { /* skip — briefs may not exist */ }

  // 3. Live SKUs must have VERSION + release-notes.md in their delivery folder.
  try {
    const deliveryDir = join(paths.templates, '_delivery');
    const folders = (await readdir(deliveryDir, { withFileTypes: true }))
      .filter((d) => d.isDirectory() && /^[A-Z]{3}-\d{3}-/.test(d.name));
    for (const folder of folders) {
      const sku = folder.name.match(/^([A-Z]{3}-\d{3})/)?.[1];
      if (!sku) continue;
      const hasVersion = await fileExists(join(deliveryDir, folder.name, 'VERSION'));
      const hasReleaseNotes = await fileExists(join(deliveryDir, folder.name, 'release-notes.md'));
      if (!hasVersion) {
        findings.push({
          bucket: 'conventions',
          severity: 'warn',
          ref: `templates/_delivery/${folder.name}`,
          message: 'Missing VERSION file',
          hint: 'echo "v1.0.0" > templates/_delivery/<folder>/VERSION',
        });
      }
      if (hasVersion && !hasReleaseNotes) {
        findings.push({
          bucket: 'conventions',
          severity: 'info',
          ref: `templates/_delivery/${folder.name}`,
          message: 'VERSION set but no release-notes.md (required to ship updates)',
          hint: 'Add release-notes.md before next release-shipped invocation',
        });
      }
    }
  } catch { /* skip */ }

  return findings;
}

/**
 * Process drift — files touched in recent commits that the dashboard
 * surfaces. Doesn't prove drift, but answers "what changed lately that
 * the registry may need to catch up on?"
 */
async function checkProcess(days = 14): Promise<DriftFinding[]> {
  const findings: DriftFinding[] = [];

  // Build the set of atlas-referenced paths once.
  const tracked = new Set<string>();
  try {
    const atlas = await readAtlas();
    for (const sec of atlas.sections) {
      for (const grp of sec.groups) {
        for (const it of grp.items) {
          if (it.url && !it.url.startsWith('http') && it.kind !== 'internal') {
            tracked.add(it.url.replace(/^\/+/, ''));
          }
        }
      }
    }
  } catch { /* skip */ }

  // Git log of files touched in the last N days.
  try {
    const since = new Date(Date.now() - days * 864e5).toISOString().slice(0, 10);
    const { stdout } = await execAsync(
      `git log --since="${since}" --name-only --pretty=format: -- .`,
      { cwd: paths.root, windowsHide: true, maxBuffer: 4 * 1024 * 1024 },
    );
    const touched = new Set(
      stdout.split('\n').map((l) => l.trim().replace(/\\/g, '/')).filter(Boolean),
    );
    for (const t of touched) {
      // Match if the touched path equals or starts with a tracked atlas path,
      // OR if a tracked path starts with the touched path (e.g. folder edit).
      const hit = [...tracked].find((tp) => t === tp || t.startsWith(tp + '/') || tp.startsWith(t + '/'));
      if (hit) {
        findings.push({
          bucket: 'process',
          severity: 'info',
          ref: t,
          message: `Touched in the last ${days} days · atlas refs ${hit}`,
          hint: 'Confirm the registry entry is still accurate',
        });
      }
    }
  } catch { /* not a git repo or git missing — skip */ }

  return findings;
}

export async function readDrift(opts: { processDays?: number } = {}): Promise<DriftReport> {
  const [structural, conventions, process] = await Promise.all([
    checkStructural(),
    checkConventions(),
    checkProcess(opts.processDays ?? 14),
  ]);
  const findings = [...structural, ...conventions, ...process];

  const tally = (bucket: DriftFinding['bucket']) => ({
    bad:  findings.filter((f) => f.bucket === bucket && f.severity === 'bad').length,
    warn: findings.filter((f) => f.bucket === bucket && f.severity === 'warn').length,
    info: findings.filter((f) => f.bucket === bucket && f.severity === 'info').length,
  });

  return {
    generatedAt: new Date().toISOString(),
    findings,
    totals: {
      structural: tally('structural'),
      conventions: tally('conventions'),
      process: tally('process'),
      bad:  findings.filter((f) => f.severity === 'bad').length,
      warn: findings.filter((f) => f.severity === 'warn').length,
      info: findings.filter((f) => f.severity === 'info').length,
    },
  };
}
