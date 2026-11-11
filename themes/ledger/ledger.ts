import { DEFAULT_THEME_ID } from "@/lib/resume/types";
import type { Theme } from "@/themes/theme";
import { LEDGER_LAYOUT } from "./default-layout";
import { LedgerPage } from "./ledger-page";
import { LedgerDocument } from "./pdf/ledger-document";

/** The v1 Theme: the Header on top and every other Section below it. */
export const ledger: Theme = {
  id: DEFAULT_THEME_ID,
  ...LEDGER_LAYOUT,
  Page: LedgerPage,
  Document: LedgerDocument,
};
