import { useId, type ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteEntryButton } from "./delete-entry-button";
import { ExpandButton } from "./expand-button";
import { isControlClick } from "./is-control-click";

/**
 * An Entry with many fields (a job, a project, a degree) as a card: a header
 * line with its Enabled checkbox, a short description of it, its delete
 * button and a chevron. Clicking anywhere on the line opens or closes its
 * fields, except on the checkbox and delete button; keyboard and screen
 * reader users get the chevron button. Whether it's open is up to the
 * parent, which keeps one card open at a time. The description is grey
 * while the Entry is Disabled.
 */
export function EntryCard({
  name,
  enabled,
  onEnabledChange,
  onDelete,
  title,
  meta,
  expanded,
  onToggle,
  children,
}: {
  /** Names the Entry for screen readers, e.g. "Paystream entry". */
  name: string;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  onDelete: () => void;
  /** What the Entry is, e.g. its company and role. */
  title: ReactNode;
  /** Shown on the right of the header line, e.g. its dates. */
  meta?: ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  const bodyId = useId();

  return (
    <li className="rounded-lg border border-line bg-surface">
      <div
        onClick={(event) => !isControlClick(event) && onToggle()}
        className="flex min-h-11 cursor-pointer items-center gap-2.5 pr-1 pl-3 select-none"
      >
        <Checkbox
          checked={enabled}
          onCheckedChange={(checked) => onEnabledChange(checked)}
          aria-label={`${name} enabled`}
        />
        <div className={`min-w-0 grow truncate text-[13px] ${enabled ? "text-ink" : "text-ink-disabled"}`}>
          {title}
        </div>
        {meta && <div className="shrink-0 text-xs text-ink-meta">{meta}</div>}
        <DeleteEntryButton label={`Delete ${name}`} onClick={onDelete} />
        <ExpandButton expanded={expanded} onClick={onToggle} controls={bodyId} name={name} />
      </div>
      <div id={bodyId} hidden={!expanded} className="border-t border-line-soft px-3 pt-3 pb-4">
        {children}
      </div>
    </li>
  );
}
