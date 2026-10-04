import { editEntry, editSections, type EditOptions } from "./edit-sections";
import type { EducationEntry, Resume } from "./types";

/** An Education Entry's plain-text fields. Its dates and Bullets have their own functions (dates.ts, bullets.ts). */
export type EducationEntryChanges = Partial<Pick<EducationEntry, "institution" | "degree" | "location" | "results">>;

/**
 * The Resume with an Education Entry's institution, degree, location and/or
 * GPA or results changed, stored exactly as typed.
 */
export function updateEducationEntry(
  resume: Resume,
  entryId: string,
  { institution, degree, location, results }: EducationEntryChanges,
  options: EditOptions = {},
): Resume {
  return editSections(
    resume,
    (section) =>
      section.type === "education"
        ? editEntry(section, entryId, (entry) => ({
            ...entry,
            institution: institution ?? entry.institution,
            degree: degree ?? entry.degree,
            location: location ?? entry.location,
            results: results ?? entry.results,
          }))
        : section,
    options,
  );
}
