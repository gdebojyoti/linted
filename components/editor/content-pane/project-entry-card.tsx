import { Badge } from "@/components/common/badge";
import { TextField } from "@/components/common/text-field";
import { formatDateRange } from "@/lib/format/date-range";
import { currentLabel } from "@/lib/resume/current-label";
import type { ProjectEntry, ResumeEdit } from "@/lib/resume/types";
import { updateProjectEntry } from "@/lib/resume/update-project-entry";
import { BulletsFields } from "./bullets-fields";
import { DatesFields } from "./dates-fields";
import { EntryCard } from "./entry-card";
import { LinkField } from "./link-field";

/**
 * A Project Entry. Its card's header line shows the name and tech stack,
 * and "Current" or its dates; the card holds its name, its link's label and
 * URL side by side (as in the Header), its tech stack, dates and Bullets.
 * A new Entry has focus on Name.
 */
export function ProjectEntryCard({
  entry,
  index,
  onEdit,
  onEnabledChange,
  onDelete,
  expanded,
  onToggle,
  isNew,
}: {
  entry: ProjectEntry;
  index: number;
  onEdit: (edit: ResumeEdit) => void;
  onEnabledChange: (enabled: boolean) => void;
  onDelete: () => void;
  expanded: boolean;
  onToggle: () => void;
  isNew: boolean;
}) {
  const name = entry.name.trim();
  const techStack = entry.techStack.trim();
  const named = name || techStack;

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
            {name && <span className="font-semibold">{name}</span>}
            {name && techStack && " "}
            {techStack && <span className="text-ink-muted">{techStack}</span>}
          </>
        ) : (
          <span className="text-ink-meta">New entry</span>
        )
      }
      meta={entry.dates.current ? <Badge>Current</Badge> : formatDateRange(entry.dates)}
    >
      <div className="flex flex-col gap-4">
        <TextField
          label="Name"
          placeholder="e.g. Ledgerly"
          value={entry.name}
          onChange={(name) => onEdit((r) => updateProjectEntry(r, entry.id, { name }))}
          autoFocus={isNew}
        />
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Label"
            placeholder="e.g. Live demo"
            value={entry.linkLabel}
            onChange={(linkLabel) => onEdit((r) => updateProjectEntry(r, entry.id, { linkLabel }))}
          />
          <LinkField
            label="URL"
            value={entry.link}
            onChange={(link) => onEdit((r) => updateProjectEntry(r, entry.id, { link }))}
          />
        </div>
        <TextField
          label="Tech stack"
          placeholder="e.g. Go, Postgres, HTMX"
          value={entry.techStack}
          onChange={(techStack) => onEdit((r) => updateProjectEntry(r, entry.id, { techStack }))}
        />
        <DatesFields entryId={entry.id} dates={entry.dates} currentLabel={currentLabel("projects")} onEdit={onEdit} />
        <BulletsFields entryId={entry.id} bullets={entry.bullets} onEdit={onEdit} />
      </div>
    </EntryCard>
  );
}
