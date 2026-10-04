import { Fragment, useState, type ReactNode } from "react";
import type { ResumeEdit, Section } from "@/lib/resume/types";
import { AddEntryButton } from "./add-entry-button";
import { useEntryList } from "./use-entry-list";

/** What EntryCardList hands each card, to pass on to its EntryCard. */
export type EntryCardProps = {
  index: number;
  onEnabledChange: (enabled: boolean) => void;
  onDelete: () => void;
  expanded: boolean;
  onToggle: () => void;
  isNew: boolean;
};

/**
 * A Section's Entries as cards (a job, a project, a degree), with "Add
 * entry" under them. One card is open at a time: opening one, or adding one,
 * closes the others. All start closed. `card` draws one Entry's card.
 */
export function EntryCardList<S extends Section>({
  section,
  onEdit,
  card,
}: {
  section: S;
  onEdit: (edit: ResumeEdit) => void;
  card: (entry: S["entries"][number], props: EntryCardProps) => ReactNode;
}) {
  const { addedId, addButtonRef, add, remove, setEnabled } = useEntryList(section.id, onEdit);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {section.entries.length > 0 && (
        <ul className="flex flex-col gap-2">
          {section.entries.map((entry, index) => (
            <Fragment key={entry.id}>
              {card(entry, {
                index,
                onEnabledChange: (enabled) => setEnabled(entry.id, enabled),
                onDelete: () => remove(entry.id),
                expanded: entry.id === openId,
                onToggle: () => setOpenId(entry.id === openId ? null : entry.id),
                isNew: entry.id === addedId,
              })}
            </Fragment>
          ))}
        </ul>
      )}
      <AddEntryButton ref={addButtonRef} onClick={() => setOpenId(add())}>
        Add entry
      </AddEntryButton>
    </div>
  );
}
