// Copied from Ledger (themes/ledger/pdf/look.ts), so each Theme stays independent.
// The copies may drift apart. When you fix one, check whether the other
// needs the same fix.

import { createContext, useContext } from "react";
import type { ResolvedThemeOptions } from "@/lib/resume/theme-options";
import type { DensityId } from "@/lib/resume/types";
import { ACCENTS } from "@/lib/theme/theme-option-choices";
import { MARGIN_FONT_FAMILIES } from "./fonts";
import { BODY_SIZE } from "./styles";

/** The parts of Margin's look that its Theme Options change. */
export type MarginLook = {
  /** For Section titles and links. */
  accent: string;
  fontFamily: string;
  /** Line height as a multiple of the font size, as react-pdf takes it. */
  lineHeight: number;
  /** The height of one line of body text, in pt. */
  oneLine: number;
  /** Two lines of body text, in pt: the least that must follow a title on its page. */
  twoLines: number;
  /** Space between Sections, in pt, the `header` Zone and the columns below it included. */
  spaceBetweenSections: number;
};

/**
 * Each Density's line height and space between Sections (docs/design/NOTES.md,
 * the Margin page). The same space sits below the `header` Zone, so Sections
 * are spaced alike whether they run in one column or two.
 */
const DENSITY: Record<DensityId, { lineHeight: number; spaceBetweenSections: number }> = {
  comfortable: { lineHeight: 1.42, spaceBetweenSections: 14 },
  compact: { lineHeight: 1.32, spaceBetweenSections: 9 },
};

export function marginLook(options: ResolvedThemeOptions): MarginLook {
  const { lineHeight, spaceBetweenSections } = DENSITY[options.density];
  const oneLine = BODY_SIZE * lineHeight;
  return {
    accent: ACCENTS[options.accent].hex,
    fontFamily: MARGIN_FONT_FAMILIES[options.typeface],
    lineHeight,
    oneLine,
    twoLines: oneLine * 2,
    spaceBetweenSections,
  };
}

/** Hands the look down from MarginDocument to every part that needs it. */
export const MarginLookContext = createContext<MarginLook | null>(null);

export function useMarginLook(): MarginLook {
  const look = useContext(MarginLookContext);
  if (!look) throw new Error("Margin's parts are drawn only inside MarginDocument, which gives them their look");
  return look;
}
