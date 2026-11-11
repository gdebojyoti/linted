import type { DropSide } from "./use-reorderable";

/**
 * The line showing where a dragged item will land: in the gap before or
 * after the item it's drawn on, which must be positioned (`relative`).
 * `gap` is the space between items in pixels, so the line sits in its middle.
 */
export function DropMarker({ side, gap }: { side: DropSide; gap: number }) {
  const offset = -(gap / 2) - 1;
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 h-0.5 rounded-full bg-accent"
      style={side === "before" ? { top: offset } : { bottom: offset }}
    />
  );
}
