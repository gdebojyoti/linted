import type { ThemeLayout } from "@/lib/resume/layout";
import type { SectionType } from "@/lib/resume/types";
import { MARGIN_ZONES, type MarginZone } from "./zones";

/**
 * Typed to Margin's own Zones, so a Section can't be sent to a Zone the page
 * never draws. As in the design (docs/design/NOTES.md, #105).
 */
export const MARGIN_DEFAULT_LAYOUT: Record<SectionType, MarginZone> = {
  header: "header",
  summary: "header",
  skills: "aside-left",
  education: "aside-left",
  experience: "main",
  projects: "main",
  custom: "main",
};

/** What the Layout rules need to know about Margin. */
export const MARGIN_LAYOUT: ThemeLayout = {
  zones: MARGIN_ZONES,
  defaultLayout: MARGIN_DEFAULT_LAYOUT,
  arrangement: { kind: "top-sidebar-main", top: "header", sidebar: "aside-left", main: "main" },
};
