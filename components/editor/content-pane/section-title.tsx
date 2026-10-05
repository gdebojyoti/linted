import { Pencil } from "lucide-react";
import type { InputHTMLAttributes, RefObject } from "react";
import { Button } from "@/components/ui/button";

/**
 * A Section's title on its header line, grey while the Section is Disabled,
 * or, while `draft` isn't null, the field it's renamed in (useInlineRename's
 * `inputProps`). With `onStartRename`, a pencil button next to it starts
 * renaming: a click on the title itself opens or closes the Section instead.
 */
export function SectionTitle({
  title,
  enabled,
  draft,
  inputProps,
  pencilRef,
  onStartRename,
}: {
  title: string;
  enabled: boolean;
  draft: string | null;
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  pencilRef: RefObject<HTMLButtonElement | null>;
  /** Left out when there's no pencil: the Header can't be renamed, and a Custom Section is renamed from its menu. */
  onStartRename?: () => void;
}) {
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
      {onStartRename && (
        <Button
          ref={pencilRef}
          variant="ghost"
          size="icon-sm"
          aria-label={`Rename ${title}`}
          onClick={onStartRename}
          className="text-ink-muted"
        >
          <Pencil aria-hidden="true" className="size-3.5" />
        </Button>
      )}
    </span>
  );
}
