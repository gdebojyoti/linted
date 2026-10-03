import { useState } from "react";
import type { ExperienceSection, ResumeEdit } from "@/lib/resume/types";
import { AddEntryButton } from "./add-entry-button";
import { ExperienceEntryCard } from "./experience-entry-card";
import { useEntryList } from "./use-entry-list";

/**
 * The Experience Section's Entries, one card per job. One card is open at
 * a time: opening one, or adding one, closes the others. All start closed.
 */
export function ExperienceFields({
  section,
  onEdit,
}: {
  section: ExperienceSection;
  onEdit: (edit: ResumeEdit) => void;
}) {
  const { addedId, addButtonRef, add, remove, setEnabled } = useEntryList(section.id, onEdit);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {section.entries.length > 0 && (
        <ul className="flex flex-col gap-2">
          {section.entries.map((entry, index) => (
            <ExperienceEntryCard
              key={entry.id}
              entry={entry}
              index={index}
              onEdit={onEdit}
              onEnabledChange={(enabled) => setEnabled(entry.id, enabled)}
              onDelete={() => remove(entry.id)}
              expanded={entry.id === openId}
              onToggle={() => setOpenId(entry.id === openId ? null : entry.id)}
              isNew={entry.id === addedId}
            />
          ))}
        </ul>
      )}
      <AddEntryButton ref={addButtonRef} onClick={() => setOpenId(add())}>
        Add entry
      </AddEntryButton>
    </div>
  );
}
