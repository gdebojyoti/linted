import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import type { HeaderSection, Resume } from "@/lib/resume/types";
import { addEntry, deleteEntry, setEntryEnabled } from "@/lib/resume/entries";
import { updateContact, type ContactChanges } from "@/lib/resume/update-contact";
import { updateHeader } from "@/lib/resume/update-header";
import { TextField } from "@/components/common/text-field";
import { Button } from "@/components/ui/button";
import { ContactRow } from "./contact-row";
import { LinkRow } from "./link-row";

// The Header's own fields and its contact items. The Header can't be renamed,
// so it has no title field.

export function HeaderFields({
  header,
  onEdit,
}: {
  header: HeaderSection;
  onEdit: (edit: (resume: Resume) => Resume) => void;
}) {
  // A link the user just added gets focus; after a delete, focus moves to "Add link".
  const [addedId, setAddedId] = useState<string | null>(null);
  const addLinkRef = useRef<HTMLButtonElement>(null);

  function addLink() {
    const id = crypto.randomUUID();
    onEdit((resume) => addEntry(resume, header.id, { newId: () => id }));
    setAddedId(id);
  }

  function deleteLink(entryId: string) {
    onEdit((resume) => deleteEntry(resume, header.id, entryId));
    addLinkRef.current?.focus();
  }

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
            const onUpdate = (changes: ContactChanges) =>
              onEdit((r) => updateContact(r, entry.id, changes));
            const onEnabledChange = (enabled: boolean) =>
              onEdit((r) => setEntryEnabled(r, header.id, entry.id, enabled));

            return entry.kind === "link" ? (
              <LinkRow
                key={entry.id}
                entry={entry}
                onUpdate={onUpdate}
                onEnabledChange={onEnabledChange}
                onDelete={() => deleteLink(entry.id)}
                autoFocus={entry.id === addedId}
              />
            ) : (
              <ContactRow key={entry.id} entry={entry} onUpdate={onUpdate} onEnabledChange={onEnabledChange} />
            );
          })}
        </ul>
        <Button ref={addLinkRef} variant="outline" size="sm" onClick={addLink} className="self-start">
          <Plus aria-hidden="true" />
          Add link
        </Button>
      </div>
    </div>
  );
}
