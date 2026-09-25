import { renderableView } from "@/lib/resume/renderable-view";
import type { Resume } from "@/lib/resume/types";
import { placeSections } from "@/lib/theme/place-sections";
import { themeFor } from "@/themes/theme-for";

// The preview area belongs to the app; everything inside the page belongs to
// the Theme. The page itself stays at its real A4 size, so the preview and the
// printed PDF share one layout; only the wrapper shrinks it on screen.
//
// Drawn straight from the Resume it is given, so it updates whenever that
// Resume changes. The Layout is always null in v1, so the Theme's default
// Layout places every Section (ADR 0005).

export function PreviewPane({ resume }: { resume: Resume }) {
  const { Page, defaultLayout } = themeFor(resume.themeSettings.themeId);
  const zones = placeSections(renderableView(resume).sections, defaultLayout);

  return (
    <main className="flex min-w-0 grow flex-col bg-preview">
      <div className="flex h-11 shrink-0 items-center border-b border-line bg-app px-5">
        <span className="text-[13px] font-semibold">Preview</span>
      </div>
      <div className="flex grow justify-center overflow-auto p-6">
        <div className="h-fit shrink-0 shadow-page [zoom:0.75]">
          <Page zones={zones} />
        </div>
      </div>
    </main>
  );
}
