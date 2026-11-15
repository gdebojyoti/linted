import { GripVertical } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { Badge } from "@/components/common/badge";
import { DropMarker } from "@/components/common/drag/drop-marker";
import { useReorderable, type DropSide } from "@/components/common/drag/use-reorderable";
import { layoutTag, type SectionMoveDirection } from "@/lib/resume/layout";
import type { Section } from "@/lib/resume/types";
import { SECTION_DRAG_GROUP } from "./drag-group";
import { SectionMoveArrows } from "./section-move-arrows";

/**
 * A Section in the Layout tab. It can be dragged, and other chips dropped
 * before or after it, where `accepts` allows; a marker shows where a drop
 * will land. Its arrows are the keyboard path: they show while the pointer
 * is over the chip or focus is in it, so nothing has to be selected first.
 * An Empty or Disabled Section is tagged as such, and moves like any other.
 * A long title wraps, so the chip fits a narrow sidebar.
 *
 * A chip moved into another Zone's box is drawn afresh there, so the arrow
 * that moved it is gone. After every render it asks `takeFocus` whether it
 * was just moved, and if so focuses the arrow it's told to.
 *
 * The list sets `--chip-gap`, the space between chips. A chip takes drops
 * over its own half of the gap either side (its `before:` layer, past its
 * 1px border), so there's nowhere between chips a drop is lost, and the
 * marker sits in the gap's middle.
 */
export function SectionChip({
  section,
  canMove,
  onMove,
  takeFocus,
  accepts,
  onDrop,
}: {
  section: Section;
  canMove: (direction: SectionMoveDirection) => boolean;
  onMove: (direction: SectionMoveDirection) => void;
  takeFocus: () => SectionMoveDirection | null;
  accepts: (sourceId: string, side: DropSide) => boolean;
  onDrop: (sourceId: string, side: DropSide) => void;
}) {
  const tag = layoutTag(section);
  const arrowsRef = useRef<HTMLDivElement>(null);
  const { ref, dragging, dropSide } = useReorderable<HTMLLIElement>({
    group: SECTION_DRAG_GROUP,
    id: section.id,
    accepts,
    onDrop,
  });

  useLayoutEffect(() => {
    const direction = takeFocus();
    if (direction) arrowsRef.current?.querySelector<HTMLElement>(`[data-direction="${direction}"]`)?.focus();
  });

  return (
    <li
      ref={ref}
      className={`group relative flex min-h-10 cursor-grab items-center gap-2.5 rounded-md border border-line bg-surface py-1 pr-1.5 pl-2.5 before:absolute before:inset-x-0 before:-inset-y-[calc(var(--chip-gap)/2_+_1px)] hover:border-accent focus-within:border-accent focus-within:shadow-[0_0_0_3px_var(--color-accent-tint),0_8px_20px_rgb(0_0_0/0.10)] ${dragging ? "opacity-40" : ""}`}
    >
      <GripVertical aria-hidden="true" className="size-4 shrink-0 text-ink-disabled group-hover:text-ink-muted" />
      <span className="min-w-0 text-[13.5px] font-medium [overflow-wrap:anywhere]">{section.title}</span>
      {tag && <Badge>{tag}</Badge>}
      <span className="grow" />
      <SectionMoveArrows
        ref={arrowsRef}
        name={section.title}
        canMove={canMove}
        onMove={onMove}
        className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
      />
      {dropSide && <DropMarker side={dropSide} outset="var(--chip-gap) / 2 + 2px" />}
    </li>
  );
}
