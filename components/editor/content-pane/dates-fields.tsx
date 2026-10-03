import { Checkbox } from "@/components/ui/checkbox";
import { endsBeforeStart, setCurrent, updateDates } from "@/lib/resume/dates";
import type { DateRange, ResumeEdit } from "@/lib/resume/types";
import { DateField } from "./date-field";

/**
 * An Entry's start date, end date and Current checkbox, for every Section
 * whose Entries have dates. While the Entry is Current it has no end date, so
 * the end date's fields are hidden; unticking Current brings them back empty.
 * An end date before the start date is saved, with a warning (#21).
 */
export function DatesFields({
  entryId,
  dates,
  currentLabel,
  onEdit,
}: {
  entryId: string;
  dates: DateRange;
  /** The Current checkbox's label: `currentLabel()` in lib/resume/current-label.ts gives each Section's. */
  currentLabel: string;
  onEdit: (edit: ResumeEdit) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <DateField
        label="Start"
        date={dates.start}
        onChange={(start) => onEdit((r) => updateDates(r, entryId, { start }))}
      />
      {!dates.current && (
        <DateField
          label="End"
          date={dates.end}
          onChange={(end) => onEdit((r) => updateDates(r, entryId, { end }))}
          note={endsBeforeStart(dates) ? "The end date is before the start date." : undefined}
        />
      )}
      <label className="flex w-fit cursor-pointer items-center gap-2 text-[13px] text-ink">
        <Checkbox
          checked={dates.current}
          onCheckedChange={(current) => onEdit((r) => setCurrent(r, entryId, current))}
        />
        {currentLabel}
        <span className="text-ink-meta">— shown as “Present”</span>
      </label>
    </div>
  );
}
