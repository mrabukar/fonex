/** Business-calendar timezone for homepage slide windows. No DST. */
export const HOMEPAGE_TIMEZONE_OFFSET = "+03:00";

export function startOfDayInMogadishu(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00.000${HOMEPAGE_TIMEZONE_OFFSET}`);
}

export function endOfDayInMogadishu(dateStr: string): Date {
  return new Date(`${dateStr}T23:59:59.999${HOMEPAGE_TIMEZONE_OFFSET}`);
}

export function toMogadishuDateInput(value: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Mogadishu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}
