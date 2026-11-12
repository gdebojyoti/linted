import { GripVertical } from "lucide-react";
import { Badge } from "@/components/common/badge";
import { DropMarker } from "@/components/common/drag/drop-marker";
import { useReorderable, type DropSide } from "@/components/common/drag/use-reorderable";
import { layoutTag, type MoveDirection } from "@/lib/resume/layout";
import type { Section } from "@/lib/resume/types";
import { MoveArrows } from "@/components/common/drag/move-arrows";

/**
 * A Section in the Layout tab. It can be dragged, and other chips dropped
 * before or after it, where `accepts` allows; a marker shows where a drop
 * will land. Its arrows are the keyboard path: they show while the pointer
 * is over the chip or focus is in it, so nothing has to be selected first.
 * An Empty or Disabled Section is tagged as such, and moves like any other.
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
  accepts,
  onDrop,
}: {
  section: Section;
  canMove: (direction: MoveDirection) => boolean;
  onMove: (direction: MoveDirection) => void;
  accepts: (sourceId: string, side: DropSide) => boolean;
  onDrop: (sourceId: string, side: DropSide) => void;
}) {
  const tag = layoutTag(section);
  const { ref, dragging, dropSide } = useReorderable<HTMLLIElement>({
    group: "layout-sections",
    id: section.id,
    accepts,
    onDrop,
  });
  return (
    <li
      ref={ref}
      className={`group relative flex h-10 cursor-grab items-center gap-2.5 rounded-md border border-line bg-surface pr-1.5 pl-2.5 before:absolute before:inset-x-0 before:-inset-y-[calc(var(--chip-gap)/2_+_1px)] hover:border-accent focus-within:border-accent focus-within:shadow-[0_0_0_3px_var(--color-accent-tint),0_8px_20px_rgb(0_0_0/0.10)] ${dragging ? "opacity-40" : ""}`}
    >
      <GripVertical aria-hidden="true" className="size-4 shrink-0 text-ink-disabled group-hover:text-ink-muted" />
      <span className="text-[13.5px] font-medium">{section.title}</span>
      {tag && <Badge>{tag}</Badge>}
      <span className="grow" />
      <MoveArrows
        name={section.title}
        canMove={canMove}
        onMove={onMove}
        className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
      />
      {dropSide && <DropMarker side={dropSide} outset="var(--chip-gap) / 2 + 2px" />}
    </li>
  );
}
