import { Badge } from "@/components/common/badge";
import { TextField } from "@/components/common/text-field";
import { formatDateRange } from "@/lib/format/date-range";
import { currentLabel } from "@/lib/resume/current-label";
import type { CustomEntry, ResumeEdit } from "@/lib/resume/types";
import { updateCustomEntry } from "@/lib/resume/update-custom-entry";
import { BulletsFields } from "./bullets-fields";
import { DatesFields } from "./dates-fields";
import { EntryCard } from "./entry-card";
import type { EntryCardProps } from "./entry-card-list";

/**
 * An Entry of a Custom Section, in the generic shape. Its card's header line
 * shows the title and subtitle, and "Current" or its dates; the card holds
 * its title, subtitle, dates and Bullets, one under another. A new Entry has
 * focus on Title.
 */
export function CustomEntryCard({
  entry,
  index,
  onEdit,
  onEnabledChange,
  onDelete,
  expanded,
  onToggle,
  isNew,
}: {
  entry: CustomEntry;
  onEdit: (edit: ResumeEdit) => void;
} & EntryCardProps) {
  const title = entry.title.trim();
  const subtitle = entry.subtitle.trim();
  const named = title || subtitle;

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
            {title && <span className="font-semibold">{title}</span>}
            {title && subtitle && " "}
            {subtitle && <span className="text-ink-muted">{subtitle}</span>}
          </>
        ) : (
          <span className="text-ink-meta">New entry</span>
        )
      }
      meta={entry.dates.current ? <Badge>Current</Badge> : formatDateRange(entry.dates)}
    >
      <div className="flex flex-col gap-4">
        <TextField
          label="Title"
          placeholder="e.g. Idempotency at scale"
          value={entry.title}
          onChange={(title) => onEdit((r) => updateCustomEntry(r, entry.id, { title }))}
          autoFocus={isNew}
        />
        <TextField
          label="Subtitle"
          placeholder="e.g. GopherCon UK"
          value={entry.subtitle}
          onChange={(subtitle) => onEdit((r) => updateCustomEntry(r, entry.id, { subtitle }))}
        />
        <DatesFields entryId={entry.id} dates={entry.dates} currentLabel={currentLabel("custom")} onEdit={onEdit} />
        <BulletsFields entryId={entry.id} bullets={entry.bullets} onEdit={onEdit} />
      </div>
    </EntryCard>
  );
}
