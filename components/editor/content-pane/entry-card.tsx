import { useId, type ReactNode } from "react";
import { DragGrip } from "@/components/common/drag/drag-grip";
import { DropMarker } from "@/components/common/drag/drop-marker";
import { MoveArrows } from "@/components/common/drag/move-arrows";
import { useReorderable } from "@/components/common/drag/use-reorderable";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteEntryButton } from "./delete-entry-button";
import type { EntryHeading } from "./entry-name";
import type { RowReorder } from "@/components/common/drag/row-reorder";
import { ExpandButton } from "./expand-button";
import { isControlClick } from "./is-control-click";
import { arrowsOnHoverOrFocusClass, movableRowClass } from "@/components/common/drag/movable-row-classes";

/**
 * An Entry with many fields (a job, a project, a degree) as a card: a header
 * line with its grip, its Enabled checkbox, its heading (e.g. the company in
 * bold and the role in grey), its move arrows, its delete button and a chevron. Clicking anywhere on the
 * line opens or closes its fields, except on its controls; keyboard and
 * screen reader users get the chevron button. Whether it's open is up to the
 * parent, which keeps one card open at a time. The heading is grey
 * while the Entry is Disabled.
 *
 * Open or closed, the card is dragged by its grip, within its Section; a
 * marker shows where it will land. Its arrows are the keyboard path: they
 * show while the pointer is over the card or focus is in it.
 *
 * A card takes drops over its own half of the gap either side, past its
 * 1px border (see movable-row-classes), so no drop between cards is lost.
 */
export function EntryCard({
  name,
  enabled,
  onEnabledChange,
  onDelete,
  heading: { main, detail },
  meta,
  expanded,
  onToggle,
  reorder,
  children,
}: {
  /** Names the Entry for screen readers, e.g. "Paystream entry". */
  name: string;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  onDelete: () => void;
  /** What the Entry is, e.g. its company and role; "New entry" while both are blank. */
  heading: EntryHeading;
  /** Shown on the right of the header line, e.g. its dates. */
  meta?: ReactNode;
  expanded: boolean;
  onToggle: () => void;
  reorder: RowReorder;
  children: ReactNode;
}) {
  const bodyId = useId();
  const { ref, handleRef, dragging, dropSide } = useReorderable<HTMLLIElement>(reorder);

  return (
    <li
      ref={ref}
      className={`${movableRowClass("entry", dragging)} before:inset-x-0 rounded-lg border border-line bg-surface before:-inset-y-[calc(var(--row-gap)/2_+_1px)]`}
    >
      <div
        onClick={(event) => !isControlClick(event) && onToggle()}
        className="flex min-h-11 cursor-pointer items-center gap-2.5 pr-1 pl-2 select-none"
      >
        <DragGrip ref={handleRef} />
        <Checkbox
          checked={enabled}
          onCheckedChange={(checked) => onEnabledChange(checked)}
          aria-label={`${name} enabled`}
        />
        <div className={`min-w-0 grow truncate text-[13px] ${enabled ? "text-ink" : "text-ink-disabled"}`}>
          {main || detail ? (
            <>
              {main && <span className="font-semibold">{main}</span>}
              {main && detail && " "}
              {detail && <span className="text-ink-muted">{detail}</span>}
            </>
          ) : (
            <span className="text-ink-meta">New entry</span>
          )}
        </div>
        {meta && <div className="shrink-0 text-xs text-ink-meta">{meta}</div>}
        <MoveArrows
          name={name}
          canMove={reorder.canMove}
          onMove={reorder.onMove}
          className={arrowsOnHoverOrFocusClass("entry")}
        />
        <DeleteEntryButton label={`Delete ${name}`} onClick={onDelete} />
        <ExpandButton expanded={expanded} onClick={onToggle} controls={bodyId} name={name} />
      </div>
      <div id={bodyId} hidden={!expanded} className="border-t border-line-soft px-3 pt-3 pb-4">
        {children}
      </div>
      {dropSide && <DropMarker side={dropSide} outset="var(--row-gap) / 2 + 2px" />}
    </li>
  );
}
