import { useState } from "react";
import type { DropSide } from "@/components/common/drag/use-reorderable";
import type { MoveDirection } from "@/lib/resume/layout";
import type { ResumeEdit } from "@/lib/resume/types";
import { canMoveEntry, canPlaceEntry, moveEntry, placeEntry } from "@/lib/resume/entries";
import { entryName, type MovableSection } from "./entry-name";
import type { EntryReorder } from "./entry-reorder";

/**
 * Moving a Section's Entries. `reorder` gives an Entry's row what it needs to
 * be dragged within the Section, and only there, or moved with its arrows.
 * The last move is worded in `announcement`, for screen readers, from the
 * Section as it now is, e.g. "Paystream entry moved up, position 1 of 3."
 */
export function useEntryMoves(section: MovableSection, onEdit: (edit: ResumeEdit) => void) {
  const sectionId = section.id;
  const [lastMove, setLastMove] = useState<{ entryId: string; how: string } | null>(null);

  const indexOf = (entryId: string) => section.entries.findIndex((entry) => entry.id === entryId);
  /** The gap on this side of the target Entry, for a drop beside it. */
  const gapBeside = (targetId: string, side: DropSide) => indexOf(targetId) + (side === "after" ? 1 : 0);

  const movedIndex = lastMove ? indexOf(lastMove.entryId) : -1;
  const announcement =
    lastMove && movedIndex !== -1
      ? `${entryName(section, movedIndex)} ${lastMove.how}, position ${movedIndex + 1} of ${section.entries.length}.`
      : "";

  function reorder(entryId: string): EntryReorder {
    return {
      group: `entries-${sectionId}`,
      id: entryId,
      canMove: (direction) => canMoveEntry(section, entryId, direction),
      onMove(direction: MoveDirection) {
        onEdit((resume) => moveEntry(resume, sectionId, entryId, direction));
        setLastMove({ entryId, how: `moved ${direction}` });
      },
      accepts: (sourceId, side) => canPlaceEntry(section, sourceId, gapBeside(entryId, side)),
      /** Only called once `accepts` has said yes. */
      onDrop(sourceId, side) {
        const index = gapBeside(entryId, side);
        onEdit((resume) => placeEntry(resume, sectionId, sourceId, index));
        setLastMove({ entryId: sourceId, how: "dropped" });
      },
    };
  }

  return { reorder, announcement };
}
