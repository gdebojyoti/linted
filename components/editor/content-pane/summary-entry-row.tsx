import { useId } from "react";
import { Textarea } from "@/components/ui/textarea";
import { brokenLinks } from "@/lib/prose/parse-prose";
import type { SummaryEntry } from "@/lib/resume/types";
import { DeleteEntryButton } from "./delete-entry-button";
import { EntryRow } from "./entry-row";
import { MoveEntryButtons } from "./move-entry-buttons";

/**
 * A Summary Entry: one piece of Prose, typed as Markdown (ADR 0004), in a
 * field that grows with its text. A link that can't become a link is still
 * saved as typed, but the field says how to fix it.
 */
export function SummaryEntryRow({
  entry,
  index,
  count,
  onTextChange,
  onEnabledChange,
  onMove,
  onDelete,
  autoFocus,
}: {
  entry: SummaryEntry;
  index: number;
  count: number;
  onTextChange: (text: string) => void;
  onEnabledChange: (enabled: boolean) => void;
  onMove: (direction: "up" | "down") => void;
  onDelete: () => void;
  autoFocus?: boolean;
}) {
  const id = useId();
  const errorId = useId();
  const name = `Summary ${index + 1}`;
  const broken = brokenLinks(entry.text).length > 0;

  return (
    <EntryRow
      name={name}
      enabled={entry.enabled}
      onEnabledChange={onEnabledChange}
      columns="grid-cols-1"
      action={
        <div className="flex">
          <MoveEntryButtons name={name} index={index} count={count} onMove={onMove} />
          <DeleteEntryButton label={`Delete ${name}`} onClick={onDelete} />
        </div>
      }
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-xs font-medium text-ink-muted">
          {name}
        </label>
        <Textarea
          id={id}
          value={entry.text}
          onChange={(event) => onTextChange(event.target.value)}
          autoFocus={autoFocus}
          aria-invalid={broken || undefined}
          aria-describedby={broken ? errorId : undefined}
          className="min-h-20 text-[13px] md:text-[13px]"
        />
        {broken && (
          <p id={errorId} className="text-xs text-danger">
            Links must start with https://, http:// or mailto:.
          </p>
        )}
      </div>
    </EntryRow>
  );
}
