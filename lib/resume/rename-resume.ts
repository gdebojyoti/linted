import type { EditOptions } from "./edit-sections";
import type { Resume } from "./types";

/**
 * The Resume with this Resume Title, trimmed, and last-edited-at set to now.
 * An empty or whitespace-only title is rejected: the given Resume comes back
 * unchanged, as does one that already has this title. Titles need not be
 * unique across Resumes. The given Resume is not changed.
 */
export function renameResume(resume: Resume, title: string, { now = new Date() }: EditOptions = {}): Resume {
  const trimmed = title.trim();
  if (trimmed === "" || trimmed === resume.metadata.title) return resume;
  return { ...resume, metadata: { ...resume.metadata, title: trimmed, lastEditedAt: now.toISOString() } };
}
