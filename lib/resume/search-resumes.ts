import type { Resume } from "./types";

/**
 * The Resumes whose Resume Title contains `query`, ignoring case and spaces
 * at the ends of the query, in the order given.
 */
export function searchResumes(resumes: Resume[], query: string): Resume[] {
  const wanted = query.trim().toLocaleLowerCase();
  return resumes.filter((resume) => resume.metadata.title.toLocaleLowerCase().includes(wanted));
}
