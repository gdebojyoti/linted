import { createContext, useContext } from "react";
import type { ResolvedThemeOptions } from "@/lib/resume/theme-options";
import type { DensityId } from "@/lib/resume/types";
import { ACCENTS } from "@/lib/theme/theme-option-choices";
import { LEDGER_FONT_FAMILIES } from "./fonts";
import { BODY_SIZE } from "./styles";

/** The parts of Ledger's look that its Theme Options change (#89). */
export type LedgerLook = {
  /** For Section titles and links. */
  accent: string;
  fontFamily: string;
  /** Line height as a multiple of the font size, as react-pdf takes it. */
  lineHeight: number;
  /** The height of one line of body text, in pt. */
  oneLine: number;
  /** Two lines of body text, in pt: the least that must follow a title on its page. */
  twoLines: number;
  /** Space between Sections, in pt. */
  spaceBetweenSections: number;
};

/** Each Density's line height and space between Sections (docs/design/linted-editor-tabs-design/README.md). */
const DENSITY: Record<DensityId, { lineHeight: number; spaceBetweenSections: number }> = {
  comfortable: { lineHeight: 1.42, spaceBetweenSections: 14 },
  compact: { lineHeight: 1.32, spaceBetweenSections: 9 },
};

export function ledgerLook(options: ResolvedThemeOptions): LedgerLook {
  const { lineHeight, spaceBetweenSections } = DENSITY[options.density];
  const oneLine = BODY_SIZE * lineHeight;
  return {
    accent: ACCENTS[options.accent].hex,
    fontFamily: LEDGER_FONT_FAMILIES[options.typeface],
    lineHeight,
    oneLine,
    twoLines: oneLine * 2,
    spaceBetweenSections,
  };
}

/** Hands the look down from LedgerDocument to every part that needs it. */
export const LedgerLookContext = createContext<LedgerLook | null>(null);

export function useLedgerLook(): LedgerLook {
  const look = useContext(LedgerLookContext);
  if (!look) throw new Error("Ledger's parts are drawn only inside LedgerDocument, which gives them their look");
  return look;
}
