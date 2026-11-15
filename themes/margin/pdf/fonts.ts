// Copied from Ledger (themes/ledger/pdf/fonts.ts), so each Theme stays independent.
// The copies may drift apart. When you fix one, check whether the other
// needs the same fix.

import type { TypefaceId } from "@/lib/resume/types";
import { FONT_FAMILIES } from "@/themes/fonts/fonts";

/** The font Margin draws in for each Typeface (Theme Options, #89). */
export const MARGIN_FONT_FAMILIES: Record<TypefaceId, string> = {
  serif: FONT_FAMILIES.sourceSerif4,
  sans: FONT_FAMILIES.ibmPlexSans,
  classic: FONT_FAMILIES.ebGaramond,
};
