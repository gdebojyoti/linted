import type { SectionType } from "@/lib/resume/types";
import type { LedgerZone } from "./zones";

/** Typed to Ledger's own Zones, so a Section can't be sent to a Zone the page never draws. */
export const LEDGER_DEFAULT_LAYOUT: Record<SectionType, LedgerZone> = {
  header: "header",
  summary: "main",
  experience: "main",
  projects: "main",
  skills: "main",
  education: "main",
  custom: "main",
};
