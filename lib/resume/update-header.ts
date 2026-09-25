import type { HeaderSection, Resume } from "./types";

/** The Header fields the user can edit. Its title is fixed, so it isn't one of them. */
export type HeaderChanges = Partial<Pick<HeaderSection, "name" | "headline">>;

/**
 * The Resume with its Header's name and/or headline changed, stored exactly
 * as typed, and last-edited-at set to now. The given Resume is not changed.
 */
export function updateHeader(
  resume: Resume,
  changes: HeaderChanges,
  { now = new Date() }: { now?: Date } = {},
): Resume {
  return {
    ...resume,
    metadata: { ...resume.metadata, lastEditedAt: now.toISOString() },
    content: {
      sections: resume.content.sections.map((section) =>
        section.type === "header" ? { ...section, ...changes } : section,
      ),
    },
  };
}
