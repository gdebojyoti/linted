import { ArrowDown, ArrowUp } from "lucide-react";
import { flushSync } from "react-dom";
import { Button } from "@/components/ui/button";
import type { MoveDirection } from "@/lib/resume/layout";

/**
 * An arrow that moves a selected Section chip one place up or down. When the
 * move can't happen it is disabled but stays focusable, so focus isn't lost
 * when a move takes the chip to the end of its Zone. Focus stays on the
 * arrow after the move, even though the chip changes place in the list.
 */
export function MoveButton({
  direction,
  sectionTitle,
  enabled,
  onMove,
}: {
  direction: MoveDirection;
  sectionTitle: string;
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
      aria-label={`Move ${sectionTitle} ${direction}`}
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
