export const CHURCH_TIME_ZONE = "Asia/Ulaanbaatar";

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const WEEKDAYS = ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"];

/** Today's calendar date in Ulaanbaatar as YYYY-MM-DD. */
export function todayUB(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: CHURCH_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function isIsoDate(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const match = ISO_DATE.exec(value);
  if (!match) return false;
  const [, y, m, d] = match.map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

export function addDays(isoDate: string, days: number) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return date.toISOString().slice(0, 10);
}

/** "2026 оны 9-р сарын 25, Пүрэв" — built by hand so server and browser always agree. */
export function formatDateMn(isoDate: string, withWeekday = true) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const weekday = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  const text = `${y} оны ${m}-р сарын ${d}`;
  return withWeekday ? `${text}, ${weekday}` : text;
}

/** "9/25" style short label for grids. */
export function formatShortDate(isoDate: string) {
  const [, m, d] = isoDate.split("-").map(Number);
  return `${m}/${d}`;
}

export function weekdayShort(isoDate: string) {
  const [y, m, d] = isoDate.split("-").map(Number);
  return WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()].slice(0, 2);
}
