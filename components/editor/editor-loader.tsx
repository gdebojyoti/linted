"use client";

import { useEffect, useState } from "react";
import { browserLibrary as library } from "@/lib/resume/browser-library";
import type { Resume } from "@/lib/resume/types";
import { ContentPaneSkeleton } from "./content-pane/content-pane-skeleton";
import { Editor } from "./editor";
import { EditorFrame } from "./editor-frame";
import { MissingResume } from "./missing-resume";
import { PreviewPane } from "./preview-pane/preview-pane";
import { TopBar } from "./top-bar/top-bar";

type Status =
  | { kind: "loading" }
  | { kind: "not-found" }
  | { kind: "failed" }
  | { kind: "ready"; resume: Resume };

/**
 * Loads the Resume with this id, then opens the editor on it. Resumes live
 * in this browser (ADR 0002), so the server renders the editor's layout with
 * skeletons, and the Resume is read after hydration. Every state keeps the
 * top bar and fills in the rest, so the layout never jumps.
 *
 * Holds the state of one id only; the page gives it a `key` of the id, so
 * opening another Resume starts over, Editor included.
 */
export function EditorLoader({ id }: { id: string }) {
  const [status, setStatus] = useState<Status>({ kind: "loading" });

  useEffect(() => {
    let current = true;
    library.get(id).then(
      (resume) => current && setStatus(resume ? { kind: "ready", resume } : { kind: "not-found" }),
      () => current && setStatus({ kind: "failed" }),
    );
    return () => {
      current = false;
    };
  }, [id]);

  switch (status.kind) {
    case "loading":
      return (
        <EditorFrame topBar={<TopBar status="loading" />}>
          <ContentPaneSkeleton />
          <PreviewPane resume={null} />
        </EditorFrame>
      );
    case "not-found":
    case "failed":
      return (
        <EditorFrame topBar={<TopBar status="missing" />}>
          <MissingResume reason={status.kind} />
        </EditorFrame>
      );
    case "ready":
      return <Editor initialResume={status.resume} />;
  }
}
