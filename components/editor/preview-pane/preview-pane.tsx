import { Notice } from "@/components/common/notice";
import type { PreviewState } from "@/components/editor/pdf/use-pdf-file";
import { PdfPreview } from "./pdf-preview";
import { PreviewLoading } from "./preview-loading";

/**
 * The preview area belongs to the app; the page inside it is the Resume's
 * PDF, the same file Export downloads (ADR 0006). It updates a moment after
 * an edit, once the PDF is rebuilt.
 *
 * Until the Resume, its Theme and its first PDF are ready, one note says the
 * preview is loading. After that, a note shows only when nothing is Enabled
 * and filled in.
 */
export function PreviewPane({ pdf }: { pdf: PreviewState }) {
  function page() {
    switch (pdf.status) {
      case "loading":
        return <PreviewLoading />;
      case "empty":
        return (
          <div className="pt-32">
            <Notice title="Nothing to preview yet">
              Fill in any section on the left to see your resume here. Disabled sections aren&apos;t shown.
            </Notice>
          </div>
        );
      case "ready":
        return <PdfPreview file={pdf.file} />;
    }
  }

  return (
    <main className="flex min-w-0 grow flex-col bg-preview">
      <div className="flex h-11 shrink-0 items-center border-b border-line bg-app px-5">
        <span className="text-[13px] font-semibold">Preview</span>
      </div>
      {/* The scrollbar's space is always kept, so it showing up never narrows the pages and redraws them. */}
      <div className="flex grow justify-center overflow-auto [scrollbar-gutter:stable]">{page()}</div>
    </main>
  );
}
