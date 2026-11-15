import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/adapter/element-adapter";
import { attachClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge/attach-closest-edge";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge/extract-closest-edge";
import { useEffect, useEffectEvent, useRef, useState } from "react";

/** Which side of a row a drop lands on. */
export type DropSide = "before" | "after";

const ROW = Symbol("reorderable-row");

type RowData = { [ROW]: true; group: string; id: string };

function isRow(data: Record<string | symbol, unknown>): data is RowData {
  return data[ROW] === true;
}

/**
 * Makes a row of a vertical list draggable, and a place to drop the list's
 * other rows, before or after it. Rows only meet others of the same group.
 * The drag-and-drop library (Pragmatic drag and drop, #88) is used here and
 * nowhere else, so swapping it touches only this file.
 *
 * `accepts` says whether a drop on this side would do something; only then
 * is `dropSide` set, for drawing a marker, and only then does `onDrop` run.
 *
 * The whole row is dragged, unless `handleRef` is put on a grip inside it:
 * then only the grip starts a drag, still showing the whole row as it goes.
 * A row holding text fields needs a grip, as browsers don't let text be
 * selected inside a draggable element.
 *
 * `onDragChange` hears when the row starts and stops being dragged, for
 * rows that go with it (a Bullet's children).
 */
export function useReorderable<T extends HTMLElement>({
  group,
  id,
  accepts,
  onDrop,
  onDragChange,
}: {
  group: string;
  id: string;
  accepts: (sourceId: string, side: DropSide) => boolean;
  onDrop: (sourceId: string, side: DropSide) => void;
  onDragChange?: (dragging: boolean) => void;
}) {
  const ref = useRef<T>(null);
  const handleRef = useRef<HTMLElement>(null);
  const [dragging, setDragging] = useState(false);
  const [dropSide, setDropSide] = useState<DropSide | null>(null);

  const acceptedSide = useEffectEvent((data: Record<string | symbol, unknown>, source: Record<string, unknown>) => {
    const edge = extractClosestEdge(data);
    const side: DropSide | null = edge === "top" ? "before" : edge === "bottom" ? "after" : null;
    const sourceId = (source as Partial<RowData>).id;
    return side && typeof sourceId === "string" && accepts(sourceId, side) ? { sourceId, side } : null;
  });
  const drop = useEffectEvent((sourceId: string, side: DropSide) => onDrop(sourceId, side));
  const dragChange = useEffectEvent((isDragging: boolean) => {
    setDragging(isDragging);
    onDragChange?.(isDragging);
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const handle = handleRef.current;
    const data: RowData = { [ROW]: true, group, id };
    return combine(
      draggable({
        element: handle ?? element,
        getInitialData: () => data,
        onGenerateDragPreview: ({ nativeSetDragImage, location }) => {
          if (!handle || !nativeSetDragImage) return;
          const rect = element.getBoundingClientRect();
          const { clientX, clientY } = location.current.input;
          nativeSetDragImage(element, clientX - rect.left, clientY - rect.top);
        },
        onDragStart: () => dragChange(true),
        onDrop: () => dragChange(false),
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) => isRow(source.data) && source.data.group === group,
        getData: ({ input }) => attachClosestEdge(data, { element, input, allowedEdges: ["top", "bottom"] }),
        onDrag: ({ self, source }) => setDropSide(acceptedSide(self.data, source.data)?.side ?? null),
        onDragLeave: () => setDropSide(null),
        onDrop: ({ self, source }) => {
          setDropSide(null);
          const accepted = acceptedSide(self.data, source.data);
          if (accepted) drop(accepted.sourceId, accepted.side);
        },
      }),
    );
  }, [group, id]);

  return { ref, handleRef, dragging, dropSide };
}

/**
 * Makes a box holding a list (e.g. a Zone in the Layout tab) a place to drop
 * the list's rows at its end, for the space no row covers: below the last
 * row, or anywhere in an empty list. Rows of the same `group` from other
 * lists can be dropped there too. Rows inside take their own drops; the box
 * only takes a drop where it's the innermost target.
 *
 * As with rows, `accepts` says whether a drop would do something; only then
 * is `active` set, for drawing a marker at the list's end, and only then
 * does `onDrop` run.
 */
export function useDropAtEnd<T extends HTMLElement>({
  group,
  accepts,
  onDrop,
}: {
  group: string;
  accepts: (sourceId: string) => boolean;
  onDrop: (sourceId: string) => void;
}) {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(false);

  const accepted = useEffectEvent((source: Record<string, unknown>, innermost: boolean) => {
    const sourceId = (source as Partial<RowData>).id;
    return innermost && typeof sourceId === "string" && accepts(sourceId) ? sourceId : null;
  });
  const drop = useEffectEvent((sourceId: string) => onDrop(sourceId));

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    return dropTargetForElements({
      element,
      canDrop: ({ source }) => isRow(source.data) && source.data.group === group,
      onDrag: ({ location, source }) =>
        setActive(accepted(source.data, location.current.dropTargets[0]?.element === element) !== null),
      onDragLeave: () => setActive(false),
      onDrop: ({ location, source }) => {
        setActive(false);
        const sourceId = accepted(source.data, location.current.dropTargets[0]?.element === element);
        if (sourceId) drop(sourceId);
      },
    });
  }, [group]);

  return { ref, active };
}
