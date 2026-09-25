import { linkHref } from "@/lib/format/link-href";
import { editEntry, editSections, type EditOptions } from "./edit-sections";
import type { Resume } from "./types";

/** A contact item's editable fields. Only a link has a label. */
export type ContactChanges = {
  label?: string;
  value?: string;
};

/**
 * The Resume with a Header contact item changed, stored exactly as typed.
 * A link must start with http://, https:// or mailto: (see linkHref); any
 * other link is saved as empty.
 */
export function updateContact(
  resume: Resume,
  entryId: string,
  { label, value }: ContactChanges,
  options: EditOptions = {},
): Resume {
  return editSections(
    resume,
    (section) =>
      section.type === "header"
        ? editEntry(section, entryId, (entry) =>
            entry.kind === "link"
              ? {
                  ...entry,
                  label: label ?? entry.label,
                  value: value === undefined ? entry.value : allowedLink(value),
                }
              : { ...entry, value: value ?? entry.value },
          )
        : section,
    options,
  );
}

function allowedLink(url: string): string {
  return linkHref(url) === null ? "" : url;
}
