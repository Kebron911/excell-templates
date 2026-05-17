import { describe, expect, it } from 'vitest';
import { planAlertDispatches, type ChangeForDispatch, type SubscriberWithSubscription } from '../../server/lib/alerts/dispatcher';
import type { AlertSeverity, AlertSubscriber, AlertSubscription, AlertTier } from '../../server/lib/alerts/types';

function sub(id: number, tier: AlertTier, confirmed: boolean, unsubscribed = false): AlertSubscriber {
  return {
    id,
    email: `user${id}@example.com`,
    tier,
    influencersoft_contact_id: null,
    confirmed_at: confirmed ? '2026-05-01T00:00:00Z' : null,
    unsubscribed_at: unsubscribed ? '2026-05-10T00:00:00Z' : null,
  };
}

function subscription(id: number, subscriberId: number, cityId: number, threshold: AlertSeverity): AlertSubscription {
  return { id, subscriber_id: subscriberId, city_id: cityId, severity_threshold: threshold };
}

const change: ChangeForDispatch = {
  changeId: 555,
  cityId: 1,
  citySlug: 'salt-lake-city',
  cityName: 'Salt Lake City',
  stateSlug: 'utah',
  stateName: 'Utah',
  severity: 'material',
  blogPostSlug: 'slc-utah-str-material-2026-05-14',
  summary: 'Permit fee doubled.',
};

describe('planAlertDispatches', () => {
  it('routes premium subscribers to resend', () => {
    const audience: SubscriberWithSubscription[] = [
      { subscriber: sub(1, 'premium', true), subscription: subscription(10, 1, 1, 'material') },
    ];
    const plans = planAlertDispatches({ change, audience });
    expect(plans).toHaveLength(1);
    expect(plans[0]!.channel).toBe('resend');
  });

  it('routes free subscribers to influencersoft', () => {
    const audience: SubscriberWithSubscription[] = [
      { subscriber: sub(2, 'free', true), subscription: subscription(11, 2, 1, 'material') },
    ];
    const plans = planAlertDispatches({ change, audience });
    expect(plans[0]!.channel).toBe('influencersoft');
  });

  it('drops unconfirmed subscribers', () => {
    const audience: SubscriberWithSubscription[] = [
      { subscriber: sub(3, 'premium', false), subscription: subscription(12, 3, 1, 'material') },
    ];
    expect(planAlertDispatches({ change, audience })).toHaveLength(0);
  });

  it('drops unsubscribed users', () => {
    const audience: SubscriberWithSubscription[] = [
      { subscriber: sub(4, 'premium', true, true), subscription: subscription(13, 4, 1, 'material') },
    ];
    expect(planAlertDispatches({ change, audience })).toHaveLength(0);
  });

  it('drops subscriptions for a different city', () => {
    const audience: SubscriberWithSubscription[] = [
      { subscriber: sub(5, 'premium', true), subscription: subscription(14, 5, 999, 'material') },
    ];
    expect(planAlertDispatches({ change, audience })).toHaveLength(0);
  });

  it('honors severity_threshold (drops minor-threshold subscribers from minor changes — they get them, drops them on stricter)', () => {
    const minorChange: ChangeForDispatch = { ...change, severity: 'minor' };
    const majorChange: ChangeForDispatch = { ...change, severity: 'major' };

    // Material-threshold subscriber receives major but NOT minor
    const sMaterial: SubscriberWithSubscription = {
      subscriber: sub(6, 'free', true),
      subscription: subscription(15, 6, 1, 'material'),
    };
    expect(planAlertDispatches({ change: minorChange, audience: [sMaterial] })).toHaveLength(0);
    expect(planAlertDispatches({ change: majorChange, audience: [sMaterial] })).toHaveLength(1);
  });

  it('major-threshold subscriber only gets major', () => {
    const sub7: SubscriberWithSubscription = {
      subscriber: sub(7, 'premium', true),
      subscription: subscription(16, 7, 1, 'major'),
    };
    expect(planAlertDispatches({ change: { ...change, severity: 'material' }, audience: [sub7] })).toHaveLength(0);
    expect(planAlertDispatches({ change: { ...change, severity: 'major' }, audience: [sub7] })).toHaveLength(1);
  });

  it('skips subscribers already dispatched (idempotency on retry)', () => {
    const audience: SubscriberWithSubscription[] = [
      { subscriber: sub(8, 'premium', true), subscription: subscription(17, 8, 1, 'material') },
    ];
    const plans = planAlertDispatches({
      change,
      audience,
      alreadyDispatched: new Set([8]),
    });
    expect(plans).toHaveLength(0);
  });

  it('dedups within a single dispatch call (subscriber with two subscriptions to same city)', () => {
    const audience: SubscriberWithSubscription[] = [
      { subscriber: sub(9, 'premium', true), subscription: subscription(18, 9, 1, 'material') },
      { subscriber: sub(9, 'premium', true), subscription: subscription(19, 9, 1, 'minor') },
    ];
    expect(planAlertDispatches({ change, audience })).toHaveLength(1);
  });

  it('preserves all payload fields needed by the email template', () => {
    const audience: SubscriberWithSubscription[] = [
      { subscriber: sub(10, 'premium', true), subscription: subscription(20, 10, 1, 'minor') },
    ];
    const plan = planAlertDispatches({ change, audience })[0]!;
    expect(plan.changeId).toBe(555);
    expect(plan.citySlug).toBe('salt-lake-city');
    expect(plan.cityName).toBe('Salt Lake City');
    expect(plan.stateSlug).toBe('utah');
    expect(plan.severity).toBe('material');
    expect(plan.blogPostSlug).toBe('slc-utah-str-material-2026-05-14');
    expect(plan.summary).toBe('Permit fee doubled.');
  });
});
