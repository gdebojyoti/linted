import { useEffect, useRef, useState } from "react";
import { loadPdfjs } from "@/lib/preview/load-pdfjs";
import { previewPageSize, type PreviewPageSize } from "@/lib/preview/page-size";
import { PreviewLoading } from "./preview-loading";

/**
 * Draws a finished PDF file with pdf.js, a canvas per page (ADR 0006), so the
 * preview looks the same in every browser and on phones. The only part of
 * the preview that knows how the PDF is shown.
 *
 * Each page fits the pane's width, never bigger than its real size. A new
 * file's pages are all drawn first and then swap in together, so the preview
 * never flickers, and pages of the same size keep the scroll position. Until
 * the first pages are drawn, the loading note stays.
 *
 * The pages are pictures: text and links work in the exported PDF.
 */
export function PdfPreview({ file }: { file: Blob }) {
  const paneRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<HTMLDivElement>(null);
  const [paneWidth, setPaneWidth] = useState<number | null>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const pane = paneRef.current;
    if (!pane) return;
    const observer = new ResizeObserver(([entry]) => setPaneWidth(Math.floor(entry.contentRect.width)));
    observer.observe(pane);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paneWidth === null || paneWidth <= 0) return;
    let current = true;
    drawPages(file, paneWidth, () => current).then(
      (canvases) => {
        const pages = pagesRef.current;
        if (!canvases) return;
        if (!current || !pages) {
          releaseCanvases(canvases);
          return;
        }
        releaseCanvases(pages.children);
        pages.replaceChildren(...canvases);
        setDrawn(true);
      },
      (error: unknown) => console.error("Drawing the preview failed", error),
    );
    return () => {
      current = false;
    };
  }, [file, paneWidth]);

  return (
    <div ref={paneRef} className="w-full p-6">
      {!drawn && <PreviewLoading />}
      <div ref={pagesRef} role="group" aria-label="Resume preview" className="flex flex-col items-center gap-6" />
    </div>
  );
}

/** Every page of the PDF, drawn on its own canvas. Null if a newer drawing overtook this one. */
async function drawPages(file: Blob, paneWidth: number, isCurrent: () => boolean): Promise<HTMLCanvasElement[] | null> {
  const { pdfjs, worker } = await loadPdfjs();
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()), worker });
  try {
    const pdf = await loadingTask.promise;
    const canvases: HTMLCanvasElement[] = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      if (!isCurrent()) {
        releaseCanvases(canvases);
        return null;
      }
      const page = await pdf.getPage(pageNumber);
      const size = previewPageSize(page.getViewport({ scale: 1 }), {
        paneWidth,
        pixelRatio: window.devicePixelRatio || 1,
      });
      const canvas = pageCanvas(size, `Page ${pageNumber} of ${pdf.numPages}`);
      await page.render({ canvas, viewport: page.getViewport({ scale: size.scale }) }).promise;
      canvases.push(canvas);
    }
    return canvases;
  } finally {
    // Lets go of the PDF, not the shared worker. The drawn canvases keep their pixels.
    void loadingTask.destroy();
  }
}

/**
 * A blank canvas for one page. Its CSS width is the page's, at most the
 * pane's, so a page drawn for a wider pane never sticks out while the pane
 * shrinks and the page is redrawn.
 */
function pageCanvas(size: PreviewPageSize, label: string): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size.canvas.width;
  canvas.height = size.canvas.height;
  canvas.style.width = `${size.width}px`;
  canvas.className = "h-auto max-w-full shrink-0 bg-white shadow-page";
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", label);
  return canvas;
}

/**
 * Gives back the canvases' memory at once rather than when they're collected,
 * as pdf.js's own viewer does: iOS Safari limits the canvas memory of a page.
 */
function releaseCanvases(canvases: Iterable<Element>) {
  for (const canvas of Array.from(canvases)) {
    if (canvas instanceof HTMLCanvasElement) {
      canvas.width = 0;
      canvas.height = 0;
    }
  }
}
