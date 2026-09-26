import { useId, useState, type ReactNode } from "react";
import type { Section } from "@/lib/resume/types";
import { Badge } from "@/components/common/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCount } from "@/lib/format/count";

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
        <span className="text-xs text-ink-meta">{summarise(section)}</span>
        <span className="grow" />
        {section.type === "header" && section.pinned && <Badge>Pinned</Badge>}
        {children && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-controls={bodyId}
            aria-label={`${expanded ? "Collapse" : "Expand"} ${section.title}`}
            className="flex size-8 items-center justify-center rounded-sm text-ink-muted hover:bg-subtle"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className={expanded ? "rotate-180" : undefined}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
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

/** The short description next to a Section's title, e.g. "2 entries". */
function summarise(section: Section): string {
  const entries = section.entries.length;
  if (section.type === "header") {
    const enabled = section.entries.filter((e) => e.enabled).length;
    const contacts = `${enabled} of ${formatCount(entries, "entry", "entries")}`;
    return section.name ? `${section.name} · ${contacts}` : contacts;
  }
  return entries === 0 ? "No entries" : formatCount(entries, "entry", "entries");
}
