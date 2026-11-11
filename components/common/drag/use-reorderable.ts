import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/adapter/element-adapter";
import { attachClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge/attach-closest-edge";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge/extract-closest-edge";
import { useEffect, useEffectEvent, useRef, useState } from "react";

/** Which side of an item a drop lands on. */
export type DropSide = "before" | "after";

const ITEM = Symbol("reorderable-item");

type ItemData = { [ITEM]: true; group: string; id: string };

function isItem(data: Record<string | symbol, unknown>): data is ItemData {
  return data[ITEM] === true;
}

/**
 * Makes an item of a vertical list draggable, and a place to drop the list's
 * other items, before or after it. Items only meet others of the same group.
 * The drag-and-drop library (Pragmatic drag and drop, #88) is used here and
 * nowhere else, so swapping it touches only this file.
 *
 * `accepts` says whether a drop on this side would do something; only then
 * is `dropSide` set, for drawing a marker, and only then does `onDrop` run.
 */
export function useReorderable<T extends HTMLElement>({
  group,
  id,
  draggable: canDrag = true,
  accepts,
  onDrop,
}: {
  group: string;
  id: string;
  draggable?: boolean;
  accepts: (sourceId: string, side: DropSide) => boolean;
  onDrop: (sourceId: string, side: DropSide) => void;
}) {
  const ref = useRef<T>(null);
  const [dragging, setDragging] = useState(false);
  const [dropSide, setDropSide] = useState<DropSide | null>(null);

  const acceptedSide = useEffectEvent((data: Record<string | symbol, unknown>, source: Record<string, unknown>) => {
    const edge = extractClosestEdge(data);
    const side: DropSide | null = edge === "top" ? "before" : edge === "bottom" ? "after" : null;
    const sourceId = (source as Partial<ItemData>).id;
    return side && typeof sourceId === "string" && accepts(sourceId, side) ? { sourceId, side } : null;
  });
  const drop = useEffectEvent((sourceId: string, side: DropSide) => onDrop(sourceId, side));

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const data: ItemData = { [ITEM]: true, group, id };
    return combine(
      ...(canDrag
        ? [
            draggable({
              element,
              getInitialData: () => data,
              onDragStart: () => setDragging(true),
              onDrop: () => setDragging(false),
            }),
          ]
        : []),
      dropTargetForElements({
        element,
        canDrop: ({ source }) => isItem(source.data) && source.data.group === group,
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
  }, [group, id, canDrag]);

  return { ref, dragging, dropSide };
}
