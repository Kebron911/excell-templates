export const GA4_EVENTS = [
  'tool_viewed',
  'calc_started',
  'calc_completed',
  'pdf_download',
  'pdf_email_gated',
  'lead_captured',
  'upsell_shown',
  'upsell_clicked',
  'checkout_started',
  'checkout_completed',
  'newsletter_signup',
  'external_link_click',
  'share_clicked',
  'video_played',
] as const;

export type Ga4Event = (typeof GA4_EVENTS)[number];
