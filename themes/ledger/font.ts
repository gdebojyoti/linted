import { Open_Sans } from "next/font/google";

// Ledger's own font, separate from the app's, so changing the app font never
// changes a Resume.
export const ledgerFont = Open_Sans({ subsets: ["latin"], display: "swap" });
