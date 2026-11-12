import { useState } from "react";
import type { RowReorder } from "@/components/common/drag/row-reorder";
import type { DropSide } from "@/components/common/drag/use-reorderable";
import { bulletLines } from "@/lib/resume/bullet-lines";
import { bulletMoveGap, canMoveBullet, canPlaceBullet, placeBullet, placedBullets } from "@/lib/resume/bullets";
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

  /** Places the Bullet at the gap, and words the move from the Bullets as they are now. */
  function place(bulletId: string, index: number, wording: string) {
    const placed = placedBullets(bullets, bulletId, index);
    if (!placed) return;
    onEdit((resume) => placeBullet(resume, bulletId, index));
    setAnnouncement(`Bullet ${numberIn(bullets, bulletId)} ${wording}, now Bullet ${numberIn(placed, bulletId)}.`);
  }

  function reorder(bulletId: string): RowReorder {
    return {
      group: `bullets-${entryId}`,
      id: bulletId,
      canMove: (direction) => canMoveBullet(bullets, bulletId, direction),
      onMove: (direction: MoveDirection) =>
        place(bulletId, bulletMoveGap(bullets, bulletId, direction), `moved ${direction}`),
      accepts: (sourceId, side) => canPlaceBullet(bullets, sourceId, gapBeside(bulletId, side)),
      /** Only called once `accepts` has said yes. */
      onDrop: (sourceId, side) => place(sourceId, gapBeside(bulletId, side), "dropped"),
    };
  }

  return { reorder, announcement };
}
