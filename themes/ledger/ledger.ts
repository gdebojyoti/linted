import { DEFAULT_THEME_ID, type SectionType } from "@/lib/resume/types";
import type { Theme } from "@/themes/theme";
import { LedgerPage } from "./ledger-page";
import { LEDGER_ZONES, type LedgerZone } from "./zones";

// Typed to Ledger's own Zones, so a Section can't be sent to a Zone the page never draws.
const defaultLayout: Record<SectionType, LedgerZone> = {
  header: "header",
  summary: "main",
  experience: "main",
  projects: "main",
  skills: "main",
  education: "main",
  custom: "main",
};

/** The v1 Theme: the Header on top and every other Section below it. */
export const ledger: Theme = {
  id: DEFAULT_THEME_ID,
  zones: LEDGER_ZONES,
  defaultLayout,
  Page: LedgerPage,
};
