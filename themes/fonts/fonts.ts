import { Font } from "@react-pdf/renderer";

/** The family names Themes use in their styles, one per font registered here. */
export const FONT_FAMILIES = {
  sourceSerif4: "Source Serif 4",
  ibmPlexSans: "IBM Plex Sans",
  ebGaramond: "EB Garamond",
} as const;

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

let registered = false;

/**
 * Registers every Theme font with react-pdf: static files, one per weight
 * and style, with real italics. Every Theme calls this, and only the first
 * call registers, so a font two Themes share is loaded once: react-pdf keeps
 * each file it has loaded, and the browser caches it by its one URL.
 * react-pdf fetches a family's files only when a PDF uses it.
 *
 * - WOFF, not WOFF2: react-pdf crashes while embedding WOFF2.
 * - From Fontsource 5 (Source Serif 4 5.3.1, IBM Plex Sans and EB Garamond
 *   5.3.0), latin subset, under the SIL Open Font License (./OFL-*.txt).
 *   Other letters fall back to Helvetica, which can't draw most of them (#62).
 * - `new URL(..., import.meta.url)` makes the bundler serve each file, so each
 *   path is written out in full.
 */
export function registerFonts() {
  if (registered) return;
  registered = true;

  registerFamily(FONT_FAMILIES.sourceSerif4, {
    regular: new URL("./source-serif-4-latin-400-normal.woff", import.meta.url),
    italic: new URL("./source-serif-4-latin-400-italic.woff", import.meta.url),
    bold: new URL("./source-serif-4-latin-600-normal.woff", import.meta.url),
    boldItalic: new URL("./source-serif-4-latin-600-italic.woff", import.meta.url),
  });
  registerFamily(FONT_FAMILIES.ibmPlexSans, {
    regular: new URL("./ibm-plex-sans-latin-400-normal.woff", import.meta.url),
    italic: new URL("./ibm-plex-sans-latin-400-italic.woff", import.meta.url),
    bold: new URL("./ibm-plex-sans-latin-600-normal.woff", import.meta.url),
    boldItalic: new URL("./ibm-plex-sans-latin-600-italic.woff", import.meta.url),
  });
  registerFamily(FONT_FAMILIES.ebGaramond, {
    regular: new URL("./eb-garamond-latin-400-normal.woff", import.meta.url),
    italic: new URL("./eb-garamond-latin-400-italic.woff", import.meta.url),
    bold: new URL("./eb-garamond-latin-600-normal.woff", import.meta.url),
    boldItalic: new URL("./eb-garamond-latin-600-italic.woff", import.meta.url),
  });

  // Words are never split with a hyphen at the end of a line, as on the web.
  // react-pdf has one setting for every document, so this applies to all Themes.
  Font.registerHyphenationCallback((word) => [word]);
}
