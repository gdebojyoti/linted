import type { SkillsEntry } from "@/lib/resume/types";
import type { SkillsEntryChanges } from "@/lib/resume/update-skills-entry";
import { TextField } from "@/components/common/text-field";
import { DeleteEntryButton } from "./delete-entry-button";
import type { RowReorder } from "@/components/common/drag/row-reorder";
import { MovableEntryRow } from "./movable-entry-row";

/** A Skills Entry: its label and its Skills as one line of text. It can be moved within the Section. */
export function SkillsEntryRow({
  entry,
  name,
  reorder,
  onUpdate,
  onEnabledChange,
  onDelete,
  autoFocus,
}: {
  entry: SkillsEntry;
  /** Names the Entry for screen readers, e.g. "Languages entry". */
  name: string;
  reorder: RowReorder;
  onUpdate: (changes: SkillsEntryChanges) => void;
  onEnabledChange: (enabled: boolean) => void;
  onDelete: () => void;
  autoFocus?: boolean;
}) {
  const label = entry.label.trim();

  return (
    <MovableEntryRow
      name={name}
      reorder={reorder}
      enabled={entry.enabled}
      onEnabledChange={onEnabledChange}
      columns="grid-cols-[1fr_2fr]"
      action={<DeleteEntryButton label={label ? `Delete ${label} entry` : "Delete entry"} onClick={onDelete} />}
    >
      <TextField
        label="Label"
        placeholder="e.g. Languages"
        value={entry.label}
        onChange={(label) => onUpdate({ label })}
        autoFocus={autoFocus}
      />
      <TextField
        label="Skills"
        placeholder="e.g. Go, Python, SQL"
        value={entry.skills}
        onChange={(skills) => onUpdate({ skills })}
      />
    </MovableEntryRow>
  );
}
