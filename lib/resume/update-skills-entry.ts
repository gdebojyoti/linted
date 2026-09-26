import { editEntry, editSections, type EditOptions } from "./edit-sections";
import type { Resume, SkillsEntry } from "./types";

export type SkillsEntryChanges = Partial<Pick<SkillsEntry, "label" | "skills">>;

/** The Resume with a Skills Entry's label and/or Skills changed, stored exactly as typed. */
export function updateSkillsEntry(
  resume: Resume,
  entryId: string,
  { label, skills }: SkillsEntryChanges,
  options: EditOptions = {},
): Resume {
  return editSections(
    resume,
    (section) =>
      section.type === "skills"
        ? editEntry(section, entryId, (entry) => ({
            ...entry,
            label: label ?? entry.label,
            skills: skills ?? entry.skills,
          }))
        : section,
    options,
  );
}
