import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, type LucideIcon } from "lucide-react";
import { flushSync } from "react-dom";
import { Button } from "@/components/ui/button";
import type { SectionMoveDirection } from "@/lib/resume/layout";

const ICONS: Record<SectionMoveDirection, LucideIcon> = { up: ArrowUp, down: ArrowDown, left: ArrowLeft, right: ArrowRight };

/**
 * An arrow that moves a row (a Section chip, an Entry) one step; `name`
 * names the row, as in "Move Skills up", unless `label` says it all. When
 * the move can't happen it is disabled but stays focusable, so focus isn't
 * lost when a move takes the row to the end of its list. Focus stays on the
 * arrow after the move, even though the row changes place in the list; a
 * row that moves to another list finds its arrow again by `data-direction`.
 */
export function MoveButton<D extends SectionMoveDirection>({
  direction,
  name,
  label,
  enabled,
  onMove,
}: {
  direction: D;
  name: string;
  label?: string;
  enabled: boolean;
  onMove: (direction: D) => void;
}) {
  const Icon: LucideIcon = ICONS[direction];
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      disabled={!enabled}
      focusableWhenDisabled
      aria-label={label ?? `Move ${name} ${direction}`}
      data-direction={direction}
      onClick={(event) => {
        const button = event.currentTarget;
        flushSync(() => onMove(direction));
        button.focus();
      }}
      className="text-ink data-disabled:cursor-default data-disabled:opacity-30 data-disabled:hover:bg-transparent"
    >
      <Icon aria-hidden="true" className="size-3.5" />
    </Button>
  );
}
