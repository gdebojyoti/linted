import type { Section } from "@/lib/resume/types";
import { Badge } from "@/components/common/badge";
import { formatCount } from "@/lib/format/count";

export function SectionRow({ section }: { section: Section }) {
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

/** The short description next to a Section's title, e.g. "2 entries". */
function summarise(section: Section): string {
  const entries = section.entries.length;
  if (section.type === "header") {
    const enabled = section.entries.filter((e) => e.enabled).length;
    const contacts = `${enabled} of ${formatCount(entries, "entry", "entries")}`;
    return section.name ? `${section.name} · ${contacts}` : contacts;
  }
  if (section.type === "skills") {
    const skills = section.entries.reduce((n, e) => n + e.skills.length, 0);
    return `${formatCount(entries, "group", "groups")} · ${formatCount(skills, "skill", "skills")}`;
  }
  return entries === 0 ? "No entries" : formatCount(entries, "entry", "entries");
}
