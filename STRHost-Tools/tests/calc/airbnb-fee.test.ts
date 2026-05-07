import { describe, it, expect } from 'vitest';
import { calculateAirbnbFee, AIRBNB_FEE_DEFAULTS } from '@/lib/calc/airbnb-fee';

describe('calculateAirbnbFee', () => {
  it('computes a baseline scenario', () => {
    const r = calculateAirbnbFee({
      nightlyRate: 200,
      nights: 3,
      cleaningFee: 100,
      hostFeeRate: 0.03,
      guestFeeRate: 0.14,
    });
    // subtotal = 200*3 + 100 = 700
    expect(r.subtotal).toBeCloseTo(700, 2);
    expect(r.hostFee).toBeCloseTo(21, 2); // 3% of 700
    expect(r.guestServiceFee).toBeCloseTo(98, 2); // 14% of 700
    expect(r.guestTotal).toBeCloseTo(798, 2); // 700 + 98
    expect(r.hostPayout).toBeCloseTo(679, 2); // 700 - 21
  });

  it('handles zero cleaning fee', () => {
    const r = calculateAirbnbFee({
      nightlyRate: 100,
      nights: 2,
      cleaningFee: 0,
      hostFeeRate: 0.03,
      guestFeeRate: 0.14,
    });
    expect(r.subtotal).toBe(200);
    expect(r.hostFee).toBeCloseTo(6, 2);
    expect(r.guestServiceFee).toBeCloseTo(28, 2);
    expect(r.hostPayout).toBeCloseTo(194, 2);
  });

  it('returns zeros on zero input', () => {
    const r = calculateAirbnbFee({
      nightlyRate: 0,
      nights: 0,
      cleaningFee: 0,
      hostFeeRate: 0.03,
      guestFeeRate: 0.14,
    });
    expect(r.guestTotal).toBe(0);
    expect(r.hostPayout).toBe(0);
  });

  it('handles override fee rates', () => {
    // Some hosts on legacy split fee see 0% host fee + ~6% guest fee. Calculator must support overrides.
    const r = calculateAirbnbFee({
      nightlyRate: 100,
      nights: 1,
      cleaningFee: 0,
      hostFeeRate: 0,
      guestFeeRate: 0.06,
    });
    expect(r.hostFee).toBe(0);
    expect(r.guestServiceFee).toBeCloseTo(6, 2);
    expect(r.hostPayout).toBe(100);
  });

  it('exposes sane defaults', () => {
    expect(AIRBNB_FEE_DEFAULTS.hostFeeRate).toBe(0.03);
    expect(AIRBNB_FEE_DEFAULTS.guestFeeRate).toBe(0.14);
  });
});
