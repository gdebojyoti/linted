import type { RenderedSection } from "@/lib/resume/renderable-view";
import { ZONES, type SectionType, type Zone } from "@/lib/resume/types";

/** Where a Theme puts each type of Section when the Resume has no Layout of its own (ADR 0005). */
export type DefaultLayout = Record<SectionType, Zone>;

/** The Sections in each Zone, in drawing order. Zones a Theme doesn't use stay empty. */
export type PlacedSections = Record<Zone, RenderedSection[]>;

/**
 * Groups Sections by the Zone the default Layout gives their type. Within a
 * Zone, Pinned Sections come first; the rest keep their Content order.
 */
export function placeSections(sections: RenderedSection[], layout: DefaultLayout): PlacedSections {
  const zones = Object.fromEntries(ZONES.map((zone) => [zone, []])) as unknown as PlacedSections;
  const pinnedFirst = [...sections.filter(isPinned), ...sections.filter((s) => !isPinned(s))];
  for (const section of pinnedFirst) {
    zones[layout[section.type]].push(section);
  }
  return zones;
}

function isPinned(section: RenderedSection): boolean {
  return "pinned" in section && section.pinned;
}
