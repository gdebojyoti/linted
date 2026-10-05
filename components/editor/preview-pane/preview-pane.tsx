import { useEffect, type Ref } from "react";
import { Notice } from "@/components/common/notice";
import { renderableView } from "@/lib/resume/renderable-view";
import type { Resume } from "@/lib/resume/types";
import { placeSections } from "@/lib/theme/place-sections";
import { useTheme } from "./use-theme";

/**
 * The preview area belongs to the app; everything inside the page belongs to
 * the Theme. The page is shown at its real A4 size, so the preview and the
 * printed PDF share one layout.
 *
 * Drawn straight from the Resume it is given, so it updates whenever that
 * Resume changes. The Layout is always null in v1, so the Theme's default
 * Layout places every Section (ADR 0005).
 *
 * Until both the Resume and its Theme have loaded, one note says the preview
 * is loading. After that, a note shows only when nothing is Enabled and
 * filled in.
 *
 * `pageRef` points at the element holding the Theme's page, which is its only
 * child; Export prints that page. It is unset while a note shows, so an empty
 * page is never exported. The Theme loads here, as only the preview pane may
 * use Theme code; `onThemeReadyChange` tells the editor when it has, since
 * Export waits for it.
 */
export function PreviewPane({
  resume,
  pageRef,
  onThemeReadyChange,
}: {
  /** Null while the Resume is read. */
  resume: Resume | null;
  pageRef?: Ref<HTMLDivElement>;
  onThemeReadyChange?: (ready: boolean) => void;
}) {
  const theme = useTheme(resume?.themeSettings.themeId ?? null);
  const themeReady = theme !== null;

  useEffect(() => {
    onThemeReadyChange?.(themeReady);
  }, [themeReady, onThemeReadyChange]);

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
      <div ref={pageRef} className="h-fit shrink-0 shadow-page">
        <theme.Page zones={placeSections(sections, theme.defaultLayout)} />
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
