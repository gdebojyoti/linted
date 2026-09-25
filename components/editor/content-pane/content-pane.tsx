import type { Section } from "@/lib/resume/types";
import { formatCount } from "@/lib/format/count";
import { SectionRow } from "./section-row";

// Read-only for now: editing arrives with the Section tickets (#17 onwards).

export function ContentPane({ sections }: { sections: Section[] }) {
  return (
    <aside
      aria-label="Content"
      className="flex w-160 shrink-0 flex-col border-r border-line bg-surface"
    >
      <div className="flex h-11 shrink-0 items-center gap-2.5 border-b border-line-soft px-6">
        <span className="text-[13px] font-semibold">Content</span>
        <span className="text-xs text-ink-meta">{formatCount(sections.length, "section", "sections")}</span>
      </div>
      <ul className="flex grow flex-col gap-2 overflow-auto px-6 pt-4 pb-8">
        {sections.map((section) => (
          <SectionRow key={section.id} section={section} />
        ))}
      </ul>
    </aside>
  );
}
