import { Copy, Ellipsis, Pencil, Trash2 } from "lucide-react";
import { useRef } from "react";
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
 * A Resume row's "…" menu: Rename, Duplicate and, after a divider, Delete
 * in red. Each action gets the "…" button, so focus can return to it when
 * the dialog it opens closes.
 */
export function RowMenu({
  title,
  onRename,
  onDuplicate,
  onDelete,
}: {
  title: string;
  onRename: (opener: HTMLElement) => void;
  onDuplicate: (opener: HTMLElement) => void;
  onDelete: (opener: HTMLElement) => void;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const trigger = () => triggerRef.current!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button ref={triggerRef} variant="ghost" size="icon" aria-label={`More actions for ${title}`}>
            <Ellipsis aria-hidden="true" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className={MENU_CONTENT_CLASS}>
        <DropdownMenuItem className={MENU_ITEM_CLASS} onClick={() => onRename(trigger())}>
          <Pencil aria-hidden="true" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem className={MENU_ITEM_CLASS} onClick={() => onDuplicate(trigger())}>
          <Copy aria-hidden="true" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-line-soft" />
        <DropdownMenuItem className={MENU_DANGER_ITEM_CLASS} onClick={() => onDelete(trigger())}>
          <Trash2 aria-hidden="true" />
          Delete resume
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
