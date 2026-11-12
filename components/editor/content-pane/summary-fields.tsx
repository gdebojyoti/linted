import type { ResumeEdit, SummarySection } from "@/lib/resume/types";
import { updateSummaryEntry } from "@/lib/resume/update-summary-entry";
import { LiveMessage } from "@/components/common/live-message";
import { AddEntryButton } from "./add-entry-button";
import { entryName } from "./entry-name";
import { SummaryEntryRow } from "./summary-entry-row";
import { movableListClass } from "@/components/common/drag/movable-row-classes";
import { useEntryList } from "./use-entry-list";
import { useEntryMoves } from "./use-entry-moves";

/**
 * The Summary Section's Entries, one pitch each. Any number can be Enabled,
 * so the user can switch pitches by toggling them. They are dragged or moved
 * with their arrows within the Section, and each move is read out to screen
 * readers.
 */
export function SummaryFields({
  section,
  onEdit,
}: {
  section: SummarySection;
  onEdit: (edit: ResumeEdit) => void;
}) {
  const { addedId, addButtonRef, add, remove, setEnabled } = useEntryList(section.id, onEdit);
  const { reorder, announcement } = useEntryMoves(section, onEdit);

  return (
    <div className="flex flex-col gap-3">
      {section.entries.length > 0 && (
        <ul className={`${movableListClass} [--row-gap:16px]`}>
          {section.entries.map((entry, index) => (
            <SummaryEntryRow
              key={entry.id}
              entry={entry}
              name={entryName(section, index)}
              reorder={reorder(entry.id)}
              onTextChange={(text) => onEdit((r) => updateSummaryEntry(r, entry.id, text))}
              onEnabledChange={(enabled) => setEnabled(entry.id, enabled)}
              onDelete={() => remove(entry.id)}
              autoFocus={entry.id === addedId}
            />
          ))}
        </ul>
      )}
      <AddEntryButton ref={addButtonRef} onClick={add}>
        Add summary
      </AddEntryButton>
      <LiveMessage message={announcement} />
    </div>
  );
}
