import { localStorageResumeStore } from "@/lib/storage/local-storage-resume-store";
import { resumeLibrary } from "./resume-library";

/**
 * The user's Library, kept in this browser's localStorage (ADR 0002). The
 * store only reaches localStorage when a method runs, so importing this is
 * safe during the server render too.
 */
export const browserLibrary = resumeLibrary(localStorageResumeStore());
