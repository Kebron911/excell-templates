import { z } from 'zod';

export const MESSAGE_TYPES = [
  'booking-confirmation',
  'pre-arrival',
  'mid-stay',
  'post-checkout',
  'late-checkout-request',
  'noise-complaint',
  'broken-item',
  'refund-request',
] as const;
export type MessageType = (typeof MESSAGE_TYPES)[number];

export const MessageVarsSchema = z.object({
  messageType: z.enum(MESSAGE_TYPES),
  propertyName: z.string().min(1),
  hostName: z.string().min(1),
  guestFirstName: z.string().optional(),
  scenarioDetails: z.string().max(800).optional(),
});
export type MessageVars = z.infer<typeof MessageVarsSchema>;

const TYPE_GUIDANCE: Record<MessageType, string> = {
  'booking-confirmation':
    'Confirm the booking, thank them, set expectations for what arrives next (check-in instructions ~3 days before arrival).',
  'pre-arrival':
    'Sent ~3 days before check-in. Cover: arrival window, parking, wifi-and-essentials note, where the welcome book lives.',
  'mid-stay':
    'Sent on day 2 of the stay. Light, optional reply. Offer help if anything is off.',
  'post-checkout':
    'Sent within 12 hours of checkout. Thank them, ask for a review, mention rebooking discount if relevant.',
  'late-checkout-request':
    'Reply granting (or politely declining) a late checkout. Reference cleaner schedule when declining.',
  'noise-complaint':
    'Acknowledge the noise complaint, name what changed, do not blame neighbors or other guests.',
  'broken-item':
    'Reply about a broken item. Thank them for telling you, do not ask for payment in writing — direct to platform Resolution Center.',
  'refund-request':
    'Reply to a refund request. Empathetic but neutral. Direct to platform Resolution Center for any money movement.',
};

export const MESSAGE_V1 = {
  id: 'message',
  version: 1,
  schema: MessageVarsSchema,
  system:
    'You are an experienced Airbnb host writing guest messages. Output a single message ready to drop into a PMS template field. ' +
    'Use Mustache placeholders for variables that may change per booking: {{guestFirstName}}, {{propertyName}}, {{hostName}}, ' +
    '{{checkInDate}}, {{checkOutDate}}, {{wifiNetwork}}, {{wifiPassword}}, {{addressLine}}. ' +
    'Cap at 140 words. No headings, no signoff line beyond {{hostName}}.',
  user(vars: MessageVars): string {
    const detail = vars.scenarioDetails?.trim();
    return [
      `Write a ${vars.messageType} message.`,
      `Guidance: ${TYPE_GUIDANCE[vars.messageType]}`,
      '',
      `Property: ${vars.propertyName}`,
      `Host: ${vars.hostName}`,
      vars.guestFirstName ? `Guest first name (use as a placeholder anyway): ${vars.guestFirstName}` : '',
      detail ? `Scenario specifics:\n${detail}` : '',
      '',
      'Output the message body only.',
    ]
      .filter(Boolean)
      .join('\n');
  },
} as const;
