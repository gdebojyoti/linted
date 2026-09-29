import { editEntry, editSections, withEntries, type EditOptions } from "./edit-sections";
import { emptyEntry } from "./empty-entry";
import type { Entry, Resume } from "./types";

// Entry operations that work the same in every Section. Editing an Entry's
// own fields is per type (updateContact, updateSkillsEntry).

export type AddOptions = EditOptions & {
  newId?: () => string;
};

/**
 * The Resume with an Empty, Enabled Entry added at the end of the Section. In
 * the Header, that Entry is a link.
 */
export function addEntry(
  resume: Resume,
  sectionId: string,
  { newId = () => crypto.randomUUID(), ...options }: AddOptions = {},
): Resume {
  return editSections(
    resume,
    (section) =>
      section.id === sectionId
        ? withEntries(section, [...section.entries, emptyEntry(section.type, newId())])
        : section,
    options,
  );
}

/** The Resume without the Entry. The Header's email, phone and location items can't be deleted. */
export function deleteEntry(
  resume: Resume,
  sectionId: string,
  entryId: string,
  options: EditOptions = {},
): Resume {
  return editSections(
    resume,
    (section) => {
      if (section.id !== sectionId) return section;
      const entry = section.entries.find((e) => e.id === entryId);
      if (!entry || isFixedContact(entry)) return section;
      return withEntries(
        section,
        section.entries.filter((e) => e.id !== entryId),
      );
    },
    options,
  );
}

/**
 * The Resume with the Entry moved one place up (towards the start) or down.
 * Nothing changes at either end, or in the Header, whose contact items keep
 * a fixed order in v1.
 */
export function moveEntry(
  resume: Resume,
  sectionId: string,
  entryId: string,
  direction: "up" | "down",
  options: EditOptions = {},
): Resume {
  return editSections(
    resume,
    (section) => {
      if (section.id !== sectionId || section.type === "header") return section;
      const from = section.entries.findIndex((e) => e.id === entryId);
      const to = direction === "up" ? from - 1 : from + 1;
      if (from === -1 || to < 0 || to >= section.entries.length) return section;
      const entries = [...section.entries];
      [entries[from], entries[to]] = [entries[to], entries[from]];
      return withEntries(section, entries);
    },
    options,
  );
}

/** Whether this is one of the Header's email, phone and location items, which can't be deleted. */
function isFixedContact(entry: Entry): boolean {
  return "kind" in entry && entry.kind !== "link";
}

/** The Resume with the Entry Enabled or Disabled. */
export function setEntryEnabled(
  resume: Resume,
  sectionId: string,
  entryId: string,
  enabled: boolean,
  options: EditOptions = {},
): Resume {
  return editSections(
    resume,
    (section) =>
      section.id === sectionId ? editEntry(section, entryId, (entry) => ({ ...entry, enabled })) : section,
    options,
  );
}
