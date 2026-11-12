import { ArrowDown, ArrowUp } from "lucide-react";
import { flushSync } from "react-dom";
import { Button } from "@/components/ui/button";
import type { MoveDirection } from "@/lib/resume/layout";

/**
 * An arrow that moves a row (a Section chip, an Entry) one place up or
 * down; `name` names the row, as in "Move Skills up". When the move can't
 * happen it is disabled but stays focusable, so focus isn't lost when a
 * move takes the row to the end of its list. Focus stays on the arrow after
 * the move, even though the row changes place in the list.
 */
export function MoveButton({
  direction,
  name,
  enabled,
  onMove,
}: {
  direction: MoveDirection;
  name: string;
  enabled: boolean;
  onMove: (direction: MoveDirection) => void;
}) {
  const Icon = direction === "up" ? ArrowUp : ArrowDown;
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      disabled={!enabled}
      focusableWhenDisabled
      aria-label={`Move ${name} ${direction}`}
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
