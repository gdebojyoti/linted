import { Notice } from "@/components/common/notice";
import { layoutOf } from "@/lib/resume/layout";
import { renderableView } from "@/lib/resume/renderable-view";
import type { Resume } from "@/lib/resume/types";
import { placeSections } from "@/lib/theme/place-sections";
import { useTheme } from "@/components/editor/theme/use-theme";

/**
 * The preview area belongs to the app; everything inside the page belongs to
 * the Theme. The page is shown at its real A4 size. It is the Theme's HTML
 * page, while Export draws the Theme's PDF, so the two may differ slightly
 * until the preview shows the PDF too (ADR 0006).
 *
 * Drawn straight from the Resume it is given, so it updates whenever that
 * Resume changes, its Layout included (ADR 0005).
 *
 * Until both the Resume and its Theme have loaded, one note says the preview
 * is loading. After that, a note shows only when nothing is Enabled and
 * filled in.
 */
export function PreviewPane({
  resume,
}: {
  /** Null while the Resume is read. */
  resume: Resume | null;
}) {
  const theme = useTheme(resume?.themeSettings.themeId ?? null);

  function page() {
    if (!resume || !theme) {
      return (
        <div className="pt-32">
          <Notice title="Loading preview…" />
        </div>
      );
    }
    const { sections } = renderableView(resume);
    if (sections.length === 0) {
      return (
        <div className="pt-32">
          <Notice title="Nothing to preview yet">
            Fill in any section on the left to see your resume here. Disabled sections aren&apos;t shown.
          </Notice>
        </div>
      );
    }
    return (
      <div className="h-fit shrink-0 shadow-page">
        <theme.Page zones={placeSections(sections, layoutOf(resume, theme))} />
      </div>
    );
  }

  return (
    <main className="flex min-w-0 grow flex-col bg-preview">
      <div className="flex h-11 shrink-0 items-center border-b border-line bg-app px-5">
        <span className="text-[13px] font-semibold">Preview</span>
      </div>
      <div className="flex grow justify-center overflow-auto p-6">{page()}</div>
    </main>
  );
}
