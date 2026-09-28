import { ChevronDown, ChevronUp } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

/**
 * Move up and Move down for one Entry, disabled at the ends of its list.
 * When a move reaches an end, the button just pressed becomes disabled, so
 * focus goes to the other one instead of being lost.
 */
export function MoveEntryButtons({
  name,
  index,
  count,
  onMove,
}: {
  /** Names the Entry for screen readers, e.g. "Summary 2". */
  name: string;
  index: number;
  count: number;
  onMove: (direction: "up" | "down") => void;
}) {
  const upRef = useRef<HTMLButtonElement>(null);
  const downRef = useRef<HTMLButtonElement>(null);

  function move(direction: "up" | "down") {
    onMove(direction);
    const reachesEnd = direction === "up" ? index === 1 : index === count - 2;
    if (reachesEnd) requestAnimationFrame(() => (direction === "up" ? downRef : upRef).current?.focus());
  }

  return (
    <>
      <Button
        ref={upRef}
        variant="ghost"
        size="icon"
        aria-label={`Move ${name} up`}
        disabled={index === 0}
        onClick={() => move("up")}
      >
        <ChevronUp aria-hidden="true" />
      </Button>
      <Button
        ref={downRef}
        variant="ghost"
        size="icon"
        aria-label={`Move ${name} down`}
        disabled={index === count - 1}
        onClick={() => move("down")}
      >
        <ChevronDown aria-hidden="true" />
      </Button>
    </>
  );
}
