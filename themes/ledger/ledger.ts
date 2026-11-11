import { DEFAULT_THEME_ID } from "@/lib/resume/types";
import type { Theme } from "@/themes/theme";
import { LEDGER_DEFAULT_LAYOUT } from "./default-layout";
import { LedgerPage } from "./ledger-page";
import { LedgerDocument } from "./pdf/ledger-document";
import { LEDGER_ZONES } from "./zones";

/** The v1 Theme: the Header on top and every other Section below it. */
export const ledger: Theme = {
  id: DEFAULT_THEME_ID,
  zones: LEDGER_ZONES,
  defaultLayout: LEDGER_DEFAULT_LAYOUT,
  Page: LedgerPage,
  Document: LedgerDocument,
};
