import { Pencil } from "lucide-react";
import { useInlineRename } from "@/components/common/use-inline-rename";
import { Button } from "@/components/ui/button";

/**
 * The Resume Title in the top bar, renamed in place (useInlineRename). The
 * pencil button, or a click on the title, turns it into a field.
 *
 * The title itself is left out of the tab order, so keyboard users reach
 * renaming once, through the pencil button, which gets focus back after
 * Enter or Esc.
 */
export function ResumeTitleEditor({ title, onRename }: { title: string; onRename: (title: string) => void }) {
  const { draft, start, buttonRef, inputProps } = useInlineRename(title, onRename);

  if (draft !== null) {
    return (
      <input
        aria-label="Resume title"
        {...inputProps}
        className="h-7 w-72 rounded-md border border-accent bg-surface px-2 text-[13px] font-semibold text-ink ring-3 ring-accent-tint outline-none aria-invalid:border-danger"
      />
    );
  }

  return (
    <span className="flex items-center gap-1">
      <button type="button" tabIndex={-1} onClick={start} className="font-semibold">
        {title}
      </button>
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon-sm"
        aria-label="Rename resume"
        onClick={start}
        className="text-ink-muted"
      >
        <Pencil aria-hidden="true" className="size-3.5" />
      </Button>
    </span>
  );
}
