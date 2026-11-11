import { useState } from "react";
import { useTheme } from "@/components/editor/preview-pane/use-theme";
import { downloadFile } from "@/lib/export/download-file";
import { pdfFileName } from "@/lib/export/pdf-file-name";
import type { Resume } from "@/lib/resume/types";
import { exportDocument } from "./export-document";

/**
 * Export: builds the Resume's PDF with its Theme and saves it as a file,
 * named after the Resume Title, with no print dialog (ADR 0006).
 *
 * The Theme starts loading as soon as the editor opens, so it is usually
 * ready by the time the user clicks. Until it has loaded, while there's
 * nothing to export, and while a PDF is still being built, `canExport` is
 * false.
 */
export function usePdfExport(resume: Resume) {
  const theme = useTheme(resume.themeSettings.themeId);
  const [exporting, setExporting] = useState(false);
  const pdfDocument = theme ? exportDocument(resume, theme) : null;

  /**
   * A failed Export is only logged to the console for now; the button simply
   * goes back to "Export PDF". Showing the user an error is left for the same
   * work as #49 (telling the user when saving fails).
   */
  async function exportPdf() {
    if (!pdfDocument || exporting) return;
    setExporting(true);
    try {
      // Already loaded with the Theme, so this only hands it over.
      const { pdf } = await import("@react-pdf/renderer");
      downloadFile(await pdf(pdfDocument).toBlob(), pdfFileName(resume.metadata.title));
    } catch (error) {
      console.error("Exporting the PDF failed", error);
    } finally {
      setExporting(false);
    }
  }

  return { canExport: pdfDocument !== null && !exporting, exporting, exportPdf };
}
