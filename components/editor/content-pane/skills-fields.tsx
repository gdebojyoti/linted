import type { ResumeEdit, SkillsSection } from "@/lib/resume/types";
import { updateSkillsEntry } from "@/lib/resume/update-skills-entry";
import { AddEntryButton } from "./add-entry-button";
import { entryName } from "./entry-name";
import { SkillsEntryRow } from "./skills-entry-row";
import { useEntryList } from "./use-entry-list";
import { useEntryMoves } from "./use-entry-moves";

/**
 * The Skills Section's Entries, each a label and a line of Skills. They are
 * dragged or moved with their arrows within the Section, and each move is
 * read out to screen readers.
 */
export function SkillsFields({
  section,
  onEdit,
}: {
  section: SkillsSection;
  onEdit: (edit: ResumeEdit) => void;
}) {
  const { addedId, addButtonRef, add, remove, setEnabled } = useEntryList(section.id, onEdit);
  const { reorder, announcement } = useEntryMoves(section, onEdit);

  return (
    <div className="flex flex-col gap-3">
      {section.entries.length > 0 && (
        <ul className="isolate flex flex-col gap-(--entry-gap) [--entry-gap:12px]">
          {section.entries.map((entry, index) => (
            <SkillsEntryRow
              key={entry.id}
              entry={entry}
              name={entryName(section, index)}
              reorder={reorder(entry.id)}
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
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
