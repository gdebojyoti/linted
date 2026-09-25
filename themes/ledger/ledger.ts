import { DEFAULT_THEME_ID } from "@/lib/resume/types";
import type { Theme } from "@/themes/theme";
import { LedgerPage } from "./ledger-page";

/** The v1 Theme: one column, with the Header on top and every other Section below. */
export const ledger: Theme = {
  id: DEFAULT_THEME_ID,
  defaultLayout: {
    header: "header",
    summary: "main",
    experience: "main",
    projects: "main",
    skills: "main",
    education: "main",
    custom: "main",
  },
  Page: LedgerPage,
};
