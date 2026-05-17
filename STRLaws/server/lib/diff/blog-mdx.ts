/**
 * Render a DiffResult into MDX for auto-publish (spec §7 stage 4).
 *
 * Output shape is suitable for writing to src/content/blog/<slug>.mdx
 * before triggering Astro rebuild via Hostinger deploy webhook. The
 * blog post slug is also persisted to regulation_changes.blog_post_slug
 * so the alert dispatcher can deep-link subscribers to the post.
 */
import type { DiffResult } from './types';

export interface BlogPostFrontmatter {
  title: string;
  description: string;
  slug: string;
  date: string;
  severity: DiffResult['severity'];
  city_slug: string;
  state_slug: string;
  city_name: string;
  state_name: string;
}

export interface BlogPostOutput {
  slug: string;
  frontmatter: BlogPostFrontmatter;
  /** Full MDX content including the frontmatter block. Write this verbatim. */
  content: string;
}

export interface BlogPostContext {
  diff: DiffResult;
  city: { slug: string; name: string };
  state: { slug: string; name: string };
  /** ISO date for the dateline. Defaults to today. Injected for tests. */
  publishedAt?: string;
}

const SEVERITY_LABELS: Record<DiffResult['severity'], string> = {
  major: 'Major Change',
  material: 'Material Update',
  minor: 'Minor Update',
};

export function slugifyChange(
  cityName: string,
  stateName: string,
  date: string,
  severity: DiffResult['severity'],
): string {
  const base = `${cityName}-${stateName}-str-${severity}-${date}`;
  return base
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function escapeYaml(s: string): string {
  return s.replace(/"/g, '\\"');
}

export function toMdxBlogPost(ctx: BlogPostContext): BlogPostOutput {
  const { diff, city, state } = ctx;
  const publishedAt = (ctx.publishedAt ?? new Date().toISOString()).slice(0, 10);
  const label = SEVERITY_LABELS[diff.severity];

  const slug = slugifyChange(city.name, state.name, publishedAt, diff.severity);
  const title = `${label}: Short-Term Rental Regulations in ${city.name}, ${state.name} (${publishedAt})`;
  const description = diff.changes[0]?.description.slice(0, 155)
    ?? `${label.toLowerCase()} to STR regulations in ${city.name}, ${state.name}.`;

  const frontmatter: BlogPostFrontmatter = {
    title,
    description,
    slug,
    date: publishedAt,
    severity: diff.severity,
    city_slug: city.slug,
    state_slug: state.slug,
    city_name: city.name,
    state_name: state.name,
  };

  const fmYaml = [
    '---',
    `title: "${escapeYaml(title)}"`,
    `description: "${escapeYaml(description)}"`,
    `slug: "${slug}"`,
    `date: "${publishedAt}"`,
    `severity: "${diff.severity}"`,
    `city_slug: "${city.slug}"`,
    `state_slug: "${state.slug}"`,
    `city_name: "${escapeYaml(city.name)}"`,
    `state_name: "${escapeYaml(state.name)}"`,
    '---',
    '',
  ].join('\n');

  const body = [
    `# ${title}`,
    '',
    `On ${publishedAt}, short-term rental regulations in [${city.name}, ${state.name}](/${state.slug}/${city.slug}) were updated. This change is classified as **${label.toLowerCase()}**.`,
    '',
    '## What changed',
    '',
    ...diff.changes.map((c) => `- **${c.field}** (${c.severity}): ${c.description}`),
    '',
    '## What it means for hosts and investors',
    '',
    diff.severity === 'major'
      ? `Operators in ${city.name} should review their permit status and immediately consult with a STR-specialist attorney. Major changes can require pausing bookings, restructuring listings, or wind-down planning.`
      : diff.severity === 'material'
        ? `Operators in ${city.name} should re-check their permit fee budget and compliance paperwork. The change is substantive enough that it likely affects unit economics, but does not by itself force a shutdown.`
        : `This is a minor update — typically a clarification or note refresh. No immediate action required, but worth a quick read.`,
    '',
    `For the full current regulation summary, see the [${city.name} regulation page](/${state.slug}/${city.slug}). For change history, see [${city.name} history](/${state.slug}/${city.slug}/history).`,
    '',
    `*Sources and methodology: see [/legal/sources](/legal/sources). STRLaws is an information service, not legal advice.*`,
    '',
  ].join('\n');

  return {
    slug,
    frontmatter,
    content: fmYaml + body,
  };
}
