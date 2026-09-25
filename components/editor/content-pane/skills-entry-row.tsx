import { Trash2 } from "lucide-react";
import type { SkillsEntry } from "@/lib/resume/types";
import type { SkillsEntryChanges } from "@/lib/resume/update-skills-entry";
import { TextField } from "@/components/common/text-field";
import { Button } from "@/components/ui/button";
import { EntryRow } from "./entry-row";

/** A Skills Entry: its label and its Skills as one line of text. */
export function SkillsEntryRow({
  entry,
  onUpdate,
  onEnabledChange,
  onDelete,
  autoFocus,
}: {
  entry: SkillsEntry;
  onUpdate: (changes: SkillsEntryChanges) => void;
  onEnabledChange: (enabled: boolean) => void;
  onDelete: () => void;
  autoFocus?: boolean;
}) {
  const label = entry.label.trim();

  return (
    <EntryRow
      name={label ? `${label} group` : "Group"}
      enabled={entry.enabled}
      onEnabledChange={onEnabledChange}
      columns="grid-cols-[1fr_2fr]"
      action={
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          aria-label={label ? `Delete ${label} group` : "Delete group"}
        >
          <Trash2 aria-hidden="true" />
        </Button>
      }
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
    </EntryRow>
  );
}
