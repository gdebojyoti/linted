import { editEntry, editSections, type EditOptions } from "./edit-sections";
import type { DateRange, Resume, ResumeDate } from "./types";

// Setting an Entry's dates, marking it Current, and checking its dates.
// Experience, Projects, Education and Custom Entries have dates; other
// Entries don't.

/** The earliest year a date may have. */
export const MIN_YEAR = 1900;

/** The latest year a date may have. */
export const MAX_YEAR = 2100;

/** A date's parts as a form holds them, before they're checked. */
export type DateParts = { year: number; month: number | null; day: number | null };

/**
 * Whether these parts make a date: a whole year from 1900 to 2100, then
 * optionally a month from 1 to 12, then optionally a day that month has
 * (29 February only in a leap year). A day without a month is not a date.
 */
export function isValidDate(date: DateParts): date is ResumeDate {
  const { year, month, day } = date;
  if (!Number.isInteger(year) || year < MIN_YEAR || year > MAX_YEAR) return false;
  if (month === null) return day === null;
  if (!Number.isInteger(month) || month < 1 || month > 12) return false;
  return day === null || (Number.isInteger(day) && day >= 1 && day <= daysInMonth(year, month));
}

/** How many days the month (1-12) has in this year. */
export function daysInMonth(year: number, month: number): number {
  // Day 0 of the next month is this month's last day. Date counts months from 0.
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/**
 * Whether the end date is before the start date, as far as both of them go:
 * "2022" isn't before "Mar 2022", since it may mean that same month. The
 * Resume allows such dates (see updateDates); the editor warns about them.
 */
export function endsBeforeStart({ start, end }: DateRange): boolean {
  if (!start || !end) return false;
  const pairs = [
    [end.year, start.year],
    [end.month, start.month],
    [end.day, start.day],
  ];
  for (const [endPart, startPart] of pairs) {
    if (endPart === null || startPart === null) return false;
    if (endPart !== startPart) return endPart < startPart;
  }
  return false;
}

/** New start and/or end dates. null clears a date; a date left out stays as it is. */
export type DateChanges = {
  start?: ResumeDate | null;
  end?: ResumeDate | null;
};

/**
 * The Resume with an Entry's start and/or end date set or cleared. The whole
 * change is rejected, and the given Resume comes back unchanged, if a date
 * isn't valid (see isValidDate) or if it gives a Current Entry an end date.
 * An end date before the start date is allowed.
 */
export function updateDates(
  resume: Resume,
  entryId: string,
  { start, end }: DateChanges,
  options: EditOptions = {},
): Resume {
  const dates = datesOf(resume, entryId);
  if (!dates) return resume;
  if ((start && !isValidDate(start)) || (end && !isValidDate(end))) return resume;
  if (end && dates.current) return resume;

  const newStart = start === undefined ? dates.start : start;
  return withDates(
    resume,
    entryId,
    dates.current
      ? { start: newStart, current: true, end: null }
      : { start: newStart, current: false, end: end === undefined ? dates.end : end },
    options,
  );
}

/**
 * The Resume with an Entry marked Current or not. Marking it Current removes
 * its end date, and unmarking it later doesn't bring that date back.
 */
export function setCurrent(
  resume: Resume,
  entryId: string,
  current: boolean,
  options: EditOptions = {},
): Resume {
  const dates = datesOf(resume, entryId);
  if (!dates) return resume;
  return withDates(
    resume,
    entryId,
    current
      ? { start: dates.start, current: true, end: null }
      : { start: dates.start, current: false, end: dates.end },
    options,
  );
}

/** The dates of the Entry with this id, or null if there's no such Entry or it has no dates. */
function datesOf(resume: Resume, entryId: string): DateRange | null {
  for (const section of resume.content.sections) {
    const entry = section.entries.find((e) => e.id === entryId);
    if (entry) return "dates" in entry ? entry.dates : null;
  }
  return null;
}

function withDates(resume: Resume, entryId: string, dates: DateRange, options: EditOptions): Resume {
  return editSections(
    resume,
    (section) => editEntry(section, entryId, (entry) => ("dates" in entry ? { ...entry, dates } : entry)),
    options,
  );
}
