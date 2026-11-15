import type { Ref } from "react";
import { MoveButton } from "@/components/common/drag/move-button";
import type { SectionMoveDirection } from "@/lib/resume/layout";
import { ZONE_WORDS } from "./zone-words";

/**
 * A Section chip's arrows, the keyboard path for moving it: left, up, down,
 * right, as in the design. Up and down are always there, disabled where the
 * move can't happen. Left and right show only where they can move the
 * Section (#108): left in main, right in the sidebar, neither in Ledger.
 * `className` sets when they show, e.g. only while the chip is pointed at or
 * has focus.
 */
export function SectionMoveArrows({
  name,
  canMove,
  onMove,
  className = "",
  ref,
}: {
  name: string;
  canMove: (direction: SectionMoveDirection) => boolean;
  onMove: (direction: SectionMoveDirection) => void;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <div ref={ref} className={`relative flex shrink-0 gap-px ${className}`}>
      {canMove("left") && (
        <MoveButton
          direction="left"
          name={name}
          label={`Move ${name} to ${ZONE_WORDS.sidebar.into}`}
          enabled
          onMove={onMove}
        />
      )}
      <MoveButton direction="up" name={name} enabled={canMove("up")} onMove={onMove} />
      <MoveButton direction="down" name={name} enabled={canMove("down")} onMove={onMove} />
      {canMove("right") && (
        <MoveButton
          direction="right"
          name={name}
          label={`Move ${name} to ${ZONE_WORDS.main.into}`}
          enabled
          onMove={onMove}
        />
      )}
    </div>
  );
}
