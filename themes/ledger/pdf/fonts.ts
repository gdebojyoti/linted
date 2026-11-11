import { Font } from "@react-pdf/renderer";

/** The family name Ledger's styles use. */
export const LEDGER_FONT_FAMILY = "Ledger Source Serif 4";

/**
 * Registers Ledger's font, Source Serif 4, with react-pdf as static files (one
 * weight and style per file), so the PDF embeds it as real text. The italics
 * are real italic files, not slanted upright letters.
 *
 * These are WOFF, not the WOFF2 the HTML Ledger uses: react-pdf opens WOFF2
 * but crashes while embedding it ("Offset is outside the bounds of the
 * DataView", in fontkit's subsetter). Both are Fontsource's files
 * (@fontsource/source-serif-4 5.3.1, latin subset), under the SIL Open Font
 * License. Letters outside the latin subset fall back to react-pdf's
 * Helvetica, which can't draw most of them (logged on #62).
 *
 * Each file is a `new URL(..., import.meta.url)`, so the bundler serves it as
 * a static file, and react-pdf fetches it the first time it draws Ledger.
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
  Font.registerHyphenationCallback((word) => [word]);
}
