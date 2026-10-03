import { useId, type ReactNode } from "react";
import type { Section } from "@/lib/resume/types";
import { Badge } from "@/components/common/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { entrySummary } from "@/lib/resume/section-summary";
import { ExpandButton } from "./expand-button";
import { isControlClick } from "./is-control-click";

/**
 * One Section in the Content pane. When it has fields to edit (`children`),
 * clicking anywhere on its header line opens or closes them, except on the
 * line's own controls. Keyboard and screen reader users get the chevron
 * button. Whether it's open is up to the parent, which keeps one Section
 * open at a time. Closed fields stay on the page, hidden, so nothing typed
 * in them is lost.
 */
export function SectionRow({
  section,
  expanded = false,
  onToggle,
  children,
}: {
  section: Section;
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
          disabled
          aria-label={`${section.title} enabled`}
          className="data-disabled:opacity-50"
        />
        <span
          className={`text-sm font-medium ${section.enabled ? "text-ink" : "text-ink-disabled"}`}
        >
          {section.title}
        </span>
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
