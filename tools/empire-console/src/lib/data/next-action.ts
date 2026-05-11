import { readAlerts } from './alerts.js';
import { readCalendar } from './calendar.js';
import { readInfrastructure } from './infrastructure.js';
import { readVendors } from './vendors.js';
import { readNewsletter } from './newsletter.js';
import { readProgress } from './progress.js';

export interface NextAction {
  priority: 'P0' | 'P1' | 'P2';
  source: string;            // module name
  message: string;
  ctaLabel?: string;
  ctaHref?: string;
}

/**
 * Decide the single most important thing Daniel should do next.
 * Priority cascade: open P0 alert → overdue calendar → expiring SSL → renewing vendor →
 * newsletter cadence drift → top P0 PROGRESS item → all clear.
 */
export async function computeNextAction(): Promise<NextAction> {
  const [alerts, calendar, infra, vendors, newsletter, progress] = await Promise.all([
    readAlerts(20),
    readCalendar(),
    readInfrastructure(),
    readVendors(),
    readNewsletter(),
    readProgress(),
  ]);

  // 1. Unacked P0 alerts (highest)
  const openP0 = alerts.find((a) => a.priority === 'P0' && !a.acked);
  if (openP0) {
    return {
      priority: 'P0',
      source: openP0.source,
      message: openP0.message,
      ctaLabel: 'Open alert',
      ctaHref: openP0.url ?? '/check/alerts',
    };
  }

  // 2. Overdue calendar
  const overdue = calendar.items.find((i) => i.isOverdue);
  if (overdue) {
    return {
      priority: 'P0',
      source: 'calendar',
      message: `Overdue: ${overdue.label} (${Math.abs(overdue.daysUntil)}d late)`,
      ctaLabel: 'Open calendar',
      ctaHref: '/maintain/calendar',
    };
  }

  // 3. Domain or SSL expiring ≤7d
  const domainP0 = infra.domains.find((d) => d.isExpiringP0);
  if (domainP0) {
    return {
      priority: 'P0',
      source: 'infrastructure',
      message: `${domainP0.domain} expires in ${domainP0.daysToExpiry}d`,
      ctaLabel: 'Open infrastructure',
      ctaHref: '/check/infrastructure',
    };
  }

  // 4. Vendor renewal ≤7d
  const renewSoon = vendors.vendors.find((v) => v.daysToRenewal !== null && v.daysToRenewal >= 0 && v.daysToRenewal <= 7);
  if (renewSoon) {
    return {
      priority: 'P1',
      source: 'vendors',
      message: `${renewSoon.vendor} renews in ${renewSoon.daysToRenewal}d ($${renewSoon.monthly_cost ?? 0}/mo)`,
      ctaLabel: 'Open vendors',
      ctaHref: '/maintain/vendors',
    };
  }

  // 5. Newsletter cadence drift (>14d on a weekly newsletter)
  if (newsletter.isCadenceStale) {
    return {
      priority: 'P1',
      source: 'newsletter',
      message: `Newsletter overdue — last send ${newsletter.daysSinceLastSend}d ago`,
      ctaLabel: 'Open newsletter',
      ctaHref: '/promote/newsletter',
    };
  }

  // 6. Calendar item due ≤7d
  const dueSoon = calendar.items.find((i) => i.isDueSoon);
  if (dueSoon) {
    return {
      priority: 'P1',
      source: 'calendar',
      message: `Due in ${dueSoon.daysUntil}d: ${dueSoon.label}`,
      ctaLabel: 'Open calendar',
      ctaHref: '/maintain/calendar',
    };
  }

  // 7. Top unchecked P0 PROGRESS item
  const topProgress = progress.nextActions[0];
  if (topProgress) {
    return {
      priority: 'P2',
      source: 'PROGRESS.md',
      message: `${topProgress.section} — ${topProgress.text}`,
      ctaLabel: 'Open PROGRESS',
      ctaHref: 'PROGRESS.md',
    };
  }

  // All clear
  return {
    priority: 'P2',
    source: 'all-clear',
    message: 'All caught up. Pour a coffee, plan something good.',
    ctaLabel: 'Open weekly review',
    ctaHref: '/check/cluster',
  };
}
