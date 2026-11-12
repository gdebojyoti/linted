import { useState } from "react";
import type { DropSide } from "@/components/common/drag/use-reorderable";
import { withEntries } from "@/lib/resume/edit-sections";
import { canMoveEntry, canPlaceEntry, moveGap, placedEntries, placeEntry } from "@/lib/resume/entries";
import type { MoveDirection } from "@/lib/resume/layout";
import type { ResumeEdit } from "@/lib/resume/types";
import { entryName, type MovableSection } from "./entry-name";
import type { RowReorder } from "@/components/common/drag/row-reorder";

/**
 * Moving a Section's Entries. `reorder` gives an Entry's row what it needs to
 * be dragged within the Section, and only there, or moved with its arrows.
 * Each move is worded in `announcement`, for screen readers, e.g. "Paystream
 * entry moved up, position 1 of 3." The wording is fixed when the move is
 * made, so later edits (typing in the Entry's name, adding one) don't change
 * it and have it read out again.
 */
export function useEntryMoves(section: MovableSection, onEdit: (edit: ResumeEdit) => void) {
  const sectionId = section.id;
  const [announcement, setAnnouncement] = useState("");

  /** The gap on this side of the target Entry, for a drop beside it. */
  const gapBeside = (targetId: string, side: DropSide) =>
    section.entries.findIndex((entry) => entry.id === targetId) + (side === "after" ? 1 : 0);

  /** Places the Entry at the gap, and words the move from the Section as it leaves it. */
  function place(entryId: string, index: number, wording: string) {
    const entries = placedEntries(section, entryId, index);
    if (!entries) return;
    onEdit((resume) => placeEntry(resume, sectionId, entryId, index));
    const at = entries.findIndex((entry) => entry.id === entryId);
    const name = entryName(withEntries(section, entries), at);
    setAnnouncement(`${name} ${wording}, position ${at + 1} of ${entries.length}.`);
  }

  function reorder(entryId: string): RowReorder {
    return {
      group: `entries-${sectionId}`,
      id: entryId,
      canMove: (direction) => canMoveEntry(section, entryId, direction),
      onMove: (direction: MoveDirection) => place(entryId, moveGap(section, entryId, direction), `moved ${direction}`),
      accepts: (sourceId, side) => canPlaceEntry(section, sourceId, gapBeside(entryId, side)),
      /** Only called once `accepts` has said yes. */
      onDrop: (sourceId, side) => place(sourceId, gapBeside(entryId, side), "dropped"),
    };
  }

  return { reorder, announcement };
}
