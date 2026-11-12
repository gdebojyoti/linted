import type { DropSide } from "@/components/common/drag/use-reorderable";
import type { MoveDirection } from "@/lib/resume/layout";

/**
 * What an Entry's row needs to be moved within its Section: dragged by its
 * grip, among the rows of the same `group` (its Section), or moved one place
 * with its arrows. From useEntryMoves's `reorder`.
 */
export type EntryReorder = {
  group: string;
  id: string;
  canMove: (direction: MoveDirection) => boolean;
  onMove: (direction: MoveDirection) => void;
  accepts: (sourceId: string, side: DropSide) => boolean;
  onDrop: (sourceId: string, side: DropSide) => void;
};
