import { editEntry, editSections, type EditOptions } from "./edit-sections";
import type { Resume } from "./types";

/** The Resume with a Summary Entry's Prose changed, stored exactly as typed (ADR 0004). */
export function updateSummaryEntry(resume: Resume, entryId: string, text: string, options: EditOptions = {}): Resume {
  return editSections(
    resume,
    (section) => (section.type === "summary" ? editEntry(section, entryId, (entry) => ({ ...entry, text })) : section),
    options,
  );
}
