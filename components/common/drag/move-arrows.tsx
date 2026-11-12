import type { MoveDirection } from "@/lib/resume/layout";
import { MoveButton } from "./move-button";

/**
 * A row's up and down arrows, the keyboard path for moving it. `className`
 * sets when they show, e.g. only while the row is pointed at or has focus.
 */
export function MoveArrows({
  name,
  canMove,
  onMove,
  className = "",
}: {
  name: string;
  canMove: (direction: MoveDirection) => boolean;
  onMove: (direction: MoveDirection) => void;
  className?: string;
}) {
  return (
    <div className={`relative flex shrink-0 gap-px ${className}`}>
      <MoveButton direction="up" name={name} enabled={canMove("up")} onMove={onMove} />
      <MoveButton direction="down" name={name} enabled={canMove("down")} onMove={onMove} />
    </div>
  );
}
