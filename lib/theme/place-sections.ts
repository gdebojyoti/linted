import type { RenderedSection } from "@/lib/resume/renderable-view";
import { ZONES, type Layout, type Zone } from "@/lib/resume/types";

/** The Sections in each Zone, in drawing order. Zones a Theme doesn't use stay empty. */
export type PlacedSections = Record<Zone, RenderedSection[]>;

/**
 * Puts the Sections to draw into their Zones, in the order the Layout gives.
 * The Layout should be the Resume's whole Layout for the Theme (`layoutOf`);
 * its ids with no Section to draw, such as Empty or Disabled Sections, are
 * left out.
 */
export function placeSections(sections: RenderedSection[], layout: Layout): PlacedSections {
  const byId = new Map(sections.map((section) => [section.id, section]));
  return Object.fromEntries(
    ZONES.map((zone) => [zone, (layout[zone] ?? []).flatMap((id) => byId.get(id) ?? [])]),
  ) as PlacedSections;
}
