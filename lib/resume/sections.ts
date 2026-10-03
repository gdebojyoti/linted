import { editSections, type EditOptions } from "./edit-sections";
import type { Resume } from "./types";

// Section operations that work the same in every Section, the Header included.

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
