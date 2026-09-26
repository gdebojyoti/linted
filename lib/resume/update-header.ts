import { editSections, type EditOptions } from "./edit-sections";
import type { HeaderSection, Resume } from "./types";

/** The Header fields the user can edit. The Header can't be renamed, so its title isn't one of them. */
export type HeaderChanges = Partial<Pick<HeaderSection, "name" | "headline">>;

/**
 * The Resume with its Header's name and/or headline changed, stored exactly
 * as typed, and last-edited-at set to now. Anything else passed in changes
 * is ignored. The given Resume is not changed.
 */
export function updateHeader(
  resume: Resume,
  { name, headline }: HeaderChanges,
  options: EditOptions = {},
): Resume {
  return editSections(
    resume,
    (section) =>
      section.type === "header"
        ? { ...section, name: name ?? section.name, headline: headline ?? section.headline }
        : section,
    options,
  );
}
