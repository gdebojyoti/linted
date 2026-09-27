import { formatCount } from "@/lib/format/count";
import { isContactShown, renderableView } from "./renderable-view";
import type { Resume, Section } from "./types";

/**
 * How much of a Resume will be shown, for the Library: "4 of 6 sections"
 * counts the Sections the Theme will draw (Enabled and not Empty) out of all
 * of them.
 */
export function sectionSummary(resume: Resume): string {
  const shown = renderableView(resume).sections.length;
  return `${shown} of ${resume.content.sections.length} sections`;
}

/**
 * The short description next to a Section's title in the Content pane, e.g.
 * "2 entries". The Header's reads "Asha Rao · 1 of 3 entries", counting the
 * contact items that will be shown (Enabled and not Empty), like
 * sectionSummary does for Sections. It counts them as if the Header itself
 * were Enabled: disabling the Header doesn't change its items' own state.
 */
export function entrySummary(section: Section): string {
  const entries = section.entries.length;
  if (section.type === "header") {
    const shown = section.entries.filter(isContactShown).length;
    const contacts = `${shown} of ${formatCount(entries, "entry", "entries")}`;
    return section.name ? `${section.name} · ${contacts}` : contacts;
  }
  return entries === 0 ? "No entries" : formatCount(entries, "entry", "entries");
}
