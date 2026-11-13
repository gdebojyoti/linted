import { Font } from "@react-pdf/renderer";
import type { TypefaceId } from "@/lib/resume/types";

/** The family name Ledger's styles use for each Typeface (Theme Options, #89). */
export const LEDGER_FONT_FAMILIES: Record<TypefaceId, string> = {
  serif: "Ledger Source Serif 4",
  sans: "Ledger IBM Plex Sans",
  classic: "Ledger EB Garamond",
};

/** One family's four files: regular and semibold, each upright and italic. */
function registerFamily(family: string, files: { regular: URL; italic: URL; bold: URL; boldItalic: URL }) {
  Font.register({
    family,
    fonts: [
      { src: files.regular.href, fontWeight: 400, fontStyle: "normal" },
      { src: files.italic.href, fontWeight: 400, fontStyle: "italic" },
      { src: files.bold.href, fontWeight: 600, fontStyle: "normal" },
      { src: files.boldItalic.href, fontWeight: 600, fontStyle: "italic" },
    ],
  });
}

/**
 * Registers each Typeface with react-pdf: static files, one per weight and
 * style, with real italics. react-pdf fetches a family's files only when a
 * PDF uses it.
 *
 * - WOFF, not WOFF2: react-pdf crashes while embedding WOFF2.
 * - From Fontsource 5 (Source Serif 4 5.3.1, IBM Plex Sans and EB Garamond
 *   5.3.0), latin subset, under the SIL Open Font License (../fonts/OFL-*.txt).
 *   Other letters fall back to Helvetica, which can't draw most of them (#62).
 * - `new URL(..., import.meta.url)` makes the bundler serve each file, so each
 *   path is written out in full.
 */
export function registerLedgerFonts() {
  registerFamily(LEDGER_FONT_FAMILIES.serif, {
    regular: new URL("../fonts/source-serif-4-latin-400-normal.woff", import.meta.url),
    italic: new URL("../fonts/source-serif-4-latin-400-italic.woff", import.meta.url),
    bold: new URL("../fonts/source-serif-4-latin-600-normal.woff", import.meta.url),
    boldItalic: new URL("../fonts/source-serif-4-latin-600-italic.woff", import.meta.url),
  });
  registerFamily(LEDGER_FONT_FAMILIES.sans, {
    regular: new URL("../fonts/ibm-plex-sans-latin-400-normal.woff", import.meta.url),
    italic: new URL("../fonts/ibm-plex-sans-latin-400-italic.woff", import.meta.url),
    bold: new URL("../fonts/ibm-plex-sans-latin-600-normal.woff", import.meta.url),
    boldItalic: new URL("../fonts/ibm-plex-sans-latin-600-italic.woff", import.meta.url),
  });
  registerFamily(LEDGER_FONT_FAMILIES.classic, {
    regular: new URL("../fonts/eb-garamond-latin-400-normal.woff", import.meta.url),
    italic: new URL("../fonts/eb-garamond-latin-400-italic.woff", import.meta.url),
    bold: new URL("../fonts/eb-garamond-latin-600-normal.woff", import.meta.url),
    boldItalic: new URL("../fonts/eb-garamond-latin-600-italic.woff", import.meta.url),
  });

  // Words are never split with a hyphen at the end of a line, as on the web.
  // react-pdf has one setting for every document, so this applies to all Themes.
  Font.registerHyphenationCallback((word) => [word]);
}
