import { Copy, Ellipsis, Pencil, Trash2 } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Menu items as in the Library design, with the app's grey highlight rather than shadcn's accent. */
const ITEM = "h-8.5 gap-2 rounded-[5px] px-2.5 text-[13px] text-ink focus:bg-subtle focus:text-ink [&_svg]:size-3.5";

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
      <DropdownMenuContent
        align="end"
        className="w-50 rounded-lg p-1 shadow-[0_8px_24px_rgb(0_0_0/0.12)] ring-1 ring-line-input"
      >
        <DropdownMenuItem className={ITEM} onClick={() => onRename(trigger())}>
          <Pencil aria-hidden="true" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem className={ITEM} onClick={() => onDuplicate(trigger())}>
          <Copy aria-hidden="true" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-line-soft" />
        <DropdownMenuItem className={cn(ITEM, "text-danger focus:text-danger")} onClick={() => onDelete(trigger())}>
          <Trash2 aria-hidden="true" />
          Delete resume
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
