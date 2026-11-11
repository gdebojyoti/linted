import type { Layout, Resume, Section, SectionType, Zone } from "./types";
import type { EditOptions } from "./edit-sections";
import { hasShownContent } from "./renderable-view";

// The Layout rules (ADR 0005, ADR 0006): which Zone each Section sits in and
// in what order, for the Resume's current Theme.

/** Where a Theme puts each type of Section when the Resume has no Layout of its own. */
export type DefaultLayout = Record<SectionType, Zone>;

/** What the Layout rules need to know about a Theme. */
export type ThemeLayout = {
  /** The Zones the Theme draws, in order. */
  zones: readonly Zone[];
  defaultLayout: DefaultLayout;
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

function isPinned(section: Section): boolean {
  return section.type === "header" && section.pinned;
}

export type MoveDirection = "up" | "down";

/**
 * The Resume with the Section moved one place up or down within its Zone,
 * and the whole Layout saved. A move that can't happen (off either end of
 * the Zone, above a Pinned Section, or of a Pinned Section) gives back the
 * Resume unchanged.
 */
export function moveSection(
  resume: Resume,
  theme: ThemeLayout,
  sectionId: string,
  direction: MoveDirection,
  { now = new Date() }: EditOptions = {},
): Resume {
  const layout = movedLayout(resume, theme, sectionId, direction);
  return layout ? withSavedLayout(resume, layout, now) : resume;
}

/** Whether moveSection would move the Section, so the editor can disable the arrow. */
export function canMoveSection(resume: Resume, theme: ThemeLayout, sectionId: string, direction: MoveDirection): boolean {
  return movedLayout(resume, theme, sectionId, direction) !== null;
}

function movedLayout(resume: Resume, theme: ThemeLayout, sectionId: string, direction: MoveDirection): Layout | null {
  const layout = layoutOf(resume, theme);
  const zone = theme.zones.find((z) => layout[z]?.includes(sectionId));
  if (!zone) return null;
  const ids = [...(layout[zone] ?? [])];
  const from = ids.indexOf(sectionId);
  const to = direction === "up" ? from - 1 : from + 1;
  if (to < 0 || to >= ids.length) return null;
  const pinned = pinnedIds(resume);
  if (pinned.has(sectionId) || pinned.has(ids[to])) return null;
  [ids[from], ids[to]] = [ids[to], ids[from]];
  return { ...layout, [zone]: ids };
}

function withSavedLayout(resume: Resume, layout: Layout, now: Date): Resume {
  return {
    ...resume,
    metadata: { ...resume.metadata, lastEditedAt: now.toISOString() },
    themeSettings: { ...resume.themeSettings, layout },
  };
}

/**
 * The Resume with the Section moved to the end of another of the Theme's
 * Zones, and the whole Layout saved. A Pinned Section never moves; moving to
 * the Section's own Zone, or to one the Theme doesn't draw, changes nothing.
 */
export function moveSectionToZone(
  resume: Resume,
  theme: ThemeLayout,
  sectionId: string,
  zone: Zone,
  { now = new Date() }: EditOptions = {},
): Resume {
  const layout = layoutOf(resume, theme);
  const from = theme.zones.find((z) => layout[z]?.includes(sectionId));
  if (!from || from === zone || !theme.zones.includes(zone) || pinnedIds(resume).has(sectionId)) return resume;
  return withSavedLayout(
    resume,
    { ...layout, [from]: layout[from]?.filter((id) => id !== sectionId), [zone]: [...(layout[zone] ?? []), sectionId] },
    now,
  );
}

function pinnedIds(resume: Resume): Set<string> {
  return new Set(resume.content.sections.filter(isPinned).map((section) => section.id));
}

/** The Resume back on its Theme's default Layout. With no Layout saved, it comes back unchanged. */
export function resetLayout(resume: Resume, { now = new Date() }: EditOptions = {}): Resume {
  if (resume.themeSettings.layout === null) return resume;
  return {
    ...resume,
    metadata: { ...resume.metadata, lastEditedAt: now.toISOString() },
    themeSettings: { ...resume.themeSettings, layout: null },
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
