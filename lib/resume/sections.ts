import { editSections, type EditOptions } from "./edit-sections";
import type { Resume } from "./types";

// Section operations. They work the same in every Section, except that the
// Header can't be renamed.

/**
 * The Resume with the Section Enabled or Disabled. Its Entries and Bullets
 * keep their own Enabled state, so Enabling the Section again brings back
 * exactly what was shown before.
 */
export function setSectionEnabled(
  resume: Resume,
  sectionId: string,
  enabled: boolean,
  options: EditOptions = {},
): Resume {
  return editSections(
    resume,
    (section) => (section.id === sectionId && section.enabled !== enabled ? { ...section, enabled } : section),
    options,
  );
}

/**
 * The Resume with the Section's title changed, trimmed. The Header can't be
 * renamed, and a blank title is rejected: either way, as with a title the
 * Section already has, the given Resume comes back unchanged.
 */
export function renameSection(resume: Resume, sectionId: string, title: string, options: EditOptions = {}): Resume {
  const trimmed = title.trim();
  if (trimmed === "") return resume;
  return editSections(
    resume,
    (section) =>
      section.id === sectionId && section.type !== "header" && section.title !== trimmed
        ? { ...section, title: trimmed }
        : section,
    options,
  );
}
