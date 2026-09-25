import {
  DEFAULT_RESUME_TITLE,
  DEFAULT_THEME_ID,
  SCHEMA_VERSION,
  FIXED_CONTACT_KINDS,
  type Resume,
} from "./types";
import { emptyContact } from "./empty-entry";

type Options = {
  now?: Date;
  newId?: () => string;
};

/**
 * Builds a new Resume with the six Default Sections, all Empty and Enabled,
 * the Header Pinned and holding its Empty email, phone and location items.
 * Pure apart from the clock and id generator, which callers can pass in.
 */
export function newResume({
  now = new Date(),
  newId = () => crypto.randomUUID(),
}: Options = {}): Resume {
  const timestamp = now.toISOString();

  return {
    schemaVersion: SCHEMA_VERSION,
    metadata: {
      id: newId(),
      title: DEFAULT_RESUME_TITLE,
      createdAt: timestamp,
      lastEditedAt: timestamp,
    },
    themeSettings: { themeId: DEFAULT_THEME_ID, layout: null },
    content: {
      sections: [
        {
          id: newId(),
          type: "header",
          title: "Header",
          enabled: true,
          pinned: true,
          name: "",
          headline: "",
          entries: FIXED_CONTACT_KINDS.map((kind) => emptyContact(kind, newId())),
        },
        { id: newId(), type: "summary", title: "Summary", enabled: true, entries: [] },
        { id: newId(), type: "experience", title: "Experience", enabled: true, entries: [] },
        { id: newId(), type: "projects", title: "Projects", enabled: true, entries: [] },
        { id: newId(), type: "skills", title: "Skills", enabled: true, entries: [] },
        { id: newId(), type: "education", title: "Education", enabled: true, entries: [] },
      ],
    },
  };
}
