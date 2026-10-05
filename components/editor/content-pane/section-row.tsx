import { useId, useRef, type ReactNode } from "react";
import type { Section } from "@/lib/resume/types";
import { Badge } from "@/components/common/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { entrySummary } from "@/lib/resume/section-summary";
import { DeleteEntryButton } from "./delete-entry-button";
import { ExpandButton } from "./expand-button";
import { isControlClick } from "./is-control-click";
import { SectionTitle } from "./section-title";

/**
 * One Section in the Content pane, with its Enabled checkbox and its title,
 * renamed from a pencil next to it (except the Header's). A Custom Section
 * also has a delete button, next to the chevron as on Entry cards. A
 * Disabled Section's title is grey, and its fields can still be edited.
 *
 * When it has fields to edit (`children`), clicking anywhere on its header
 * line opens or closes them, except on the line's own controls. Keyboard and
 * screen reader users get the chevron button. Whether it's open is up to the
 * parent, which keeps one Section open at a time. Closed fields stay on the
 * page, hidden, so nothing typed in them is lost.
 */
export function SectionRow({
  section,
  onEnabledChange,
  onRename,
  onDelete,
  isNew = false,
  expanded = false,
  onToggle,
  children,
}: {
  section: Section;
  onEnabledChange: (enabled: boolean) => void;
  /** Left out for the Header, which can't be renamed. */
  onRename?: (title: string) => void;
  /** Only for Custom Sections, the only ones that can be deleted. Gets the delete button, for focus after Cancel. */
  onDelete?: (opener: HTMLElement) => void;
  /** Just added: its title starts in the rename field. */
  isNew?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
  children?: ReactNode;
}) {
  const bodyId = useId();
  const deleteRef = useRef<HTMLButtonElement>(null);
  const toggle = children ? onToggle : undefined;

  return (
    <li className="rounded-lg border border-line bg-surface">
      <div
        onClick={toggle && ((event) => !isControlClick(event) && toggle())}
        className={`flex min-h-12 items-center gap-2.5 pr-2 pl-3 ${toggle ? "cursor-pointer select-none" : ""}`}
      >
        <Checkbox
          checked={section.enabled}
          onCheckedChange={(checked) => onEnabledChange(checked)}
          aria-label={`${section.title} enabled`}
        />
        <SectionTitle title={section.title} enabled={section.enabled} onRename={onRename} renaming={isNew} />
        {section.type === "custom" && <Badge>Custom</Badge>}
        <span className="text-xs text-ink-meta">{entrySummary(section)}</span>
        <span className="grow" />
        {section.type === "header" && section.pinned && <Badge>Pinned</Badge>}
        {onDelete && (
          <DeleteEntryButton
            ref={deleteRef}
            label={`Delete ${section.title}`}
            onClick={() => onDelete(deleteRef.current!)}
          />
        )}
        {toggle && <ExpandButton expanded={expanded} onClick={toggle} controls={bodyId} name={section.title} />}
      </div>
      {children && (
        <div id={bodyId} hidden={!expanded} className="border-t border-line-soft px-4 pt-3 pb-4">
          {children}
        </div>
      )}
    </li>
  );
}
