"use client";

import { useState } from "react";
import type { Resume } from "@/lib/resume/types";
import { ContentPane } from "./content-pane/content-pane";
import { PreviewPane } from "./preview-pane/preview-pane";
import { TopBar } from "./top-bar/top-bar";

// Holds the Resume being edited. Both panes read this state, so every edit
// shows in the preview at once; that shared state is why the whole editor is
// a Client Component. Edits aren't saved yet: autosave is #10.

export function Editor({ initialResume }: { initialResume: Resume }) {
  const [resume, setResume] = useState(initialResume);

  // Every edit is a Resume module function, applied to the latest Resume.
  function handleEdit(edit: (resume: Resume) => Resume) {
    setResume(edit);
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar resumeTitle={resume.metadata.title} />
      <div className="flex min-h-0 grow">
        <ContentPane sections={resume.content.sections} onEdit={handleEdit} />
        <PreviewPane resume={resume} />
      </div>
    </div>
  );
}
