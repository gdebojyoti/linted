"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { CHANGE_LATER_HINT, ResumeTitleDialog } from "@/components/common/title-dialog/resume-title-dialog";
import { browserLibrary as library } from "@/lib/resume/browser-library";
import { copyTitle } from "@/lib/resume/duplicate-resume";
import { renameResume } from "@/lib/resume/rename-resume";
import type { Resume, ResumeEdit } from "@/lib/resume/types";
import { ContentPane } from "./content-pane/content-pane";
import { EditorFrame } from "./editor-frame";
import { usePdfExport } from "./export/use-pdf-export";
import { PreviewPane } from "./preview-pane/preview-pane";
import { TopBar } from "./top-bar/top-bar";
import { useAutosave } from "./use-autosave";

/**
 * Holds the Resume being edited. Both panes read this state, so every edit
 * shows in the preview at once; that shared state is why the whole editor is
 * a Client Component. Every edit is saved automatically, with no Save button.
 */
export function Editor({ initialResume }: { initialResume: Resume }) {
  const router = useRouter();
  const [resume, setResume] = useState(initialResume);
  const [naming, setNaming] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  /** The Duplicate button, which gets focus back when the dialog closes. */
  const duplicateRef = useRef<HTMLElement>(null);
  useAutosave(resume, initialResume);
  const { canExport, exporting, exportPdf } = usePdfExport(resume);

  /** Every edit is a Resume module function, applied to the latest Resume. */
  function handleEdit(edit: ResumeEdit) {
    setResume(edit);
  }

  function openDuplicate(opener: HTMLElement) {
    duplicateRef.current = opener;
    setNaming(true);
  }

  /**
   * Copies the Resume as it is on screen, so edits autosave hasn't stored yet
   * are copied too, then opens the copy. Leaving the editor saves the
   * original's waiting edits (useAutosave). A failed save closes the dialog;
   * telling the user is #49.
   */
  async function handleDuplicate(title: string) {
    setDuplicating(true);
    try {
      const copy = await library.duplicate(resume, title);
      router.push(`/resume-builder/resumes/${copy.metadata.id}`);
    } catch (error) {
      console.error("Duplicating the Resume failed", error);
      setDuplicating(false);
      setNaming(false);
    }
  }

  return (
    <EditorFrame
      topBar={
        <TopBar
          status="ready"
          resumeTitle={resume.metadata.title}
          onRename={(title) => handleEdit((current) => renameResume(current, title))}
          onDuplicate={openDuplicate}
          onExport={() => void exportPdf()}
          canExport={canExport}
          exporting={exporting}
        />
      }
    >
      <ContentPane sections={resume.content.sections} onEdit={handleEdit} />
      <PreviewPane resume={resume} />
      <ResumeTitleDialog
        open={naming}
        onOpenChange={(open) => !duplicating && setNaming(open)}
        heading="Duplicate resume"
        submitLabel="Duplicate"
        footerHint={CHANGE_LATER_HINT}
        initialTitle={copyTitle(resume.metadata.title)}
        submitting={duplicating}
        onSubmit={handleDuplicate}
        returnFocusTo={duplicateRef}
      />
    </EditorFrame>
  );
}
