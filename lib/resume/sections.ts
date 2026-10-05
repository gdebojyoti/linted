import { hasDates } from "./dates";
import { editSections, type EditOptions } from "./edit-sections";
import type { AddOptions } from "./entries";
import { DEFAULT_CUSTOM_SECTION_TITLE, type Bullet, type CustomSection, type Resume } from "./types";

// Section operations. They work the same in every Section, except that the
// Header can't be renamed and only Custom Sections can be deleted.

/**
 * The Resume with an Empty, Enabled Custom Section added after all the
 * others, titled "Untitled Section" until the user renames it.
 */
export function addCustomSection(
  resume: Resume,
  { newId = () => crypto.randomUUID(), now = new Date() }: AddOptions = {},
): Resume {
  const section: CustomSection = {
    id: newId(),
    type: "custom",
    title: DEFAULT_CUSTOM_SECTION_TITLE,
    enabled: true,
    entries: [],
  };
  return {
    ...resume,
    metadata: { ...resume.metadata, lastEditedAt: now.toISOString() },
    content: { sections: [...resume.content.sections, section] },
  };
}

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

/**
 * The Resume without the Section, the others keeping their order. Only a
 * Custom Section can be deleted: a Default Section, the Header included, is
 * left Empty or Disabled instead, so deleting one changes nothing.
 */
export function deleteSection(resume: Resume, sectionId: string, { now = new Date() }: EditOptions = {}): Resume {
  const sections = resume.content.sections.filter((s) => s.id !== sectionId || s.type !== "custom");
  if (sections.length === resume.content.sections.length) return resume;
  return {
    ...resume,
    metadata: { ...resume.metadata, lastEditedAt: now.toISOString() },
    content: { sections },
  };
}

/**
 * Whether anything in a Custom Section is filled in: text or dates in any of
 * its Entries or Bullets, Enabled or Disabled. Deleting a Section with
 * content loses work, so the editor asks first.
 */
export function hasContent(section: CustomSection): boolean {
  return section.entries.some(
    (entry) =>
      isFilled(entry.title) || isFilled(entry.subtitle) || hasDates(entry.dates) || entry.bullets.some(bulletHasContent),
  );
}

function bulletHasContent(bullet: Bullet): boolean {
  return isFilled(bullet.text) || bullet.children.some(bulletHasContent);
}

function isFilled(text: string): boolean {
  return text.trim() !== "";
}
