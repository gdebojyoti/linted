import { useId, type ReactNode } from "react";
import type { Section } from "@/lib/resume/types";
import { Badge } from "@/components/common/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { entrySummary } from "@/lib/resume/section-summary";
import { ExpandButton } from "./expand-button";
import { isControlClick } from "./is-control-click";
import { SectionTitle } from "./section-title";

/**
 * One Section in the Content pane, with its Enabled checkbox and its title,
 * which can be renamed (except the Header's). A Disabled Section's title is
 * grey, and its fields can still be edited. When it has
 * fields to edit (`children`), clicking anywhere on its header line opens or
 * closes them, except on the line's own controls. Keyboard and screen reader users get the chevron
 * button. Whether it's open is up to the parent, which keeps one Section
 * open at a time. Closed fields stay on the page, hidden, so nothing typed
 * in them is lost.
 */
export function SectionRow({
  section,
  onEnabledChange,
  onRename,
  expanded = false,
  onToggle,
  children,
}: {
  section: Section;
  onEnabledChange: (enabled: boolean) => void;
  /** Left out for the Header, which can't be renamed. */
  onRename?: (title: string) => void;
  expanded?: boolean;
  onToggle?: () => void;
  children?: ReactNode;
}) {
  const bodyId = useId();
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
        <SectionTitle title={section.title} enabled={section.enabled} onRename={onRename} />
        {section.type === "custom" && <Badge>Custom</Badge>}
        <span className="text-xs text-ink-meta">{entrySummary(section)}</span>
        <span className="grow" />
        {section.type === "header" && section.pinned && <Badge>Pinned</Badge>}
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
