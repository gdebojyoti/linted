import type { DropSide } from "./use-reorderable";

/**
 * The line showing where a dragged row will land, drawn on the row beside
 * it, which must be positioned (`relative`). `outset` is how far past the
 * row's edge the line starts, as a CSS length, so it can sit in the middle
 * of the gap between rows.
 */
export function DropMarker({ side, outset }: { side: DropSide; outset: string }) {
  const offset = `calc(-1 * (${outset}))`;
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 h-0.5 rounded-full bg-accent"
      style={side === "before" ? { top: offset } : { bottom: offset }}
    />
  );
}
