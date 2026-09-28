import type { ResumeEdit, SummarySection } from "@/lib/resume/types";
import { updateSummaryEntry } from "@/lib/resume/update-summary-entry";
import { AddEntryButton } from "./add-entry-button";
import { SummaryEntryRow } from "./summary-entry-row";
import { useEntryList } from "./use-entry-list";

/**
 * The Summary Section's Entries, one pitch each. Any number can be Enabled,
 * so the user can switch pitches by toggling them.
 */
export function SummaryFields({
  section,
  onEdit,
}: {
  section: SummarySection;
  onEdit: (edit: ResumeEdit) => void;
}) {
  const { addedId, addButtonRef, add, remove, setEnabled, move } = useEntryList(section.id, onEdit);

  return (
    <div className="flex flex-col gap-3">
      {section.entries.length > 0 && (
        <ul className="flex flex-col gap-4">
          {section.entries.map((entry, index) => (
            <SummaryEntryRow
              key={entry.id}
              entry={entry}
              index={index}
              count={section.entries.length}
              onTextChange={(text) => onEdit((r) => updateSummaryEntry(r, entry.id, text))}
              onEnabledChange={(enabled) => setEnabled(entry.id, enabled)}
              onMove={(direction) => move(entry.id, direction)}
              onDelete={() => remove(entry.id)}
              autoFocus={entry.id === addedId}
            />
          ))}
        </ul>
      )}
      <AddEntryButton ref={addButtonRef} onClick={add}>
        Add summary
      </AddEntryButton>
    </div>
  );
}
