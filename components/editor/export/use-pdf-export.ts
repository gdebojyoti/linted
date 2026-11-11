import { useState } from "react";
import { downloadFile } from "@/lib/export/download-file";
import { pdfFileName } from "@/lib/export/pdf-file-name";
import type { Resume } from "@/lib/resume/types";
import { useTheme } from "@/components/editor/preview-pane/use-theme";
import { exportDocument } from "./export-document";

/**
 * Export: builds the Resume's PDF with its Theme and downloads it, named
 * after the Resume Title, with no print dialog (ADR 0006).
 *
 * The Theme loads as soon as the editor opens, so Export can start at once.
 * Export can't start until it has, nor while there's nothing to export, nor
 * while a PDF is still being built.
 */
export function usePdfExport(resume: Resume) {
  const theme = useTheme(resume.themeSettings.themeId);
  const [exporting, setExporting] = useState(false);
  const document = theme ? exportDocument(resume, theme) : null;

  /** A failed Export is only logged; telling the user is like #49. */
  async function exportPdf() {
    if (!document || exporting) return;
    setExporting(true);
    try {
      // Already loaded with the Theme, so this only hands it over.
      const { pdf } = await import("@react-pdf/renderer");
      downloadFile(await pdf(document).toBlob(), pdfFileName(resume.metadata.title));
    } catch (error) {
      console.error("Exporting the PDF failed", error);
    } finally {
      setExporting(false);
    }
  }

  return { canExport: document !== null && !exporting, exporting, exportPdf };
}
