"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { browserLibrary as library } from "@/lib/resume/browser-library";
import { DEFAULT_RESUME_TITLE, type Resume } from "@/lib/resume/types";
import { EmptyLibrary } from "./empty-state/empty-library";
import { LibraryHeader } from "./header/library-header";
import { LibraryMessage } from "./library-message";
import { ResumeList } from "./resume-list/resume-list";
import { ResumeTitleDialog } from "./title-dialog/resume-title-dialog";

type Status =
  | { kind: "loading" }
  | { kind: "failed" }
  | { kind: "ready"; resumes: Resume[]; now: Date };

/**
 * The Library page. Resumes live in this browser (ADR 0002), so the server
 * renders only "Loading…" and the list is read after hydration.
 */
export function Library() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>({ kind: "loading" });
  const [creating, setCreating] = useState(false);
  const [naming, setNaming] = useState(false);
  /** The New resume button that opened the dialog, which gets focus back when it closes. */
  const openerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let current = true;
    library.list().then(
      (resumes) => current && setStatus({ kind: "ready", resumes, now: new Date() }),
      () => current && setStatus({ kind: "failed" }),
    );
    return () => {
      current = false;
    };
  }, []);

  // Saved first, so the editor always opens a Resume that exists. The dialog
  // stays open, its button disabled, until the editor replaces the page.
  // A failed save closes it; telling the user properly is #49.
  async function handleCreate(title: string) {
    setCreating(true);
    try {
      const resume = await library.create(title);
      router.push(`/resume-builder/resumes/${resume.metadata.id}`);
    } catch {
      setCreating(false);
      setNaming(false);
      setStatus({ kind: "failed" });
    }
  }

  function openDialog(opener: HTMLElement) {
    openerRef.current = opener;
    setNaming(true);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <LibraryHeader />
      {status.kind === "loading" && <LibraryMessage>Loading…</LibraryMessage>}
      {status.kind === "failed" && (
        <LibraryMessage role="alert">
          Your resumes couldn&apos;t be read. This browser may be blocking site storage.
        </LibraryMessage>
      )}
      {status.kind === "ready" &&
        (status.resumes.length === 0 ? (
          <EmptyLibrary creating={creating} onCreate={openDialog} />
        ) : (
          <ResumeList
            resumes={status.resumes}
            now={status.now}
            creating={creating}
            onCreate={openDialog}
          />
        ))}
      <ResumeTitleDialog
        open={naming}
        onOpenChange={(open) => !creating && setNaming(open)}
        heading="New resume"
        submitLabel="Create resume"
        initialTitle={DEFAULT_RESUME_TITLE}
        submitting={creating}
        onSubmit={handleCreate}
        returnFocusTo={openerRef}
      />
    </div>
  );
}
