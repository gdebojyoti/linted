import type { Resume } from "@/lib/resume/types";
import type { ResumeStore } from "./resume-store";

/**
 * Keeps Resumes in memory, for tests. Copies through JSON on the way in and
 * out, exactly as localStorage does, so callers can't change what's stored by
 * accident and tests see the same data the app would.
 */
export function memoryResumeStore(): ResumeStore {
  const resumes = new Map<string, string>();

  return {
    async save(resume) {
      resumes.set(resume.metadata.id, JSON.stringify(resume));
    },
    async get(id) {
      const json = resumes.get(id);
      return json === undefined ? null : (JSON.parse(json) as Resume);
    },
    async list() {
      return [...resumes.values()].map((json) => JSON.parse(json) as Resume);
    },
    async delete(id) {
      resumes.delete(id);
    },
  };
}
