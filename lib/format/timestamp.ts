import { formatCount } from "./count";

// Spelled out rather than using Intl, whose short months vary by locale and
// runtime (e.g. "Sep" or "Sept").
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

/** "14 Sep 2026", in the viewer's time zone. */
export function formatDay(iso: string): string {
  const date = new Date(iso);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * When a Resume was last edited, relative to `now` and in the viewer's time
 * zone: "Just now", "15 minutes ago", "3 hours ago" (earlier today),
 * "Yesterday, 18:40", "3 days ago" (up to six), then "14 Sep 2026".
 */
export function formatLastEdited(iso: string, now: Date): string {
  const date = new Date(iso);
  const elapsed = now.getTime() - date.getTime();
  if (elapsed < MINUTE) return "Just now";

  const days = calendarDaysBetween(date, now);
  if (days === 0) {
    return elapsed < HOUR
      ? `${formatCount(Math.floor(elapsed / MINUTE), "minute", "minutes")} ago`
      : `${formatCount(Math.floor(elapsed / HOUR), "hour", "hours")} ago`;
  }
  if (days === 1) return `Yesterday, ${twoDigits(date.getHours())}:${twoDigits(date.getMinutes())}`;
  if (days < 7) return `${days} days ago`;
  return formatDay(iso);
}

/** How many midnights lie between the two dates, in the viewer's time zone. */
function calendarDaysBetween(earlier: Date, later: Date): number {
  const midnight = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  // Rounded, because a day with a daylight-saving change isn't 24 hours long.
  return Math.round((midnight(later) - midnight(earlier)) / (24 * HOUR));
}

function twoDigits(n: number): string {
  return String(n).padStart(2, "0");
}
