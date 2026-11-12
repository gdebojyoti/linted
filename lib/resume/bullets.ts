import { editEntry, editSections, type EditOptions } from "./edit-sections";
import type { AddOptions } from "./entries";
import type { MoveDirection } from "./layout";
import type { Bullet, Entry, Resume } from "./types";

// Bullet operations. Experience, Projects, Education and Custom Entries have
// Bullets; other Entries don't. Bullets go two levels deep: top-level
// Bullets and their children. A child Bullet has no children of its own.
// Moving a Bullet never changes its level, so it can't make a third one:
// only nesting and un-nesting do that.

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

/**
 * The Resume with an Empty, Enabled Bullet added right after this one in
 * reading order, at the same level: after a child Bullet, a child of the
 * same parent. After a top-level Bullet, the new one takes its children,
 * as when un-nesting.
 */
export function addBulletAfter(
  resume: Resume,
  bulletId: string,
  { newId = () => crypto.randomUUID(), ...options }: AddOptions = {},
): Resume {
  return editInReadingOrder(
    resume,
    bulletId,
    (flat, index) => [
      ...flat.slice(0, index + 1),
      { bullet: { id: newId(), enabled: true, text: "", children: [] }, nested: flat[index].nested },
      ...flat.slice(index + 1),
    ],
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

/**
 * The Resume with the Bullet placed at this gap in its Entry's Bullets,
 * counted in reading order as they are now (0 is before the first Bullet,
 * the number of Bullets after the last), for dropping a dragged Bullet.
 */
export function placeBullet(resume: Resume, bulletId: string, index: number, options: EditOptions = {}): Resume {
  return editInReadingOrder(resume, bulletId, (flat, from) => placedInReadingOrder(flat, from, index), options);
}

/**
 * The Resume with the Bullet moved one place up or down, for its arrows. A
 * top-level Bullet moves past the next top-level Bullet, children and all. A
 * child moves one place in reading order: past the end of its parent's
 * children, it becomes the last child of the Bullet above or the first of the
 * one below. When it can't move, the given Resume comes back unchanged.
 */
export function moveBullet(resume: Resume, bulletId: string, direction: MoveDirection, options: EditOptions = {}): Resume {
  return editInReadingOrder(
    resume,
    bulletId,
    (flat, from) => placedInReadingOrder(flat, from, moveGap(flat, from, direction)),
    options,
  );
}

/** Whether moveBullet would move the Bullet among these, so the editor can disable the arrow. */
export function canMoveBullet(bullets: Bullet[], bulletId: string, direction: MoveDirection): boolean {
  return placedBullets(bullets, bulletId, bulletMoveGap(bullets, bulletId, direction)) !== null;
}

/** The gap in reading order that moveBullet places the Bullet at. */
export function bulletMoveGap(bullets: Bullet[], bulletId: string, direction: MoveDirection): number {
  const flat = flatten(bullets);
  return moveGap(flat, indexOf(flat, bulletId), direction);
}

/** Whether placeBullet would move the Bullet among these, so a drop marker shows only where a drop does something. */
export function canPlaceBullet(bullets: Bullet[], bulletId: string, index: number): boolean {
  return placedBullets(bullets, bulletId, index) !== null;
}

/**
 * The Bullets with this one placed at the gap, as placeBullet places it, or
 * null when the placement can't happen or changes nothing.
 */
export function placedBullets(bullets: Bullet[], bulletId: string, index: number): Bullet[] | null {
  const flat = flatten(bullets);
  const placed = placedInReadingOrder(flat, indexOf(flat, bulletId), index);
  return placed && unflatten(placed);
}

/**
 * The Bullets in reading order with the one at `from` placed at the gap, or
 * null when the placement can't happen or changes nothing.
 */
function placedInReadingOrder(flat: FlatBullet[], from: number, index: number): FlatBullet[] | null {
  if (from === -1 || index < 0 || index > flat.length) return null;
  const end = blockEnd(flat, from);
  if (index >= from && index <= end) return null;
  const block = flat.slice(from, end);
  const rest = [...flat.slice(0, from), ...flat.slice(end)];
  const at = index > from ? index - block.length : index;
  // A top-level Bullet only goes where a top-level Bullet starts, or at the end.
  if (!flat[from].nested && rest[at]?.nested) return null;
  // A child Bullet needs a top-level Bullet before it, to be its parent.
  if (flat[from].nested && at === 0) return null;
  return [...rest.slice(0, at), ...block, ...rest.slice(at)];
}

/**
 * The gap a move up or down places the Bullet at `from` in, which may be
 * outside the list when there's nowhere to go. See moveBullet.
 */
function moveGap(flat: FlatBullet[], from: number, direction: MoveDirection): number {
  if (from === -1) return -1;
  if (flat[from].nested) return direction === "up" ? from - 1 : from + 2;
  if (direction === "up") {
    let start = from - 1;
    while (start >= 0 && flat[start].nested) start--;
    return start;
  }
  const next = blockEnd(flat, from);
  return next < flat.length ? blockEnd(flat, next) : flat.length + 1;
}

/** Where the Bullet at `from` ends in reading order: after its children, if it's top-level. */
function blockEnd(flat: FlatBullet[], from: number): number {
  let end = from + 1;
  if (!flat[from].nested) while (end < flat.length && flat[end].nested) end++;
  return end;
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
      const edited = edit(flat, indexOf(flat, bulletId));
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

function indexOf(flat: FlatBullet[], bulletId: string): number {
  return flat.findIndex((f) => f.bullet.id === bulletId);
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
