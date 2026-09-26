import type { Entry, Resume, Section } from "./types";

export type EditOptions = {
  now?: Date;
};

/**
 * The Resume with each Section passed through `edit`, and last-edited-at set
 * to now. `edit` returns a Section unchanged (the same object) when the edit
 * isn't for it; when no Section changes, the given Resume itself comes back,
 * so an edit of nothing isn't an edit. The given Resume is not changed.
 */
export function editSections(
  resume: Resume,
  edit: (section: Section) => Section,
  { now = new Date() }: EditOptions = {},
): Resume {
  const sections = resume.content.sections.map(edit);
  if (sections.every((section, i) => section === resume.content.sections[i])) return resume;

  return {
    ...resume,
    metadata: { ...resume.metadata, lastEditedAt: now.toISOString() },
    content: { sections },
  };
}

/**
 * The Section with the Entry `entryId` passed through `edit`, or the Section
 * itself when it has no such Entry.
 */
export function editEntry<S extends Section>(
  section: S,
  entryId: string,
  edit: (entry: S["entries"][number]) => S["entries"][number],
): S {
  if (!section.entries.some((entry) => entry.id === entryId)) return section;
  return withEntries(
    section,
    section.entries.map((entry) => (entry.id === entryId ? edit(entry) : entry)),
  );
}

/**
 * The Section with new Entries. TypeScript can't check that Entries match the
 * type of a Section it only knows as "any Section", so callers must: pass only
 * Entries taken from this Section, or made for its type.
 */
export function withEntries<S extends Section>(section: S, entries: Entry[]): S {
  return { ...section, entries } as S;
}
