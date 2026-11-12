import { useState } from "react";
import type { ResumePdf } from "@/components/editor/pdf/use-pdf-file";
import { downloadFile } from "@/lib/export/download-file";
import { pdfFileName } from "@/lib/export/pdf-file-name";

/**
 * Export: saves the Resume's PDF, the same file the preview shows
 * (usePdfFile), named after the Resume Title, with no print dialog (ADR 0006).
 * While a PDF is being saved, `canExport` is false.
 */
export function usePdfExport(resumeTitle: string, pdf: ResumePdf) {
  const [exporting, setExporting] = useState(false);

  /**
   * A failed Export is only logged to the console for now; the button simply
   * goes back to "Export PDF". Showing the user an error is left for the same
   * work as #49 (telling the user when saving fails).
   */
  async function exportPdf() {
    if (!pdf.canExport || exporting) return;
    setExporting(true);
    try {
      downloadFile(await pdf.fileNow(), pdfFileName(resumeTitle));
    } catch (error) {
      console.error("Exporting the PDF failed", error);
    } finally {
      setExporting(false);
    }
  }

  return { canExport: pdf.canExport && !exporting, exporting, exportPdf };
}
