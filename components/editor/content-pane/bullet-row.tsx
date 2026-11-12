import { IndentDecrease, IndentIncrease } from "lucide-react";
import { useId } from "react";
import { DragGrip } from "@/components/common/drag/drag-grip";
import { DropMarker } from "@/components/common/drag/drop-marker";
import { arrowsOnHoverOrFocusClass, movableRowClass } from "@/components/common/drag/movable-row-classes";
import { MoveArrows } from "@/components/common/drag/move-arrows";
import type { RowReorder } from "@/components/common/drag/row-reorder";
import { useReorderable } from "@/components/common/drag/use-reorderable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { brokenLinks } from "@/lib/prose/parse-prose";
import type { BulletLine } from "@/lib/resume/bullet-lines";
import { BrokenLinksMessage } from "./broken-links-message";
import { DeleteEntryButton } from "./delete-entry-button";

/**
 * One Bullet: its grip, its Enabled checkbox, its Prose typed as Markdown
 * (ADR 0004) in a field that grows with its text, and its actions. A child
 * Bullet sits indented behind a rule. Screen readers hear "Bullet 1",
 * "Bullet 1.1"…
 *
 * Its text is grey while it won't be shown: when it's Disabled, or its
 * parent is. The one indent button nests a top-level Bullet (not the first,
 * which has nothing above it) or un-nests a child; staying the same button
 * keeps focus on it as the Bullet moves.
 *
 * It's dragged by its grip within its Entry, with a marker showing where it
 * will land, or moved with its arrows, the keyboard path, which show while
 * the pointer is over the row or focus is in it. A top-level Bullet takes
 * its children along, so they fade with it while it's dragged (`faded`). A
 * child Bullet's row takes drops over its indent too, so no drop is lost.
 *
 * Bullets have no line breaks (#75): Enter adds the next Bullet, and Enter
 * with Shift or another modifier does nothing. Line breaks already in the
 * text, or pasted in, stay as typed.
 */
export function BulletRow({
  line,
  hintId,
  reorder,
  faded,
  onDragChange,
  onTextChange,
  onEnabledChange,
  onNest,
  onUnnest,
  onDelete,
  onEnter,
  autoFocus,
}: {
  line: BulletLine;
  /** The formatting hint every Bullet's field points at. */
  hintId: string;
  reorder: RowReorder;
  /** Its parent is being dragged, taking it along. */
  faded: boolean;
  onDragChange: (dragging: boolean) => void;
  onTextChange: (text: string) => void;
  onEnabledChange: (enabled: boolean) => void;
  onNest: () => void;
  onUnnest: () => void;
  onDelete: () => void;
  /** Enter was pressed in the field. */
  onEnter: () => void;
  autoFocus?: boolean;
}) {
  const errorId = useId();
  const { ref, handleRef, dragging, dropSide } = useReorderable<HTMLLIElement>({ ...reorder, onDragChange });
  const { bullet, number, nested, canNest, parentEnabled } = line;
  const name = `Bullet ${number}`;
  const broken = brokenLinks(bullet.text);
  const shown = bullet.enabled && parentEnabled;

  return (
    <li
      ref={ref}
      className={`${movableRowClass("bullet", dragging || faded)} py-1 before:inset-y-0 before:right-0 ${
        nested ? "ml-6.5 border-l border-line pl-2.5 before:-left-6.75" : "before:left-0"
      }`}
    >
      <div className="flex items-start gap-2">
        <div className="flex h-9 shrink-0 items-center gap-2">
          <DragGrip ref={handleRef} />
          <Checkbox
            checked={bullet.enabled}
            onCheckedChange={(enabled) => onEnabledChange(enabled)}
            aria-label={`${name} enabled`}
          />
        </div>
        <div className="flex min-w-0 grow flex-col gap-1.5">
          <Textarea
            aria-label={name}
            value={bullet.text}
            onChange={(event) => onTextChange(event.target.value)}
            onKeyDown={(event) => {
              // While an input method (e.g. for Chinese or Japanese) is
              // composing, Enter confirms the text. Safari reports that
              // Enter as keyCode 229 rather than with isComposing.
              if (event.key !== "Enter" || event.nativeEvent.isComposing || event.keyCode === 229) return;
              event.preventDefault();
              if (!event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) onEnter();
            }}
            autoFocus={autoFocus}
            aria-invalid={broken.length > 0 || undefined}
            aria-describedby={broken.length > 0 ? `${errorId} ${hintId}` : hintId}
            className={`min-h-9 py-1.5 text-[13px] md:text-[13px] supports-[field-sizing:content]:resize-none ${shown ? "" : "text-ink-disabled"}`}
          />
          <BrokenLinksMessage id={errorId} links={broken} />
        </div>
        <div className="flex h-9 shrink-0 items-center">
          <MoveArrows
            name={name}
            canMove={reorder.canMove}
            onMove={reorder.onMove}
            className={arrowsOnHoverOrFocusClass("bullet")}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={nested ? onUnnest : onNest}
            disabled={!nested && !canNest}
            aria-label={nested ? `Un-nest ${name}` : `Nest ${name}`}
          >
            {nested ? <IndentDecrease aria-hidden="true" /> : <IndentIncrease aria-hidden="true" />}
          </Button>
          <DeleteEntryButton label={`Delete ${name}`} onClick={onDelete} />
        </div>
      </div>
      {dropSide && <DropMarker side={dropSide} outset="1px" />}
    </li>
  );
}
