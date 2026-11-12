import { Fragment, useState, type ReactNode } from "react";
import type { ResumeEdit } from "@/lib/resume/types";
import { LiveMessage } from "@/components/common/live-message";
import { AddEntryButton } from "./add-entry-button";
import { entryHeading, entryName, type CardSection, type EntryHeading } from "./entry-name";
import type { EntryReorder } from "./entry-reorder";
import { movableEntryListClass } from "./movable-entry-classes";
import { useEntryList } from "./use-entry-list";
import { useEntryMoves } from "./use-entry-moves";

/** What EntryCardList hands each card, to pass on to its EntryCard. */
export type EntryCardProps = {
  /** Names the Entry for screen readers, e.g. "Paystream entry". */
  name: string;
  /** What the card's header line shows, e.g. the company and role. */
  heading: EntryHeading;
  onEnabledChange: (enabled: boolean) => void;
  onDelete: () => void;
  expanded: boolean;
  onToggle: () => void;
  isNew: boolean;
  reorder: EntryReorder;
};

/**
 * A Section's Entries as cards (a job, a project, a degree), with "Add
 * entry" under them. One card is open at a time: opening one, or adding one,
 * closes the others. All start closed. `card` draws one Entry's card.
 *
 * Cards are dragged or moved with their arrows within the Section, and each
 * move is read out to screen readers.
 */
export function EntryCardList<S extends CardSection>({
  section,
  onEdit,
  card,
}: {
  section: S;
  onEdit: (edit: ResumeEdit) => void;
  card: (entry: S["entries"][number], props: EntryCardProps) => ReactNode;
}) {
  const { addedId, addButtonRef, add, remove, setEnabled } = useEntryList(section.id, onEdit);
  const { reorder, announcement } = useEntryMoves(section, onEdit);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {section.entries.length > 0 && (
        <ul className={`${movableEntryListClass} [--entry-gap:8px]`}>
          {section.entries.map((entry: S["entries"][number], index: number) => (
            <Fragment key={entry.id}>
              {card(entry, {
                name: entryName(section, index),
                heading: entryHeading(section, index),
                onEnabledChange: (enabled) => setEnabled(entry.id, enabled),
                onDelete: () => remove(entry.id),
                expanded: entry.id === openId,
                onToggle: () => setOpenId(entry.id === openId ? null : entry.id),
                isNew: entry.id === addedId,
                reorder: reorder(entry.id),
              })}
            </Fragment>
          ))}
        </ul>
      )}
      <AddEntryButton ref={addButtonRef} onClick={() => setOpenId(add())}>
        Add entry
      </AddEntryButton>
      <LiveMessage message={announcement} />
    </div>
  );
}
