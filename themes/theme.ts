import type { ComponentType } from "react";
import type { DefaultLayout, PlacedSections } from "@/lib/theme/place-sections";
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
  Page: ComponentType<{ zones: PlacedSections }>;
};
