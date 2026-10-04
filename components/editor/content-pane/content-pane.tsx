import { useState, type ReactNode } from "react";
import type { ResumeEdit, Section } from "@/lib/resume/types";
import { formatCount } from "@/lib/format/count";
import { renameSection, setSectionEnabled } from "@/lib/resume/sections";
import { EntryCardList } from "./entry-card-list";
import { ExperienceEntryCard } from "./experience-entry-card";
import { HeaderFields } from "./header-fields";
import { ProjectEntryCard } from "./project-entry-card";
import { SectionRow } from "./section-row";
import { SkillsFields } from "./skills-fields";
import { SummaryFields } from "./summary-fields";

/**
 * The Resume's Sections, one open at a time: opening one closes the others.
 * The Header starts open. Only the Header, Summary, Experience, Projects
 * and Skills can be edited so far; the other Sections gain their fields in
 * later tickets.
 */
export function ContentPane({
  sections,
  onEdit,
}: {
  sections: Section[];
  onEdit: (edit: ResumeEdit) => void;
}) {
  const [openId, setOpenId] = useState(() => sections.find((s) => s.type === "header")?.id ?? null);

  function fieldsOf(section: Section): ReactNode {
    switch (section.type) {
      case "header":
        return <HeaderFields header={section} onEdit={onEdit} />;
      case "summary":
        return <SummaryFields section={section} onEdit={onEdit} />;
      case "experience":
        return (
          <EntryCardList
            section={section}
            onEdit={onEdit}
            card={(entry, props) => <ExperienceEntryCard entry={entry} onEdit={onEdit} {...props} />}
          />
        );
      case "projects":
        return (
          <EntryCardList
            section={section}
            onEdit={onEdit}
            card={(entry, props) => <ProjectEntryCard entry={entry} onEdit={onEdit} {...props} />}
          />
        );
      case "skills":
        return <SkillsFields section={section} onEdit={onEdit} />;
      default:
        return null;
    }
  }

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
        {sections.map((section) => (
          <SectionRow
            key={section.id}
            section={section}
            onEnabledChange={(enabled) => onEdit((r) => setSectionEnabled(r, section.id, enabled))}
            onRename={
              section.type === "header" ? undefined : (title) => onEdit((r) => renameSection(r, section.id, title))
            }
            expanded={section.id === openId}
            onToggle={() => setOpenId(section.id === openId ? null : section.id)}
          >
            {fieldsOf(section)}
          </SectionRow>
        ))}
      </ul>
    </aside>
  );
}
