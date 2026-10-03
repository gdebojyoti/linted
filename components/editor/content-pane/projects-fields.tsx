import { useState } from "react";
import type { ProjectsSection, ResumeEdit } from "@/lib/resume/types";
import { AddEntryButton } from "./add-entry-button";
import { ProjectEntryCard } from "./project-entry-card";
import { useEntryList } from "./use-entry-list";

/**
 * The Projects Section's Entries, one card per project. One card is open at
 * a time: opening one, or adding one, closes the others. All start closed.
 */
export function ProjectsFields({
  section,
  onEdit,
}: {
  section: ProjectsSection;
  onEdit: (edit: ResumeEdit) => void;
}) {
  const { addedId, addButtonRef, add, remove, setEnabled } = useEntryList(section.id, onEdit);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {section.entries.length > 0 && (
        <ul className="flex flex-col gap-2">
          {section.entries.map((entry, index) => (
            <ProjectEntryCard
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
