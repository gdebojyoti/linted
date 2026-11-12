import type { DocumentProps } from "@react-pdf/renderer";
import { useEffect, useMemo, useState, type ReactElement } from "react";
import { useTheme } from "@/components/editor/theme/use-theme";
import type { Resume } from "@/lib/resume/types";
import { rebuilder } from "@/lib/timing/rebuilder";
import { exportDocument } from "./export-document";

/** How long edits must pause before the PDF is rebuilt. */
const REBUILD_DELAY_MS = 400;

/**
 * The name each build's time is recorded under, to measure rebuilds on real
 * devices (ADR 0006): performance.getEntriesByName("linted:pdf-build").
 */
const BUILD_MEASURE = "linted:pdf-build";

/** What the preview shows: a note while the first PDF builds, a note when there's nothing to show, or the PDF. */
export type PreviewState = { status: "loading" } | { status: "empty" } | { status: "ready"; file: Blob };

/** The Resume's PDF, as the preview and Export use it. */
export type ResumePdf = {
  preview: PreviewState;
  /** False while the Theme loads and while there's nothing to export. */
  canExport: boolean;
  /** The PDF of the Resume as it is now, built at once if the waiting rebuild hasn't started. */
  fileNow: () => Promise<Blob>;
};

async function buildPdf(pdfDocument: ReactElement<DocumentProps>): Promise<Blob> {
  // Already loaded with the Theme, so this only hands it over.
  const { pdf } = await import("@react-pdf/renderer");
  const start = performance.now();
  const file = await pdf(pdfDocument).toBlob();
  performance.measure(BUILD_MEASURE, { start, end: performance.now() });
  return file;
}

/**
 * The Resume's PDF, the one file both the preview and Export use (ADR 0006).
 * The first PDF is built at once; after that it's rebuilt once edits pause,
 * not on every keystroke, and the preview keeps the last one until then.
 */
export function usePdfFile(resume: Resume): ResumePdf {
  const theme = useTheme(resume.themeSettings.themeId);
  const [file, setFile] = useState<Blob | null>(null);
  const [builds] = useState(() =>
    rebuilder({
      build: buildPdf,
      wait: REBUILD_DELAY_MS,
      firstAtOnce: true,
      onBuilt: setFile,
      // The preview keeps its last PDF. Telling the user is for the same work as #49.
      onFailed: (error) => console.error("Building the PDF failed", error),
    }),
  );
  const pdfDocument = useMemo(() => (theme ? exportDocument(resume, theme) : null), [resume, theme]);

  useEffect(() => {
    if (pdfDocument) builds.request(pdfDocument);
  }, [pdfDocument, builds]);

  return { preview: previewState(theme !== null, pdfDocument !== null, file), canExport: pdfDocument !== null, fileNow: builds.now };
}

function previewState(themeLoaded: boolean, hasContent: boolean, file: Blob | null): PreviewState {
  if (!themeLoaded) return { status: "loading" };
  if (!hasContent) return { status: "empty" };
  return file ? { status: "ready", file } : { status: "loading" };
}
