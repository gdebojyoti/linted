import type { Section } from "@/lib/resume/types";

// Read-only for now: editing arrives with the Section tickets (#17 onwards).

export function ContentPane({ sections }: { sections: Section[] }) {
  return (
    <aside
      aria-label="Content"
      className="flex w-160 shrink-0 flex-col border-r border-line bg-surface"
    >
      <div className="flex h-11 shrink-0 items-center gap-2.5 border-b border-line-soft px-6">
        <span className="text-[13px] font-semibold">Content</span>
        <span className="text-xs text-ink-meta">{countOf(sections.length, "section", "sections")}</span>
      </div>
      <ul className="flex grow flex-col gap-2 overflow-auto px-6 pt-4 pb-8">
        {sections.map((section) => (
          <SectionRow key={section.id} section={section} />
        ))}
      </ul>
    </aside>
  );
}

function SectionRow({ section }: { section: Section }) {
  return (
    <li className="flex min-h-12 items-center gap-2.5 rounded-lg border border-line bg-surface pr-2 pl-3">
      <input
        type="checkbox"
        checked={section.enabled}
        disabled
        aria-label={`${section.title} enabled`}
        className="size-4 accent-accent"
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
    </li>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-xs border border-line px-1.5 py-0.5 text-[11px] text-ink-muted">
      {children}
    </span>
  );
}

/** The short description next to a Section's title, e.g. "2 entries". */
function summarise(section: Section): string {
  const entries = section.entries.length;
  if (section.type === "header") {
    const enabled = section.entries.filter((e) => e.enabled).length;
    const contacts = `${enabled} of ${countOf(entries, "entry", "entries")}`;
    return section.name ? `${section.name} · ${contacts}` : contacts;
  }
  if (section.type === "skills") {
    const skills = section.entries.reduce((n, e) => n + e.skills.length, 0);
    return `${countOf(entries, "group", "groups")} · ${countOf(skills, "skill", "skills")}`;
  }
  return entries === 0 ? "No entries" : countOf(entries, "entry", "entries");
}

function countOf(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}
