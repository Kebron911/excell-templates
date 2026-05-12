import tools from './tools.json';

export interface SidebarItem {
  slug: string;
  label: string;
  description?: string;
  href: string;
}

export const sidebarItems: SidebarItem[] = Object.entries(tools).map(([slug, t]: [string, any]) => ({
  slug,
  label: t.shortName ?? t.name ?? slug,
  description: t.tagline,
  href: t.path ?? `/${slug}`,
}));
