/**
 * Alert dispatch routing (spec §7 stage 5, pure logic).
 *
 * Given a regulation_changes row and the full set of subscriptions watching
 * that city, compute the list of AlertDispatchPlan rows: who to email, which
 * channel, and with what payload. The orchestrator persists results into
 * alert_dispatches and calls the relevant EmailProvider per plan.
 *
 * Channel routing (spec §10):
 *   - premium tier → resend (instant, transactional)
 *   - free tier    → influencersoft (batched marketing send)
 *
 * Eligibility:
 *   - Subscriber must be confirmed and not unsubscribed
 *   - Change severity must be ≥ subscription.severity_threshold
 *   - Dispatch must not already exist for (change_id, subscriber_id) — dedup
 *     check belongs to the orchestrator (queries alert_dispatches); this
 *     pure function trusts the caller-provided alreadyDispatched set.
 */
import type {
  AlertChannel,
  AlertDispatchPlan,
  AlertSeverity,
  AlertSubscriber,
  AlertSubscription,
  AlertTier,
} from './types';

const SEVERITY_RANK: Record<AlertSeverity, number> = { minor: 0, material: 1, major: 2 };

const CHANNEL_BY_TIER: Record<AlertTier, AlertChannel> = {
  premium: 'resend',
  free: 'influencersoft',
};

export interface ChangeForDispatch {
  changeId: number;
  cityId: number;
  citySlug: string;
  cityName: string;
  stateSlug: string;
  stateName: string;
  severity: AlertSeverity;
  blogPostSlug: string | null;
  summary: string | null;
}

export interface SubscriberWithSubscription {
  subscriber: AlertSubscriber;
  subscription: AlertSubscription;
}

export interface DispatcherInput {
  change: ChangeForDispatch;
  audience: SubscriberWithSubscription[];
  /** Set of subscriber IDs already dispatched for change.changeId. */
  alreadyDispatched?: Set<number>;
}

function meetsSeverityThreshold(threshold: AlertSeverity, actual: AlertSeverity): boolean {
  return SEVERITY_RANK[actual] >= SEVERITY_RANK[threshold];
}

function isEligible(subscriber: AlertSubscriber): boolean {
  return subscriber.confirmed_at !== null && subscriber.unsubscribed_at === null;
}

export function planAlertDispatches(input: DispatcherInput): AlertDispatchPlan[] {
  const skip = input.alreadyDispatched ?? new Set<number>();
  const plans: AlertDispatchPlan[] = [];
  const seen = new Set<number>(); // dedup within a single dispatch call

  for (const { subscriber, subscription } of input.audience) {
    if (subscription.city_id !== input.change.cityId) continue;
    if (!isEligible(subscriber)) continue;
    if (!meetsSeverityThreshold(subscription.severity_threshold, input.change.severity)) continue;
    if (skip.has(subscriber.id) || seen.has(subscriber.id)) continue;
    seen.add(subscriber.id);

    plans.push({
      subscriberId: subscriber.id,
      subscriberEmail: subscriber.email,
      channel: CHANNEL_BY_TIER[subscriber.tier],
      changeId: input.change.changeId,
      citySlug: input.change.citySlug,
      cityName: input.change.cityName,
      stateSlug: input.change.stateSlug,
      stateName: input.change.stateName,
      severity: input.change.severity,
      blogPostSlug: input.change.blogPostSlug,
      summary: input.change.summary,
    });
  }

  return plans;
}
