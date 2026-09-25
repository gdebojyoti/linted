import type { DateRange, Entry, FixedContactEntry, FixedContactKind, SectionType } from "./types";

const noDates: DateRange = { start: null, current: false, end: null };

/** An Empty, Enabled email, phone or location item. */
export function emptyContact(kind: FixedContactKind, id: string): FixedContactEntry {
  return { id, enabled: true, kind, value: "" };
}

/**
 * An Empty, Enabled Entry for a Section of this type. For the Header it is a
 * link: the only contact item that can be added.
 */
export function emptyEntry(type: SectionType, id: string): Entry {
  const enabled = true;
  switch (type) {
    case "header":
      return { id, enabled, kind: "link", label: "", value: "" };
    case "summary":
      return { id, enabled, text: "" };
    case "experience":
      return { id, enabled, company: "", role: "", location: "", dates: noDates, bullets: [] };
    case "projects":
      return { id, enabled, name: "", link: "", techStack: "", dates: noDates, bullets: [] };
    case "skills":
      return { id, enabled, label: "", skills: "" };
    case "education":
      return {
        id,
        enabled,
        institution: "",
        degree: "",
        location: "",
        dates: noDates,
        results: "",
        bullets: [],
      };
    case "custom":
      return { id, enabled, title: "", subtitle: "", dates: noDates, bullets: [] };
  }
}
