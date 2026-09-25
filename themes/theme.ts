import type { ComponentType } from "react";
import type { DefaultLayout, PlacedSections } from "@/lib/theme/place-sections";

/**
 * What every Theme provides. A Theme only draws: the Sections it receives are
 * already filtered (renderableView) and placed into its Zones (placeSections).
 */
export type Theme = {
  id: string;
  defaultLayout: DefaultLayout;
  Page: ComponentType<{ zones: PlacedSections }>;
};
