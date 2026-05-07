import { describe, it, expect } from 'vitest';
import { LISTING_V1 } from '../../../server/lib/ai/prompts/listing';
import { REVIEW_V1 } from '../../../server/lib/ai/prompts/review';
import { MESSAGE_V1, MESSAGE_TYPES } from '../../../server/lib/ai/prompts/message';

describe('LISTING_V1', () => {
  it('rejects missing required fields', () => {
    const result = LISTING_V1.schema.safeParse({ tone: 'warm' });
    expect(result.success).toBe(false);
  });

  it('renders user prompt with all key vars', () => {
    const vars = LISTING_V1.schema.parse({
      propertyType: 'cabin',
      bedrooms: 2,
      bathrooms: 1,
      sleeps: 4,
      location: 'Asheville, NC',
      features: ['hot tub'],
      tone: 'warm',
      length: 'medium',
    });
    const text = LISTING_V1.user(vars);
    expect(text).toMatch(/cabin/);
    expect(text).toMatch(/Asheville/);
    expect(text).toMatch(/hot tub/);
    expect(text).toMatch(/Sleeps: 4/);
  });

  it('handles empty features array gracefully', () => {
    const vars = LISTING_V1.schema.parse({
      propertyType: 'apartment',
      bedrooms: 1,
      bathrooms: 1,
      sleeps: 2,
      location: 'Austin, TX',
      features: [],
      tone: 'professional',
      length: 'short',
    });
    expect(LISTING_V1.user(vars)).toMatch(/none specified/);
  });
});

describe('REVIEW_V1', () => {
  it('caps reviewText length', () => {
    const result = REVIEW_V1.schema.safeParse({
      reviewText: 'x'.repeat(5000),
      starRating: 5,
      tone: 'warm',
      responseGoal: 'thank',
    });
    expect(result.success).toBe(false);
  });

  it('validates starRating range', () => {
    expect(
      REVIEW_V1.schema.safeParse({
        reviewText: 'ok',
        starRating: 0,
        tone: 'warm',
        responseGoal: 'thank',
      }).success,
    ).toBe(false);
    expect(
      REVIEW_V1.schema.safeParse({
        reviewText: 'ok',
        starRating: 6,
        tone: 'warm',
        responseGoal: 'thank',
      }).success,
    ).toBe(false);
  });

  it('embeds the review text and rating in the prompt', () => {
    const vars = REVIEW_V1.schema.parse({
      reviewText: 'The wifi was slow.',
      starRating: 3,
      tone: 'professional',
      responseGoal: 'address-issue',
    });
    const text = REVIEW_V1.user(vars);
    expect(text).toMatch(/3-star/);
    expect(text).toMatch(/wifi was slow/);
  });
});

describe('MESSAGE_V1', () => {
  it('exposes all 8 message types', () => {
    expect(MESSAGE_TYPES).toHaveLength(8);
    expect(MESSAGE_TYPES).toContain('booking-confirmation');
    expect(MESSAGE_TYPES).toContain('refund-request');
  });

  it('rejects unknown message types', () => {
    expect(
      MESSAGE_V1.schema.safeParse({
        messageType: 'random',
        propertyName: 'Cabin',
        hostName: 'Daniel',
      }).success,
    ).toBe(false);
  });

  it('omits scenario block when scenarioDetails is absent', () => {
    const vars = MESSAGE_V1.schema.parse({
      messageType: 'pre-arrival',
      propertyName: 'Cozy Cabin',
      hostName: 'Daniel',
    });
    const text = MESSAGE_V1.user(vars);
    expect(text).not.toMatch(/Scenario specifics/);
  });

  it('includes scenario details when provided', () => {
    const vars = MESSAGE_V1.schema.parse({
      messageType: 'noise-complaint',
      propertyName: 'Cozy Cabin',
      hostName: 'Daniel',
      scenarioDetails: 'Neighbor complained about late-night music.',
    });
    const text = MESSAGE_V1.user(vars);
    expect(text).toMatch(/Scenario specifics/);
    expect(text).toMatch(/Neighbor complained/);
  });

  it('system prompt mentions Mustache placeholders', () => {
    expect(MESSAGE_V1.system).toMatch(/\{\{guestFirstName\}\}/);
    expect(MESSAGE_V1.system).toMatch(/\{\{propertyName\}\}/);
  });
});
