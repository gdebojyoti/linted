import { allowedLink } from "./allowed-link";
import { editEntry, editSections, type EditOptions } from "./edit-sections";
import type { ProjectEntry, Resume } from "./types";

/** A Project Entry's plain-text fields. Its dates and Bullets have their own functions (dates.ts, bullets.ts). */
export type ProjectEntryChanges = Partial<Pick<ProjectEntry, "name" | "linkLabel" | "link" | "techStack">>;

/**
 * The Resume with a Project Entry's name, link label, link and/or tech stack
 * changed, stored exactly as typed, except that the link follows the link
 * rule (allowedLink): one that doesn't start with http://, https:// or
 * mailto: is saved as empty.
 */
export function updateProjectEntry(
  resume: Resume,
  entryId: string,
  { name, linkLabel, link, techStack }: ProjectEntryChanges,
  options: EditOptions = {},
): Resume {
  return editSections(
    resume,
    (section) =>
      section.type === "projects"
        ? editEntry(section, entryId, (entry) => ({
            ...entry,
            name: name ?? entry.name,
            linkLabel: linkLabel ?? entry.linkLabel,
            link: link === undefined ? entry.link : allowedLink(link),
            techStack: techStack ?? entry.techStack,
          }))
        : section,
    options,
  );
}
