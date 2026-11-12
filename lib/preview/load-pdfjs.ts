import type { PDFWorker } from "pdfjs-dist";

type LoadedPdfjs = {
  pdfjs: typeof import("pdfjs-dist");
  /** One worker for every PDF the preview draws, so a redraw never starts another. */
  worker: PDFWorker;
};

let pdfjsLoading: Promise<LoadedPdfjs> | null = null;

/**
 * pdf.js, loaded the first time the preview draws a PDF, so it never holds up
 * the editor. Its worker parses each PDF off the main thread, so typing stays
 * smooth while the preview redraws. The modern build: Safari 16.4+, Chrome
 * and Edge 110+, current Firefox (#90). Browser-only.
 */
export function loadPdfjs(): Promise<LoadedPdfjs> {
  pdfjsLoading ??= import("pdfjs-dist").then((pdfjs) => {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
    return { pdfjs, worker: new pdfjs.PDFWorker() };
  });
  return pdfjsLoading;
}
