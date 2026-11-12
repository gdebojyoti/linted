import { useState } from "react";
import type { RowReorder } from "@/components/common/drag/row-reorder";
import type { DropSide } from "@/components/common/drag/use-reorderable";
import { bulletLines } from "@/lib/resume/bullet-lines";
import {
  canMoveBullet,
  canPlaceBullet,
  moveBullet,
  movedBullets,
  placeBullet,
  placedBullets,
} from "@/lib/resume/bullets";
import type { MoveDirection } from "@/lib/resume/layout";
import type { Bullet, ResumeEdit } from "@/lib/resume/types";

/**
 * Moving an Entry's Bullets. `reorder` gives a Bullet's row what it needs to
 * be dragged within the Entry, and only there, or moved with its arrows; the
 * Resume module keeps each Bullet at its level (see placeBullet). Each move
 * is worded in `announcement`, for screen readers, e.g. "Bullet 1.2 moved
 * down, now Bullet 2.1." The wording is fixed when the move is made, so later
 * edits don't change it and have it read out again.
 */
export function useBulletMoves(entryId: string, bullets: Bullet[], onEdit: (edit: ResumeEdit) => void) {
  const [announcement, setAnnouncement] = useState("");
  const lines = bulletLines(bullets);

  /** The gap in reading order on this side of the target Bullet, for a drop beside it. */
  const gapBeside = (targetId: string, side: DropSide) =>
    lines.findIndex((line) => line.bullet.id === targetId) + (side === "after" ? 1 : 0);

  /** Where the Bullet is numbered among these Bullets, e.g. "2.1". */
  const numberIn = (list: Bullet[], bulletId: string) =>
    bulletLines(list).find((line) => line.bullet.id === bulletId)?.number;

  /** Makes the edit, and words the move from the Bullets as they are now and as they'll be. */
  function apply(bulletId: string, after: Bullet[] | null, edit: ResumeEdit, wording: string) {
    if (!after) return;
    onEdit(edit);
    setAnnouncement(`Bullet ${numberIn(bullets, bulletId)} ${wording}, now Bullet ${numberIn(after, bulletId)}.`);
  }

  function place(bulletId: string, index: number) {
    apply(bulletId, placedBullets(bullets, bulletId, index), (r) => placeBullet(r, bulletId, index), "dropped");
  }

  function move(bulletId: string, direction: MoveDirection) {
    const after = movedBullets(bullets, bulletId, direction);
    apply(bulletId, after, (r) => moveBullet(r, bulletId, direction), `moved ${direction}`);
  }

  function reorder(bulletId: string): RowReorder {
    return {
      group: `bullets-${entryId}`,
      id: bulletId,
      canMove: (direction) => canMoveBullet(bullets, bulletId, direction),
      onMove: (direction) => move(bulletId, direction),
      accepts: (sourceId, side) => canPlaceBullet(bullets, sourceId, gapBeside(bulletId, side)),
      /** Only called once `accepts` has said yes. */
      onDrop: (sourceId, side) => place(sourceId, gapBeside(bulletId, side)),
    };
  }

  return { reorder, announcement };
}
