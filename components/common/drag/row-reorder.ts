import type { MoveDirection } from "@/lib/resume/layout";
import type { DropSide } from "./use-reorderable";

/**
 * What a row (an Entry, a Bullet) needs to be moved within its list: dragged
 * by its grip, among the rows of the same `group` (e.g. its Section), or
 * moved one place with its arrows. From useEntryMoves's or useBulletMoves's
 * `reorder`.
 */
export type RowReorder = {
  group: string;
  id: string;
  canMove: (direction: MoveDirection) => boolean;
  onMove: (direction: MoveDirection) => void;
  accepts: (sourceId: string, side: DropSide) => boolean;
  onDrop: (sourceId: string, side: DropSide) => void;
};
