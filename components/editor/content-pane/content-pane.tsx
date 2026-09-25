import type { Resume, Section } from "@/lib/resume/types";
import { formatCount } from "@/lib/format/count";
import { HeaderFields } from "./header-fields";
import { SectionRow } from "./section-row";

// Only the Header can be edited so far; the other Sections gain their fields
// in later tickets.

export function ContentPane({
  sections,
  onEdit,
}: {
  sections: Section[];
  onEdit: (edit: (resume: Resume) => Resume) => void;
}) {
  return (
    <aside
      aria-label="Content"
      className="flex min-w-100 max-w-160 w-1/3 shrink-0 flex-col border-r border-line bg-surface"
    >
      <div className="flex h-11 shrink-0 items-center gap-2.5 border-b border-line-soft px-6">
        <span className="text-[13px] font-semibold">Content</span>
        <span className="text-xs text-ink-meta">{formatCount(sections.length, "section", "sections")}</span>
      </div>
      <ul className="flex grow flex-col gap-2 overflow-auto px-6 pt-4 pb-8">
        {sections.map((section) =>
          section.type === "header" ? (
            <SectionRow key={section.id} section={section} defaultExpanded>
              <HeaderFields header={section} onEdit={onEdit} />
            </SectionRow>
          ) : (
            <SectionRow key={section.id} section={section} />
          ),
        )}
      </ul>
    </aside>
  );
}
