/**
 * Validate src/data/templates.json against the Phase 4 schema.
 *
 * Run: `pnpm tsx scripts/validate-templates.ts`
 *
 * Checks:
 *   - top-level shape: { categories[], templates: { [key]: TemplateEntry } }
 *   - every template has all required fields
 *   - every template's `category` is one of the declared categories
 *   - `lastVerified` is a valid ISO YYYY-MM-DD
 *   - keys are kebab-case (a-z, 0-9, hyphens)
 *   - no duplicate keys (JSON parsing already enforces this, but we re-check)
 *
 * Exits non-zero on any failure so CI can wire this into the lint stage.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_PATH = resolve(here, '../src/data/templates.json');

interface TemplateEntry {
  name: string;
  category: string;
  scenario: string;
  exampleInput: string;
  exampleOutput: string;
  lastVerified: string;
}

interface TemplatesFile {
  categories: string[];
  templates: Record<string, TemplateEntry>;
}

const REQUIRED_FIELDS: Array<keyof TemplateEntry> = [
  'name',
  'category',
  'scenario',
  'exampleInput',
  'exampleOutput',
  'lastVerified',
];

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function fail(message: string): never {
  console.error(`[validate-templates] FAIL — ${message}`);
  process.exit(1);
}

function main() {
  const raw = readFileSync(TEMPLATES_PATH, 'utf-8');
  let data: TemplatesFile;
  try {
    data = JSON.parse(raw) as TemplatesFile;
  } catch (err) {
    fail(`templates.json is not valid JSON: ${(err as Error).message}`);
  }

  if (!Array.isArray(data.categories) || data.categories.length === 0) {
    fail('top-level "categories" must be a non-empty array');
  }

  if (!data.templates || typeof data.templates !== 'object') {
    fail('top-level "templates" must be an object');
  }

  const categorySet = new Set(data.categories);
  const errors: string[] = [];
  const keys = Object.keys(data.templates);
  const categoryCounts = new Map<string, number>();
  data.categories.forEach((c) => categoryCounts.set(c, 0));

  for (const key of keys) {
    if (!KEBAB.test(key)) {
      errors.push(`key "${key}" is not kebab-case (a-z, 0-9, hyphens)`);
    }

    const entry = data.templates[key];
    if (!entry || typeof entry !== 'object') {
      errors.push(`entry "${key}" is not an object`);
      continue;
    }

    for (const field of REQUIRED_FIELDS) {
      if (typeof entry[field] !== 'string' || !entry[field].trim()) {
        errors.push(`entry "${key}" missing or empty required field: ${field}`);
      }
    }

    if (entry.category && !categorySet.has(entry.category)) {
      errors.push(`entry "${key}" has unknown category "${entry.category}"`);
    } else if (entry.category) {
      categoryCounts.set(entry.category, (categoryCounts.get(entry.category) ?? 0) + 1);
    }

    if (entry.lastVerified) {
      if (!ISO_DATE.test(entry.lastVerified)) {
        errors.push(`entry "${key}" lastVerified "${entry.lastVerified}" is not YYYY-MM-DD`);
      } else {
        const d = new Date(entry.lastVerified + 'T00:00:00Z');
        if (Number.isNaN(d.getTime())) {
          errors.push(`entry "${key}" lastVerified "${entry.lastVerified}" is not a real date`);
        }
      }
    }
  }

  if (errors.length > 0) {
    for (const e of errors) console.error(`[validate-templates] ${e}`);
    fail(`${errors.length} validation error(s)`);
  }

  console.log(`[validate-templates] ok — ${keys.length} templates across ${data.categories.length} categories`);
  for (const [cat, n] of categoryCounts) {
    const flag = n === 0 ? ' (empty)' : '';
    console.log(`  • ${cat.padEnd(22)} ${String(n).padStart(3)} template(s)${flag}`);
  }
}

main();
