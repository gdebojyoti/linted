// Classes shared by the rows that can be moved (Entries, Bullets) and their
// lists, so they drag and drop alike.

/**
 * Which kind of row it is. Each kind is its own Tailwind group, so hovering
 * an Entry card doesn't show the arrows of the Bullets inside it.
 */
export type RowGroup = "entry" | "bullet";

/**
 * A list of movable rows. The list also sets `--row-gap`, the space between
 * rows, e.g. `[--row-gap:8px]`; it's `isolate` so each row's drop layer
 * (below) sits behind the rows but above whatever is under the list.
 */
export const movableListClass = "isolate flex flex-col gap-(--row-gap)";

const groupClass: Record<RowGroup, string> = { entry: "group/entry", bullet: "group/bullet" };

/**
 * A movable row: faded while dragged, with a `before:` drop layer behind it.
 * The caller sets how far the layer reaches: across the row, and into the
 * gap either side (half of `--row-gap`, plus any border), so no drop between
 * rows is lost.
 */
export function movableRowClass(group: RowGroup, faded: boolean): string {
  return `${groupClass[group]} relative before:absolute before:-z-10 ${faded ? "opacity-40" : ""}`;
}

const arrowsClass: Record<RowGroup, string> = {
  entry: "opacity-0 group-hover/entry:opacity-100 group-focus-within/entry:opacity-100",
  bullet: "opacity-0 group-hover/bullet:opacity-100 group-focus-within/bullet:opacity-100",
};

/** A row's move arrows show only while the pointer is over it or focus is in it. */
export function arrowsOnHoverOrFocusClass(group: RowGroup): string {
  return arrowsClass[group];
}
