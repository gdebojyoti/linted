import type { ComponentProps } from "react";
import { DragGrip } from "@/components/common/drag/drag-grip";
import { DropMarker } from "@/components/common/drag/drop-marker";
import { MoveArrows } from "@/components/common/drag/move-arrows";
import { useReorderable } from "@/components/common/drag/use-reorderable";
import type { EntryReorder } from "./entry-reorder";
import { EntryRow } from "./entry-row";

/**
 * An EntryRow that can be moved within its Section (a Skills or Summary
 * Entry): dragged by its grip, with a marker showing where it will land, or
 * moved with its arrows, the keyboard path. The arrows sit before the
 * row's action, and show while the pointer is over the row or focus is in
 * it.
 *
 * The list sets `--entry-gap`, the space between rows, and is `isolate`. A
 * row takes drops over its own half of the gap either side (its `before:`
 * layer, behind the row), so no drop between rows is lost.
 */
export function MovableEntryRow({
  reorder,
  action,
  ...props
}: { reorder: EntryReorder } & Omit<ComponentProps<typeof EntryRow>, "ref" | "grip" | "className" | "overlay">) {
  const { ref, handleRef, dragging, dropSide } = useReorderable<HTMLLIElement>(reorder);

  return (
    <EntryRow
      {...props}
      ref={ref}
      grip={<DragGrip ref={handleRef} />}
      className={`group/entry relative before:absolute before:inset-x-0 before:-inset-y-[calc(var(--entry-gap)/2)] before:-z-10 ${dragging ? "opacity-40" : ""}`}
      action={
        <>
          <MoveArrows
            name={props.name}
            canMove={reorder.canMove}
            onMove={reorder.onMove}
            className="opacity-0 group-hover/entry:opacity-100 group-focus-within/entry:opacity-100"
          />
          {action}
        </>
      }
      overlay={dropSide && <DropMarker side={dropSide} outset="var(--entry-gap) / 2 + 1px" />}
    />
  );
}
