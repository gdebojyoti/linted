"use client";

import { useRef, useState } from "react";
import { printElement } from "@/lib/export/print-element";
import type { Resume, ResumeEdit } from "@/lib/resume/types";
import { ContentPane } from "./content-pane/content-pane";
import { PreviewPane } from "./preview-pane/preview-pane";
import { TopBar } from "./top-bar/top-bar";

// Holds the Resume being edited. Both panes read this state, so every edit
// shows in the preview at once; that shared state is why the whole editor is
// a Client Component. Edits aren't saved yet: autosave is #10.

export function Editor({ initialResume }: { initialResume: Resume }) {
  const [resume, setResume] = useState(initialResume);
  const pageRef = useRef<HTMLDivElement>(null);

  // Every edit is a Resume module function, applied to the latest Resume.
  function handleEdit(edit: ResumeEdit) {
    setResume(edit);
  }

  // Export prints the preview's page itself, so the PDF matches the preview.
  function handleExport() {
    const page = pageRef.current?.firstElementChild;
    if (page instanceof HTMLElement) void printElement(page, { title: resume.metadata.title });
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar resumeTitle={resume.metadata.title} onExport={handleExport} />
      <div className="flex min-h-0 grow">
        <ContentPane sections={resume.content.sections} onEdit={handleEdit} />
        <PreviewPane resume={resume} pageRef={pageRef} />
      </div>
    </div>
  );
}
