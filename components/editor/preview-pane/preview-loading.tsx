import { Notice } from "@/components/common/notice";

/** The note the preview shows until its first pages are drawn. */
export function PreviewLoading() {
  return (
    <div className="pt-32">
      <Notice title="Loading preview…" />
    </div>
  );
}
