import { GripVertical } from "lucide-react";
import { Badge } from "@/components/common/badge";
import { layoutTag, type MoveDirection } from "@/lib/resume/layout";
import type { Section } from "@/lib/resume/types";
import { MoveButton } from "./move-button";

/**
 * A Section in the Layout tab. Its arrows show while the pointer is over the
 * chip or focus is in it: keyboard users Tab onto them, so nothing has to be
 * selected first. An Empty or Disabled Section is tagged as such, and moves
 * like any other.
 *
 * The grip is only drawn, as in the design, until dragging works (its own
 * ticket).
 */
export function SectionChip({
  section,
  canMove,
  onMove,
}: {
  section: Section;
  canMove: (direction: MoveDirection) => boolean;
  onMove: (direction: MoveDirection) => void;
}) {
  const tag = layoutTag(section);
  return (
    <li className="group flex h-10 items-center gap-2.5 rounded-md border border-line bg-surface pr-1.5 pl-2.5 hover:border-accent focus-within:border-accent focus-within:shadow-[0_0_0_3px_var(--color-accent-tint),0_8px_20px_rgb(0_0_0/0.10)]">
      <GripVertical aria-hidden="true" className="size-4 shrink-0 text-ink-disabled" />
      <span className="text-[13.5px] font-medium">{section.title}</span>
      {tag && <Badge>{tag}</Badge>}
      <span className="grow" />
      <div className="flex gap-px opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
        <MoveButton direction="up" sectionTitle={section.title} enabled={canMove("up")} onMove={onMove} />
        <MoveButton direction="down" sectionTitle={section.title} enabled={canMove("down")} onMove={onMove} />
      </div>
    </li>
  );
}
