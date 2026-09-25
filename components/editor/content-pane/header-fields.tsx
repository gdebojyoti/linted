import { Plus } from "lucide-react";
import type { HeaderSection, Resume } from "@/lib/resume/types";
import { updateContact, type ContactChanges } from "@/lib/resume/update-contact";
import { updateHeader } from "@/lib/resume/update-header";
import { TextField } from "@/components/common/text-field";
import { Button } from "@/components/ui/button";
import { ContactRow } from "./contact-row";
import { LinkRow } from "./link-row";
import { useEntryList } from "./use-entry-list";

// The Header's own fields and its contact items. The Header can't be renamed,
// so it has no title field.

export function HeaderFields({
  header,
  onEdit,
}: {
  header: HeaderSection;
  onEdit: (edit: (resume: Resume) => Resume) => void;
}) {
  const { addedId, addButtonRef, add, remove, setEnabled } = useEntryList(header.id, onEdit);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Name" value={header.name} onChange={(name) => onEdit((r) => updateHeader(r, { name }))} />
        <TextField
          label="Headline"
          value={header.headline}
          onChange={(headline) => onEdit((r) => updateHeader(r, { headline }))}
        />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold text-ink">Contact</h3>
        <ul className="flex flex-col gap-3">
          {header.entries.map((entry) => {
            const onUpdate = (changes: ContactChanges) => onEdit((r) => updateContact(r, entry.id, changes));
            const onEnabledChange = (enabled: boolean) => setEnabled(entry.id, enabled);

            return entry.kind === "link" ? (
              <LinkRow
                key={entry.id}
                entry={entry}
                onUpdate={onUpdate}
                onEnabledChange={onEnabledChange}
                onDelete={() => remove(entry.id)}
                autoFocus={entry.id === addedId}
              />
            ) : (
              <ContactRow key={entry.id} entry={entry} onUpdate={onUpdate} onEnabledChange={onEnabledChange} />
            );
          })}
        </ul>
        <Button ref={addButtonRef} variant="outline" size="sm" onClick={add} className="self-start">
          <Plus aria-hidden="true" />
          Add link
        </Button>
      </div>
    </div>
  );
}
