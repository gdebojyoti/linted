import { Badge } from "@/components/common/badge";
import { TextField } from "@/components/common/text-field";
import { formatDateRange } from "@/lib/format/date-range";
import { currentLabel } from "@/lib/resume/current-label";
import type { ExperienceEntry, ResumeEdit } from "@/lib/resume/types";
import { updateExperienceEntry } from "@/lib/resume/update-experience-entry";
import { BulletsFields } from "./bullets-fields";
import { DatesFields } from "./dates-fields";
import { EntryCard } from "./entry-card";
import type { EntryCardProps } from "./entry-card-list";

/**
 * An Experience Entry: a job. Its card's header line shows the company and
 * role, and "Current" or its dates; the card holds its company, role,
 * location, dates and Bullets. A new Entry has focus on Company.
 */
export function ExperienceEntryCard({
  entry,
  index,
  onEdit,
  onEnabledChange,
  onDelete,
  expanded,
  onToggle,
  isNew,
}: {
  entry: ExperienceEntry;
  onEdit: (edit: ResumeEdit) => void;
} & EntryCardProps) {
  const company = entry.company.trim();
  const role = entry.role.trim();
  const named = company || role;

  return (
    <EntryCard
      name={named ? `${named} entry` : `Entry ${index + 1}`}
      enabled={entry.enabled}
      onEnabledChange={onEnabledChange}
      onDelete={onDelete}
      expanded={expanded}
      onToggle={onToggle}
      title={
        named ? (
          <>
            {company && <span className="font-semibold">{company}</span>}
            {company && role && " "}
            {role && <span className="text-ink-muted">{role}</span>}
          </>
        ) : (
          <span className="text-ink-meta">New entry</span>
        )
      }
      meta={entry.dates.current ? <Badge>Current</Badge> : formatDateRange(entry.dates)}
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Company"
            placeholder="e.g. Paystream"
            value={entry.company}
            onChange={(company) => onEdit((r) => updateExperienceEntry(r, entry.id, { company }))}
            autoFocus={isNew}
          />
          <TextField
            label="Role"
            placeholder="e.g. Backend Engineer"
            value={entry.role}
            onChange={(role) => onEdit((r) => updateExperienceEntry(r, entry.id, { role }))}
          />
        </div>
        <TextField
          label="Location"
          placeholder="e.g. London, UK"
          value={entry.location}
          onChange={(location) => onEdit((r) => updateExperienceEntry(r, entry.id, { location }))}
        />
        <DatesFields
          entryId={entry.id}
          dates={entry.dates}
          currentLabel={currentLabel("experience")}
          onEdit={onEdit}
        />
        <BulletsFields entryId={entry.id} bullets={entry.bullets} onEdit={onEdit} />
      </div>
    </EntryCard>
  );
}
