import type { Bullet, Entry, Layout, Resume, Section, Zone } from "./types";

type Options = {
  now?: Date;
  newId?: () => string;
  /** The copy's Resume Title, trimmed. Empty or only spaces means copyTitle of the original's. */
  title?: string;
};

/** The title a Duplicate starts with: "Stripe backend v2 (copy)". */
export function copyTitle(title: string): string {
  return `${title} (copy)`;
}

/**
 * A Duplicate: a full, independent copy of the Resume (CONTEXT.md). The
 * Resume and every Section, Entry and Bullet in it get new ids, so nothing
 * links the two, and the Layout follows the Sections' new ids. Created and
 * last-edited are now. The given Resume is not changed.
 */
export function duplicateResume(
  resume: Resume,
  { now = new Date(), newId = () => crypto.randomUUID(), title = "" }: Options = {},
): Resume {
  const timestamp = now.toISOString();
  const sectionIds = new Map<string, string>();

  const sections = resume.content.sections.map((section): Section => {
    const id = newId();
    sectionIds.set(section.id, id);
    return { ...section, id, entries: section.entries.map((entry) => copyEntry(entry, newId)) } as Section;
  });

  return {
    schemaVersion: resume.schemaVersion,
    metadata: {
      id: newId(),
      title: title.trim() || copyTitle(resume.metadata.title),
      createdAt: timestamp,
      lastEditedAt: timestamp,
    },
    themeSettings: {
      ...resume.themeSettings,
      layout: resume.themeSettings.layout && copyLayout(resume.themeSettings.layout, sectionIds),
    },
    content: { sections },
  };
}

/** A deep copy, so the copy's dates and Bullets are its own objects. */
function copyEntry(entry: Entry, newId: () => string): Entry {
  const copy = { ...structuredClone(entry), id: newId() };
  if ("bullets" in copy) copy.bullets = copyBullets(copy.bullets, newId);
  return copy;
}

function copyBullets(bullets: Bullet[], newId: () => string): Bullet[] {
  return bullets.map((bullet) => ({ ...bullet, id: newId(), children: copyBullets(bullet.children, newId) }));
}

/** The Layout with each Section id swapped for its copy's. Ids of Sections that no longer exist are dropped. */
function copyLayout(layout: Layout, sectionIds: Map<string, string>): Layout {
  return Object.fromEntries(
    Object.entries(layout).map(([zone, ids]) => [zone as Zone, ids.flatMap((id) => sectionIds.get(id) ?? [])]),
  );
}
