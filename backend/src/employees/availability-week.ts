const localDateFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Ho_Chi_Minh',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function getAvailabilityWeek(now = new Date()) {
  const parts = localDateFormat.formatToParts(now);
  const part = (type: string) =>
    parts.find((item) => item.type === type)?.value;
  const monday = new Date(
    `${part('year')}-${part('month')}-${part('day')}T00:00:00Z`,
  );
  monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7));
  const sunday = new Date(monday);
  sunday.setUTCDate(sunday.getUTCDate() + 6);
  return {
    weekStart: monday.toISOString().slice(0, 10),
    weekEnd: sunday.toISOString().slice(0, 10),
  };
}

export function isAvailabilityWeekStart(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return date.getUTCDay() === 1 && date.toISOString().slice(0, 10) === value;
}
