import { formatCount } from "./count";

/**
 * The Library's count line: "5 resumes" when every Resume is shown, else
 * "2 of 5 resumes" for what a search shows.
 */
export function formatLibraryCount(shown: number, total: number): string {
  const all = formatCount(total, "resume", "resumes");
  return shown === total ? all : `${shown} of ${all}`;
}
