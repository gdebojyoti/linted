"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { browserLibrary as library } from "@/lib/resume/browser-library";
import type { Resume } from "@/lib/resume/types";
import { Editor } from "./editor";
import { EditorMessage } from "./editor-message";

type Status =
  | { kind: "loading" }
  | { kind: "not-found" }
  | { kind: "failed" }
  | { kind: "ready"; resume: Resume };

/**
 * Loads the Resume with this id, then opens the editor on it. Resumes live
 * in this browser (ADR 0002), so the server renders only "Loading…" and the
 * Resume is read after hydration.
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
      return <EditorMessage>Loading…</EditorMessage>;
    case "not-found":
      return (
        <EditorMessage>
          Not found!{" "}
          <Link href="/resume-builder" className="underline">
            Back to resumes
          </Link>
        </EditorMessage>
      );
    case "failed":
      return (
        <EditorMessage role="alert">
          This resume couldn&apos;t be read. This browser may be blocking site storage.
        </EditorMessage>
      );
    case "ready":
      return <Editor initialResume={status.resume} />;
  }
}
