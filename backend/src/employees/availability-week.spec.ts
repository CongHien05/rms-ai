import { getAvailabilityWeek } from './availability-week.js';

describe('availability week in Vietnam', () => {
  it('moves to the next week at local midnight on Monday', () => {
    expect(getAvailabilityWeek(new Date('2026-11-22T16:59:59Z'))).toEqual({
      weekStart: '2026-11-16',
      weekEnd: '2026-11-22',
    });
    expect(getAvailabilityWeek(new Date('2026-11-22T17:00:00Z'))).toEqual({
      weekStart: '2026-11-23',
      weekEnd: '2026-11-29',
    });
  });

  it('includes all seven dates across a year boundary', () => {
    expect(getAvailabilityWeek(new Date('2027-01-01T12:00:00Z'))).toEqual({
      weekStart: '2026-12-28',
      weekEnd: '2027-01-03',
    });
  });
});
