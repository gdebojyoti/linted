"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ConfirmDeleteDialog } from "@/components/common/confirm-delete-dialog";
import { CHANGE_LATER_HINT, ResumeTitleDialog } from "@/components/common/title-dialog/resume-title-dialog";
import { browserLibrary as library } from "@/lib/resume/browser-library";
import { copyTitle } from "@/lib/resume/duplicate-resume";
import { renameResume } from "@/lib/resume/rename-resume";
import { DEFAULT_RESUME_TITLE, type Resume } from "@/lib/resume/types";
import { EmptyLibrary } from "./empty-state/empty-library";
import { LibraryHeader } from "./header/library-header";
import { LibraryMessage } from "./library-message";
import { ResumeList } from "./resume-list/resume-list";

type Status =
  | { kind: "loading" }
  | { kind: "failed" }
  | { kind: "ready"; resumes: Resume[]; now: Date };

/** What the title dialog is for. */
type Request = { kind: "new" } | { kind: "duplicate"; resume: Resume } | { kind: "rename"; resume: Resume };

/** The dialog's wording and starting title for each Request. */
function dialogText(request: Request) {
  switch (request.kind) {
    case "new":
      return {
        heading: "New resume",
        submitLabel: "Create resume",
        initialTitle: DEFAULT_RESUME_TITLE,
        footerHint: CHANGE_LATER_HINT,
      };
    case "duplicate":
      return {
        heading: "Duplicate resume",
        submitLabel: "Duplicate",
        initialTitle: copyTitle(request.resume.metadata.title),
        footerHint: CHANGE_LATER_HINT,
      };
    case "rename":
      return { heading: "Rename resume", submitLabel: "Rename", initialTitle: request.resume.metadata.title };
  }
}


/**
 * The Library page. Resumes live in this browser (ADR 0002), so the server
 * renders only "Loading…" and the list is read after hydration.
 */
export function Library() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>({ kind: "loading" });
  const [saving, setSaving] = useState(false);
  const [naming, setNaming] = useState(false);
  /** Kept after the dialog closes, so its wording doesn't change while it fades out. */
  const [request, setRequest] = useState<Request>({ kind: "new" });
  /** The button that opened the dialog, which gets focus back when it closes. */
  const openerRef = useRef<HTMLElement>(null);
  const [confirming, setConfirming] = useState(false);
  /** The Resume the delete confirmation is for, kept while the dialog fades out. */
  const [toDelete, setToDelete] = useState<Resume | null>(null);
  /** Where focus goes after a delete, since the deleted row's "…" button is gone. */
  const newResumeRef = useRef<HTMLButtonElement>(null);

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

  // A new Resume or a Duplicate is saved first, so the editor always opens a
  // Resume that exists; the dialog stays open, its button disabled, until the
  // editor replaces the page. A rename stays in the Library, which is read
  // again so the list shows it (now the most recently edited). A failed save
  // closes the dialog; telling the user properly is #49.
  async function handleSubmit(title: string) {
    setSaving(true);
    try {
      if (request.kind === "rename") {
        const renamed = renameResume(request.resume, title);
        if (renamed !== request.resume) await library.save(renamed);
        setStatus({ kind: "ready", resumes: await library.list(), now: new Date() });
        setSaving(false);
        setNaming(false);
        return;
      }
      const resume =
        request.kind === "duplicate" ? await library.duplicate(request.resume, title) : await library.create(title);
      router.push(`/resume-builder/resumes/${resume.metadata.id}`);
    } catch {
      setSaving(false);
      setNaming(false);
      setStatus({ kind: "failed" });
    }
  }

  function openDialog(opener: HTMLElement, next: Request) {
    openerRef.current = opener;
    setRequest(next);
    setNaming(true);
  }

  const openNew = (opener: HTMLElement) => openDialog(opener, { kind: "new" });

  function openDelete(resume: Resume, opener: HTMLElement) {
    openerRef.current = opener;
    setToDelete(resume);
    setConfirming(true);
  }

  // The list is read again, so the deleted Resume's row goes (or the empty
  // state shows). A failed delete closes the dialog; telling the user
  // properly is #49.
  async function handleDelete() {
    if (!toDelete) return;
    setSaving(true);
    try {
      await library.delete(toDelete.metadata.id);
      setStatus({ kind: "ready", resumes: await library.list(), now: new Date() });
    } catch {
      setStatus({ kind: "failed" });
    }
    setSaving(false);
    setConfirming(false);
  }

  /** The "…" button that opened the dialog while its row is still there, else New resume. */
  const focusAfterDelete = () => (openerRef.current?.isConnected ? openerRef.current : newResumeRef.current);

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
          <EmptyLibrary creating={saving} onCreate={openNew} newResumeRef={newResumeRef} />
        ) : (
          <ResumeList
            resumes={status.resumes}
            now={status.now}
            creating={saving}
            onCreate={openNew}
            onRename={(resume, opener) => openDialog(opener, { kind: "rename", resume })}
            onDuplicate={(resume, opener) => openDialog(opener, { kind: "duplicate", resume })}
            onDelete={openDelete}
            newResumeRef={newResumeRef}
          />
        ))}
      <ConfirmDeleteDialog
        open={confirming}
        onOpenChange={(open) => !saving && setConfirming(open)}
        heading="Delete resume?"
        message={
          <>
            &ldquo;{toDelete?.metadata.title}&rdquo; will be deleted from this browser. This can&apos;t be undone.
          </>
        }
        action="Delete resume"
        deleting={saving}
        onConfirm={handleDelete}
        returnFocusTo={focusAfterDelete}
      />
      <ResumeTitleDialog
        {...dialogText(request)}
        open={naming}
        onOpenChange={(open) => !saving && setNaming(open)}
        submitting={saving}
        onSubmit={handleSubmit}
        returnFocusTo={openerRef}
      />
    </div>
  );
}
