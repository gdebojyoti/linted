import { renderableView } from "./renderable-view";
import type { Resume } from "./types";

/**
 * How much of a Resume will be shown, for the Library: "4 of 6 sections"
 * counts the Sections the Theme will draw (Enabled and not Empty) out of all
 * of them.
 */
export function sectionSummary(resume: Resume): string {
  const shown = renderableView(resume).sections.length;
  return `${shown} of ${resume.content.sections.length} sections`;
}
