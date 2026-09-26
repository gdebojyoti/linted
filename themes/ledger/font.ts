import localFont from "next/font/local";

// Ledger's own font, separate from the app's, so changing the app font never
// changes a Resume. Source Serif 4, as in the design.
//
// These are static (one weight per file) fonts, not Google's variable font:
// browsers can't embed a variable font in a printed PDF, so they draw its
// letters as pictures and the PDF has no real text (#20). Files from
// Fontsource (@fontsource/source-serif-4), under the SIL Open Font License.
export const ledgerFont = localFont({
  src: [
    { path: "./fonts/source-serif-4-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/source-serif-4-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  display: "swap",
});
