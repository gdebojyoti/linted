import type { Layout, Resume, Section, SectionType, Zone } from "./types";
import type { EditOptions } from "./edit-sections";
import { placedInList } from "./place-in-list";
import { hasShownContent } from "./renderable-view";

// The Layout rules (ADR 0005, ADR 0006): which Zone each Section sits in and
// in what order, for the Resume's current Theme.

/** Where a Theme puts each type of Section when the Resume has no Layout of its own. */
export type DefaultLayout = Record<SectionType, Zone>;

/**
 * How a Theme's Zones sit on the page: one column, top to bottom (Ledger), or
 * a Zone across the top, then a sidebar beside main (Margin). It decides
 * which moves cross between Zones.
 */
export type ZoneArrangement =
  | { kind: "one-column" }
  | { kind: "top-sidebar-main"; top: Zone; sidebar: Zone; main: Zone };

/** What the Layout rules need to know about a Theme. */
export type ThemeLayout = {
  /** The Zones the Theme draws, in order. */
  zones: readonly Zone[];
  defaultLayout: DefaultLayout;
  arrangement: ZoneArrangement;
};

/**
 * The Resume's Layout as the Theme draws it: every Zone of the Theme, holding
 * the ids of every Section in order.
 */
export function layoutOf(resume: Resume, theme: ThemeLayout): Layout {
  const saved = resume.themeSettings.layout ?? {};
  const exists = new Set(resume.content.sections.map((section) => section.id));
  const placed = new Set<string>();
  const layout: Layout = {};
  for (const zone of theme.zones) {
    layout[zone] = (saved[zone] ?? []).filter((id) => {
      if (!exists.has(id) || placed.has(id)) return false;
      placed.add(id);
      return true;
    });
  }
  for (const section of resume.content.sections) {
    if (!placed.has(section.id)) layout[theme.defaultLayout[section.type]]?.push(section.id);
  }
  const pinned = pinnedIds(resume);
  for (const zone of theme.zones) {
    const ids = layout[zone] ?? [];
    layout[zone] = [...ids.filter((id) => pinned.has(id)), ...ids.filter((id) => !pinned.has(id))];
  }
  return layout;
}

/** Whether the Section is Pinned: always first in its Zone, and never moved. */
export function isPinned(section: Section): boolean {
  return section.type === "header" && section.pinned;
}

function pinnedIds(resume: Resume): Set<string> {
  return new Set(resume.content.sections.filter(isPinned).map((section) => section.id));
}

/** The Zone of the Layout holding this Section, if any. */
function zoneOf(layout: Layout, theme: ThemeLayout, sectionId: string): Zone | undefined {
  return theme.zones.find((zone) => layout[zone]?.includes(sectionId));
}

/**
 * Where the Section sits in its Zone, counting from 1, and how many Sections
 * the Zone holds. Null for an unknown Section.
 */
export function positionInZone(
  resume: Resume,
  theme: ThemeLayout,
  sectionId: string,
): { position: number; count: number } | null {
  const layout = layoutOf(resume, theme);
  const zone = zoneOf(layout, theme, sectionId);
  if (!zone) return null;
  const ids = layout[zone] ?? [];
  return { position: ids.indexOf(sectionId) + 1, count: ids.length };
}

/** Up or down a list: Sections in a Zone, Entries in a Section, Bullets in an Entry. */
export type MoveDirection = "up" | "down";

/** A Section can also move left and right, between a sidebar and main. */
export type SectionMoveDirection = MoveDirection | "left" | "right";

/**
 * The Resume with the Section moved one step, and the whole Layout saved.
 * Up and down move it one place within its Zone. With a top Zone above a
 * sidebar beside main, moves also cross between Zones: up from the top of
 * the sidebar or main goes to the end of the top Zone, and down from the end
 * of the top Zone to the start of main; left goes from main to the end of
 * the sidebar, and right from the sidebar to the end of main.
 *
 * A move that can't happen (off the end of a Zone with nowhere to go, above
 * a Pinned Section, or of a Pinned Section) gives back the Resume unchanged.
 */
export function moveSection(
  resume: Resume,
  theme: ThemeLayout,
  sectionId: string,
  direction: SectionMoveDirection,
  { now = new Date() }: EditOptions = {},
): Resume {
  const layout = movedLayout(resume, theme, sectionId, direction);
  return layout ? withLayout(resume, layout, now) : resume;
}

/** Whether moveSection would move the Section, so the editor can disable or hide the arrow. */
export function canMoveSection(
  resume: Resume,
  theme: ThemeLayout,
  sectionId: string,
  direction: SectionMoveDirection,
): boolean {
  return movedLayout(resume, theme, sectionId, direction) !== null;
}

/** A move is a placement: in the gap past the next Section up or down, or in another Zone. */
function movedLayout(
  resume: Resume,
  theme: ThemeLayout,
  sectionId: string,
  direction: SectionMoveDirection,
): Layout | null {
  const placement = movePlacement(layoutOf(resume, theme), theme, sectionId, direction);
  return placement && placedLayout(resume, theme, sectionId, placement);
}

function movePlacement(
  layout: Layout,
  theme: ThemeLayout,
  sectionId: string,
  direction: SectionMoveDirection,
): Placement | null {
  const zone = zoneOf(layout, theme, sectionId);
  if (!zone) return null;
  const ids = layout[zone] ?? [];
  const from = ids.indexOf(sectionId);
  const columns = theme.arrangement.kind === "top-sidebar-main" ? theme.arrangement : null;
  const endOf = (target: Zone): Placement => ({ zone: target, index: (layout[target] ?? []).length });
  switch (direction) {
    case "up":
      if (from > 0) return { zone, index: from - 1 };
      return columns && zone !== columns.top ? endOf(columns.top) : null;
    case "down":
      if (from < ids.length - 1) return { zone, index: from + 2 };
      return columns && zone === columns.top ? { zone: columns.main, index: 0 } : null;
    case "left":
      return columns && zone === columns.main ? endOf(columns.sidebar) : null;
    case "right":
      return columns && zone === columns.sidebar ? endOf(columns.main) : null;
  }
}

/** The Zone holding the Section, or null for an unknown Section. */
export function sectionZone(resume: Resume, theme: ThemeLayout, sectionId: string): Zone | null {
  return zoneOf(layoutOf(resume, theme), theme, sectionId) ?? null;
}

/** The gap on this side of the target Section, in its Zone, for a drop beside it. Null for an unknown Section. */
export function placementBeside(
  resume: Resume,
  theme: ThemeLayout,
  targetId: string,
  side: "before" | "after",
): Placement | null {
  const layout = layoutOf(resume, theme);
  const zone = zoneOf(layout, theme, targetId);
  if (!zone) return null;
  return { zone, index: (layout[zone] ?? []).indexOf(targetId) + (side === "after" ? 1 : 0) };
}

/**
 * Where a dropped Section lands: a Zone, and the gap between its Sections,
 * counted as the Zone is now (0 is before the first, the Zone's length after
 * the last).
 */
export type Placement = { zone: Zone; index: number };

/** Whether placeSection would move the Section, so a drop marker shows only where a drop does something. */
export function canPlaceSection(resume: Resume, theme: ThemeLayout, sectionId: string, placement: Placement): boolean {
  return placedLayout(resume, theme, sectionId, placement) !== null;
}

/**
 * The Resume with the Section placed at this gap, in its own Zone or another,
 * and the whole Layout saved. A placement that can't happen (of a Pinned
 * Section, above a Pinned Section, into a Zone the Theme doesn't draw, at a
 * gap outside the Zone) or that changes nothing gives back the Resume
 * unchanged.
 */
export function placeSection(
  resume: Resume,
  theme: ThemeLayout,
  sectionId: string,
  placement: Placement,
  { now = new Date() }: EditOptions = {},
): Resume {
  const layout = placedLayout(resume, theme, sectionId, placement);
  return layout ? withLayout(resume, layout, now) : resume;
}

function placedLayout(resume: Resume, theme: ThemeLayout, sectionId: string, { zone, index }: Placement): Layout | null {
  const layout = layoutOf(resume, theme);
  const from = zoneOf(layout, theme, sectionId);
  if (!from || !theme.zones.includes(zone)) return null;
  const target = layout[zone] ?? [];
  const pinned = pinnedIds(resume);
  if (pinned.has(sectionId) || (index === 0 && pinned.has(target[0]))) return null;
  const ids = placedInList(target, sectionId, index);
  if (!ids) return null;
  return { ...layout, [from]: (layout[from] ?? []).filter((id) => id !== sectionId), [zone]: ids };
}

/** The Resume back on its Theme's default Layout. With no Layout saved, it comes back unchanged. */
export function resetLayout(resume: Resume, { now = new Date() }: EditOptions = {}): Resume {
  return resume.themeSettings.layout === null ? resume : withLayout(resume, null, now);
}

/** The Resume with this Layout saved (null for the Theme's default), last edited now. */
function withLayout(resume: Resume, layout: Layout | null, now: Date): Resume {
  return {
    ...resume,
    metadata: { ...resume.metadata, lastEditedAt: now.toISOString() },
    themeSettings: { ...resume.themeSettings, layout },
  };
}

/** The Layout without this Section's id, as tidying when the Section is deleted (ADR 0005). */
export function withoutSection(layout: Layout | null, sectionId: string): Layout | null {
  if (layout === null) return null;
  return Object.fromEntries(Object.entries(layout).map(([zone, ids]) => [zone, ids.filter((id) => id !== sectionId)]));
}

/**
 * What the Layout tab tags a Section's chip with: "Disabled" or "Empty" for a
 * Section the preview leaves out, which can still be placed. Disabled wins
 * when it's both. Null for a Section the preview shows.
 */
export function layoutTag(section: Section): "Disabled" | "Empty" | null {
  if (!section.enabled) return "Disabled";
  return hasShownContent(section) ? null : "Empty";
}
