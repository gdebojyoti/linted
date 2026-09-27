import { renderableView } from "./renderable-view";
import type { Resume } from "./types";

/**
 * How much of a Resume will be shown, for the Library: "4 of 6 sections"
 * counts the Sections the Theme will draw (Enabled and not Empty) out of all
 * of them, or "all sections empty" when none will be drawn.
 */
export function sectionSummary(resume: Resume): string {
  const shown = renderableView(resume).sections.length;
  if (shown === 0) return "all sections empty";
  return `${shown} of ${resume.content.sections.length} sections`;
}
