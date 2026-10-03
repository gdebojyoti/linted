import { editEntry, editSections, type EditOptions } from "./edit-sections";
import type { ExperienceEntry, Resume } from "./types";

/** An Experience Entry's plain-text fields. Its dates and Bullets have their own functions (dates.ts, bullets.ts). */
export type ExperienceEntryChanges = Partial<Pick<ExperienceEntry, "company" | "role" | "location">>;

/** The Resume with an Experience Entry's company, role and/or location changed, stored exactly as typed. */
export function updateExperienceEntry(
  resume: Resume,
  entryId: string,
  { company, role, location }: ExperienceEntryChanges,
  options: EditOptions = {},
): Resume {
  return editSections(
    resume,
    (section) =>
      section.type === "experience"
        ? editEntry(section, entryId, (entry) => ({
            ...entry,
            company: company ?? entry.company,
            role: role ?? entry.role,
            location: location ?? entry.location,
          }))
        : section,
    options,
  );
}
