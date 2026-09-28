import type { ResumeStore } from "@/lib/storage/resume-store";
import { duplicateResume } from "./duplicate-resume";
import { newResume } from "./new-resume";
import { trimText } from "./trim-text";
import type { Resume } from "./types";

/**
 * Orders Resumes by last-edited-at, newest first. Ties go to the most
 * recently created, then to the id, so the order never depends on the store.
 */
function newestFirst(a: Resume, b: Resume) {
  const time = (iso: string) => Date.parse(iso);
  return (
    time(b.metadata.lastEditedAt) - time(a.metadata.lastEditedAt) ||
    time(b.metadata.createdAt) - time(a.metadata.createdAt) ||
    (a.metadata.id < b.metadata.id ? -1 : a.metadata.id > b.metadata.id ? 1 : 0)
  );
}

type Options = {
  /** Tells the time. Unlike the `now` Date the edit functions take, it's called on each use. */
  clock?: () => Date;
};

/**
 * The user's Library: creates, gets and lists their Resumes, kept in `store`.
 * The clock defaults to the real one; tests pass their own.
 */
export function resumeLibrary(store: ResumeStore, { clock = () => new Date() }: Options = {}) {
  return {
    /** Saves a new, Empty Resume with this title (see newResume) and returns it. */
    async create(title?: string): Promise<Resume> {
      const resume = newResume({ now: clock(), title });
      await store.save(resume);
      return resume;
    },

    /**
     * Saves a Duplicate of the Resume (see duplicateResume) with its text
     * trimmed, and returns it. Takes the Resume itself rather than its id, so
     * the editor can copy edits that aren't saved yet.
     */
    async duplicate(resume: Resume, title?: string): Promise<Resume> {
      const copy = trimText(duplicateResume(resume, { now: clock(), title }));
      await store.save(copy);
      return copy;
    },

    /** Stores the Resume with its text trimmed, replacing the saved one with the same id. */
    async save(resume: Resume): Promise<void> {
      await store.save(trimText(resume));
    },

    /** The Resume with this id, or null if there is none. */
    async get(id: string): Promise<Resume | null> {
      return store.get(id);
    },

    /** Every Resume, the most recently edited first. */
    async list(): Promise<Resume[]> {
      return [...(await store.list())].sort(newestFirst);
    },
  };
}
