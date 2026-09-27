import { renderableView } from "@/lib/resume/renderable-view";
import type { Ref } from "react";
import type { Resume } from "@/lib/resume/types";
import { placeSections } from "@/lib/theme/place-sections";
import { PreviewMessage } from "./preview-message";
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
 * The Theme loads lazily. While it loads, and when nothing is Enabled and
 * filled in, a note shows in place of the page.
 *
 * `pageRef` points at the element holding the Theme's page, which is its only
 * child; Export prints that page. It is unset while a note shows, so an empty
 * page is never exported.
 */
export function PreviewPane({ resume, pageRef }: { resume: Resume; pageRef?: Ref<HTMLDivElement> }) {
  const theme = useTheme(resume.themeSettings.themeId);
  const { sections } = renderableView(resume);

  function page() {
    if (!theme) return <PreviewMessage title="Loading preview…" />;
    if (sections.length === 0) {
      return (
        <PreviewMessage title="Nothing to preview yet">
          Fill in any section on the left to see your resume here. Disabled sections aren&apos;t shown.
        </PreviewMessage>
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
