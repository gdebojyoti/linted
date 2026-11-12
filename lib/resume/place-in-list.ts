/**
 * The list with the item placed at this gap, counted as the list is now (0 is
 * before the first item, the list's length after the last). The item is taken
 * out of its old place if it's already in the list. Null when the gap is
 * outside the list or the placement changes nothing.
 *
 * Shared by the Layout rules (Sections in a Zone) and the Entry rules
 * (Entries in a Section).
 */
export function placedInList<T>(list: readonly T[], item: T, index: number): T[] | null {
  if (index < 0 || index > list.length) return null;
  const without = list.filter((x) => x !== item);
  const at = list.slice(0, index).filter((x) => x !== item).length;
  const placed = [...without.slice(0, at), item, ...without.slice(at)];
  return placed.length === list.length && placed.every((x, i) => x === list[i]) ? null : placed;
}
