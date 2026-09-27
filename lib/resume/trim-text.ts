import type { Content, Resume } from "./types";

function trimmedDeep(value: unknown): unknown {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return value.map(trimmedDeep);
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, trimmedDeep(inner)]));
  }
  return value;
}

/**
 * The Resume with every text field in its Content trimmed, as it is saved.
 * The editor keeps text as typed, so a space typed at the end of a word
 * survives until the next letter. Walks every string rather than listing
 * fields, so new Entry types are trimmed too; ids and kinds never have spaces
 * around them. The given Resume is not changed.
 */
export function trimText(resume: Resume): Resume {
  return { ...resume, content: trimmedDeep(resume.content) as Content };
}
