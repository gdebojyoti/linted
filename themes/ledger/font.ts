import { Source_Serif_4 } from "next/font/google";

// Ledger's own font, separate from the app's, so changing the app font never
// changes a Resume. Source Serif 4, as in the design, with its optical-size axis.
export const ledgerFont = Source_Serif_4({ subsets: ["latin"], axes: ["opsz"], display: "swap" });
