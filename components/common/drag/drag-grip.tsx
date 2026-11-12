import { GripVertical } from "lucide-react";
import type { Ref } from "react";

/**
 * The grip a row is dragged by, from useReorderable's `handleRef`. It's for
 * the pointer only, so screen readers skip it; the row's arrows are the
 * keyboard path.
 */
export function DragGrip({ ref }: { ref: Ref<HTMLSpanElement> }) {
  return (
    <span ref={ref} aria-hidden="true" className="flex shrink-0 cursor-grab text-ink-disabled hover:text-ink-muted">
      <GripVertical className="size-4" />
    </span>
  );
}
