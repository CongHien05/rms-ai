const calendarDateFormat = new Intl.DateTimeFormat('vi-VN', {
  timeZone: 'UTC',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

export function formatCalendarDate(value: string) {
  return calendarDateFormat.format(new Date(value))
}
