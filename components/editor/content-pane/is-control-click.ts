import type { MouseEvent } from "react";

/**
 * Whether a click on a header line landed on one of its controls (a button,
 * checkbox, link or field). Those do their own thing, so the click shouldn't
 * also open or close the line's fields.
 */
export function isControlClick(event: MouseEvent): boolean {
  return (
    event.target instanceof Element &&
    event.target.closest("button, a, input, textarea, select, [role='checkbox']") !== null
  );
}
