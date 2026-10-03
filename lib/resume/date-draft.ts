import { monthName } from "@/lib/format/date-range";
import { daysInMonth, isValidDate, MAX_YEAR, MIN_YEAR } from "./dates";
import type { ResumeDate } from "./types";

// One date as the editor's fields hold it while it's being entered (#23).
// The Resume only takes valid dates, so the fields keep what was entered
// until it makes one, and the Resume keeps the last valid date meanwhile.

/** A date's fields: the year as typed, the month and day as picked (null when not picked). */
export type DateDraft = { year: string; month: number | null; day: number | null };

/** The fields that show a stored date, or empty fields for no date. */
export function draftOf(date: ResumeDate | null): DateDraft {
  return date ? { year: `${date.year}`, month: date.month, day: date.day } : { year: "", month: null, day: null };
}

/** What the fields say: a date, no date, or an error naming the field to fix. */
export type DraftReading =
  | { ok: true; date: ResumeDate | null }
  | { ok: false; field: "year" | "day"; error: string };

/**
 * Empty fields mean no date. Otherwise they need a year from 1900 to 2100,
 * and a picked day has to be one the month has in that year. In the editor
 * the Day list changes such a day itself (see DateField), so the day error
 * is mostly a guard.
 */
export function readDraft({ year, month, day }: DateDraft): DraftReading {
  const typedYear = year.trim();
  if (typedYear === "" && month === null && day === null) return { ok: true, date: null };
  if (typedYear === "") return { ok: false, field: "year", error: "Add a year." };

  const parsedYear = /^\d{4}$/.test(typedYear) ? Number(typedYear) : Number.NaN;
  if (!(parsedYear >= MIN_YEAR && parsedYear <= MAX_YEAR)) {
    return { ok: false, field: "year", error: `Year must be from ${MIN_YEAR} to ${MAX_YEAR}.` };
  }

  const parts = { year: parsedYear, month, day };
  if (isValidDate(parts)) return { ok: true, date: parts };
  if (month === null) return { ok: false, field: "day", error: "Pick a month for this day." };
  return { ok: false, field: "day", error: `${monthName(month, "long")} ${parsedYear} has no day ${day}.` };
}

/** Whether the fields say this date (or, for null, no date). */
export function draftShows(draft: DateDraft, date: ResumeDate | null): boolean {
  const reading = readDraft(draft);
  if (!reading.ok) return false;
  if (reading.date === null || date === null) return reading.date === date;
  return (
    reading.date.year === date.year && reading.date.month === date.month && reading.date.day === date.day
  );
}

/**
 * The fields with a month picked. Without a month there's no day, so clearing
 * the month clears the day too. A day the new month doesn't have is kept
 * here, but in the editor the Day list then changes it (see DateField).
 */
export function withMonth(draft: DateDraft, month: number | null): DateDraft {
  return { ...draft, month, day: month === null ? null : draft.day };
}

/**
 * The days to pick from: those the picked month has, in the typed year if
 * it's valid (29 February only in a leap year). Until a year is typed,
 * February offers the 29th. No month, no days.
 */
export function dayChoices({ year, month }: DateDraft): number[] {
  if (month === null) return [];
  const reading = readDraft({ year, month: null, day: null });
  const leapYear = 2000;
  const days = daysInMonth(reading.ok && reading.date ? reading.date.year : leapYear, month);
  return Array.from({ length: days }, (_, i) => i + 1);
}
