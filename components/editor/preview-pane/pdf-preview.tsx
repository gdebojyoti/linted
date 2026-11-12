import { useEffect, useRef } from "react";

/**
 * Shows a finished PDF file in the browser's own PDF viewer, in an iframe
 * (ADR 0006). The only part of the preview that knows how the PDF is shown,
 * so pdf.js can replace it (#90) without touching anything else.
 *
 * Each file gets its own object URL, let go of once a newer file replaces it.
 */
export function PdfPreview({ file }: { file: Blob }) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    // Chrome and Edge read these hints: no toolbar, and the page fit to the width.
    frameRef.current?.setAttribute("src", `${url}#toolbar=0&view=FitH`);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return <iframe ref={frameRef} title="Resume preview" className="size-full border-0" />;
}
