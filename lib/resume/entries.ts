import { editEntry, editSections, withEntries, type EditOptions } from "./edit-sections";
import { emptyEntry } from "./empty-entry";
import type { MoveDirection } from "./layout";
import { placedInList } from "./place-in-list";
import type { Entry, Resume, Section } from "./types";

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
  direction: MoveDirection,
  options: EditOptions = {},
): Resume {
  return editSections(
    resume,
    (section) => {
      if (section.id !== sectionId) return section;
      const entries = placedEntries(section, entryId, moveGap(section, entryId, direction));
      return entries ? withEntries(section, entries) : section;
    },
    options,
  );
}

/** Whether moveEntry would move the Entry in this Section, so the editor can disable the arrow. */
export function canMoveEntry(section: Section, entryId: string, direction: MoveDirection): boolean {
  return placedEntries(section, entryId, moveGap(section, entryId, direction)) !== null;
}

/** A move is a placement in the gap past the next Entry up or down. */
export function moveGap(section: Section, entryId: string, direction: MoveDirection): number {
  const from = section.entries.findIndex((e) => e.id === entryId);
  return direction === "up" ? from - 1 : from + 2;
}

/** Whether placeEntry would move the Entry in this Section, so a drop marker shows only where a drop does something. */
export function canPlaceEntry(section: Section, entryId: string, index: number): boolean {
  return placedEntries(section, entryId, index) !== null;
}

/**
 * The Resume with the Entry placed at this gap in its Section, counted as the
 * Section is now (0 is before the first Entry, the Section's length after the
 * last), for dropping a dragged Entry.
 */
export function placeEntry(
  resume: Resume,
  sectionId: string,
  entryId: string,
  index: number,
  options: EditOptions = {},
): Resume {
  return editSections(
    resume,
    (section) => {
      if (section.id !== sectionId) return section;
      const entries = placedEntries(section, entryId, index);
      return entries ? withEntries(section, entries) : section;
    },
    options,
  );
}

/**
 * The Section's Entries with this one placed at the gap, or null when the
 * placement can't happen (an unknown Entry, a gap outside the Section, the
 * Header) or changes nothing.
 */
export function placedEntries(section: Section, entryId: string, index: number): Entry[] | null {
  if (section.type === "header") return null;
  const entry = section.entries.find((e) => e.id === entryId);
  return entry ? placedInList<Entry>(section.entries, entry, index) : null;
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
