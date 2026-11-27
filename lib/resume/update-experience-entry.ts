import { editEntry, editSections, type EditOptions } from "./edit-sections";
import type { ExperienceEntry, Resume } from "./types";

/** An Experience Entry's own plain-text fields. Its Positions have their own functions (positions.ts). */
export type ExperienceEntryChanges = Partial<Pick<ExperienceEntry, "company" | "location">>;

/** The Resume with an Experience Entry's company and/or location changed, stored exactly as typed. */
export function updateExperienceEntry(
  resume: Resume,
  entryId: string,
  { company, location }: ExperienceEntryChanges,
  options: EditOptions = {},
): Resume {
  return editSections(
    resume,
    (section) =>
      section.type === "experience"
        ? editEntry(section, entryId, (entry) => ({
            ...entry,
            company: company ?? entry.company,
            location: location ?? entry.location,
          }))
        : section,
    options,
  );
}
