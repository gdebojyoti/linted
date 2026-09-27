"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { resumeLibrary } from "@/lib/resume/resume-library";
import type { Resume } from "@/lib/resume/types";
import { localStorageResumeStore } from "@/lib/storage/local-storage-resume-store";
import { EmptyLibrary } from "./empty-state/empty-library";
import { LibraryHeader } from "./header/library-header";
import { LibraryMessage } from "./library-message";
import { ResumeList } from "./resume-list/resume-list";

// The store only reaches localStorage when a method runs, so creating it here
// is safe during the server render too.
const library = resumeLibrary(localStorageResumeStore());

type Loaded =
  | { state: "loading" }
  | { state: "failed" }
  | { state: "ready"; resumes: Resume[]; now: Date };

/**
 * The Library page. Resumes live in this browser (ADR 0002), so the server
 * renders only "Loading…" and the list is read after hydration.
 */
export function Library() {
  const router = useRouter();
  const [loaded, setLoaded] = useState<Loaded>({ state: "loading" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let current = true;
    library.list().then(
      (resumes) => current && setLoaded({ state: "ready", resumes, now: new Date() }),
      () => current && setLoaded({ state: "failed" }),
    );
    return () => {
      current = false;
    };
  }, []);

  // Saved first, so the editor always opens a Resume that exists.
  async function handleCreate() {
    setCreating(true);
    try {
      const resume = await library.create();
      router.push(`/resume-builder/resumes/${resume.metadata.id}`);
    } catch {
      setCreating(false);
      setLoaded({ state: "failed" });
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <LibraryHeader />
      {loaded.state === "loading" && <LibraryMessage>Loading…</LibraryMessage>}
      {loaded.state === "failed" && (
        <LibraryMessage>
          Your resumes couldn&apos;t be read. This browser may be blocking site storage.
        </LibraryMessage>
      )}
      {loaded.state === "ready" &&
        (loaded.resumes.length === 0 ? (
          <EmptyLibrary creating={creating} onCreate={handleCreate} />
        ) : (
          <ResumeList
            resumes={loaded.resumes}
            now={loaded.now}
            creating={creating}
            onCreate={handleCreate}
          />
        ))}
    </div>
  );
}
