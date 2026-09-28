"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ResumeTitleDialog } from "@/components/common/title-dialog/resume-title-dialog";
import { browserLibrary as library } from "@/lib/resume/browser-library";
import { copyTitle } from "@/lib/resume/duplicate-resume";
import { DEFAULT_RESUME_TITLE, type Resume } from "@/lib/resume/types";
import { EmptyLibrary } from "./empty-state/empty-library";
import { LibraryHeader } from "./header/library-header";
import { LibraryMessage } from "./library-message";
import { ResumeList } from "./resume-list/resume-list";

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
  /**
   * The Resume being duplicated, or null for a new one. Kept after the
   * dialog closes, so its wording doesn't change while it fades out.
   */
  const [source, setSource] = useState<Resume | null>(null);
  /** The button that opened the dialog, which gets focus back when it closes. */
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
  async function handleSubmit(title: string) {
    setCreating(true);
    try {
      const resume = source ? await library.duplicate(source, title) : await library.create(title);
      router.push(`/resume-builder/resumes/${resume.metadata.id}`);
    } catch {
      setCreating(false);
      setNaming(false);
      setStatus({ kind: "failed" });
    }
  }

  function openDialog(opener: HTMLElement, resume: Resume | null) {
    openerRef.current = opener;
    setSource(resume);
    setNaming(true);
  }

  const openNew = (opener: HTMLElement) => openDialog(opener, null);

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
          <EmptyLibrary creating={creating} onCreate={openNew} />
        ) : (
          <ResumeList
            resumes={status.resumes}
            now={status.now}
            creating={creating}
            onCreate={openNew}
            onDuplicate={(resume, opener) => openDialog(opener, resume)}
          />
        ))}
      <ResumeTitleDialog
        open={naming}
        onOpenChange={(open) => !creating && setNaming(open)}
        heading={source ? "Duplicate resume" : "New resume"}
        submitLabel={source ? "Duplicate" : "Create resume"}
        initialTitle={source ? copyTitle(source.metadata.title) : DEFAULT_RESUME_TITLE}
        submitting={creating}
        onSubmit={handleSubmit}
        returnFocusTo={openerRef}
      />
    </div>
  );
}
