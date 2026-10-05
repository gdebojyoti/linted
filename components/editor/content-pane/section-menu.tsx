import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { useRef, type RefObject } from "react";
import { MENU_CONTENT_CLASS, MENU_DANGER_ITEM_CLASS, MENU_ITEM_CLASS } from "@/components/common/menu-class";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * A Custom Section's "…" menu: Rename section and, after a divider, Delete
 * section in red. Each action waits until the menu has closed, so the menu
 * handing focus back to its button can't pull focus out of the rename field
 * or the delete dialog.
 */
export function SectionMenu({
  title,
  triggerRef,
  onRename,
  onDelete,
}: {
  title: string;
  /** The "…" button. It gets focus back after a rename, and `onDelete` gets it for after a cancelled delete. */
  triggerRef: RefObject<HTMLButtonElement | null>;
  onRename: () => void;
  onDelete: (opener: HTMLElement) => void;
}) {
  const pendingRef = useRef<(() => void) | null>(null);

  return (
    <DropdownMenu
      onOpenChangeComplete={(open) => {
        if (open) return;
        pendingRef.current?.();
        pendingRef.current = null;
      }}
    >
      <DropdownMenuTrigger
        render={
          <Button ref={triggerRef} variant="ghost" size="icon" aria-label={`More actions for ${title}`}>
            <Ellipsis aria-hidden="true" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className={MENU_CONTENT_CLASS}>
        <DropdownMenuItem className={MENU_ITEM_CLASS} onClick={() => (pendingRef.current = onRename)}>
          <Pencil aria-hidden="true" />
          Rename section
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-line-soft" />
        <DropdownMenuItem
          className={MENU_DANGER_ITEM_CLASS}
          onClick={() => (pendingRef.current = () => onDelete(triggerRef.current!))}
        >
          <Trash2 aria-hidden="true" />
          Delete section
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
