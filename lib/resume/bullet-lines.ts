import type { Bullet } from "./types";

/** A Bullet as the editor lists it: one line each, in reading order. */
export type BulletLine = {
  bullet: Bullet;
  /** "1", "2"… for top-level Bullets, "1.1", "1.2"… for a child of the first. */
  number: string;
  nested: boolean;
  /** Whether it can be nested: a top-level Bullet with one above it (see nestBullet). */
  canNest: boolean;
  /** Whether its parent is Enabled. A Disabled parent hides it, whatever its own state. Always true at the top level. */
  parentEnabled: boolean;
};

/** An Entry's Bullets as one list in reading order, each child after its parent. */
export function bulletLines(bullets: Bullet[]): BulletLine[] {
  return bullets.flatMap((bullet, i) => [
    { bullet, number: `${i + 1}`, nested: false, canNest: i > 0, parentEnabled: true },
    ...bullet.children.map((child, j) => ({
      bullet: child,
      number: `${i + 1}.${j + 1}`,
      nested: true,
      canNest: false,
      parentEnabled: bullet.enabled,
    })),
  ]);
}
