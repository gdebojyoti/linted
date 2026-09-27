import type { ResumeStore } from "@/lib/storage/resume-store";
import { newResume } from "./new-resume";
import type { Resume } from "./types";

function lastEdited(resume: Resume) {
  return Date.parse(resume.metadata.lastEditedAt);
}

type Options = {
  now?: () => Date;
};

/**
 * Creates, gets and lists the user's Resumes, kept in `store`. The clock
 * defaults to the real one; tests pass their own.
 */
export function resumes(store: ResumeStore, { now = () => new Date() }: Options = {}) {
  return {
    /** Saves a new, Empty Resume and returns it. */
    async create(): Promise<Resume> {
      const resume = newResume({ now: now() });
      await store.save(resume);
      return resume;
    },

    /** The Resume with this id, or null if there is none. */
    async get(id: string): Promise<Resume | null> {
      return store.get(id);
    },

    /** Every Resume, the most recently edited first. */
    async list(): Promise<Resume[]> {
      const all = await store.list();
      return all.sort((a, b) => lastEdited(b) - lastEdited(a));
    },
  };
}
