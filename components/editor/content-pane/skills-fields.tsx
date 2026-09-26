import type { ResumeEdit, SkillsSection } from "@/lib/resume/types";
import { updateSkillsEntry } from "@/lib/resume/update-skills-entry";
import { AddEntryButton } from "./add-entry-button";
import { SkillsEntryRow } from "./skills-entry-row";
import { useEntryList } from "./use-entry-list";

/** The Skills Section's Entries, each a label and a line of Skills. */
export function SkillsFields({
  section,
  onEdit,
}: {
  section: SkillsSection;
  onEdit: (edit: ResumeEdit) => void;
}) {
  const { addedId, addButtonRef, add, remove, setEnabled } = useEntryList(section.id, onEdit);

  return (
    <div className="flex flex-col gap-3">
      {section.entries.length > 0 && (
        <ul className="flex flex-col gap-3">
          {section.entries.map((entry) => (
            <SkillsEntryRow
              key={entry.id}
              entry={entry}
              onUpdate={(changes) => onEdit((r) => updateSkillsEntry(r, entry.id, changes))}
              onEnabledChange={(enabled) => setEnabled(entry.id, enabled)}
              onDelete={() => remove(entry.id)}
              autoFocus={entry.id === addedId}
            />
          ))}
        </ul>
      )}
      <AddEntryButton ref={addButtonRef} onClick={add}>
        Add entry
      </AddEntryButton>
    </div>
  );
}
