import type { ReactNode } from "react";
import { DropMarker } from "@/components/common/drag/drop-marker";
import { useDropAtEnd } from "@/components/common/drag/use-reorderable";
import { SECTION_DRAG_GROUP } from "./drag-group";

/**
 * One Zone of a Theme with several columns, in the Layout tab: a labelled box
 * holding its Section chips. The box's empty space takes drops at the Zone's
 * end, with the drop marker after its last chip, so a chip can be dropped
 * into an empty Zone, or into one holding only the Pinned Header.
 *
 * Its dashed line tints while focus is anywhere on the board (`group/board`).
 */
export function ZoneBox({
  label,
  name,
  accepts,
  onDrop,
  className = "",
  children,
}: {
  label: string;
  name: string;
  accepts: (sourceId: string) => boolean;
  onDrop: (sourceId: string) => void;
  className?: string;
  children: ReactNode;
}) {
  const { ref, active } = useDropAtEnd<HTMLDivElement>({ group: SECTION_DRAG_GROUP, accepts, onDrop });
  return (
    <div
      ref={ref}
      className={`flex min-w-0 flex-col gap-1.5 rounded-lg border border-dashed border-line-input bg-surface p-2.5 group-focus-within/board:border-accent/50 ${className}`}
    >
      <span aria-hidden="true" className="px-0.5 pb-0.5 text-[11px] text-ink-muted">
        {label}
      </span>
      <ul aria-label={name} className="flex flex-col gap-(--chip-gap) [--chip-gap:6px]">
        {children}
        {active && (
          <li aria-hidden="true" className="relative -mt-(--chip-gap) h-0 first:mt-0">
            <DropMarker side="after" outset="var(--chip-gap) / 2 + 2px" />
          </li>
        )}
      </ul>
    </div>
  );
}
