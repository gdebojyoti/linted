import { editEntry, editSections, type EditOptions } from "./edit-sections";
import type { CustomEntry, Resume } from "./types";

/** A Custom Entry's plain-text fields. Its dates and Bullets have their own functions (dates.ts, bullets.ts). */
export type CustomEntryChanges = Partial<Pick<CustomEntry, "title" | "subtitle">>;

/** The Resume with a Custom Entry's title and/or subtitle changed, stored exactly as typed. */
export function updateCustomEntry(
  resume: Resume,
  entryId: string,
  { title, subtitle }: CustomEntryChanges,
  options: EditOptions = {},
): Resume {
  return editSections(
    resume,
    (section) =>
      section.type === "custom"
        ? editEntry(section, entryId, (entry) => ({
            ...entry,
            title: title ?? entry.title,
            subtitle: subtitle ?? entry.subtitle,
          }))
        : section,
    options,
  );
}
