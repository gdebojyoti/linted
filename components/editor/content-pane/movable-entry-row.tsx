import type { ComponentProps } from "react";
import { DragGrip } from "@/components/common/drag/drag-grip";
import { DropMarker } from "@/components/common/drag/drop-marker";
import { MoveArrows } from "@/components/common/drag/move-arrows";
import { useReorderable } from "@/components/common/drag/use-reorderable";
import type { RowReorder } from "@/components/common/drag/row-reorder";
import { EntryRow } from "./entry-row";
import { arrowsOnHoverOrFocusClass, movableEntryClass } from "./movable-entry-classes";

/**
 * An EntryRow that can be moved within its Section (a Skills or Summary
 * Entry): dragged by its grip, with a marker showing where it will land, or
 * moved with its arrows, the keyboard path. The arrows sit before the
 * row's action, and show while the pointer is over the row or focus is in
 * it.
 *
 * A row takes drops over its own half of the gap either side (see
 * movable-entry-classes), so no drop between rows is lost.
 */
export function MovableEntryRow({
  reorder,
  action,
  ...props
}: { reorder: RowReorder } & Omit<ComponentProps<typeof EntryRow>, "ref" | "grip" | "className" | "overlay">) {
  const { ref, handleRef, dragging, dropSide } = useReorderable<HTMLLIElement>(reorder);

  return (
    <EntryRow
      {...props}
      ref={ref}
      grip={<DragGrip ref={handleRef} />}
      className={`${movableEntryClass(dragging)} before:-inset-y-[calc(var(--entry-gap)/2)]`}
      action={
        <>
          <MoveArrows
            name={props.name}
            canMove={reorder.canMove}
            onMove={reorder.onMove}
            className={arrowsOnHoverOrFocusClass}
          />
          {action}
        </>
      }
      overlay={dropSide && <DropMarker side={dropSide} outset="var(--entry-gap) / 2 + 1px" />}
    />
  );
}
