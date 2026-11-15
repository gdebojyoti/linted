import type { ZoneArrangement } from "@/lib/resume/layout";
import type { Zone } from "@/lib/resume/types";

/**
 * How the Layout tab names a Zone by where it sits on the page: its box's
 * label, the box's name for screen readers, and the words for a move into it
 * ("Skills moved to the sidebar").
 */
export const ZONE_WORDS = {
  top: { label: "Top · full width", name: "Top", into: "the top" },
  sidebar: { label: "Sidebar · narrow", name: "Sidebar", into: "the sidebar" },
  main: { label: "Main", name: "Main", into: "the main column" },
} as const;

export type ZonePlace = keyof typeof ZONE_WORDS;

/** Where the Zone sits, or null in a one-column Theme, where Zones aren't told apart. */
export function zonePlace(arrangement: ZoneArrangement, zone: Zone): ZonePlace | null {
  if (arrangement.kind === "one-column") return null;
  if (zone === arrangement.top) return "top";
  if (zone === arrangement.sidebar) return "sidebar";
  return zone === arrangement.main ? "main" : null;
}
