import { Font } from "@react-pdf/renderer";

/** The family name Ledger's styles use. */
export const LEDGER_FONT_FAMILY = "Ledger Source Serif 4";

/**
 * Registers Source Serif 4 with react-pdf: static files, one per weight and
 * style, with real italics.
 *
 * - WOFF, not WOFF2: react-pdf crashes while embedding WOFF2.
 * - From Fontsource 5.3.1, latin subset, under the SIL Open Font License.
 *   Other letters fall back to Helvetica, which can't draw most of them (#62).
 * - `new URL(..., import.meta.url)` makes the bundler serve each file.
 */
export function registerLedgerFonts() {
  Font.register({
    family: LEDGER_FONT_FAMILY,
    fonts: [
      {
        src: new URL("../fonts/source-serif-4-latin-400-normal.woff", import.meta.url).href,
        fontWeight: 400,
        fontStyle: "normal",
      },
      {
        src: new URL("../fonts/source-serif-4-latin-400-italic.woff", import.meta.url).href,
        fontWeight: 400,
        fontStyle: "italic",
      },
      {
        src: new URL("../fonts/source-serif-4-latin-600-normal.woff", import.meta.url).href,
        fontWeight: 600,
        fontStyle: "normal",
      },
      {
        src: new URL("../fonts/source-serif-4-latin-600-italic.woff", import.meta.url).href,
        fontWeight: 600,
        fontStyle: "italic",
      },
    ],
  });

  // Words are never split with a hyphen at the end of a line, as on the web.
  // react-pdf has one setting for every document, so this applies to all Themes.
  Font.registerHyphenationCallback((word) => [word]);
}
