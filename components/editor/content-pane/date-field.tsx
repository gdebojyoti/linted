import { useId, useState } from "react";
import { INPUT_CLASS } from "@/components/common/input-class";
import { monthName } from "@/lib/format/date-range";
import { dayChoices, draftOf, draftShows, readDraft, withMonth, type DateDraft } from "@/lib/resume/date-draft";
import type { ResumeDate } from "@/lib/resume/types";
import { DatePartSelect } from "./date-part-select";

const MONTHS = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: monthName(i + 1, "long") }));

/**
 * One date, such as an Entry's start: a typed year, then an optional month
 * and an optional day picked from lists. The Resume only takes valid dates,
 * so what's entered stays in the fields until it makes one, and the Resume
 * keeps the last valid date meanwhile. Clearing every field clears the date.
 *
 * An error says what to fix once the user leaves the year or picks a month
 * or day, not while they're still typing. `note` shows under a valid date,
 * e.g. a warning about it.
 */
export function DateField({
  label,
  date,
  onChange,
  note,
}: {
  /** "Start" or "End". Screen readers hear it with each field: "Start year", "Start month"… */
  label: string;
  date: ResumeDate | null;
  onChange: (date: ResumeDate | null) => void;
  note?: string;
}) {
  const labelId = useId();
  const messageId = useId();
  const [draft, setDraft] = useState(() => draftOf(date));
  const [touched, setTouched] = useState(false);
  const [shownDate, setShownDate] = useState(date);

  // A date changed from elsewhere replaces what's in the fields, unless they already say it.
  if (date !== shownDate) {
    setShownDate(date);
    if (!draftShows(draft, date)) {
      setDraft(draftOf(date));
      setTouched(false);
    }
  }

  const reading = readDraft(draft);
  const error = touched && !reading.ok ? reading : null;
  const message = error ? error.error : reading.ok ? note : undefined;
  const describedBy = message ? messageId : undefined;

  function change(next: DateDraft) {
    setDraft(next);
    const nextReading = readDraft(next);
    if (nextReading.ok && !draftShows(next, date)) onChange(nextReading.date);
  }

  function pick(next: DateDraft) {
    change(next);
    setTouched(true);
  }

  return (
    <div role="group" aria-labelledby={labelId} className="flex flex-col gap-1.5">
      <span id={labelId} className="text-xs font-medium text-ink-muted">
        {label}
      </span>
      <div className="grid grid-cols-[5rem_minmax(0,1fr)_5.5rem] gap-2">
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={4}
          aria-label={`${label} year`}
          placeholder="Year"
          value={draft.year}
          onChange={(event) => change({ ...draft, year: event.target.value })}
          onBlur={() => setTouched(true)}
          aria-invalid={error?.field === "year" || undefined}
          aria-describedby={describedBy}
          className={INPUT_CLASS}
        />
        <DatePartSelect
          label={`${label} month`}
          placeholder="Month"
          noneLabel="No month"
          value={draft.month}
          options={MONTHS}
          onChange={(month) => pick(withMonth(draft, month))}
          describedBy={describedBy}
        />
        <DatePartSelect
          label={`${label} day`}
          placeholder="Day"
          noneLabel="No day"
          value={draft.day}
          options={dayChoices(draft).map((day) => ({ value: day, label: `${day}` }))}
          onChange={(day) => pick({ ...draft, day })}
          disabled={draft.month === null}
          invalid={error?.field === "day"}
          describedBy={describedBy}
        />
      </div>
      {message && (
        <p id={messageId} className={`text-xs ${error ? "text-danger" : "text-ink-muted"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
