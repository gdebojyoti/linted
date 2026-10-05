import { Pencil } from "lucide-react";
import { useInlineRename } from "@/components/common/use-inline-rename";
import { Button } from "@/components/ui/button";

/**
 * A Section's title on its header line, grey while the Section is Disabled.
 * With `onRename`, a pencil button next to it renames it in place
 * (useInlineRename). Only the pencil starts renaming: a click on the title
 * opens or closes the Section.
 */
export function SectionTitle({
  title,
  enabled,
  onRename,
  renaming = false,
}: {
  title: string;
  enabled: boolean;
  onRename?: (title: string) => void;
  /** Start in the rename field, as a newly added Section does. */
  renaming?: boolean;
}) {
  const { draft, start, buttonRef, inputProps } = useInlineRename(title, (title) => onRename?.(title), { renaming });

  if (draft !== null) {
    return (
      <input
        aria-label="Section title"
        {...inputProps}
        className="h-7 w-56 min-w-0 rounded-md border border-accent bg-surface px-2 text-sm font-medium text-ink ring-3 ring-accent-tint outline-none select-text aria-invalid:border-danger"
      />
    );
  }

  return (
    <span className="flex min-w-0 items-center gap-0.5">
      <span className={`truncate text-sm font-medium ${enabled ? "text-ink" : "text-ink-disabled"}`}>{title}</span>
      {onRename && (
        <Button
          ref={buttonRef}
          variant="ghost"
          size="icon-sm"
          aria-label={`Rename ${title}`}
          onClick={start}
          className="text-ink-muted"
        >
          <Pencil aria-hidden="true" className="size-3.5" />
        </Button>
      )}
    </span>
  );
}
