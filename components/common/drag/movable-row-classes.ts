// Classes shared by the Entries that can be moved (EntryCard,
// MovableEntryRow) and their lists, so they drag and drop alike.

/**
 * A list of movable Entries. The list also sets `--entry-gap`, the space
 * between Entries, e.g. `[--entry-gap:8px]`; it's `isolate` so each
 * Entry's drop layer (below) sits behind the Entries but above whatever is
 * under the list.
 */
export const movableEntryListClass = "isolate flex flex-col gap-(--entry-gap)";

/**
 * A movable Entry: faded while dragged, with a `before:` drop layer behind
 * it. The caller sets how far the layer reaches into the gap either side
 * (half of `--entry-gap`, plus any border), so no drop between Entries is
 * lost.
 */
export function movableEntryClass(dragging: boolean): string {
  return `group/entry relative before:absolute before:inset-x-0 before:-z-10 ${dragging ? "opacity-40" : ""}`;
}

/** An Entry's move arrows show only while the pointer is over it or focus is in it. */
export const arrowsOnHoverOrFocusClass = "opacity-0 group-hover/entry:opacity-100 group-focus-within/entry:opacity-100";
