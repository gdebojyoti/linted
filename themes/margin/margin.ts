import { MARGIN_THEME_ID } from "@/lib/resume/types";
import type { Theme } from "@/themes/theme";
import { MARGIN_LAYOUT } from "./default-layout";
import { MARGIN_DEFAULT_OPTIONS } from "./default-options";
import { MarginDocument } from "./pdf/margin-document";

/** The two-column Theme: the Header on top, then a sidebar beside the main column (#105). */
export const margin: Theme = {
  id: MARGIN_THEME_ID,
  ...MARGIN_LAYOUT,
  defaultOptions: MARGIN_DEFAULT_OPTIONS,
  Document: MarginDocument,
};
