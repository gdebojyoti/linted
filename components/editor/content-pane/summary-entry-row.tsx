import { useId } from "react";
import { Textarea } from "@/components/ui/textarea";
import { brokenLinks } from "@/lib/prose/parse-prose";
import type { SummaryEntry } from "@/lib/resume/types";
import { BrokenLinksMessage } from "./broken-links-message";
import { DeleteEntryButton } from "./delete-entry-button";
import { EntryRow } from "./entry-row";

/**
 * A Summary Entry: one piece of Prose, typed as Markdown (ADR 0004), in a
 * field that grows with its text. It has no visible label, since it sits in
 * the Summary Section; screen readers hear "Summary 1", "Summary 2"… A link
 * that can't become a link is still saved as typed, but the field names it
 * and says how to fix it.
 *
 * The resize handle is hidden only where the field grows by itself
 * (`field-sizing: content`), so older browsers can still enlarge it.
 */
export function SummaryEntryRow({
  entry,
  index,
  onTextChange,
  onEnabledChange,
  onDelete,
  autoFocus,
}: {
  entry: SummaryEntry;
  index: number;
  onTextChange: (text: string) => void;
  onEnabledChange: (enabled: boolean) => void;
  onDelete: () => void;
  autoFocus?: boolean;
}) {
  const errorId = useId();
  const name = `Summary ${index + 1}`;
  const broken = brokenLinks(entry.text);

  return (
    <EntryRow
      name={name}
      enabled={entry.enabled}
      onEnabledChange={onEnabledChange}
      columns="grid-cols-1"
      labelledFields={false}
      action={<DeleteEntryButton label={`Delete ${name}`} onClick={onDelete} />}
    >
      <div className="flex flex-col gap-1.5">
        <Textarea
          aria-label={name}
          value={entry.text}
          onChange={(event) => onTextChange(event.target.value)}
          autoFocus={autoFocus}
          aria-invalid={broken.length > 0 || undefined}
          aria-describedby={broken.length > 0 ? errorId : undefined}
          className="min-h-20 text-[13px] md:text-[13px] supports-[field-sizing:content]:resize-none"
        />
        <BrokenLinksMessage id={errorId} links={broken} />
      </div>
    </EntryRow>
  );
}
