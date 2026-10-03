import { useId, useState, type ReactNode } from "react";
import type { Section } from "@/lib/resume/types";
import { Badge } from "@/components/common/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { entrySummary } from "@/lib/resume/section-summary";
import { ExpandButton } from "./expand-button";

/**
 * One Section in the Content pane. When it has fields to edit (`children`),
 * a chevron expands and collapses them.
 */
export function SectionRow({
  section,
  defaultExpanded = false,
  children,
}: {
  section: Section;
  defaultExpanded?: boolean;
  children?: ReactNode;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const bodyId = useId();

  return (
    <li className="rounded-lg border border-line bg-surface">
      <div className="flex min-h-12 items-center gap-2.5 pr-2 pl-3">
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
        {children && (
          <ExpandButton
            expanded={expanded}
            onClick={() => setExpanded(!expanded)}
            controls={bodyId}
            name={section.title}
          />
        )}
      </div>
      {children && (
        <div id={bodyId} hidden={!expanded} className="border-t border-line-soft px-4 pt-3 pb-4">
          {children}
        </div>
      )}
    </li>
  );
}