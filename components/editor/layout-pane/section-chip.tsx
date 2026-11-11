import { GripVertical } from "lucide-react";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/ui/button";
import { layoutTag, type MoveDirection } from "@/lib/resume/layout";
import type { Section } from "@/lib/resume/types";
import { MoveButton } from "./move-button";

/**
 * A Section in the Layout tab. Its handle selects it, and a selected chip
 * shows the arrows that move it, which is also the keyboard path. An Empty
 * or Disabled Section is tagged as such, and moves like any other.
 */
export function SectionChip({
  section,
  selected,
  onSelect,
  canMove,
  onMove,
}: {
  section: Section;
  selected: boolean;
  onSelect: () => void;
  canMove: (direction: MoveDirection) => boolean;
  onMove: (direction: MoveDirection) => void;
}) {
  const tag = layoutTag(section);
  return (
    <li
      className={`flex h-10 items-center gap-2.5 rounded-md border bg-surface pr-1.5 pl-2.5 ${
        selected ? "border-accent shadow-[0_0_0_3px_var(--color-accent-tint),0_8px_20px_rgb(0_0_0/0.10)]" : "border-line"
      }`}
    >
      <Button
        variant="ghost"
        size="icon-xs"
        aria-pressed={selected}
        aria-label={`Select ${section.title}`}
        onClick={onSelect}
        className={selected ? "text-accent" : "text-ink-disabled"}
      >
        <GripVertical aria-hidden="true" />
      </Button>
      <span className="text-[13.5px] font-medium">{section.title}</span>
      {tag && <Badge>{tag}</Badge>}
      <span className="grow" />
      {selected && (
        <div className="flex gap-px">
          <MoveButton direction="up" sectionTitle={section.title} enabled={canMove("up")} onMove={onMove} />
          <MoveButton direction="down" sectionTitle={section.title} enabled={canMove("down")} onMove={onMove} />
        </div>
      )}
    </li>
  );
}
