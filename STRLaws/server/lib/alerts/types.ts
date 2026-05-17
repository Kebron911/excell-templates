/**
 * Phase 5 alert pipeline types (spec §7 stage 5: dispatch-alerts).
 *
 * Mirrors migration 0002 tables:
 *   - alert_subscribers (email-only, tier-flagged)
 *   - alert_subscriptions (one subscriber → many city watchlist entries)
 *   - alert_dispatches (append-only audit log of sends)
 */

export type AlertSeverity = 'minor' | 'material' | 'major';
export type AlertTier = 'free' | 'premium';
export type AlertChannel = 'resend' | 'influencersoft';

export interface AlertSubscriber {
  id: number;
  email: string;
  tier: AlertTier;
  influencersoft_contact_id: string | null;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
}

export interface AlertSubscription {
  id: number;
  subscriber_id: number;
  city_id: number;
  severity_threshold: AlertSeverity;
}

/** A pending alert send computed by the dispatcher; awaits provider call. */
export interface AlertDispatchPlan {
  subscriberId: number;
  subscriberEmail: string;
  channel: AlertChannel;
  changeId: number;
  citySlug: string;
  cityName: string;
  stateSlug: string;
  stateName: string;
  severity: AlertSeverity;
  blogPostSlug: string | null;
  summary: string | null;
}

/** Outcome recorded into alert_dispatches after a provider call. */
export interface AlertDispatchOutcome {
  changeId: number;
  subscriberId: number;
  channel: AlertChannel;
  providerMessageId: string | null;
  status: 'sent' | 'failed' | 'bounced';
  errorMessage: string | null;
  sentAt: string;
}

/** Minimal interface that every email provider exposes to our dispatcher. */
export interface EmailProvider {
  readonly channel: AlertChannel;
  send(message: EmailMessage): Promise<EmailSendResult>;
}

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
  /** Provider-specific tags for tracking. */
  tags?: Record<string, string>;
}

export interface EmailSendResult {
  providerMessageId: string | null;
  status: 'sent' | 'failed';
  errorMessage: string | null;
}
