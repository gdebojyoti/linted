import type { DateRange, ResumeDate } from "@/lib/resume/types";

/** How a Theme wants dates written. Add a style here when a Theme needs one. */
export type DateStyle = "short" | "long";

const MONTHS: Record<DateStyle, string[]> = {
  short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  long: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

/**
 * "Mar 2022 – Present", "2013 – 2017", "14 Aug 2025" (short style). Each date
 * shows only as much as was entered; a missing start or end leaves just the
 * other, and no dates at all give "".
 */
export function formatDateRange({ start, current, end }: DateRange, style: DateStyle = "short"): string {
  const parts = [start && formatDate(start, style), current ? "Present" : end && formatDate(end, style)];
  return parts.filter((part) => part).join(" – ");
}

function formatDate({ year, month, day }: ResumeDate, style: DateStyle): string {
  if (month === null) return `${year}`;
  const monthYear = `${MONTHS[style][month - 1]} ${year}`;
  return day === null ? monthYear : `${day} ${monthYear}`;
}
