/**
 * Guest-message template generator prompts (gpt-4o-mini).
 *
 * Stage toggle selects which moment in the guest journey the message targets;
 * tone toggle adjusts register (warm/professional/casual). The system prompt caps length
 * because over-long messages tank read-through.
 */

export const MESSAGE_SYSTEM = `You are a short-term-rental host's guest-message writer.
Write messages a host can paste into Airbnb / VRBO / direct-booking chat.

ABSOLUTE RULES:
- Stay under 120 words.
- Use the guest's first name as a {{guestFirstName}} placeholder so the host can swap it.
- Use {{propertyName}} for the property name placeholder.
- NEVER include URLs unless the host's context explicitly provides one.
- NEVER pretend to be a booking-platform notification.
- Always close with a single short call-to-action ("Let me know" / "Reply with…" / "Safe travels!").

Output ONLY the message text. No subject line unless the stage is post-checkout. No preamble.`;

export type MessageStage = 'booking_confirmation' | 'pre_arrival' | 'mid_stay' | 'post_checkout';
export type MessageTone = 'warm' | 'professional' | 'casual';

export interface MessageInput {
  stage: MessageStage;
  tone: MessageTone;
  context?: string;
}

export function validateMessageInput(raw: unknown): MessageInput | { error: string } {
  if (typeof raw !== 'object' || raw === null) return { error: 'body must be an object' };
  const r = raw as Record<string, unknown>;

  const stages: MessageStage[] = ['booking_confirmation', 'pre_arrival', 'mid_stay', 'post_checkout'];
  const stage = typeof r.stage === 'string' && (stages as string[]).includes(r.stage) ? (r.stage as MessageStage) : null;
  if (!stage) return { error: `stage must be one of: ${stages.join(', ')}` };

  const tones: MessageTone[] = ['warm', 'professional', 'casual'];
  const tone = typeof r.tone === 'string' && (tones as string[]).includes(r.tone) ? (r.tone as MessageTone) : null;
  if (!tone) return { error: `tone must be one of: ${tones.join(', ')}` };

  let context: string | undefined;
  if (r.context != null) {
    if (typeof r.context !== 'string') return { error: 'context must be a string' };
    const t = r.context.trim();
    if (t.length > 800) return { error: 'context: ≤800 chars' };
    if (t) context = t;
  }

  return { stage, tone, context };
}

export function buildMessagePrompt(input: MessageInput): string {
  const stageHuman = {
    booking_confirmation: 'a booking-confirmation message (sent within minutes of the booking)',
    pre_arrival: 'a pre-arrival message (sent 2–3 days before check-in)',
    mid_stay: 'a mid-stay check-in message (sent on day 2 of the stay)',
    post_checkout: 'a post-checkout thank-you (sent within 24 hours of checkout)',
  }[input.stage];

  return [
    `Write ${stageHuman}.`,
    `Tone: ${input.tone}.`,
    input.context ? `\nHost context: ${input.context}` : '',
    ``,
    `Use {{guestFirstName}} and {{propertyName}} placeholders.`,
    `Output ONLY the message text.`,
  ].filter(Boolean).join('\n');
}
