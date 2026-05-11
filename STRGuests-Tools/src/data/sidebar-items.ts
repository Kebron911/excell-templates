import tools from './tools.json';

export interface SidebarItem {
  slug: string;
  label: string;
  description?: string;
  href?: string;
}

export const sidebarItems: SidebarItem[] = Object.entries(tools).map(([slug, t]) => ({
  slug,
  label: t.shortName,
  description: t.tagline,
  href: t.path,
}));
