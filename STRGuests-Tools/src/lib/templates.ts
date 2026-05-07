/**
 * Template-data helpers for the programmatic /templates/[scenario] route.
 *
 * The data layer is templates.json — kept as a JSON file rather than a
 * MDX/CMS so cards, indexes, and per-page content all share one source of
 * truth. ~100+ entries across 5 categories.
 */

import templatesData from '@/data/templates.json';

export type TemplateCategory = 'booking' | 'pre-arrival' | 'mid-stay' | 'post-checkout' | 'issues';
export type TemplateTone = 'warm' | 'firm' | 'neutral';
export type TemplateAudience = 'host' | 'guest';

export interface TemplateEntry {
  slug: string;
  category: TemplateCategory;
  scenario: string;
  audience: TemplateAudience;
  shortDescription: string;
  primaryKeyword: string;
  template: string;
  variables: string[];
  tone: TemplateTone;
  whenToUse?: string;
}

export const templates = templatesData as TemplateEntry[];

export const CATEGORIES: { id: TemplateCategory; label: string; tagline: string }[] = [
  { id: 'booking', label: 'Booking', tagline: 'New reservation confirmations.' },
  { id: 'pre-arrival', label: 'Pre-arrival', tagline: 'Logistics and expectations before the stay.' },
  { id: 'mid-stay', label: 'Mid-stay', tagline: 'In-stay communication, requests, and adjustments.' },
  { id: 'post-checkout', label: 'Post-checkout', tagline: 'Thank-yous, reviews, lost items, returns.' },
  { id: 'issues', label: 'Issues', tagline: 'Difficult conversations: refunds, violations, disputes.' },
];

export function categoryLabel(id: TemplateCategory): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function getTemplate(slug: string): TemplateEntry | undefined {
  return templates.find((t) => t.slug === slug);
}

export function relatedTemplates(slug: string, count = 3): TemplateEntry[] {
  const cur = getTemplate(slug);
  if (!cur) return [];
  return templates
    .filter((t) => t.slug !== slug && t.category === cur.category)
    .slice(0, count);
}
