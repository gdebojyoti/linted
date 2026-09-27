import type { Resume } from "@/lib/resume/types";
import type { ResumeStore } from "./resume-store";

/**
 * Keeps Resumes in memory, for tests. Copies on the way in and out, as
 * localStorage does, so callers can't change what's stored by accident.
 */
export function memoryResumeStore(): ResumeStore {
  const resumes = new Map<string, Resume>();

  return {
    async save(resume) {
      resumes.set(resume.metadata.id, structuredClone(resume));
    },
    async get(id) {
      const resume = resumes.get(id);
      return resume ? structuredClone(resume) : null;
    },
    async list() {
      return [...resumes.values()].map((resume) => structuredClone(resume));
    },
    async delete(id) {
      resumes.delete(id);
    },
  };
}
