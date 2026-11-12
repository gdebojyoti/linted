import type { ComponentType } from "react";
import type { DefaultLayout } from "@/lib/resume/layout";
import type { PlacedSections } from "@/lib/theme/place-sections";
import type { Zone } from "@/lib/resume/types";

/**
 * What every Theme provides. A Theme only draws: the Sections it receives are
 * already filtered (renderableView) and placed into its Zones (placeSections).
 */
export type Theme = {
  id: string;
  /** The Zones the Theme draws. Its default Layout only uses these. */
  zones: readonly Zone[];
  defaultLayout: DefaultLayout;
  /** The PDF that the preview shows and Export downloads: a react-pdf `<Document>` (ADR 0006). */
  Document: ComponentType<{ zones: PlacedSections }>;
};
