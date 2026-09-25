"use client";

import { useState } from "react";
import type { Resume } from "@/lib/resume/types";
import { updateHeader, type HeaderChanges } from "@/lib/resume/update-header";
import { ContentPane } from "./content-pane/content-pane";
import { PreviewPane } from "./preview-pane/preview-pane";
import { TopBar } from "./top-bar/top-bar";

// Holds the Resume being edited. Both panes read this state, so every edit
// shows in the preview at once. Edits aren't saved yet: autosave is #10.

export function Editor({ initialResume }: { initialResume: Resume }) {
  const [resume, setResume] = useState(initialResume);

  function editHeader(changes: HeaderChanges) {
    setResume((current) => updateHeader(current, changes));
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar resumeTitle={resume.metadata.title} />
      <div className="flex min-h-0 grow">
        <ContentPane sections={resume.content.sections} onHeaderChange={editHeader} />
        <PreviewPane resume={resume} />
      </div>
    </div>
  );
}
