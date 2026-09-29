import { editEntry, editSections, type EditOptions } from "./edit-sections";
import type { AddOptions } from "./entries";
import type { Bullet, Entry, Resume } from "./types";

// Bullet operations. Experience, Projects, Education and Custom Entries have
// Bullets; other Entries don't. Bullets go two levels deep: top-level
// Bullets and their children. A child Bullet has no children of its own.

/** The Resume with an Empty, Enabled Bullet added at the end of the Entry's top level. */
export function addBullet(
  resume: Resume,
  entryId: string,
  { newId = () => crypto.randomUUID(), ...options }: AddOptions = {},
): Resume {
  return editBullets(
    resume,
    (entry) => entry.id === entryId,
    (bullets) => [...bullets, { id: newId(), enabled: true, text: "", children: [] }],
    options,
  );
}

/** The Resume with a Bullet's Prose changed, stored exactly as typed (ADR 0004). */
export function updateBullet(resume: Resume, bulletId: string, text: string, options: EditOptions = {}): Resume {
  return editInReadingOrder(
    resume,
    bulletId,
    (flat, index) => replaceAt(flat, index, { bullet: { ...flat[index].bullet, text } }),
    options,
  );
}

/** The Resume without the Bullet. A top-level Bullet's children are deleted with it. */
export function deleteBullet(resume: Resume, bulletId: string, options: EditOptions = {}): Resume {
  return editInReadingOrder(
    resume,
    bulletId,
    (flat, index) => {
      let end = index + 1;
      if (!flat[index].nested) while (end < flat.length && flat[end].nested) end++;
      return [...flat.slice(0, index), ...flat.slice(end)];
    },
    options,
  );
}

/**
 * The Resume with the Bullet Enabled or Disabled. Its children keep their
 * own states: Disabling a parent hides them without changing them.
 */
export function setBulletEnabled(
  resume: Resume,
  bulletId: string,
  enabled: boolean,
  options: EditOptions = {},
): Resume {
  return editInReadingOrder(
    resume,
    bulletId,
    (flat, index) => replaceAt(flat, index, { bullet: { ...flat[index].bullet, enabled } }),
    options,
  );
}

/**
 * The Resume with a top-level Bullet nested under the one above it, as its
 * last child. The Bullet's own children come along, as children of that same
 * Bullet. The first Bullet has nothing above it, and a child Bullet can't go
 * deeper, so nesting either is rejected and the given Resume comes back unchanged.
 */
export function nestBullet(resume: Resume, bulletId: string, options: EditOptions = {}): Resume {
  return editInReadingOrder(
    resume,
    bulletId,
    (flat, index) => (index === 0 || flat[index].nested ? null : replaceAt(flat, index, { nested: true })),
    options,
  );
}

/**
 * The Resume with a child Bullet moved out to the top level, right after its
 * parent. The children after it follow it, becoming its own children. A
 * top-level Bullet can't be un-nested: the given Resume comes back unchanged.
 */
export function unnestBullet(resume: Resume, bulletId: string, options: EditOptions = {}): Resume {
  return editInReadingOrder(
    resume,
    bulletId,
    (flat, index) => (flat[index].nested ? replaceAt(flat, index, { nested: false }) : null),
    options,
  );
}

/** An Entry that has Bullets. */
type EntryWithBullets = Extract<Entry, { bullets: Bullet[] }>;

/**
 * The Resume with one Entry's Bullets passed through `edit`: the Entry that
 * `isTarget` picks. When there's none, or `edit` returns the same list, the
 * given Resume comes back unchanged.
 */
function editBullets(
  resume: Resume,
  isTarget: (entry: EntryWithBullets) => boolean,
  edit: (bullets: Bullet[]) => Bullet[],
  options: EditOptions,
): Resume {
  return editSections(
    resume,
    (section) => {
      for (const entry of section.entries) {
        if (!("bullets" in entry) || !isTarget(entry)) continue;
        const bullets = edit(entry.bullets);
        if (bullets === entry.bullets) return section;
        return editEntry(section, entry.id, (e) => ("bullets" in e ? { ...e, bullets } : e));
      }
      return section;
    },
    options,
  );
}

/** A Bullet in reading order, and whether it's a child of the top-level Bullet before it. */
type FlatBullet = { bullet: Bullet; nested: boolean };

/**
 * Edits the Bullets of the Entry holding `bulletId` as one list in reading
 * order, where `index` is that Bullet's place. Each nested Bullet is then a
 * child of the top-level Bullet before it, so changing whether a Bullet is
 * nested never changes the order Bullets are read in. When `edit` returns
 * null, the change is rejected and the given Resume comes back unchanged.
 */
function editInReadingOrder(
  resume: Resume,
  bulletId: string,
  edit: (flat: FlatBullet[], index: number) => FlatBullet[] | null,
  options: EditOptions,
): Resume {
  return editBullets(
    resume,
    (entry) => flatten(entry.bullets).some((f) => f.bullet.id === bulletId),
    (bullets) => {
      const flat = flatten(bullets);
      const edited = edit(
        flat,
        flat.findIndex((f) => f.bullet.id === bulletId),
      );
      return edited ? unflatten(edited) : bullets;
    },
    options,
  );
}

/** Top-level Bullets lose their children here: they're listed after them instead. */
function flatten(bullets: Bullet[]): FlatBullet[] {
  return bullets.flatMap((bullet) => [
    { bullet: { ...bullet, children: [] }, nested: false },
    ...bullet.children.map((child) => ({ bullet: child, nested: true })),
  ]);
}

/** Groups each nested Bullet under the top-level Bullet before it. */
function unflatten(flat: FlatBullet[]): Bullet[] {
  const bullets: Bullet[] = [];
  for (const { bullet, nested } of flat) {
    const parent = bullets[bullets.length - 1];
    if (nested && parent) parent.children.push(bullet);
    else bullets.push({ ...bullet, children: [] });
  }
  return bullets;
}

function replaceAt(flat: FlatBullet[], index: number, changes: Partial<FlatBullet>): FlatBullet[] {
  return flat.map((f, i) => (i === index ? { ...f, ...changes } : f));
}
