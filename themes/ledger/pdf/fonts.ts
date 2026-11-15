import type { TypefaceId } from "@/lib/resume/types";
import { FONT_FAMILIES } from "@/themes/fonts/fonts";

/** The font Ledger draws in for each Typeface (Theme Options, #89). */
export const LEDGER_FONT_FAMILIES: Record<TypefaceId, string> = {
  serif: FONT_FAMILIES.sourceSerif4,
  sans: FONT_FAMILIES.ibmPlexSans,
  classic: FONT_FAMILIES.ebGaramond,
};
