import type { LinkEntry } from "@/lib/resume/types";
import type { ContactChanges } from "@/lib/resume/update-contact";
import { TextField } from "@/components/common/text-field";
import { DeleteEntryButton } from "./delete-entry-button";
import { EntryRow } from "./entry-row";
import { LinkField } from "./link-field";

/** A link in the Header: its label and URL. */
export function LinkRow({
  entry,
  onUpdate,
  onEnabledChange,
  onDelete,
  autoFocus,
}: {
  entry: LinkEntry;
  onUpdate: (changes: ContactChanges) => void;
  onEnabledChange: (enabled: boolean) => void;
  onDelete: () => void;
  autoFocus?: boolean;
}) {
  const label = entry.label.trim();
  const name = label ? `${label} link` : "Link";

  return (
    <EntryRow
      name={name}
      enabled={entry.enabled}
      onEnabledChange={onEnabledChange}
      action={<DeleteEntryButton label={label ? `Delete ${label} link` : "Delete link"} onClick={onDelete} />}
    >
      <TextField
        label="Label"
        placeholder="e.g. GitHub"
        value={entry.label}
        onChange={(label) => onUpdate({ label })}
        autoFocus={autoFocus}
      />
      <LinkField label="URL" value={entry.value} onChange={(value) => onUpdate({ value })} />
    </EntryRow>
  );
}
