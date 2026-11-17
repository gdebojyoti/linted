import { Copy, Ellipsis, Pencil, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

/** A row of the sheet, as in the mobile Library design. */
const ACTION =
  "flex h-13 w-full cursor-pointer items-center gap-3 px-4 text-left text-[15px] text-ink outline-none focus-visible:bg-subtle active:bg-subtle [&_svg]:size-4.5 [&_svg]:shrink-0";

/**
 * On mobile, a Resume row's "…" button opens this sheet from the bottom of
 * the screen: the Resume Title and when it was edited, then Rename,
 * Duplicate and, after a divider, Delete in red, as in the desktop menu.
 * An action closes the sheet and passes the "…" button along, so focus can
 * return to it when the dialog it opens closes. Tapping the scrim, swiping
 * down, Esc or Cancel closes it.
 */
export function RowSheet({
  title,
  edited,
  onRename,
  onDuplicate,
  onDelete,
}: {
  title: string;
  edited: string;
  onRename: (opener: HTMLElement) => void;
  onDuplicate: (opener: HTMLElement) => void;
  onDelete: (opener: HTMLElement) => void;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  /** Set when an action opens a dialog, so the closing sheet leaves focus in that dialog. */
  const handedOff = useRef(false);

  function act(action: (opener: HTMLElement) => void) {
    handedOff.current = true;
    setOpen(false);
    action(triggerRef.current!);
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(next) => {
        if (next) handedOff.current = false;
        setOpen(next);
      }}
    >
      <DrawerTrigger
        render={
          <Button
            ref={triggerRef}
            variant="ghost"
            size="icon"
            aria-label={`More actions for ${title}`}
            // A 44px tap target, as in the design.
            className="size-11 text-ink-muted [&_svg]:size-4.5"
          >
            <Ellipsis aria-hidden="true" />
          </Button>
        }
      />
      <DrawerContent
        overlayClassName="bg-[rgb(26_26_24/0.38)] supports-backdrop-filter:backdrop-blur-none"
        className="bg-surface pt-2 pb-4 text-ink shadow-[0_-8px_30px_rgb(0_0_0/0.12)] data-[swipe-direction=down]:rounded-t-2xl data-[swipe-direction=down]:border-t-0"
        finalFocus={() => !handedOff.current}
      >
        <span aria-hidden="true" className="mb-2 h-1 w-9 shrink-0 self-center rounded-xs bg-line-input" />
        <div className="mb-2 flex flex-col gap-0.75 border-b border-line-soft px-4 pb-4">
          <DrawerTitle className="truncate text-[15px] font-semibold text-ink">{title}</DrawerTitle>
          <DrawerDescription className="text-[12.5px] text-ink-muted">{edited}</DrawerDescription>
        </div>
        <button type="button" className={ACTION} onClick={() => act(onRename)}>
          <Pencil aria-hidden="true" />
          Rename
        </button>
        <button type="button" className={ACTION} onClick={() => act(onDuplicate)}>
          <Copy aria-hidden="true" />
          Duplicate
        </button>
        <div role="separator" className="my-2 h-px shrink-0 bg-line-soft" />
        <button type="button" className={cn(ACTION, "text-danger")} onClick={() => act(onDelete)}>
          <Trash2 aria-hidden="true" />
          Delete resume
        </button>
        <DrawerClose
          render={
            <Button
              variant="outline"
              size="lg"
              className="mx-4 mt-4 cursor-pointer rounded-[10px] border-line-input bg-surface text-[15px] text-ink hover:bg-subtle"
            >
              Cancel
            </Button>
          }
        />
      </DrawerContent>
    </Drawer>
  );
}
