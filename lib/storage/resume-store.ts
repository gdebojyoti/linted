import type { Resume } from "@/lib/resume/types";

/**
 * Where Resumes are kept. Async from day one so localStorage can later be
 * swapped for IndexedDB without changing callers (ADR 0002).
 */
export type ResumeStore = {
  /** Adds the Resume, or replaces the stored one with the same id. */
  save(resume: Resume): Promise<void>;
  /** The stored Resume, or null if there is none with this id. */
  get(id: string): Promise<Resume | null>;
  /** Every stored Resume, in no particular order. */
  list(): Promise<Resume[]>;
  /** Removes the Resume with this id, if there is one. */
  delete(id: string): Promise<void>;
};
