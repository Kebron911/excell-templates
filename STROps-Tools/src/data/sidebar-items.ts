export interface SidebarItem {
  slug: string;
  label: string;
  description?: string;
  href?: string;
}

export const sidebarItems: SidebarItem[] = [
  { slug: 'turnover-scheduler', label: 'Turnover scheduler' },
  { slug: 'cleaner-dispatch', label: 'Cleaner dispatch' },
  { slug: 'smart-lock-codes', label: 'Smart lock codes' },
  { slug: 'linen-par-calculator', label: 'Linen par calculator' },
  { slug: 'restock-calculator', label: 'Restock calculator' },
  { slug: 'damage-cost-lookup', label: 'Damage cost lookup' },
  { slug: 'maintenance-schedule', label: 'Maintenance schedule' },
];
