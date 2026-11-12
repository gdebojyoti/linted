import type { DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";
import { layoutOf } from "@/lib/resume/layout";
import { renderableView } from "@/lib/resume/renderable-view";
import type { Resume } from "@/lib/resume/types";
import { placeSections } from "@/lib/theme/place-sections";
import type { Theme } from "@/themes/theme";

/**
 * The PDF that Export downloads: only the Resume's Enabled, non-Empty
 * Content, placed by its Layout (ADR 0005) and drawn by the Theme's
 * Document. Null when there's nothing to export, so Export is never an empty
 * page.
 */
export function exportDocument(resume: Resume, theme: Theme): ReactElement<DocumentProps> | null {
  const { sections } = renderableView(resume);
  if (sections.length === 0) return null;
  return <theme.Document zones={placeSections(sections, layoutOf(resume, theme))} />;
}
