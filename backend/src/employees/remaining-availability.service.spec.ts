import { describe, expect, it } from 'vitest';
import { decimalFromNumber, decimalText, parseDecimalHours, parsePositiveSupport, projectHoursNumber } from './decimal-hours.js';
import { readCapacity } from './remaining-availability.service.js';

const week = '2026-11-23';

describe('exact weekly remaining availability', () => {
  it('distinguishes missing, positive, exhausted and over-allocated', () => {
    expect(readCapacity(week, null, null, ['1e-1'])).toMatchObject({
      status: 'MISSING', allocatedHoursExact: '1e-1', remainingHoursExact: null,
    });
    expect(readCapacity(week, week, 0.3, ['1e-1', '2e-1'])).toMatchObject({
      status: 'EXHAUSTED', allocatedHoursExact: '3e-1', remainingHoursExact: '0',
    });
    expect(readCapacity(week, week, 0.3, ['1e-1', '3e-1'])).toMatchObject({
      status: 'OVER_ALLOCATED', declaredHoursExact: '3e-1', remainingHoursExact: '-1e-1',
    });
    expect(readCapacity(week, week, 1, ['1e-17'])).toMatchObject({
      status: 'AVAILABLE', remainingHoursExact: '99999999999999999e-17',
    });
  });

  it('keeps DOUBLE boundaries and rejects malformed, oversized or unrepresentable inputs', () => {
    for (const n of [Number.MIN_VALUE, Number.MAX_VALUE, 0.30000000000000004]) {
      const value = decimalFromNumber(n);
      expect(parsePositiveSupport(decimalText(value))).toEqual(value);
      expect(projectHoursNumber(value)).toBe(n);
    }
    for (const value of ['1e999', '1e-325', '1e0\n', '01e0', '10e0', '9e308', `${'9'.repeat(672)}e0`]) {
      expect(parsePositiveSupport(value)).toBeNull();
    }
    expect(parseDecimalHours('-1e-1')).toEqual({ coefficient: -1n, exponent: -1 });
    expect(projectHoursNumber(parsePositiveSupport('1e-324')!, true)).toBe(0);
    expect(() => projectHoursNumber({ coefficient: 1n, exponent: -400 })).toThrow(RangeError);
    expect(() => projectHoursNumber({ coefficient: 1n, exponent: 400 })).toThrow(RangeError);
  });
});
