import { Badge } from "@/components/common/badge";
import { TextField } from "@/components/common/text-field";
import { formatDateRange } from "@/lib/format/date-range";
import { currentLabel } from "@/lib/resume/current-label";
import type { EducationEntry, ResumeEdit } from "@/lib/resume/types";
import { updateEducationEntry } from "@/lib/resume/update-education-entry";
import { BulletsFields } from "./bullets-fields";
import { DatesFields } from "./dates-fields";
import { EntryCard } from "./entry-card";
import type { EntryCardProps } from "./entry-card-list";

/**
 * An Education Entry: a degree. Its card's header line shows the institution
 * and degree, and "Current" or its dates; the card holds its institution and
 * degree side by side, its location and GPA or results side by side, then
 * its dates and Bullets. A new Entry has focus on Institution.
 */
export function EducationEntryCard({
  entry,
  name,
  heading,
  reorder,
  onEdit,
  onEnabledChange,
  onDelete,
  expanded,
  onToggle,
  isNew,
}: {
  entry: EducationEntry;
  onEdit: (edit: ResumeEdit) => void;
} & EntryCardProps) {
  return (
    <EntryCard
      name={name}
      enabled={entry.enabled}
      onEnabledChange={onEnabledChange}
      onDelete={onDelete}
      expanded={expanded}
      onToggle={onToggle}
      reorder={reorder}
      heading={heading}
      meta={entry.dates.current ? <Badge>Current</Badge> : formatDateRange(entry.dates)}
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Institution"
            placeholder="e.g. University of Manchester"
            value={entry.institution}
            onChange={(institution) => onEdit((r) => updateEducationEntry(r, entry.id, { institution }))}
            autoFocus={isNew}
          />
          <TextField
            label="Degree"
            placeholder="e.g. BSc Computer Science"
            value={entry.degree}
            onChange={(degree) => onEdit((r) => updateEducationEntry(r, entry.id, { degree }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Location"
            placeholder="e.g. Manchester, UK"
            value={entry.location}
            onChange={(location) => onEdit((r) => updateEducationEntry(r, entry.id, { location }))}
          />
          <TextField
            label="GPA / results"
            placeholder="e.g. First-class honours"
            value={entry.results}
            onChange={(results) => onEdit((r) => updateEducationEntry(r, entry.id, { results }))}
          />
        </div>
        <DatesFields
          entryId={entry.id}
          dates={entry.dates}
          currentLabel={currentLabel("education")}
          onEdit={onEdit}
        />
        <BulletsFields entryId={entry.id} bullets={entry.bullets} onEdit={onEdit} />
      </div>
    </EntryCard>
  );
}
